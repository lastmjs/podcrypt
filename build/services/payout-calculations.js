import {
  calculatePayoutAmountForPodcastDuringIntervalInWEI,
  calculatePayoutAmountForPodcryptDuringIntervalInWEI
} from "./podcast-calculations.js";
import {
  loadEthereumAccountBalance,
  loadCurrentETHPriceInUSDCents
} from "./balance-calculations.js";
import {get} from "../_snowpack/pkg/idb-keyval.js";
import {
  wait,
  getRSSFeed,
  getSafeLowGasPriceInWEI
} from "./utilities.js";
import BigNumber from "../node_modules/bignumber.js/bignumber.js";
import {getEthereumAddressFromPodcastDescription} from "./utilities.js";
import "../node_modules/ethers/dist/ethers.min.js";
import {ethersProvider} from "./ethers-provider.js";
export function getNextPayoutDate(state) {
  const previousPayoutDate = state.previousPayoutDate;
  const payoutIntervalInDays = state.payoutIntervalInDays;
  const oneDayInSeconds = 86400;
  const oneDayInMilliseconds = oneDayInSeconds * 1e3;
  const payoutIntervalInMilliseconds = oneDayInMilliseconds * payoutIntervalInDays;
  if (previousPayoutDate === "NEVER") {
    const nextPayoutDate = new Date(new Date().getTime() + payoutIntervalInMilliseconds);
    const nextPayoutDateRoundedToNearestStartOfDay = new Date(nextPayoutDate.getFullYear(), nextPayoutDate.getMonth(), nextPayoutDate.getDate());
    const nextPayoutDateInMilliseconds = nextPayoutDateRoundedToNearestStartOfDay.getTime();
    return nextPayoutDateInMilliseconds;
  } else {
    const nextPayoutDate = new Date(previousPayoutDate + payoutIntervalInMilliseconds);
    const nextPayoutDateRoundedToNearestStartOfDay = new Date(nextPayoutDate.getFullYear(), nextPayoutDate.getMonth(), nextPayoutDate.getDate());
    const nextPayoutDateInMilliseconds = nextPayoutDateRoundedToNearestStartOfDay.getTime();
    return nextPayoutDateInMilliseconds;
  }
}
export function getPayoutTargetInETH(Store2) {
  const payoutTargetInETH = new BigNumber(Store2.getState().payoutTargetInUSDCents).dividedBy(new BigNumber(Store2.getState().currentETHPriceInUSDCents)).toString();
  return Store2.getState().currentETHPriceInUSDCents === "UNKNOWN" ? "Loading..." : payoutTargetInETH;
}
export function getPayoutTargetInWEI(state) {
  const payoutTargetInWEI = new BigNumber(state.payoutTargetInUSDCents).dividedBy(new BigNumber(state.currentETHPriceInUSDCents)).multipliedBy(1e18).toString();
  return state.currentETHPriceInUSDCents === "UNKNOWN" ? "Loading..." : payoutTargetInWEI;
}
export async function payout(Store2, retryDelayInMilliseconds) {
  await loadCurrentETHPriceInUSDCents(Store2);
  await loadEthereumAccountBalance(Store2);
  if (Store2.getState().payoutProblem !== "NO_PROBLEM") {
    return;
  }
  Store2.dispatch({
    type: "SET_PAYOUT_IN_PROGRESS",
    payoutInProgress: true
  });
  if (Store2.getState().currentETHPriceInUSDCents === "UNKNOWN") {
    const newRetryDelayInMilliseconds = retryDelayInMilliseconds * 2;
    await wait(newRetryDelayInMilliseconds);
    await payout(Store2, newRetryDelayInMilliseconds);
    return;
  }
  const podcastEthereumTransactionData = await getPodcastEthereumTransactionData(Store2);
  const podcryptEthereumTransactionDatumResult = await getPodcryptEthereumTransactionDatum(Store2.getState());
  console.log("podcastEthereumTransactionData", podcastEthereumTransactionData);
  console.log("podcryptEthereumTransactionDatumResult", podcryptEthereumTransactionDatumResult);
  for (let i = 0; i < podcastEthereumTransactionData.length; i++) {
    const podcastEthereumTransactionDatum = podcastEthereumTransactionData[i];
    const podcastTransaction = await prepareAndSendTransaction(Store2, podcastEthereumTransactionDatum);
    console.log("podcastTransaction", podcastTransaction);
    Store2.dispatch({
      type: "SET_PODCAST_PREVIOUS_PAYOUT_DATE",
      feedUrl: podcastEthereumTransactionDatum.id,
      previousPayoutDate: new Date().getTime()
    });
    Store2.dispatch({
      type: "SET_PODCAST_LATEST_TRANSACTION_HASH",
      feedUrl: podcastEthereumTransactionDatum.id,
      latestTransactionHash: podcastTransaction.hash
    });
    Store2.dispatch({
      type: "RESET_PODCAST_TIME_LISTENED_SINCE_PREVIOUS_PAYOUT",
      feedUrl: podcastEthereumTransactionDatum.id
    });
  }
  if (podcryptEthereumTransactionDatumResult !== "ALREADY_PAID_FOR_INTERVAL" && podcryptEthereumTransactionDatumResult !== "NET_VALUE_TOO_SMALL") {
    const podcryptTransaction = await prepareAndSendTransaction(Store2, podcryptEthereumTransactionDatumResult);
    console.log("podcryptTransaction", podcryptTransaction);
    Store2.dispatch({
      type: "SET_PODCRYPT_PREVIOUS_PAYOUT_DATE",
      podcryptPreviousPayoutDate: new Date().getTime()
    });
    Store2.dispatch({
      type: "SET_PODCRYPT_LATEST_TRANSACTION_HASH",
      podcryptLatestTransactionHash: podcryptTransaction.hash
    });
  }
  Store2.dispatch({
    type: "SET_PREVIOUS_PAYOUT_DATE",
    previousPayoutDate: new Date().getTime()
  });
  const nextPayoutDate = getNextPayoutDate(Store2.getState());
  Store2.dispatch({
    type: "SET_NEXT_PAYOUT_DATE",
    nextPayoutDate
  });
  await loadCurrentETHPriceInUSDCents(Store2);
  await loadEthereumAccountBalance(Store2);
  Store2.dispatch({
    type: "SET_PAYOUT_IN_PROGRESS",
    payoutInProgress: false
  });
}
async function getPodcastEthereumTransactionData(Store2) {
  const podcasts = Object.values(Store2.getState().podcasts);
  const podcastEthereumTransactionData = await podcasts.reduce(async (result, podcast) => {
    if (podcast.paymentsEnabled === false) {
      return result;
    }
    if (podcast.previousPayoutDate !== "NEVER" && podcast.previousPayoutDate > Store2.getState().nextPayoutDate) {
      return result;
    }
    const feed = await getRSSFeed(podcast.feedUrl);
    if (!feed) {
      return result;
    }
    const podcastEthereumAddressInfo = await getEthereumAddressFromPodcastDescription(feed.description);
    const podcastEthereumAddress = podcastEthereumAddressInfo.ethereumAddress;
    Store2.dispatch({
      type: "SET_PODCAST_ETHEREUM_ADDRESS",
      feedUrl: podcast.feedUrl,
      ethereumAddress: podcastEthereumAddress
    });
    if (podcastEthereumAddress === "NOT_FOUND") {
      return result;
    }
    if (podcastEthereumAddress === "MALFORMED") {
      return result;
    }
    const to = podcastEthereumAddress;
    const dataHex = hexlifyData("podcrypt.app");
    const grossValue = await getGrossPayoutForPodcastInWEI(Store2.getState(), podcast);
    const gasLimit = await getGasLimit(dataHex, to, grossValue);
    const gasPrice = await getSafeLowGasPriceInWEI();
    const netValue = new BigNumber(grossValue).minus(new BigNumber(gasPrice).multipliedBy(gasLimit)).toFixed(0);
    if (new BigNumber(netValue).lte(0)) {
      return result;
    }
    const ethereumTransactionDatum = {
      id: podcast.feedUrl,
      to,
      value: netValue,
      data: dataHex,
      gasLimit,
      gasPrice
    };
    const resolvedResult = await result;
    return [...resolvedResult, ethereumTransactionDatum];
  }, Promise.resolve([]));
  return podcastEthereumTransactionData;
}
async function getPodcryptEthereumTransactionDatum(state) {
  if (state.podcryptPreviousPayoutDate > state.nextPayoutDate) {
    return "ALREADY_PAID_FOR_INTERVAL";
  }
  const to = state.podcryptEthereumAddress;
  const dataHex = hexlifyData("podcrypt.app");
  const grossValue = await getGrossPayoutForPodcryptInWEI(state);
  const gasLimit = await getGasLimit(dataHex, to, grossValue);
  const gasPrice = await getSafeLowGasPriceInWEI();
  const netValue = new BigNumber(grossValue).minus(new BigNumber(gasPrice).multipliedBy(gasLimit)).toFixed(0);
  if (new BigNumber(netValue).lte(0)) {
    return "NET_VALUE_TOO_SMALL";
  }
  const ethereumTransactionDatum = {
    id: "podcrypt",
    to,
    value: netValue,
    data: dataHex,
    gasLimit,
    gasPrice
  };
  return ethereumTransactionDatum;
}
async function prepareAndSendTransaction(Store2, transactionDatum) {
  const wallet = new ethers.Wallet(await get("ethereumPrivateKey"), ethersProvider);
  const nonceFromNetwork = await ethersProvider.getTransactionCount(wallet.address);
  const nonceFromState = Store2.getState().nonce;
  if (nonceFromState > nonceFromNetwork) {
    Store2.dispatch({
      type: "SET_NONCE",
      nonce: nonceFromState
    });
  } else {
    Store2.dispatch({
      type: "SET_NONCE",
      nonce: nonceFromNetwork
    });
  }
  const nonce = Store2.getState().nonce;
  const newNonce = nonce + 1;
  Store2.dispatch({
    type: "SET_NONCE",
    nonce: newNonce
  });
  const preparedTransaction = {
    to: transactionDatum.to,
    value: ethers.utils.bigNumberify(transactionDatum.value),
    gasLimit: transactionDatum.gasLimit,
    gasPrice: ethers.utils.bigNumberify(transactionDatum.gasPrice),
    nonce,
    data: transactionDatum.data
  };
  console.log("preparedTransaction", preparedTransaction);
  const transaction = await wallet.sendTransaction(preparedTransaction);
  console.log("transaction", transaction);
  return transaction;
}
export async function getGrossPayoutForPodcastInWEI(state, podcast) {
  const previousPayoutDate = podcast.previousPayoutDate !== "NEVER" && state.previousPayoutDate !== "NEVER" && podcast.previousPayoutDate > state.previousPayoutDate ? podcast.previousPayoutDate : state.previousPayoutDate;
  const grossValueInWEI = new BigNumber(calculatePayoutAmountForPodcastDuringIntervalInWEI(state, podcast, previousPayoutDate)).toFixed(0);
  return grossValueInWEI;
}
export async function getGrossPayoutForPodcryptInWEI(state) {
  const grossValueInWEI = new BigNumber(calculatePayoutAmountForPodcryptDuringIntervalInWEI(state)).toFixed(0);
  return grossValueInWEI;
}
function hexlifyData(dataUTF8) {
  const dataUTF8Bytes = ethers.utils.toUtf8Bytes(dataUTF8);
  const dataHex = ethers.utils.hexlify(dataUTF8Bytes);
  return dataHex;
}
async function getGasLimit(dataHex, to, value) {
  return await ethersProvider.estimateGas({
    to,
    value,
    data: dataHex
  });
}
