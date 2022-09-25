import {
    MessageSignerWalletAdapter,
    WalletError,
    WalletNotConnectedError,
  } from '@solana/wallet-adapter-base';
  import { throwError } from 'rxjs';
  
  export const signMessage = (
    adapter: MessageSignerWalletAdapter,
    connected: boolean,
    errorHandler: (error: WalletError) => unknown
  ): ((message: Uint8Array) => Promise<Uint8Array>) => {
    return (message: Uint8Array) => {

      return adapter.signMessage(message);

    };
  };
  