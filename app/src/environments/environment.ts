// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'web3authtest',
    appId: '1:908969630452:web:faa348e7bafd7b2b949ca1',
    storageBucket: 'web3authtest.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyCZZ3Rtj062gU0uqVgP1zrZxOuKtyLa00o',
    authDomain: 'web3authtest.firebaseapp.com',
    messagingSenderId: '908969630452',
    measurementId: 'G-JKQNQPG2YZ',
  },
  production: false,
  /*firebaseConfig: {
    apiKey: 'AIzaSyDEfyUmXDhgGWibRUro2EBoX8-TtBKMYyA',
    authDomain: 'web3auth-x-firebase-demo-e3332.firebaseapp.com',
    projectId: 'web3auth-x-firebase-demo-e3332', //este https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com
    storageBucket: 'web3auth-x-firebase-demo-e3332.appspot.com',
    messagingSenderId: '108145034076',
    appId: '1:108145034076:web:3ff4c0088ec4c311b17799',
  },*/
  network: 'http://127.0.0.1:8899'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
