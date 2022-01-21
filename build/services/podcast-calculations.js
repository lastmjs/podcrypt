import BigNumber from "../node_modules/bignumber.js/bignumber.js";
export function calculatePayoutAmountForPodcryptDuringIntervalInWEI(state) {
  const payoutTargetInUSDCents = state.payoutTargetInUSDCents;
  const payoutForPodcryptInUSDCents = new BigNumber(state.podcryptPayoutPercentage).multipliedBy(payoutTargetInUSDCents).dividedBy(100).toString();
  const currentETHPriceInUSDCents = state.currentETHPriceInUSDCents;
  if (currentETHPriceInUSDCents === "UNKNOWN") {
    return "UNKNOWN";
  }
  const payoutForPodcryptInWEI = new BigNumber(payoutForPodcryptInUSDCents).dividedBy(currentETHPriceInUSDCents).multipliedBy(1e18).toString();
  return payoutForPodcryptInWEI;
}
export function calculatePayoutAmountForPodcastDuringIntervalInWEI(state, podcast, previousPayoutDate) {
  const payoutForPodcastInUSDCents = calculatePayoutAmountForPodcastDuringIntervalInUSDCents(state, podcast, previousPayoutDate);
  const currentETHPriceInUSDCents = state.currentETHPriceInUSDCents;
  if (currentETHPriceInUSDCents === "UNKNOWN") {
    return "UNKNOWN";
  }
  const payoutForPodcastInWEI = new BigNumber(payoutForPodcastInUSDCents).dividedBy(new BigNumber(currentETHPriceInUSDCents)).multipliedBy(1e18).toString();
  return payoutForPodcastInWEI;
}
export function calculatePayoutAmountForPodcastDuringIntervalInUSD(state, podcast, previousPayoutDateInMilliseconds) {
  const payoutForPodcastInUSDCents = calculatePayoutAmountForPodcastDuringIntervalInUSDCents(state, podcast, previousPayoutDateInMilliseconds);
  const payoutForPodcastInUSD = new BigNumber(payoutForPodcastInUSDCents).dividedBy(100).toString();
  return payoutForPodcastInUSD;
}
function calculatePayoutAmountForPodcastDuringIntervalInUSDCents(state, podcast, previousPayoutDate) {
  const proportionOfTotalTimeForPodcastDuringInterval = calculateProportionOfTotalTimeForPodcastDuringInterval(state, podcast, previousPayoutDate);
  const payoutTargetInUSDCents = state.payoutTargetInUSDCents;
  const payoutForPodcastInUSDCents = new BigNumber(proportionOfTotalTimeForPodcastDuringInterval).multipliedBy(payoutTargetInUSDCents).toString();
  return payoutForPodcastInUSDCents;
}
export function calculateProportionOfTotalTimeForPodcastDuringInterval(state, podcast, previousPayoutDate) {
  if (podcast.paymentsEnabled === false) {
    return "0";
  }
  const grossTotalTimeDuringIntervalInMilliseconds = calculateTotalTimeDuringIntervalInMilliseconds(state);
  if (new BigNumber(grossTotalTimeDuringIntervalInMilliseconds).eq(0)) {
    return "0";
  }
  const podcryptPayoutPercentage = state.podcryptPayoutPercentage;
  const netTotalTimeDuringIntervalInMilliseconds = new BigNumber(grossTotalTimeDuringIntervalInMilliseconds).dividedBy(new BigNumber(100).minus(podcryptPayoutPercentage).dividedBy(100));
  const totalTimeForPodcastDuringIntervalInMilliseconds = podcast.timeListenedSincePreviousPayoutDate;
  return new BigNumber(totalTimeForPodcastDuringIntervalInMilliseconds).dividedBy(netTotalTimeDuringIntervalInMilliseconds).toString();
}
function calculateTotalTimeDuringIntervalInMilliseconds(state) {
  return Object.values(state.podcasts).reduce((result, podcast) => {
    if (podcast.paymentsEnabled === true) {
      return result + podcast.timeListenedSincePreviousPayoutDate;
    } else {
      return result;
    }
  }, 0);
}
