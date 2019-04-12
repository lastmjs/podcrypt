import { 
    createStore,
    Store,
    AnyAction
} from 'redux';
import { 
    get,
    set
} from 'idb-keyval';
import BigNumber from 'bignumber.js';
import {
    getPayoutTargetInWEI
} from './payout-calculations';

export const StorePromise: Promise<Readonly<Store<Readonly<State>, Readonly<AnyAction>>>> = prepareStore();

async function prepareStore(): Promise<Readonly<Store<Readonly<State>, Readonly<AnyAction>>>> {
    const persistedState: Readonly<State> = await get('state');
    const version: number = 31;

    const InitialState: Readonly<State> = getInitialState(persistedState, version);
    
    const RootReducer: (state: Readonly<State> | undefined, action: AnyAction) => Readonly<State> = (state: Readonly<State> = InitialState, action: AnyAction): Readonly<State> => {
        
        if (action.type === 'SET_PODCRYPT_LATEST_TRANSACTION_HASH') {
            return {
                ...state,
                podcryptLatestTransactionHash: action.podcryptLatestTransactionHash
            };
        }

        if (action.type === 'SET_PODCRYPT_PREVIOUS_PAYOUT_DATE_IN_MILLISECONDS') {
            return {
                ...state,
                podcryptPreviousPayoutDateInMilliseconds: action.podcryptPreviousPayoutDateInMilliseconds
            };
        }
        
        if (action.type === 'SET_PODCAST_ETHEREUM_ADDRESS') {
            return {
                ...state,
                podcasts: {
                    ...state.podcasts,
                    [action.feedUrl]: {
                        ...state.podcasts[action.feedUrl],
                        ethereumAddress: action.ethereumAddress
                    }
                }
            };
        }
        
        // TODO this is not used for anything currently
        if (action.type === 'SET_PAYOUT_IN_PROGRESS') {
            return {
                ...state,
                payoutInProgress: action.payoutInProgress
            };
        }
        
        if (action.type === 'SET_CURRENT_ETH_PRICE_STATE') {
            return {
                ...state,
                currentETHPriceState: action.currentETHPriceState
            };
        }
        
        if (action.type === 'SET_PLAYBACK_RATE') {
            return {
                ...state,
                playbackRate: action.playbackRate
            };
        }

        if (action.type === 'TOGGLE_PLAYBACK_RATE_MENU') {
            return {
                ...state,
                showPlaybackRateMenu: !state.showPlaybackRateMenu
            };
        }

        if (action.type === 'CHANGE_CURRENT_ROUTE') {
            return {
                ...state,
                currentRoute: action.currentRoute
            };
        }
    
        if (action.type === 'TOGGLE_SHOW_MAIN_MENU') {
            return {
                ...state,
                showMainMenu: !state.showMainMenu
            }
        }
    
        // if (action.type === 'PLAY_EPISODE') {
        //     return {
        //         ...state,
        //         currentEpisodeGuid: action.episode.guid,
        //         episodes: {
        //             ...state.episodes,
        //             [action.episode.guid]: {
        //                 ...state.episodes[action.episode.guid],
        //                 ...action.episode
        //             }
        //         }
        //     };
        // }
    
        if (action.type === 'SUBSCRIBE_TO_PODCAST') {
            const podcastInState: Readonly<Podcast> = state.podcasts[action.podcast.feedUrl];
            const podcastAlreadyExists: boolean = podcastInState !== null && podcastInState !== undefined;

            if (podcastAlreadyExists) {
                return {
                    ...state,
                    podcasts: {
                        ...state.podcasts,
                        [action.podcast.feedUrl]: {
                            ...state.podcasts[action.podcast.feedUrl],
                            artistName: action.podcast.artistName,
                            title: action.podcast.title,
                            description: action.podcast.description,
                            imageUrl: action.podcast.imageUrl,
                            ethereumAddress: action.podcast.ethereumAddress,
                            email: action.podcast.email
                        }
                    }
                };
            }
            else {
                return {
                    ...state,
                    podcasts: {
                        ...state.podcasts,
                        [action.podcast.feedUrl]: action.podcast
                    }
                };
            }
        }

        if (action.type === 'SET_PREPARING_PLAYLIST') {
            return {
                ...state,
                preparingPlaylist: action.preparingPlaylist
            };
        }

        // TODO we need timestamps potentially
        if (action.type === 'PLAY_PREVIOUS_EPISODE') {
            const nextPlaylistIndex: number = state.currentPlaylistIndex - 1 >= 0 ? state.currentPlaylistIndex - 1 : 0;
            const nextCurrentEpisodeGuid: EpisodeGuid = state.playlist[nextPlaylistIndex];

            return {
                ...state,
                currentPlaylistIndex: nextPlaylistIndex,
                currentEpisodeGuid: nextCurrentEpisodeGuid
            };
        }

        // TODO we need timestamps potentially
        if (action.type === 'PLAY_NEXT_EPISODE') {
            const nextPlaylistIndex: number = state.currentPlaylistIndex + 1 < state.playlist.length - 1 ? state.currentPlaylistIndex + 1 : state.playlist.length - 1;
            const nextCurrentEpisodeGuid: EpisodeGuid = state.playlist[nextPlaylistIndex];

            return {
                ...state,
                currentPlaylistIndex: nextPlaylistIndex,
                currentEpisodeGuid: nextCurrentEpisodeGuid
            };
        }

        if (action.type === 'SET_PODCAST_LATEST_TRANSACTION_HASH') {
            return {
                ...state,
                podcasts: {
                    ...state.podcasts,
                    [action.feedUrl]: {
                        ...state.podcasts[action.feedUrl],
                        latestTransactionHash: action.latestTransactionHash
                    }
                }
            };
        }
    
        if (action.type === 'ADD_EPISODE_TO_PLAYLIST') {
            const episodeInPlaylist: boolean = state.playlist.includes(action.episode.guid);

            if (episodeInPlaylist) {
                return state;
            }
            else {
                const episodeInState: Readonly<Episode> = state.episodes[action.episode.guid];
                const episodeAlreadyExists: boolean = episodeInState !== null && episodeInState !== undefined;

                if (episodeAlreadyExists) {
                    return {
                        ...state,
                        playlist: [...state.playlist, action.episode.guid],
                        episodes: {
                            ...state.episodes,
                            [action.episode.guid]: {
                                ...state.episodes[action.episode.guid],
                                title: action.episode.title,
                                src: action.episode.src
                            }
                        },
                        podcasts: {
                            ...state.podcasts,
                            [action.podcast.feedUrl]: {
                                ...state.podcasts[action.podcast.feedUrl],
                                title: action.podcast.title,
                                description: action.podcast.description,
                                imageUrl: action.podcast.imageUrl,
                                ethereumAddress: action.podcast.ethereumAddress,
                                email: action.podcast.email
                            }
                        }
                    };
                }
                else {
                    const podcastInState: Readonly<Podcast> = state.podcasts[action.podcast.feedUrl];
                    const podcastAlreadyExists: boolean = podcastInState !== null && podcastInState !== undefined;

                    if (podcastAlreadyExists) {
                        return {
                            ...state,
                            playlist: [...state.playlist, action.episode.guid],
                            episodes: {
                                ...state.episodes,
                                [action.episode.guid]: action.episode
                            },
                            podcasts: {
                                ...state.podcasts,
                                [action.podcast.feedUrl]: {
                                    ...state.podcasts[action.podcast.feedUrl],
                                    title: action.podcast.title,
                                    description: action.podcast.description,
                                    imageUrl: action.podcast.imageUrl,
                                    ethereumAddress: action.podcast.ethereumAddress,
                                    email: action.podcast.email,
                                    episodeGuids: [...podcastInState.episodeGuids, action.episode.guid]
                                }
                            }
                        };
                    }
                    else {
                        return {
                            ...state,
                            playlist: [...state.playlist, action.episode.guid],
                            episodes: {
                                ...state.episodes,
                                [action.episode.guid]: action.episode
                            },
                            podcasts: {
                                ...state.podcasts,
                                [action.podcast.feedUrl]: {
                                    ...action.podcast,
                                    episodeGuids: [action.episode.guid]
                                }
                            }
                        };
                    }
                }
            }
        }
    
        if (action.type === 'PLAY_EPISODE_FROM_PLAYLIST') {
            const newCurrentPlaylistIndex: number = state.playlist.indexOf(action.episodeGuid);
            const newCurrentEpisodeGuid: EpisodeGuid = state.playlist[newCurrentPlaylistIndex];
    
            // TODO this is dirty clean it up
            if (state.currentEpisodeGuid === 'NOT_SET') {
                return {
                    ...state,
                    currentEpisodeGuid: newCurrentEpisodeGuid,
                    currentPlaylistIndex: newCurrentPlaylistIndex,
                    playerPlaying: true,
                    episodes: {
                        ...state.episodes,
                        [newCurrentEpisodeGuid]: {
                            ...state.episodes[newCurrentEpisodeGuid],
                            playing: true,
                            timestamps: [...state.episodes[newCurrentEpisodeGuid].timestamps, {
                                type: 'START',
                                actionType: 'PLAY_EPISODE_FROM_PLAYLIST',
                                milliseconds: new Date().getTime().toString()
                            }]
                        }
                    }
                };
            }
            else if (newCurrentEpisodeGuid === state.currentEpisodeGuid) {
                return {
                    ...state,
                    playerPlaying: true,
                    episodes: {
                        ...state.episodes,
                        [state.currentEpisodeGuid]: {
                            ...state.episodes[state.currentEpisodeGuid],
                            playing: true,
                            timestamps: [...state.episodes[state.currentEpisodeGuid].timestamps, {
                                type: 'START',
                                actionType: 'PLAY_EPISODE_FROM_PLAYLIST',
                                milliseconds: new Date().getTime().toString()
                            }]
                        }
                    }
                };
            }
            else {
                return {
                    ...state,
                    currentEpisodeGuid: newCurrentEpisodeGuid,
                    currentPlaylistIndex: newCurrentPlaylistIndex,
                    playerPlaying: true,
                    episodes: {
                        ...state.episodes,
                        [newCurrentEpisodeGuid]: {
                            ...state.episodes[newCurrentEpisodeGuid],
                            playing: true,
                            timestamps: [...state.episodes[newCurrentEpisodeGuid].timestamps, {
                                type: 'START',
                                actionType: 'PLAY_EPISODE_FROM_PLAYLIST',
                                milliseconds: new Date().getTime().toString()
                            }]
                        },
                        [state.currentEpisodeGuid]: {
                            ...state.episodes[state.currentEpisodeGuid],
                            playing: false,
                            timestamps: [...(state.episodes[state.currentEpisodeGuid] ? state.episodes[state.currentEpisodeGuid].timestamps : []), {
                                type: 'STOP',
                                actionType: 'PLAY_EPISODE_FROM_PLAYLIST',
                                milliseconds: new Date().getTime().toString()
                            }]
                        }
                    }
                };
            }
        }

        if (action.type === 'PAUSE_EPISODE_FROM_PLAYLIST') {
            const episodeGuid: EpisodeGuid = action.episodeGuid;
            const isCurrentEpisode: boolean = episodeGuid === state.currentEpisodeGuid;

            return {
                ...state,
                playerPlaying: isCurrentEpisode ? false : state.playerPlaying,
                episodes: {
                    ...state.episodes,
                    [episodeGuid]: {
                        ...state.episodes[episodeGuid],
                        playing: false,
                        timestamps: [...state.episodes[episodeGuid].timestamps, {
                            type: 'STOP',
                            actionType: 'PAUSE_EPISODE_FROM_PLAYLIST',
                            milliseconds: new Date().getTime().toString()
                        }]
                    }
                }
            };
        }
    
        if (action.type === 'CURRENT_EPISODE_COMPLETED') {
            const nextPlaylistIndex: number = state.currentPlaylistIndex + 1;
            const nextEpisodeGuid: EpisodeGuid = state.playlist[nextPlaylistIndex];
            const newCurrentEpisode: Readonly<Episode> = {
                ...state.episodes[state.currentEpisodeGuid],
                finishedListening: true,
                progress: '0',
                playing: false,
                timestamps: [...state.episodes[state.currentEpisodeGuid].timestamps, {
                    type: 'STOP',
                    actionType: 'CURRENT_EPISODE_COMPLETED',
                    milliseconds: new Date().getTime().toString()
                }]
            };

            if (!nextEpisodeGuid) {
                return {
                    ...state,
                    playerPlaying: false,
                    episodes: {
                        ...state.episodes,
                        [state.currentEpisodeGuid]: newCurrentEpisode
                    }
                };
            }
    
            return {
                ...state,
                currentEpisodeGuid: nextEpisodeGuid,
                currentPlaylistIndex: nextPlaylistIndex,
                episodes: {
                    ...state.episodes,
                    [state.currentEpisodeGuid]: newCurrentEpisode,
                    [nextEpisodeGuid]: {
                        ...state.episodes[nextEpisodeGuid],
                        playing: true,
                        timestamps: [...state.episodes[nextEpisodeGuid].timestamps, {
                            type: 'START',
                            actionType: 'CURRENT_EPISODE_COMPLETED',
                            milliseconds: new Date().getTime().toString()
                        }]
                    }
                }
            };
        }
    
        if (action.type === 'UPDATE_CURRENT_EPISODE_PROGRESS') {
            return {
                ...state,
                episodes: {
                    ...state.episodes,
                    [state.currentEpisodeGuid]: {
                        ...state.episodes[state.currentEpisodeGuid],
                        progress: action.progress
                    }
                }
            };
        }
    
        if (action.type === 'CURRENT_EPISODE_PLAYED') {
            return {
                ...state,
                playerPlaying: true,
                episodes: {
                    ...state.episodes,
                    [state.currentEpisodeGuid]: {
                        ...state.episodes[state.currentEpisodeGuid],
                        playing: true,
                        timestamps: [...state.episodes[state.currentEpisodeGuid].timestamps, {
                            type: 'START',
                            actionType: 'CURRENT_EPISODE_PLAYED',
                            milliseconds: new Date().getTime().toString()
                        }]
                    }
                }
            };
        }
    
        if (action.type === 'CURRENT_EPISODE_PAUSED') {
            return {
                ...state,
                playerPlaying: false,
                episodes: {
                    ...state.episodes,
                    [state.currentEpisodeGuid]: {
                        ...state.episodes[state.currentEpisodeGuid],
                        playing: false,
                        timestamps: [...state.episodes[state.currentEpisodeGuid].timestamps, {
                            type: 'STOP',
                            actionType: 'CURRENT_EPISODE_PAUSED',
                            milliseconds: new Date().getTime().toString()
                        }]
                    }
                }
            };
        }
    
        if (action.type === 'REMOVE_EPISODE_FROM_PLAYLIST') {
            const playlistIndex = state.playlist.indexOf(action.episodeGuid);

            return {
                ...state,
                currentPlaylistIndex: state.currentPlaylistIndex > playlistIndex ? state.currentPlaylistIndex - 1 : state.currentPlaylistIndex,
                playlist: state.playlist.filter((episodeGuid: string, index: number) => {
                    return playlistIndex !== index;
                })
            };
        }
    
        if (action.type === 'MOVE_EPISODE_UP') {
            const playlistIndex = state.playlist.indexOf(action.episodeGuid);

            return {
                ...state,
                currentPlaylistIndex: getCurrentPlaylistIndexAfterMoveUp(state, playlistIndex),
                playlist: state.playlist.map((episodeGuid: string, index: number) => {
                    if (playlistIndex === 0) {
                        return episodeGuid;
                    }
    
                    if (index === playlistIndex - 1) {
                        return state.playlist[playlistIndex];
                    }
            
                    if (index === playlistIndex) {
                        return state.playlist[playlistIndex - 1];
                    }
    
                    return episodeGuid;
                })
            };
        }
    
        if (action.type === 'MOVE_EPISODE_DOWN') {

            const playlistIndex = state.playlist.indexOf(action.episodeGuid);

            return {
                ...state,
                currentPlaylistIndex: getCurrentPlaylistIndexAfterMoveDown(state, playlistIndex),
                playlist: state.playlist.map((episodeGuid: string, index: number) => {
                    if (playlistIndex === state.playlist.length - 1) {
                        return episodeGuid;
                    }
    
                    if (index === playlistIndex + 1) {
                        return state.playlist[playlistIndex];
                    }
            
                    if (index === playlistIndex) {
                        return state.playlist[playlistIndex + 1];
                    }
    
                    return episodeGuid;
                })
            };
        }

        if (action.type === 'SET_CURRENT_EPISODE') {
            const newCurrentPlaylistIndex: number = state.playlist.indexOf(action.episode.guid);
            const newCurrentEpisodeGuid: EpisodeGuid = action.episode.guid;

            return {
                ...state,
                currentPlaylistIndex: newCurrentPlaylistIndex,
                currentEpisodeGuid: newCurrentEpisodeGuid
            };
        }

        if (action.type === 'SET_CURRENT_ETH_PRICE_IN_USD_CENTS') {
            return {
                ...state,
                currentETHPriceInUSDCents: action.currentETHPriceInUSDCents
            };
        }

        if (action.type === 'SET_PAYOUT_TARGET_IN_USD_CENTS') {
            return {
                ...state,
                payoutTargetInUSDCents: action.payoutTargetInUSDCents
            };
        }

        if (action.type === 'SET_PAYOUT_INTERVAL_IN_DAYS') {
            return {
                ...state,
                payoutIntervalInDays: action.payoutIntervalInDays
            };
        }

        if (action.type === 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS') {
            return {
                ...state,
                nextPayoutDateInMilliseconds: action.nextPayoutDateInMilliseconds
            };
        }

        if (action.type === 'SET_PREVIOUS_PAYOUT_DATE_IN_MILLISECONDS') {
            return {
                ...state,
                previousPayoutDateInMilliseconds: action.previousPayoutDateInMilliseconds
            };
        }

        if (action.type === 'SET_PODCAST_PREVIOUS_PAYOUT_DATE_IN_MILLISECONDS') {
            return {
                ...state,
                podcasts: {
                    ...state.podcasts,
                    [action.feedUrl]: {
                        ...state.podcasts[action.feedUrl],
                        previousPayoutDateInMilliseconds: action.previousPayoutDateInMilliseconds
                    }
                }
            };
        }

        if (action.type === 'SET_WARNING_CHECKBOX_1_CHECKED') {
            return {
                ...state,
                warningCheckbox1Checked: action.checked
            };
        }

        if (action.type === 'SET_WARNING_CHECKBOX_2_CHECKED') {
            return {
                ...state,
                warningCheckbox2Checked: action.checked
            };
        }

        if (action.type === 'SET_WARNING_CHECKBOX_3_CHECKED') {
            return {
                ...state,
                warningCheckbox3Checked: action.checked
            };
        }

        if (action.type === 'SET_WARNING_CHECKBOX_4_CHECKED') {
            return {
                ...state,
                warningCheckbox4Checked: action.checked
            };
        }

        if (action.type === 'SET_WARNING_CHECKBOX_5_CHECKED') {
            return {
                ...state,
                warningCheckbox5Checked: action.checked
            };
        }

        if (action.type === 'SET_MNEMONIC_PHRASE_WARNING_CHECKBOX_CHECKED') {
            return {
                ...state,
                mnemonicPhraseWarningCheckboxChecked: action.checked
            };
        }

        if (action.type === 'SET_WALLET_CREATION_STATE') {
            return {
                ...state,
                walletCreationState: action.walletCreationState
            };
        }

        if (action.type === 'SET_ETHEREUM_ADDRESS') {
            return {
                ...state,
                ethereumAddress: action.ethereumAddress
            };
        }

        if (action.type === 'SET_ETHEREUM_BALANCE_IN_WEI') {
            const newEthereumBalanceInWEI: WEI = action.ethereumBalanceInWEI;
            const payoutTargetInWEI: WEI = getPayoutTargetInWEI(state);

            const newEthereumBalanceInWEIBigNumber = new BigNumber(newEthereumBalanceInWEI);
            const payoutTargetInWEIBigNumber = new BigNumber(payoutTargetInWEI);

            const newPayoutProblem = newEthereumBalanceInWEIBigNumber.eq(0) ? 'BALANCE_0' : payoutTargetInWEIBigNumber.eq(0) ? 'PAYOUT_TARGET_0' : newEthereumBalanceInWEIBigNumber.lt(payoutTargetInWEIBigNumber) ? 'BALANCE_LESS_THAN_PAYOUT_TARGET' : 'NO_PROBLEM';

            return {
                ...state,
                payoutProblem: newPayoutProblem,
                ethereumBalanceInWEI: newEthereumBalanceInWEI
            };
        }

        if (action.type === 'DELETE_PODCAST') {
            const newCurrentEpisodeGuid: EpisodeGuid = action.podcast.episodeGuids.includes(state.currentEpisodeGuid) ? 'NOT_SET' : state.currentEpisodeGuid;
            const newPlaylist: ReadonlyArray<string> = state.playlist.filter((episodeGuid: EpisodeGuid) => {
                return !action.podcast.episodeGuids.includes(episodeGuid);
            });
            const newCurrentPlaylistIndex: number = newCurrentEpisodeGuid === 'NOT_SET' ? 0 : newPlaylist.indexOf(newCurrentEpisodeGuid);
            const newEpisodes = 
                Object.entries(state.episodes)
                .filter((entry: [string, Readonly<Episode>]) => {
                    return entry[1].feedUrl !== action.podcast.feedUrl;
                })
                .reduce((result, entry: [string, Readonly<Episode>]) => {
                    return {
                        ...result,
                        [entry[0]]: entry[1]
                    };
                }, {});
            const newPodcasts = 
                Object.entries(state.podcasts)
                .filter((entry: [string, Readonly<Podcast>]) => {
                    return entry[1].feedUrl !== action.podcast.feedUrl;
                })
                .reduce((result, entry: [string, Readonly<Podcast>]) => {
                    return {
                        ...result,
                        [entry[0]]: entry[1]
                    };
                }, {});

            return {
                ...state,
                currentEpisodeGuid: newCurrentEpisodeGuid,
                currentPlaylistIndex: newCurrentPlaylistIndex,
                playlist: newPlaylist,
                episodes: newEpisodes,
                podcasts: newPodcasts
            };
        }
    
        return state;
    }

    const Store: Store<Readonly<State>, Readonly<AnyAction>> = createStore((state: Readonly<State> | undefined, action: AnyAction) => {

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

function getCurrentPlaylistIndexAfterMoveUp(state: Readonly<State>, playlistIndex: number): number {

    if (
        playlistIndex === state.currentPlaylistIndex &&
        playlistIndex !== 0
    ) {
        return state.currentPlaylistIndex - 1;
    }

    if (
        playlistIndex === state.currentPlaylistIndex + 1
    ) {
        return state.currentPlaylistIndex + 1;
    }

    return state.currentPlaylistIndex;
}

function getCurrentPlaylistIndexAfterMoveDown(state: Readonly<State>, playlistIndex: number) {

    if (
        playlistIndex === state.currentPlaylistIndex &&
        playlistIndex !== state.playlist.length - 1
    ) {
        return state.currentPlaylistIndex + 1;
    }

    if (
        playlistIndex === state.currentPlaylistIndex - 1
    ) {
        return state.currentPlaylistIndex - 1;
    }

    return state.currentPlaylistIndex;
}

function getInitialState(persistedState: Readonly<State>, version: number): Readonly<State> {

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
            payoutIntervalInDays: '30',
            currentETHPriceInUSDCents: 'UNKNOWN',
            previousPayoutDateInMilliseconds: 'NEVER',
            nextPayoutDateInMilliseconds: 'NEVER',
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
            podcryptPreviousPayoutDateInMilliseconds: 'NEVER',
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
        payoutIntervalInDays: '30',
        currentETHPriceInUSDCents: 'UNKNOWN',
        previousPayoutDateInMilliseconds: 'NEVER',
        nextPayoutDateInMilliseconds: 'NEVER',
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
        payoutInProgress: false, // TODO this is not used for anything currently
        preparingPlaylist: false,
        podcryptPayoutPercentage: '10',
        podcryptPreviousPayoutDateInMilliseconds: 'NEVER',
        podcryptLatestTransactionHash: null,
        payoutProblem: 'NO_PROBLEM'
    };
}