export function DefaultReducer(
    state: Readonly<State>, 
    action: 
        RenderAction |
        SetStateAction |
        SetPodcastEthereumAddressAction |
        SetCurrentEthPriceStateAction |
        ChangeCurrentRouteAction |
        ToggleShowMainMenuAction |
        SetEpisodeDownloadStateAction |
        SetWarningCheckbox1CheckedAction |
        SetWarningCheckbox2CheckedAction |
        SetWarningCheckbox3CheckedAction |
        SetWarningCheckbox4CheckedAction |
        SetWarningCheckbox5CheckedAction |
        SetMnemonicPhraseWarningCheckboxCheckedAction |
        SetWalletCreationStateAction |
        SetEthereumAddressAction |
        DeletePodcastAction |
        SetNonceAction |
        WindowResizeEventAction |
        ADD_DOWNLOAD_CHUNK_DATUM_TO_EPISODE
): Readonly<State> {

    if (action.type === 'WINDOW_RESIZE_EVENT') {
        return {
            ...state,
            screenType: action.screenType
        };
    }

    if (action.type === 'RENDER') {
        return state;
    }

    if (action.type === 'SET_STATE') {
        return action.state;
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

    if (action.type === 'SET_CURRENT_ETH_PRICE_STATE') {
        return {
            ...state,
            currentETHPriceState: action.currentETHPriceState
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

    if (action.type === 'SET_EPISODE_DOWNLOAD_STATE') {
        return {
            ...state,
            episodes: {
                ...state.episodes,
                [action.episodeGuid]: {
                    ...state.episodes[action.episodeGuid],
                    downloadState: action.downloadState
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

    if (action.type === 'SET_NONCE') {
        return {
            ...state,
            nonce: action.nonce
        };
    }

    if (action.type === 'ADD_DOWNLOAD_CHUNK_DATUM_TO_EPISODE') {

        const episode = state.episodes[action.episodeGuid];

        return {
            ...state,
            episodes: {
                ...state.episodes,
                [episode.guid]: {
                    ...episode,
                    downloadChunkData: [...episode.downloadChunkData, action.downloadChunkDatum]
                }
            }
        };
    }

    return state;
}