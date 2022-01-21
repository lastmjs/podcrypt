import {
  createStore
} from "../_snowpack/pkg/redux.js";
import {
  get,
  set
} from "../_snowpack/pkg/idb-keyval.js";
import {DefaultReducer} from "./default-reducer.js";
import {PayoutReducer} from "./payout-reducer.js";
import {PlaylistReducer} from "./playlist-reducer.js";
import {
  calculateTotalTimeForPodcastDuringIntervalInMilliseconds
} from "./version-32-migration-helpers.js";
import {
  migrateFrom36To37
} from "./migrations/migrate-from-36-to-37.js";
import {
  migrateFrom37To38
} from "./migrations/migrate-from-37-to-38.js";
export const StorePromise = prepareStore();
async function prepareStore() {
  const persistedState = await get("state");
  const version = 38;
  const InitialState = getInitialState(persistedState, version);
  function RootReducer(state = InitialState, action) {
    const defaultReducedState = DefaultReducer(state, action);
    const payoutReducedState = PayoutReducer(defaultReducedState, action);
    const playlistReducedState = PlaylistReducer(payoutReducedState, action);
    return playlistReducedState;
  }
  const Store2 = createStore((state, action) => {
    if (action.type !== "UPDATE_CURRENT_EPISODE_PROGRESS") {
      console.log("action", action);
    }
    const newState = RootReducer(state, action);
    if (action.type !== "UPDATE_CURRENT_EPISODE_PROGRESS") {
      console.log("state", newState);
    }
    set("state", newState);
    return newState;
  });
  return Store2;
}
export function getInitialState(persistedState, version) {
  if (persistedState === null || persistedState === void 0 || persistedState.version < 26) {
    return getOriginalState(version);
  }
  const migratedState = runMigrations(persistedState, version);
  return {
    ...migratedState,
    previousEpisodeGuid: "NOT_SET",
    currentEpisodeChangedManually: true
  };
}
function runMigrations(persistedState, version) {
  console.log("runMigrations()");
  if (persistedState.version === version) {
    console.log(`persistedState is up to date with version ${version}`);
    return persistedState;
  }
  if (persistedState.version === 26) {
    console.log(`running migration to upgrade version 26`);
    const newPersistedState = {
      ...persistedState,
      version: 27
    };
    return runMigrations(newPersistedState, version);
  }
  if (persistedState.version === 27) {
    console.log(`running migration to upgrade version 27`);
    const newPersistedState = {
      ...persistedState,
      version: 28
    };
    return runMigrations(newPersistedState, version);
  }
  if (persistedState.version === 28) {
    console.log(`running migration to upgrade version 28`);
    const newPersistedState = {
      ...persistedState,
      version: 29,
      mnemonicPhraseWarningCheckboxChecked: false
    };
    return runMigrations(newPersistedState, version);
  }
  if (persistedState.version === 29) {
    console.log(`running migration to upgrade version 29`);
    const newPersistedState = {
      ...persistedState,
      version: 30,
      payoutTargetInUSDCents: "1000",
      payoutIntervalInDays: 30,
      currentETHPriceInUSDCents: "UNKNOWN",
      previousPayoutDate: "NEVER",
      nextPayoutDate: "NEVER",
      ethereumAddress: "NOT_CREATED",
      ethereumBalanceInWEI: "0",
      warningCheckbox1Checked: false,
      warningCheckbox2Checked: false,
      warningCheckbox3Checked: false,
      warningCheckbox4Checked: false,
      warningCheckbox5Checked: false,
      mnemonicPhraseWarningCheckboxChecked: false,
      walletCreationState: "NOT_CREATED",
      currentETHPriceState: "NOT_FETCHED",
      payoutInProgress: false,
      podcryptPreviousPayoutDate: "NEVER",
      podcryptLatestTransactionHash: null,
      payoutProblem: "NO_PROBLEM"
    };
    return runMigrations(newPersistedState, version);
  }
  if (persistedState.version === 30) {
    console.log(`running migration to upgrade version 30`);
    const newPersistedState = {
      ...persistedState,
      version: 31,
      podcryptENSName: "podcrypt.eth",
      podcasts: Object.values(persistedState.podcasts).reduce((result, podcast) => {
        return {
          ...result,
          [podcast.feedUrl]: {
            ...podcast,
            ensName: "NOT_FOUND"
          }
        };
      }, {})
    };
    return runMigrations(newPersistedState, version);
  }
  if (persistedState.version === 31) {
    console.log(`running migration to upgrade version 31`);
    const newPersistedState = {
      ...persistedState,
      version: 32,
      nonce: 0
    };
    return runMigrations(newPersistedState, version);
  }
  if (persistedState.version === 32) {
    console.log(`running migration to upgrade version 32 to 33`);
    const version32State = persistedState;
    const {
      previousPayoutDateInMilliseconds,
      nextPayoutDateInMilliseconds,
      podcryptPreviousPayoutDateInMilliseconds,
      ...version32StateWithoutFields
    } = version32State;
    const newPersistedState = {
      ...version32StateWithoutFields,
      version: 33,
      previousPayoutDate: version32State.previousPayoutDateInMilliseconds === "NEVER" ? "NEVER" : parseInt(version32State.previousPayoutDateInMilliseconds),
      nextPayoutDate: parseInt(version32State.nextPayoutDateInMilliseconds),
      podcryptPreviousPayoutDate: version32State.podcryptPreviousPayoutDateInMilliseconds === "NEVER" ? "NEVER" : parseInt(version32State.podcryptPreviousPayoutDateInMilliseconds),
      podcasts: Object.values(version32State.podcasts).reduce((result, version32Podcast) => {
        const timeListenedTotal = parseInt(calculateTotalTimeForPodcastDuringIntervalInMilliseconds(version32State, version32Podcast, new Date(0).getTime().toString()));
        const timeListenedSincePreviousPayoutDate = parseInt(calculateTotalTimeForPodcastDuringIntervalInMilliseconds(version32State, version32Podcast, version32State.previousPayoutDateInMilliseconds));
        const {
          previousPayoutDateInMilliseconds: previousPayoutDateInMilliseconds2,
          ...version32PodcastWithoutFields
        } = version32Podcast;
        const newPodcast = {
          ...version32PodcastWithoutFields,
          previousPayoutDate: version32Podcast.previousPayoutDateInMilliseconds === "NEVER" ? "NEVER" : parseInt(version32Podcast.previousPayoutDateInMilliseconds),
          lastStartDate: "NEVER",
          timeListenedTotal,
          timeListenedSincePreviousPayoutDate,
          latestTransactionHash: version32Podcast.latestTransactionHash === null ? "NOT_SET" : version32Podcast.latestTransactionHash
        };
        return {
          ...result,
          [newPodcast.feedUrl]: newPodcast
        };
      }, {}),
      episodes: Object.values(version32State.episodes).reduce((result, version32Episode) => {
        const {
          timestamps,
          ...version32EpisodeWithoutTimestamps
        } = version32Episode;
        return {
          ...result,
          [version32EpisodeWithoutTimestamps.guid]: version32EpisodeWithoutTimestamps
        };
      }, {})
    };
    return runMigrations(newPersistedState, version);
  }
  if (persistedState.version === 33) {
    console.log(`running migration to upgrade version 33 to 34`);
    const newPersistedState = {
      ...persistedState,
      version: 34,
      previousEpisodeGuid: "NOT_SET"
    };
    return runMigrations(newPersistedState, version);
  }
  if (persistedState.version === 34) {
    const newPersistedState = {
      ...persistedState,
      version: 35,
      podcasts: Object.entries(persistedState.podcasts).reduce((result, entry) => {
        const podcastKey = entry[0];
        const podcastValue = entry[1];
        const paymentsEnabled = podcastValue.ethereumAddress !== "NOT_FOUND" && podcastValue.ethereumAddress !== "MALFORMED" || podcastValue.ensName !== "NOT_FOUND";
        return {
          ...result,
          [podcastKey]: {
            ...podcastValue,
            paymentsEnabled
          }
        };
      }, {})
    };
    return runMigrations(newPersistedState, version);
  }
  if (persistedState.version === 35) {
    const newPersistedState = {
      ...persistedState,
      version: 36,
      audio1Playing: false,
      audio2Playing: false,
      audio1Src: "NOT_SET",
      audio2Src: "NOT_SET",
      currentEpisodeDownloadIndex: 0
    };
    return runMigrations(newPersistedState, version);
  }
  if (persistedState.version === 36) {
    const newPersistedState = migrateFrom36To37(persistedState);
    return runMigrations(newPersistedState, version);
  }
  if (persistedState.version === 37) {
    const newPersistedState = migrateFrom37To38(persistedState);
    return runMigrations(newPersistedState, version);
  }
  return persistedState;
}
function getOriginalState(version) {
  return {
    version,
    currentRoute: {
      pathname: "/",
      search: "",
      query: {}
    },
    showMainMenu: false,
    currentEpisodeGuid: "NOT_SET",
    previousEpisodeGuid: "NOT_SET",
    playlist: [],
    currentPlaylistIndex: 0,
    podcasts: {},
    episodes: {},
    payoutTargetInUSDCents: "1000",
    payoutIntervalInDays: 30,
    currentETHPriceInUSDCents: "UNKNOWN",
    previousPayoutDate: "NEVER",
    nextPayoutDate: "NEVER",
    ethereumAddress: "NOT_CREATED",
    ethereumBalanceInWEI: "0",
    warningCheckbox1Checked: false,
    warningCheckbox2Checked: false,
    warningCheckbox3Checked: false,
    warningCheckbox4Checked: false,
    warningCheckbox5Checked: false,
    mnemonicPhraseWarningCheckboxChecked: false,
    walletCreationState: "NOT_CREATED",
    podcryptEthereumAddress: "0x0a0d88E64da0CFB51d8D1D5a9A3604647eB3D131",
    podcryptENSName: "podcrypt.eth",
    playerPlaying: false,
    showPlaybackRateMenu: false,
    playbackRate: "1",
    currentETHPriceState: "NOT_FETCHED",
    payoutInProgress: false,
    preparingPlaylist: false,
    podcryptPayoutPercentage: "10",
    podcryptPreviousPayoutDate: "NEVER",
    podcryptLatestTransactionHash: null,
    payoutProblem: "NO_PROBLEM",
    nonce: 0,
    screenType: "MOBILE",
    audio1Playing: false,
    audio2Playing: false,
    audio1Src: "NOT_SET",
    audio2Src: "NOT_SET",
    currentEpisodeDownloadIndex: 0,
    currentEpisodeChangedManually: true
  };
}
