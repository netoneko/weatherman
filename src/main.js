import App from "./App.svelte";
import { Weatherman } from "./weatherman";
import { Advice } from "./advice";
import {
  createAccount,
  Client,
  encodeHex,
  decodeHex,
  LocalSigner
} from "orbs-client-sdk";

const SENDER_PUBLIC_KEY = "sender_public_key";
const SENDER_PRIVATE_KEY = "sender_private_key";
const SENDER_ADDRESS = "sender_address";

if (!localStorage.getItem(SENDER_PUBLIC_KEY)) {
  const sender = createAccount();
  localStorage.setItem(SENDER_PUBLIC_KEY, encodeHex(sender.publicKey));
  localStorage.setItem(SENDER_PRIVATE_KEY, encodeHex(sender.privateKey));
  localStorage.setItem(SENDER_ADDRESS, sender.address);
}

const publicKey = decodeHex(localStorage.getItem(SENDER_PUBLIC_KEY));
const privateKey = decodeHex(localStorage.getItem(SENDER_PRIVATE_KEY));
const address = localStorage.getItem(SENDER_ADDRESS);
const orbsClient = new Client(
  process.env.ORBS_NODE_ADDRESS,
  process.env.ORBS_VCHAIN,
  "TEST_NET",
  new LocalSigner({
      publicKey, 
      privateKey,
  })
);

const WEATHERMAN_CONTRACT_NAME = process.env.ORBS_WEATHERMAN_CONTRACT || "Weatherman";
const weatherman = new Weatherman(orbsClient, WEATHERMAN_CONTRACT_NAME);

const ADVICE_CONTRACT_NAME = process.env.ORBS_ADVICE_CONTRACT || "Advice";
const advice = new Advice(orbsClient, ADVICE_CONTRACT_NAME);

const ORBS_ORACLE_ENDPOINT = process.env.ORBS_ORACLE_ENDPOINT || "http://localhost:3000";
const app = new App({
  target: document.body,
  props: {
    weatherman,
    advice,
    oracleEndpoint: ORBS_ORACLE_ENDPOINT,
  }
});

export default app;
