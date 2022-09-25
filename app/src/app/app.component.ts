import { Component, inject, OnInit } from "@angular/core";
import { UsersService } from "./services/users.service";
import { ConnectionStore } from "./store/connection.store";
import { WalletStore } from "./store/wallet.store";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

@Component({
  selector: "app-root",
  template: `<wa-home> </wa-home> `,
})
export class AppComponent implements OnInit {
  connected: boolean = false;

  constructor(
    private _connectionStore: ConnectionStore,
    private _walletStore: WalletStore
  ) {}

  async ngOnInit() {
    this._connectionStore.setEndpoint("http://api.devnet.solana.com");
    this._walletStore.setAdapters([
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    ]);
  }
}
