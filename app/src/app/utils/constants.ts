import { CHAIN_NAMESPACES } from "@web3auth/base";

export const clientId =
  'BJnNoYq9DcuDfdecDeHETP2LFi5XIqpW4DGO6A5P7gI0bKVJz-zAMSL55fkbi_ergREA2zTa3SVJtrKTIYT4I84'; // get from https://dashboard.web3auth.io

export const web3authConfig = {
    chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: '0x3', //0x3 for Devnet
        rpcTarget: 'http://127.0.0.1:8899',
      }
  };

export const loginMethods =  [
  'google',
  'twitter',
  'facebook',
  'github',
  'discord',
] 
export const verifierName = 'w3a-firebase-test-verifier';//'w3a-firebase-verifier-dtest2'; // get from https://dashboard.web3auth.io
export const loginType = 'jwt';
export const firebaseDomain = 'https://web3authtest.web.app'; //'http://localhost:3000',
export const openloginNetwork = "testnet";