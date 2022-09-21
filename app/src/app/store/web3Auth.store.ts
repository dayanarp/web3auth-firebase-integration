import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from '@web3auth/base';
import { Web3Auth } from '@web3auth/web3auth';
import { SolanaWallet } from '@web3auth/solana-provider';
import { PublicKey, Transaction } from '@solana/web3.js';
import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';
import {
  clientId,
  firebaseDomain,
  loginMethods,
  loginType,
  openloginNetwork,
  verifierName,
  web3authConfig,
} from './../utils/constants';
import { SolanaWalletConnectorPlugin } from '@web3auth/solana-wallet-connector-plugin';
import { handleEvent } from './../utils/handle-events';
import { fromAdapterEvent } from './../utils/from-adapter-events';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

export interface SocialAuth {
  adapter: Web3Auth | null;
  provider: SafeEventEmitterProvider | null;
  wallet: SolanaWallet | null;
  publicKey: PublicKey | null;
  connecting: boolean;
  connected: boolean;
  disconnecting: boolean;
  error: Error | null;
}

// Initial state
const initialState: SocialAuth = {
  adapter: null,
  provider: null,
  wallet: null,
  publicKey: null,
  connecting: false,
  connected: false,
  disconnecting: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class Web3AuthStore extends ComponentStore<SocialAuth> {
  private readonly _auth = inject(Auth);

  readonly adapter$ = this.select(({ adapter }) => adapter);
  readonly provider$ = this.select(({ provider }) => provider);
  readonly publicKey$ = this.select(({ publicKey }) => publicKey);
  readonly wallet$ = this.select(({ wallet }) => wallet);
  readonly connecting$ = this.select(({ connecting }) => connecting);
  readonly connected$ = this.select(({ connected }) => connected);
  readonly disconnecting$ = this.select(({ disconnecting }) => disconnecting);
  readonly error$ = this.select(({ error }) => error);
  readonly anchorWallet$ = this.select(
    this.publicKey$,
    this.wallet$,
    this.connected$,
    (publicKey, wallet, connected) => {
      if (wallet === null || publicKey === null || !connected) {
        return null;
      }

      return {
        publicKey,
        signTransaction: (transaction: Transaction) =>
          wallet.signTransaction(transaction),
        signAllTransactions: (transactions: Transaction[]) =>
          wallet.signAllTransactions(transactions),
      };
    },
    { debounce: true }
  );

  constructor() {
    super(initialState);
  }

  // set provider
  readonly _setProvider = this.updater<SafeEventEmitterProvider | null>(
    (state, provider) => ({
      ...state,
      provider,
    })
  );

  // Set adapter
  readonly _setAdapter = this.updater<Web3Auth | null>((state, adapter) => ({
    ...state,
    adapter,
  }));

  // Set error
  private readonly _setError = this.updater((state, error: Error) => ({
    ...state,
    error: state.connecting ? state.error : error,
  }));

  // Handle on connect event
  readonly onConnect = this.effect(() => {
    return this.adapter$.pipe(
      handleEvent((adapter) =>
        fromAdapterEvent(adapter, ADAPTER_EVENTS.CONNECTED).pipe(
          tap(() => this.patchState({ connected: true }))
        )
      )
    );
  });

  // Handle on disconnect event
  readonly onDisconnect = this.effect(() => {
    return this.adapter$.pipe(
      handleEvent((adapter) =>
        fromAdapterEvent(adapter, ADAPTER_EVENTS.DISCONNECTED).pipe(
          tap(() => this.disconnect())
        )
      )
    );
  });

  // Handle on errored event
  readonly onErrored = this.effect(() => {
    return this.adapter$.pipe(
      handleEvent((adapter) =>
        fromAdapterEvent(adapter, ADAPTER_EVENTS.ERRORED).pipe(
          tap(this._setError(new Error('Web3Auth connection error')))
        )
      )
    );
  });

  // Initialize Web3Auth adapter
  async initialize() {
    const adapter = new Web3Auth({
      clientId: clientId,
      chainConfig: web3authConfig.chainConfig,
      authMode: 'WALLET',
      uiConfig: {
        appLogo: '/assets/images/logo.png',
        theme: 'dark',
        loginMethodsOrder: loginMethods,
      },
    });

    const plugin = new SolanaWalletConnectorPlugin({
      torusWalletOpts: {},
      walletInitOptions: {},
    });

    // add torus pluggin
    await adapter.addPlugin(plugin);

    // create Openlogin adapter for Firebase auth
    const loginAdapter = new OpenloginAdapter({
      adapterSettings: {
        network: openloginNetwork,
        clientId,
        uxMode: 'popup',
        loginConfig: {
          jwt: {
            name: 'Test App',
            verifier: verifierName,
            typeOfLogin: loginType,
            clientId,
          },
        },
      },
    });

    // configure Openlogin adapter
    adapter.configureAdapter(loginAdapter);

    // initialize Web3Auth instance

    await adapter.init().then(
      () => {
        // set Web3Auth adapter instance
        this.patchState({ adapter: adapter, connected: true });
      },
      (error: Error) => {
        this._setError(error as Error);
      }
    );
  }

  // connect with FIREBASE
  async connect() {
    let state = this.get();

    if (!state.adapter) {
      console.log('web3auth not initialized yet');
      return;
    }

    this.patchState({ connecting: true });

    // login with Google
    const googleProvider = new GoogleAuthProvider();
    const loginRes = await signInWithPopup(this._auth, googleProvider);
    const idToken = await loginRes.user.getIdToken(true);

    console.log('ID TOKEN:', idToken);

    const provider = await state.adapter.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: loginType,
      extraLoginOptions: {
        id_token: idToken,
        domain: firebaseDomain,
        verifierIdField: 'sub',
      },
    });

    if (provider) {
      const wallet = new SolanaWallet(provider);
      const accounts = await wallet.requestAccounts();

      this.patchState({
        connected: true,
        provider: provider,
        connecting: false,
        wallet: wallet,
        publicKey: new PublicKey(accounts[0]),
      });
    }
  }

  // logout from account
  async disconnect() {
    let state = this.get();
    if (!state.adapter) {
      this._setError(new Error('Web3Auth not initialized'));
    }

    this.patchState({ disconnecting: true });
    try {
      await state.adapter!.logout();
    } catch (err) {
      console.log('ERROR: ', err);
    }

    this.patchState({
      connected: false,
      provider: null,
      disconnecting: false,
    });
  }
}
