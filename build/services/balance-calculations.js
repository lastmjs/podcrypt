import {set} from "../_snowpack/pkg/idb-keyval.js";
import {getNextPayoutDate} from "./payout-calculations.js";
import {
  cryptonatorAPIEndpoint,
  etherscanAPIEndpoint
} from "./utilities.js";
import BigNumber from "../node_modules/bignumber.js/bignumber.js";
import {ethersProvider} from "./ethers-provider.js";
import "../node_modules/ethers/dist/ethers.min.js";
export async function createWallet(Store2, mnemonicPhrase) {
  Store2.dispatch({
    type: "SET_WALLET_CREATION_STATE",
    walletCreationState: "CREATING"
  });
  const newWallet = mnemonicPhrase ? ethers.Wallet.fromMnemonic(mnemonicPhrase) : ethers.Wallet.createRandom();
  await set("ethereumPrivateKey", newWallet.privateKey);
  await set("ethereumMnemonicPhrase", newWallet.mnemonic);
  Store2.dispatch({
    type: "SET_ETHEREUM_ADDRESS",
    ethereumAddress: newWallet.address
  });
  Store2.dispatch({
    type: "SET_WALLET_CREATION_STATE",
    walletCreationState: "SHOW_MNEMONIC_PHRASE"
  });
  await loadEthereumAccountBalance(Store2);
  const nextPayoutDate = getNextPayoutDate(Store2.getState());
  Store2.dispatch({
    type: "SET_NEXT_PAYOUT_DATE",
    nextPayoutDate
  });
}
export function getBalanceInUSD(Store2) {
  const currentETHPriceState = Store2.getState().currentETHPriceState;
  if (currentETHPriceState === "NOT_FETCHED") {
    return "unknown";
  }
  if (currentETHPriceState === "FETCHING") {
    return "Loading...";
  }
  const currentETHPriceInUSDCents = Store2.getState().currentETHPriceInUSDCents;
  if (currentETHPriceState === "FETCHED" && currentETHPriceInUSDCents === "UNKNOWN") {
    return "unknown";
  }
  if (currentETHPriceState === "FETCHED" && currentETHPriceInUSDCents !== "UNKNOWN") {
    return new BigNumber(Store2.getState().ethereumBalanceInWEI).multipliedBy(Store2.getState().currentETHPriceInUSDCents).dividedBy(new BigNumber(1e20)).toString();
  }
  return "unknown";
}
export function getBalanceInETH(Store2) {
  return new BigNumber(Store2.getState().ethereumBalanceInWEI).dividedBy(new BigNumber(1e18)).toString();
}
export async function loadEthereumAccountBalance(Store2) {
  const ethereumAddress = Store2.getState().ethereumAddress;
  if (ethereumAddress === "NOT_CREATED") {
    return;
  }
  const ethereumBalanceInWEI = (await ethersProvider.getBalance(ethereumAddress)).toString();
  Store2.dispatch({
    type: "SET_ETHEREUM_BALANCE_IN_WEI",
    ethereumBalanceInWEI
  });
}
export async function loadCurrentETHPriceInUSDCents(Store2) {
  Store2.dispatch({
    type: "SET_CURRENT_ETH_PRICE_STATE",
    currentETHPriceState: "FETCHING"
  });
  const currentETHPriceInUSDCents = new BigNumber(await getCurrentETHPriceInUSDCents()).toString();
  Store2.dispatch({
    type: "SET_CURRENT_ETH_PRICE_IN_USD_CENTS",
    currentETHPriceInUSDCents
  });
  Store2.dispatch({
    type: "SET_CURRENT_ETH_PRICE_STATE",
    currentETHPriceState: "FETCHED"
  });
}
export async function getCurrentETHPriceInUSDCents(attemptNumber = 0) {
  try {
    if (attemptNumber === 0) {
      return await getCryptonatorCurrentETHPriceInUSDCents();
    }
    if (attemptNumber === 1) {
      return await getEtherscanCurrentETHPriceInUSDCents();
    }
    return "UNKNOWN";
  } catch (error) {
    console.log("getCurrentETHPriceInUSDCents error", error);
    return await getCurrentETHPriceInUSDCents(attemptNumber + 1);
  }
}
async function getCryptonatorCurrentETHPriceInUSDCents() {
  const ethPriceJSON = await getCurrentETHPriceJSON(cryptonatorAPIEndpoint);
  const currentETHPriceInUSD = ethPriceJSON.ticker.price;
  const currentETHPriceInUSDCents = new BigNumber(currentETHPriceInUSD).multipliedBy(100).toString();
  return currentETHPriceInUSDCents;
}
async function getEtherscanCurrentETHPriceInUSDCents() {
  const ethPriceJSON = await getCurrentETHPriceJSON(etherscanAPIEndpoint);
  const currentETHPriceInUSD = ethPriceJSON.result.ethusd;
  const currentETHPriceInUSDCents = new BigNumber(currentETHPriceInUSD).multipliedBy(100).toString();
  return currentETHPriceInUSDCents;
}
async function getCurrentETHPriceJSON(apiEndpoint) {
  const ethPriceResponse = await window.fetch(apiEndpoint);
  const ethPriceJSON = await ethPriceResponse.json();
  return ethPriceJSON;
}
