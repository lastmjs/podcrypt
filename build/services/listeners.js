import {StorePromise} from "../state/store.js";
import {payout} from "./payout-calculations.js";
import {
  loadCurrentETHPriceInUSDCents,
  loadEthereumAccountBalance
} from "./balance-calculations.js";
export let ephemeralState = {
  payoutInProgress: false
};
StorePromise.then((Store) => {
  Store.dispatch({
    type: "WINDOW_RESIZE_EVENT",
    screenType: window.matchMedia("(min-width: 1280px)").matches ? "DESKTOP" : "MOBILE"
  });
  window.addEventListener("resize", () => {
    Store.dispatch({
      type: "WINDOW_RESIZE_EVENT",
      screenType: window.matchMedia("(min-width: 1280px)").matches ? "DESKTOP" : "MOBILE"
    });
  });
  setInterval(async () => {
    console.log("running 1");
    if (Store.getState().nextPayoutDate !== "NEVER" && ephemeralState.payoutInProgress === false && new Date().getTime() >= Store.getState().nextPayoutDate) {
      ephemeralState.payoutInProgress = true;
      await payout(Store, 500);
      ephemeralState.payoutInProgress = false;
    }
  }, 3e4);
  setInterval(async () => {
    console.log("running 2");
    if (Store.getState().currentRoute.pathname === "/wallet") {
      await loadCurrentETHPriceInUSDCents(Store);
      await loadEthereumAccountBalance(Store);
    }
  }, 3e4);
});
