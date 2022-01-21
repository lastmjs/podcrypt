import * as fc from "../_snowpack/pkg/fast-check.js";
import {StorePromise, getInitialState} from "../state/store.js";
import {
  payout,
  getNextPayoutDateInMilliseconds,
  getPayoutInfoForPodcast,
  getPayoutInfoForPodcrypt
} from "../services/payout-calculations.js";
import BigNumber from "../node_modules/bignumber.js/bignumber.js";
import {set} from "../_snowpack/pkg/idb-keyval.js";
const emptyPodcryptWallet = {
  address: `0x0bfdd69C0F2e3c848c915f27C8Bd163A4FA20aF8`,
  privateKey: `0xdb32046c0c7ba79d7b5cc5e4e82efa4aa0929d01007823865b4bd3525df49d64`
};
const notEmptyPodcryptWallet = {
  address: "0x736B50eA67647cCc3a920A881bc98AF8de746595",
  privateKey: `0x7206cf5c63f4f233fe388fc928bb710e775d7756670ae1be7e388466b867ee70`
};
StorePromise.then((Store) => {
  const button = document.createElement("button");
  button.innerHTML = `Run tests`;
  button.style = `position: absolute; z-index: 1000; top: 0; right: 0`;
  button.addEventListener("click", () => {
    runTests();
  });
  document.body.appendChild(button);
  async function runTests() {
    console.log("Running tests");
    await test0Podcasts(`Payout with no podcasts`);
    console.log("All tests passed!");
  }
  async function test0Podcasts(message) {
    console.log(message);
    await fc.assert(await fc.asyncProperty(fc.boolean(), fc.integer(0, 1e3), arbPodcastsAndEpisodes(), async (arbEmptyPodcryptWallet, arbPayoutTargetInUSDCents, arbPodcastsAndEpisodes2) => {
      const initialState = getInitialState(null, 0);
      const oldState = {
        ...initialState,
        ethereumAddress: arbEmptyPodcryptWallet ? emptyPodcryptWallet.address : notEmptyPodcryptWallet.address,
        walletCreationState: "CREATED",
        warningCheckbox1Checked: true,
        warningCheckbox2Checked: true,
        warningCheckbox3Checked: true,
        warningCheckbox4Checked: true,
        warningCheckbox5Checked: true,
        payoutTargetInUSDCents: arbPayoutTargetInUSDCents.toString(),
        podcasts: arbPodcastsAndEpisodes2.reduce((result2, podcastAndEpisodes) => {
          return {
            ...result2,
            [podcastAndEpisodes.podcast.feedUrl]: podcastAndEpisodes.podcast
          };
        }, {}),
        episodes: arbPodcastsAndEpisodes2.reduce((result2, podcastAndEpisodes) => {
          return {
            ...result2,
            ...podcastAndEpisodes.episodes.reduce((result3, episode) => {
              return {
                ...result3,
                [episode.guid]: episode
              };
            }, {})
          };
        }, {})
      };
      Store.dispatch({
        type: "SET_STATE",
        state: oldState
      });
      await set("ethereumPrivateKey", arbEmptyPodcryptWallet ? emptyPodcryptWallet.privateKey : notEmptyPodcryptWallet.privateKey);
      await payout(Store, "500");
      const newState = Store.getState();
      const previousPayoutDateIsCorrect = isPreviousPayoutDateCorrect(oldState, newState);
      const nextPayoutDateIsCorrect = isNextPayoutDateCorrect(oldState, newState);
      const payoutInProgressIsCorrect = isPayoutInProgressCorrect(newState);
      const podcastTransactionHashesCorrect = await arePodcastTransactionHashesCorrect(oldState, newState);
      const podcryptTransactionHashCorrect = await isPodcryptTransactionHashCorrect(oldState, newState);
      const podcryptPreviousPayoutDateIsCorrect = isPodcryptPreviousPayoutDateCorrect(oldState, newState);
      const result = previousPayoutDateIsCorrect && nextPayoutDateIsCorrect && payoutInProgressIsCorrect && podcastTransactionHashesCorrect && podcryptTransactionHashCorrect && podcryptPreviousPayoutDateIsCorrect;
      console.log("result", result);
      if (result === false) {
        console.log("previousPayoutDateIsCorrect", previousPayoutDateIsCorrect);
        console.log("nextPayoutDateIsCorrect", nextPayoutDateIsCorrect);
        console.log("payoutInProgressIsCorrect", payoutInProgressIsCorrect);
        console.log("podcastTransactionHashesCorrect", podcastTransactionHashesCorrect);
        console.log("podcryptTransactionHashCorrect", podcryptTransactionHashCorrect);
        console.log("podcryptPreviousPayoutDateIsCorrect", podcryptPreviousPayoutDateIsCorrect);
      }
      return result;
    }), {
      numRuns: 10
    });
  }
  function isPreviousPayoutDateCorrect(oldState, newState) {
    if (newState.payoutProblem === "NO_PROBLEM") {
      return newState.previousPayoutDateInMilliseconds !== "NEVER" && new Date(parseInt(newState.previousPayoutDateInMilliseconds)).toString() !== "Invalid Date";
    } else {
      return oldState.previousPayoutDateInMilliseconds === newState.previousPayoutDateInMilliseconds;
    }
  }
  function isPodcryptPreviousPayoutDateCorrect(oldState, newState) {
    if (newState.payoutProblem === "NO_PROBLEM") {
      return newState.podcryptPreviousPayoutDateInMilliseconds !== "NEVER" && new Date(parseInt(newState.podcryptPreviousPayoutDateInMilliseconds)).toString() !== "Invalid Date";
    } else {
      return oldState.podcryptPreviousPayoutDateInMilliseconds === newState.podcryptPreviousPayoutDateInMilliseconds;
    }
  }
  function isNextPayoutDateCorrect(oldState, newState) {
    if (newState.payoutProblem === "NO_PROBLEM") {
      return getNextPayoutDateInMilliseconds(oldState) === newState.nextPayoutDateInMilliseconds;
    } else {
      return oldState.nextPayoutDateInMilliseconds === newState.nextPayoutDateInMilliseconds;
    }
  }
  function isPayoutInProgressCorrect(newState) {
    return newState.payoutInProgress === false;
  }
  async function arePodcastTransactionHashesCorrect(oldState, newState) {
    const payoutAmountInfosPerPodcast = await Promise.all(Object.values(oldState.podcasts).map(async (podcast) => {
      const payoutInfoForPodcast = await getPayoutInfoForPodcast(oldState, podcast);
      return {
        podcast,
        value: payoutInfoForPodcast.value
      };
    }));
    const podcastTransactionHashesCorrect = payoutAmountInfosPerPodcast.reduce((result, payoutAmountInfo) => {
      if (result === false) {
        return result;
      }
      const podcastInState = newState.podcasts[payoutAmountInfo.podcast.feedUrl];
      if (new BigNumber(payoutAmountInfo.value).gt(0)) {
        return podcastInState.latestTransactionHash !== null && podcastInState.latestTransactionHash !== void 0 && payoutAmountInfo.podcast.latestTransactionHash !== podcastInState.latestTransactionHash;
      }
      return result;
    }, true);
    return podcastTransactionHashesCorrect;
  }
  async function isPodcryptTransactionHashCorrect(oldState, newState) {
    const originalPodcryptLatestTransactionHash = oldState.podcryptLatestTransactionHash;
    const originalPodcryptPayoutInfo = await getPayoutInfoForPodcrypt(oldState);
    const podcryptTransactionHashCorrect = new BigNumber(originalPodcryptPayoutInfo.value).gt(0) ? originalPodcryptLatestTransactionHash !== null && originalPodcryptLatestTransactionHash !== void 0 && originalPodcryptLatestTransactionHash !== newState.podcryptLatestTransactionHash : true;
    return podcryptTransactionHashCorrect;
  }
  function arbPodcastsAndEpisodes() {
    return fc.array(arbPodcastAndEpisodes());
  }
  function arbPodcastAndEpisodes() {
    return fc.constant(0).map((x) => {
      const feedUrl = "http://localhost:5000/test-rss-feed.xml";
      const episodes = fc.sample(arbEpisodes(feedUrl), 1)[0];
      return {
        podcast: {
          feedUrl,
          episodeGuids: episodes.map((episode) => episode.guid),
          artistName: fc.sample(fc.unicodeString(), 1)[0],
          title: fc.sample(fc.unicodeString())[0],
          description: fc.sample(fc.unicodeString())[0],
          imageUrl: fc.sample(fc.constant("NOT_FOUND"), 1)[0],
          previousPayoutDateInMilliseconds: fc.sample(fc.constant("NEVER"), 1)[0],
          latestTransactionHash: fc.sample(fc.constant(null), 1)[0],
          ethereumAddress: fc.sample(fc.constant("0x"), 1)[0],
          ensName: fc.sample(fc.constant("NOT_FOUND"), 1)[0],
          email: fc.sample(fc.constant("NOT_SET"), 1)[0]
        },
        episodes
      };
    });
  }
  function arbEpisodes(feedUrl) {
    return fc.array(arbEpisode(feedUrl));
  }
  function arbEpisode(feedUrl) {
    return fc.tuple(fc.base64String(), fc.constant(feedUrl), fc.unicodeString(), fc.unicodeString(), fc.constant(false), fc.boolean(), fc.constant("0"), arbTimestamps(), fc.constant(new Date().toISOString())).map((tup) => {
      return {
        guid: tup[0],
        feedUrl: tup[1],
        title: tup[2],
        src: tup[3],
        playing: tup[4],
        finishedListening: tup[5],
        progress: tup[6],
        timestamps: fc.sample(fc.array(fc.constant(0)), 1)[0].map((x, index) => {
          return {
            type: index % 2 === 0 ? "START" : "STOP",
            actionType: index % 2 === 0 ? "CURRENT_EPISODE_PLAYED" : "CURRENT_EPISODE_PAUSED",
            milliseconds: fc.sample(fc.integer(), 1)[0].toString()
          };
        }),
        isoDate: tup[8],
        downloadState: "NOT_DOWNLOADED"
      };
    });
  }
  function arbTimestamps() {
    return fc.array(arbTimestamp());
  }
  function arbTimestamp() {
    return fc.tuple(fc.constant("START"), fc.constant("CURRENT_EPISODE_PLAYED"), fc.constant("0")).map((tup) => {
      const timestamp = {
        type: tup[0],
        actionType: tup[1],
        milliseconds: tup[2]
      };
      return timestamp;
    });
  }
});
