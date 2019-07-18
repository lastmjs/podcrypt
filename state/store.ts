import { 
    createStore,
    Store
} from 'redux';
import { 
    get,
    set
} from 'idb-keyval';
import { DefaultReducer } from './default-reducer';
import { PayoutReducer } from './payout-reducer';
import { PlaylistReducer } from './playlist-reducer';
import {
    calculateTotalTimeForPodcastDuringIntervalInMilliseconds, 
    Version32State,
    Version32Podcast,
    Version32Episode,
    Version33State
 } from './version-32-migration-helpers';

export const StorePromise: Promise<Readonly<Store<Readonly<State>, Readonly<PodcryptAction>>>> = prepareStore();

async function prepareStore(): Promise<Readonly<Store<Readonly<State>, Readonly<PodcryptAction>>>> {
    const persistedState: Readonly<State> = await get('state');
    const version: number = 36;

    const InitialState: Readonly<State> = getInitialState(persistedState, version);
    
    function RootReducer(state: Readonly<State> = InitialState, action: Readonly<PodcryptAction>): Readonly<State> {
                    
        const defaultReducedState: Readonly<State> = DefaultReducer(state, action as any);
        const payoutReducedState: Readonly<State> = PayoutReducer(defaultReducedState, action as any);
        const playlistReducedState: Readonly<State> = PlaylistReducer(payoutReducedState, action as any);

        return playlistReducedState;
    }

    const Store: Store<Readonly<State>, Readonly<PodcryptAction>> = createStore((state: Readonly<State> | undefined, action: Readonly<PodcryptAction>) => {

        if (action.type !== 'UPDATE_CURRENT_EPISODE_PROGRESS') {
            // console.log('action', action);
        }
    
        const newState: Readonly<State> = RootReducer(state, action);
    
        if (action.type !== 'UPDATE_CURRENT_EPISODE_PROGRESS') {
            // console.log('state', newState);
        }
    
        set('state', newState);
    
        return newState;
    });

    return Store;
}

export function getInitialState(persistedState: Readonly<State> | null | undefined, version: number): Readonly<State> {

    if (
        persistedState === null ||
        persistedState === undefined ||
        persistedState.version < 26
    ) {
        return getOriginalState(version);
    }

    const migratedState: Readonly<State> = runMigrations(persistedState, version);

    return {
        ...migratedState,
        previousEpisodeGuid: 'NOT_SET'
    };
}

