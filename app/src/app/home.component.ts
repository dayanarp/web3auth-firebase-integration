import { Component } from "@angular/core";
import { WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { encode } from "bs58";
import { defer, from, throwError } from "rxjs";
import { concatMap, first, map } from "rxjs/operators";
import { isNotNull } from "./operators";
import { ConnectionStore, WalletStore } from "./store";
import { PublicKey } from "@solana/web3.js";
import { UsersService } from "./services/users.service";

@Component({
  selector: "wa-home",
  template: `
    <header>
      <h1>@heavy-duty/wallet-adapter example</h1>
    </header>
    <main>
      <section>
        <h2>Wallet details</h2>

        <select
          [ngModel]="walletName$ | async"
          (ngModelChange)="onSelectWallet($event)"
        >
          <option [ngValue]="null">Not selected</option>
          <option
            *ngFor="let wallet of wallets$ | async"
            [ngValue]="wallet.adapter.name"
          >
            {{ wallet.adapter.name }} ({{ wallet.readyState }})
          </option>
        </select>
        <p>
          Selected provider: {{ walletName$ | async }}
          <ng-container *ngIf="ready$ | async">(READY)</ng-container>
        </p>
        <p>Wallet Key: {{ publicKey$ | async }}</p>
        <button
          (click)="onConnect()"
          *ngIf="
            (connected$ | async) === false && (walletName$ | async) !== null
          "
          [disabled]="(ready$ | async) === false"
        >
          Connect
        </button>
        <button (click)="onDisconnect()" *ngIf="connected$ | async">
          Disconnect
        </button>
        <button (click)="onSignMessage()" *ngIf="connected$ | async">
          Sign Message
        </button>
      </section>
    </main>
  `,
})
export class HomeComponent {
  readonly connection$ = this._connectionStore.connection$;
  readonly wallets$ = this._walletStore.wallets$;
  readonly wallet$ = this._walletStore.wallet$;
  readonly walletName$ = this.wallet$.pipe(
    map((wallet) => wallet?.adapter.name || null)
  );
  readonly ready$ = this.wallet$.pipe(
    map(
      (wallet) =>
        wallet &&
        (wallet.adapter.readyState === WalletReadyState.Installed ||
          wallet.adapter.readyState === WalletReadyState.Loadable)
    )
  );
  readonly connected$ = this._walletStore.connected$;
  readonly publicKey$ = this._walletStore.publicKey$;
  lamports = 0;
  recipient = "";

  constructor(
    private readonly _connectionStore: ConnectionStore,
    private readonly _walletStore: WalletStore,
    private readonly _userService: UsersService
  ) {
    let pk = this.publicKey$.subscribe(async (newK) => {
      if (newK) {
        console.log(newK.toBase58().toString());
        let user = await this._userService.getUser(newK.toBase58().toString());
        console.log(user);
      }
    });
  }

  onConnect() {
    this._walletStore.connect().subscribe();
  }

  onDisconnect() {
    this._walletStore.disconnect().subscribe();
  }

  onSelectWallet(walletName: WalletName) {
    this._walletStore.selectWallet(walletName);
  }

  onSignMessage() {
    const signMessage$ = this._walletStore.signMessage(
      new TextEncoder().encode("Hello world!")
    );

    if (!signMessage$) {
      return console.error(new Error("Sign message method is not defined"));
    }

    signMessage$.then((signature) => {
      console.log(`Message signature: ${{ encode }.encode(signature)}`);
    });
  }
}
