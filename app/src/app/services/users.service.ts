import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from './../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: Firestore) { }
    
  addUser(user: User) {
    const userRef = collection(this.firestore, 'users');
    return addDoc(userRef, user);
  }

  getUsers(): Observable<User[]> {
    const userRef = collection(this.firestore, 'users');
    return collectionData(userRef, { idField: 'id' }) as Observable<User[]>;
  }

  deleteUser(user: User) {
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return deleteDoc(userDocRef);
  }
}
