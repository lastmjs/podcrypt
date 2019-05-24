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

export const StorePromise: Promise<Readonly<Store<Readonly<State>, Readonly<PodcryptAction>>>> = prepareStore();

async function prepareStore(): Promise<Readonly<Store<Readonly<State>, Readonly<PodcryptAction>>>> {
    const persistedState: Readonly<State> = await get('state');
    const version: number = 32;

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

    return runMigrations(persistedState, version);
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
        nonce: 0
    };
}