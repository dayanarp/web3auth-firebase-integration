import { Injectable, inject } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { Auth } from "@angular/fire/auth";
import { signOut } from "firebase/auth";

interface NonceResponse {
  nonce: string;
}

interface VerifyResponse {
  token: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly _auth = inject(Auth);

  constructor(private firestore: Firestore) {}

  public signOutWallet() {
    return signOut(this._auth);
  }

  signInWallet() {

  }

}
