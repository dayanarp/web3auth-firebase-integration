import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Web3authFirebaseIntegration } from "../target/types/web3auth_firebase_integration";

describe("web3auth-firebase-integration", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Web3authFirebaseIntegration as Program<Web3authFirebaseIntegration>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
