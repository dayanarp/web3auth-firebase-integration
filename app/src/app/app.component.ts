import { Component, inject, OnInit } from '@angular/core';
import { Web3AuthStore } from './store/web3Auth.store';
import { FormControl, FormGroup } from '@angular/forms';
import { UsersService } from './services/users.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit{
  private readonly _web3auth = inject(Web3AuthStore);

  connected: boolean = false;
  form: FormGroup;
  users: User[] = [];

  constructor(private userService: UsersService){
    this._web3auth.connected$.subscribe((value: boolean) => (this.connected = value));
    this.form = new FormGroup({
      email: new FormControl(),
      wallet: new FormControl()
    });
  }

  async ngOnInit() {
    this._web3auth.initialize();
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  // LOGIN
  async login() {
    this._web3auth.connect();
  }

  // LOGIN
  async logout() {
    this._web3auth.disconnect();
  }

  // ADD USER TO WHITELIST
  async onSubmit() {
    console.log(this.form.value)
    const response = await this.userService.addUser(this.form.value);
    console.log("RESPONSE: ", response);
  }

}