function runMigrations(persistedState: Readonly<State>, version: number): Readonly<State> {
    console.log('runMigrations()');

    if (persistedState.version === version) {
        console.log(`persistedState is up to date with version ${version}`);
        return persistedState;
    }

    // TODO this is how we will deal with migrations
    // TODO for each version, we'll run a specific migration function...
    // TODO we will need to run the migrations in order though
    if (persistedState.version === 26) {
        console.log(`running migration to upgrade version 26`);
        // TODO run the migration for version 26 to 27
        // TODO then runMigrations again

        const newPersistedState: Readonly<State> = {
            ...persistedState,
            version: 27
        };

        return runMigrations(newPersistedState, version);
    }

    if (persistedState.version === 27) {
        console.log(`running migration to upgrade version 27`);

        const newPersistedState: Readonly<State> = {
            ...persistedState,
            version: 28
        };

        return runMigrations(newPersistedState, version);
    }

    if (persistedState.version === 28) {
        console.log(`running migration to upgrade version 28`);

        const newPersistedState: Readonly<State> = {
            ...persistedState,
            version: 29,
            mnemonicPhraseWarningCheckboxChecked: false
        };

        return runMigrations(newPersistedState, version);
    }

    if (persistedState.version === 29) {
        console.log(`running migration to upgrade version 29`);

        const newPersistedState: Readonly<State> = {
            ...persistedState,
            version: 30,
            payoutTargetInUSDCents: '1000',
            payoutIntervalInDays: 30,
            currentETHPriceInUSDCents: 'UNKNOWN',
            previousPayoutDate: 'NEVER',
            nextPayoutDate: 'NEVER',
            ethereumAddress: 'NOT_CREATED',
            ethereumBalanceInWEI: '0',
            warningCheckbox1Checked: false,
            warningCheckbox2Checked: false,
            warningCheckbox3Checked: false,
            warningCheckbox4Checked: false,
            warningCheckbox5Checked: false,
            mnemonicPhraseWarningCheckboxChecked: false,
            walletCreationState: 'NOT_CREATED',
            currentETHPriceState: 'NOT_FETCHED',
            payoutInProgress: false,
            podcryptPreviousPayoutDate: 'NEVER',
            podcryptLatestTransactionHash: null,
            payoutProblem: 'NO_PROBLEM'
        };

        return runMigrations(newPersistedState, version);
    }

    if (persistedState.version === 30) {
        console.log(`running migration to upgrade version 30`);

        const newPersistedState: Readonly<State> = {
            ...persistedState,
            version: 31,
            podcryptENSName: 'podcrypt.eth',
            podcasts: Object.values(persistedState.podcasts).reduce((result: {
                [key: string]: Readonly<Podcast>;
            }, podcast: Readonly<Podcast>) => {
                return {
                    ...result,
                    [podcast.feedUrl]: {
                        ...podcast,
                        ensName: 'NOT_FOUND'
                    }
                };
            }, {})
        }; 
        
        return runMigrations(newPersistedState, version);        
    }

    if (persistedState.version === 31) {
        console.log(`running migration to upgrade version 31`);

        const newPersistedState: Readonly<State> = {
            ...persistedState,
            version: 32,
            nonce: 0
        }; 
        
        return runMigrations(newPersistedState, version);    
    }

    if (persistedState.version === 32) {
        console.log(`running migration to upgrade version 32 to 33`);

        const version32State: Readonly<Version32State> = persistedState as unknown as Readonly<Version32State>;
        const {
            previousPayoutDateInMilliseconds,
            nextPayoutDateInMilliseconds,
            podcryptPreviousPayoutDateInMilliseconds,
            ...version32StateWithoutFields
        } = version32State;

        const newPersistedState: Readonly<Version33State> = {
            ...version32StateWithoutFields,
            version: 33,
            previousPayoutDate: version32State.previousPayoutDateInMilliseconds === 'NEVER' ? 'NEVER' : parseInt(version32State.previousPayoutDateInMilliseconds),
            nextPayoutDate: parseInt(version32State.nextPayoutDateInMilliseconds),
            podcryptPreviousPayoutDate: version32State.podcryptPreviousPayoutDateInMilliseconds === 'NEVER' ? 'NEVER' : parseInt(version32State.podcryptPreviousPayoutDateInMilliseconds),
            podcasts: Object.values(version32State.podcasts).reduce((result: {
                [key: string]: Readonly<Podcast>
            }, version32Podcast: Readonly<Version32Podcast>) => {

                const timeListenedTotal: Milliseconds = parseInt(calculateTotalTimeForPodcastDuringIntervalInMilliseconds(version32State, version32Podcast, new Date(0).getTime().toString()));
                const timeListenedSincePreviousPayoutDate: Milliseconds = parseInt(calculateTotalTimeForPodcastDuringIntervalInMilliseconds(version32State, version32Podcast, version32State.previousPayoutDateInMilliseconds));

                const { 
                    previousPayoutDateInMilliseconds,
                    ...version32PodcastWithoutFields
                } = version32Podcast;

                const newPodcast: Readonly<Podcast> = {
                    ...version32PodcastWithoutFields,
                    previousPayoutDate: version32Podcast.previousPayoutDateInMilliseconds === 'NEVER' ? 'NEVER' : parseInt(version32Podcast.previousPayoutDateInMilliseconds),
                    lastStartDate: 'NEVER',
                    timeListenedTotal,
                    timeListenedSincePreviousPayoutDate,
                    latestTransactionHash: version32Podcast.latestTransactionHash === null ? 'NOT_SET' : version32Podcast.latestTransactionHash
                };

                return {
                    ...result,
                    [newPodcast.feedUrl]: newPodcast
                };
            }, {}),
            episodes: Object.values(version32State.episodes).reduce((result: {
                [key: string]: Readonly<Episode>
            }, version32Episode: Readonly<Version32Episode>) => {
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

        // TODO I put in the type coercion to Readonly<State> because the Version33State does not have the previousEpisodeGuid
        // TODO but the runMigrations command takes a Readonly<State>...this is not good, because each version might have a different version of the State...we should address this eventually
        return runMigrations(newPersistedState as Readonly<State>, version);
    }

    if (persistedState.version === 33) {
        console.log(`running migration to upgrade version 33 to 34`);

        // TODO this type reall is not correct...it should be Version34State...think about making the state an interface so that it can inherit previous properties, that will save space
        const newPersistedState: Readonly<State> = {
            ...persistedState,
            version: 34,
            previousEpisodeGuid: 'NOT_SET'
        }; 
        
        return runMigrations(newPersistedState, version);    
    }

    if (persistedState.version === 34) {
        const newPersistedState: Readonly<State> = {
            ...persistedState,
            version: 35,
            podcasts: Object.entries(persistedState.podcasts).reduce((result, entry) => {
                const podcastKey: FeedUrl = entry[0];
                const podcastValue: Readonly<Podcast> = entry[1];
                const paymentsEnabled: boolean = (podcastValue.ethereumAddress !== 'NOT_FOUND' && podcastValue.ethereumAddress !== 'MALFORMED') || podcastValue.ensName !== 'NOT_FOUND';

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
        const newPersistedState: Readonly<State> = {
            ...persistedState,
            version: 36,
            audio1Playing: false,
            audio2Playing: false,
            audio1Src: 'NOT_SET',
            audio2Src: 'NOT_SET',
            currentEpisodeDownloadIndex: 0
        };

        return runMigrations(newPersistedState, version);
    }

    return persistedState;
}

function getOriginalState(version: number): Readonly<State> {
    return {
        version,
        currentRoute: {
            pathname: '/',
            search: '',
            query: {}
        },
        showMainMenu: false,
        currentEpisodeGuid: 'NOT_SET',
        previousEpisodeGuid: 'NOT_SET',
        playlist: [],
        currentPlaylistIndex: 0,
        podcasts: {},
        episodes: {},
        payoutTargetInUSDCents: '1000',
        payoutIntervalInDays: 30,
        currentETHPriceInUSDCents: 'UNKNOWN',
        previousPayoutDate: 'NEVER',
        nextPayoutDate: 'NEVER',
        ethereumAddress: 'NOT_CREATED',
        ethereumBalanceInWEI: '0',
        warningCheckbox1Checked: false,
        warningCheckbox2Checked: false,
        warningCheckbox3Checked: false,
        warningCheckbox4Checked: false,
        warningCheckbox5Checked: false,
        mnemonicPhraseWarningCheckboxChecked: false,
        walletCreationState: 'NOT_CREATED',
        podcryptEthereumAddress: '0x0a0d88E64da0CFB51d8D1D5a9A3604647eB3D131',
        podcryptENSName: 'podcrypt.eth',
        playerPlaying: false,
        showPlaybackRateMenu: false,
        playbackRate: '1',
        currentETHPriceState: 'NOT_FETCHED',
        payoutInProgress: false,
        preparingPlaylist: false,
        podcryptPayoutPercentage: '10',
        podcryptPreviousPayoutDate: 'NEVER',
        podcryptLatestTransactionHash: null,
        payoutProblem: 'NO_PROBLEM',
        nonce: 0,
        screenType: 'MOBILE',
        audio1Playing: false,
        audio2Playing: false,
        audio1Src: 'NOT_SET',
        audio2Src: 'NOT_SET',
        currentEpisodeDownloadIndex: 0
    };
}