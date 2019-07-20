declare var RSSParser: any;
declare var MediaMetadata: any;
declare var ethers: any;
declare module 'dompurify';

type ScreenType = 'DESKTOP' | 'MOBILE';

type ItunesSearchResult = {
    artistName: string;
    feedUrl: string;
    trackName: string;
    artworkUrl60: string;
}

type Feed = {
    feedUrl: string;
    title: string;
    description: string;
    itunes?: {
        author: string;
        owner: {
            name: string;
            email: string;
        };
    };
    image?: {
        url: string;
        title: string;
        link: string;
    };
    copyright: string;
    items: ReadonlyArray<FeedItem>;
}

type FeedItem = {
    title: string;
    isoDate: string;
    guid: string;
    content: string;
    enclosure?: {
        url: string;
    };
    src: string;
}

type Podcast = {
    readonly feedUrl: PodcastGuid;
    readonly artistName: string;
    readonly title: string;
    readonly description: string;
    readonly imageUrl: string | 'NOT_FOUND';
    readonly episodeGuids: ReadonlyArray<EpisodeGuid>;
    readonly previousPayoutDate: Milliseconds | 'NEVER';
    readonly latestTransactionHash: string | 'NOT_SET';
    readonly ethereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED';
    readonly ensName: ENSName | 'NOT_FOUND';
    readonly email: string | 'NOT_SET';
    readonly timeListenedTotal: Milliseconds;
    readonly timeListenedSincePreviousPayoutDate: Milliseconds;
    readonly lastStartDate: Milliseconds | 'NEVER';
    readonly paymentsEnabled: boolean;
}

type Episode = {
    readonly guid: EpisodeGuid;
    readonly feedUrl: FeedUrl;
    readonly title: string;
    readonly src: string;
    readonly playing: boolean;
    readonly finishedListening: boolean;
    readonly progress: string;
    readonly isoDate: string;
    readonly downloadState: EpisodeDownloadState;
    readonly description: string;
}

type EpisodeDownloadState = 'NOT_DOWNLOADED' | 'DOWNLOADING' | 'DOWNLOADED';

type PayoutProblem = 'BALANCE_0' | 'PAYOUT_TARGET_0' | 'BALANCE_LESS_THAN_PAYOUT_TARGET' | 'NO_PROBLEM';

type EthereumNetworkName = 'homestead' | 'ropsten';
type CryptonatorETHPriceAPIEndpoint = `https://api.cryptonator.com/api/ticker/eth-usd`;
type EtherscanETHPriceAPIEndpoint = `https://api.etherscan.io/api?module=stats&action=ethprice`;
type FeedUrl = string;
type EthereumAddress = string;
type ENSName = string;
type CurrentETHPriceState = 'NOT_FETCHED' | 'FETCHING' | 'FETCHED';
// TODO I feel like we might not need the creating state
type WalletCreationState = 'NOT_CREATED' | 'CREATING' | 'SHOW_MNEMONIC_PHRASE' | 'CREATED';
type EpisodeGuid = string;
type PodcastGuid = string;
type Percent = string;
type Proportion = string;

type USDollars = string;
type USDCents = string;

type ETH = string;
type GWEI = string;
type WEI = string;

type Days = number;
type Minutes = number;
type Seconds = number;
type Milliseconds = number;

type EthereumAddressInfo = {
    ethereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED';
    ensName: ENSName | 'NOT_FOUND';
}

type Route = {
    readonly pathname: string;
    readonly search: string;
    readonly query: {
        [key: string]: string;
    };
}

type State = {
    readonly version: number;
    readonly currentRoute: Readonly<Route>;
    readonly showMainMenu: boolean;
    readonly currentEpisodeGuid: EpisodeGuid | 'NOT_SET';
    readonly previousEpisodeGuid: EpisodeGuid | 'NOT_SET';
    readonly playlist: ReadonlyArray<EpisodeGuid>;
    readonly currentPlaylistIndex: number;
    readonly podcasts: {
        [key: string]: Readonly<Podcast>;
    };
    readonly episodes: {
        [key: string]: Readonly<Episode>;
    };
    readonly payoutTargetInUSDCents: USDCents;
    readonly payoutIntervalInDays: Days;
    readonly currentETHPriceInUSDCents: USDCents | 'UNKNOWN';
    readonly previousPayoutDate: Milliseconds | 'NEVER';
    readonly nextPayoutDate: Milliseconds | 'NEVER';
    readonly ethereumAddress: EthereumAddress | 'NOT_CREATED';
    readonly ethereumBalanceInWEI: WEI;
    readonly warningCheckbox1Checked: boolean;
    readonly warningCheckbox2Checked: boolean;
    readonly warningCheckbox3Checked: boolean;
    readonly warningCheckbox4Checked: boolean;
    readonly warningCheckbox5Checked: boolean;
    readonly mnemonicPhraseWarningCheckboxChecked: boolean;
    readonly walletCreationState: WalletCreationState;
    readonly podcryptEthereumAddress: EthereumAddress;
    readonly podcryptENSName: ENSName;
    readonly playerPlaying: boolean;
    readonly showPlaybackRateMenu: boolean;
    readonly playbackRate: string;
    readonly currentETHPriceState: CurrentETHPriceState;
    readonly payoutInProgress: boolean;
    readonly preparingPlaylist: boolean;
    readonly podcryptPayoutPercentage: Percent;
    readonly podcryptPreviousPayoutDate: Milliseconds | 'NEVER';
    readonly podcryptLatestTransactionHash: string | null;
    readonly payoutProblem: PayoutProblem;
    readonly nonce: number;
    readonly screenType: ScreenType;
    readonly audio1Playing: boolean;
    readonly audio2Playing: boolean;
    readonly audio1Src: string | 'NOT_SET';
    readonly audio2Src: string | 'NOT_SET';
    readonly currentEpisodeDownloadIndex: number;
}

type HexString = string;
type UTF8String = string;

type Transaction = {
    hash: HexString;
};

type TransactionResult = Transaction | 'ALREADY_PAID_FOR_INTERVAL' | 'FEED_NOT_FOUND' | 'PODCAST_ETHEREUM_ADDRESS_NOT_FOUND' | 'PODCAST_ETHEREUM_ADDRESS_MALFORMED' | 'PAYMENTS_DISABLED';

// Uncategorized actions

type RenderAction = {
    readonly type: 'RENDER';
}

type SetStateAction = {
    readonly type: 'SET_STATE';
    readonly state: Readonly<State>;
}

type SetPodcastEthereumAddressAction = {
    readonly type: 'SET_PODCAST_ETHEREUM_ADDRESS';
    readonly feedUrl: FeedUrl;
    readonly ethereumAddress: EthereumAddress;
}

type SetCurrentEthPriceStateAction = {
    readonly type: 'SET_CURRENT_ETH_PRICE_STATE';
    readonly currentETHPriceState: CurrentETHPriceState;
}

type ChangeCurrentRouteAction = {
    readonly type: 'CHANGE_CURRENT_ROUTE';
    readonly currentRoute: Readonly<Route>;
}

type ToggleShowMainMenuAction = {
    readonly type: 'TOGGLE_SHOW_MAIN_MENU';
}

type SetEpisodeDownloadStateAction = {
    readonly type: 'SET_EPISODE_DOWNLOAD_STATE';
    readonly episodeGuid: EpisodeGuid;
    readonly downloadState: EpisodeDownloadState;
}

type SetWarningCheckbox1CheckedAction = {
    readonly type: 'SET_WARNING_CHECKBOX_1_CHECKED';
    readonly checked: boolean;
}

type SetWarningCheckbox2CheckedAction = {
    readonly type: 'SET_WARNING_CHECKBOX_2_CHECKED';
    readonly checked: boolean;
}

type SetWarningCheckbox3CheckedAction = {
    readonly type: 'SET_WARNING_CHECKBOX_3_CHECKED';
    readonly checked: boolean;
}

type SetWarningCheckbox4CheckedAction = {
    readonly type: 'SET_WARNING_CHECKBOX_4_CHECKED';
    readonly checked: boolean;
}

type SetWarningCheckbox5CheckedAction = {
    readonly type: 'SET_WARNING_CHECKBOX_5_CHECKED';
    readonly checked: boolean;
}

type SetMnemonicPhraseWarningCheckboxCheckedAction = {
    readonly type: 'SET_MNEMONIC_PHRASE_WARNING_CHECKBOX_CHECKED';
    readonly checked: boolean;
}

type SetWalletCreationStateAction = {
    readonly type: 'SET_WALLET_CREATION_STATE';
    readonly walletCreationState: WalletCreationState;
}

type SetEthereumAddressAction = {
    readonly type: 'SET_ETHEREUM_ADDRESS';
    readonly ethereumAddress: EthereumAddress;
}

type DeletePodcastAction = {
    readonly type: 'DELETE_PODCAST';
    readonly podcast: Readonly<Podcast>;
}

type SetNonceAction = {
    readonly type: 'SET_NONCE';
    readonly nonce: number;
}

type WindowResizeEventAction = {
    readonly type: 'WINDOW_RESIZE_EVENT';
    readonly screenType: ScreenType;
}

// Payout actions

type SetPodcryptLatestTransactionHashAction = {
    readonly type: 'SET_PODCRYPT_LATEST_TRANSACTION_HASH';
    readonly podcryptLatestTransactionHash: HexString;
}

type SetPodcryptPreviousPayoutDateAction = {
    readonly type: 'SET_PODCRYPT_PREVIOUS_PAYOUT_DATE';
    readonly podcryptPreviousPayoutDate: Milliseconds;
}

type SetPayoutInProgressAction = {
    readonly type: 'SET_PAYOUT_IN_PROGRESS';
    readonly payoutInProgress: boolean;
}

type SetPodcastLatestTransactionHash = {
    readonly type: 'SET_PODCAST_LATEST_TRANSACTION_HASH';
    readonly feedUrl: FeedUrl;
    readonly latestTransactionHash: HexString;
}

type SetCurrentETHPriceInUSDCentsAction = {
    readonly type: 'SET_CURRENT_ETH_PRICE_IN_USD_CENTS';
    readonly currentETHPriceInUSDCents: USDCents;
}

type SetPayoutTargetInUSDCentsAction = {
    readonly type: 'SET_PAYOUT_TARGET_IN_USD_CENTS';
    readonly payoutTargetInUSDCents: USDCents;
}

type SetPayoutIntervalInDaysAction = {
    readonly type: 'SET_PAYOUT_INTERVAL_IN_DAYS';
    readonly payoutIntervalInDays: Days;
}

type SetNextPayoutDateAction = {
    readonly type: 'SET_NEXT_PAYOUT_DATE';
    readonly nextPayoutDate: Milliseconds;
}

type SetPreviousPayoutDateAction = {
    readonly type: 'SET_PREVIOUS_PAYOUT_DATE';
    readonly previousPayoutDate: Milliseconds;
}

type SetPodcastPreviousPayoutDate = {
    readonly type: 'SET_PODCAST_PREVIOUS_PAYOUT_DATE';
    readonly feedUrl: FeedUrl;
    readonly previousPayoutDate: Milliseconds;
}

type SetEthereumBalanceInWEIAction = {
    readonly type: 'SET_ETHEREUM_BALANCE_IN_WEI';
    readonly ethereumBalanceInWEI: WEI;
}

type ResetPodcastTimeListenedSincePreviousPayoutAction = {
    readonly type: 'RESET_PODCAST_TIME_LISTENED_SINCE_PREVIOUS_PAYOUT';
    readonly feedUrl: FeedUrl;
}

type SetPodcastPaymentsEnabledAction = {
    readonly type: 'SET_PODCAST_PAYMENTS_ENABLED';
    readonly feedUrl: FeedUrl;
    readonly paymentsEnabled: boolean;
}

// Player / playlist / playback actions

type SetPlaybackRateAction = {
    readonly type: 'SET_PLAYBACK_RATE';
    readonly playbackRate: string;
}

type TogglePlaybackRateMenuAction = {
    readonly type: 'TOGGLE_PLAYBACK_RATE_MENU';
    readonly showPlaybackRateMenu: boolean;
}

type SubscribeToPodcastAction = {
    readonly type: 'SUBSCRIBE_TO_PODCAST';
    readonly podcast: Readonly<Podcast>;
}

type SetPreparingPlaylistAction = {
    readonly type: 'SET_PREPARING_PLAYLIST';
    readonly preparingPlaylist: boolean;
}

type PlayPreviousEpisodeAction = {
    readonly type: 'PLAY_PREVIOUS_EPISODE';
}

type PlayNextEpisodeAction = {
    readonly type: 'PLAY_NEXT_EPISODE';
}

type AddEpisodeToPlaylistAction = {
    readonly type: 'ADD_EPISODE_TO_PLAYLIST';
    readonly podcast: Readonly<Podcast>;
    readonly episode: Readonly<Episode>;
}

type PlayEpisodeFromPlaylistAction = {
    readonly type: 'PLAY_EPISODE_FROM_PLAYLIST';
    readonly episodeGuid: EpisodeGuid;
}

type PauseEpisodeFromPlaylistAction = {
    readonly type: 'PAUSE_EPISODE_FROM_PLAYLIST';
    readonly episodeGuid: EpisodeGuid;
}

type CurrentEpisodeCompletedAction = {
    readonly type: 'CURRENT_EPISODE_COMPLETED';
}

type UpdateCurrentEpisodeProgressAction = {
    readonly type: 'UPDATE_CURRENT_EPISODE_PROGRESS';
    readonly progress: string;
}

type UpdateCurrentEpisodeProgressFromSliderAction = {
    readonly type: 'UPDATE_CURRENT_EPISODE_PROGRESS_FROM_SLIDER';
    readonly progress: string;
}

type CurrentEpisodePlayedAction = {
    readonly type: 'CURRENT_EPISODE_PLAYED';
}

type CurrentEpisodePausedAction = {
    readonly type: 'CURRENT_EPISODE_PAUSED';
}

type RemoveEpisodeFromPlaylistAction = {
    readonly type: 'REMOVE_EPISODE_FROM_PLAYLIST';
    readonly episodeGuid: EpisodeGuid;
}

type MoveEpisodeUpAction = {
    readonly type: 'MOVE_EPISODE_UP';
    readonly episodeGuid: EpisodeGuid;
}

type MoveEpisodeDownAction = {
    readonly type: 'MOVE_EPISODE_DOWN';
    readonly episodeGuid: EpisodeGuid;
}

type SetCurrentEpisodeAction = {
    readonly type: 'SET_CURRENT_EPISODE';
    readonly episode: Readonly<Episode>;
}

type SetPreviousEpisodeGuidAction = {
    readonly type: 'SET_PREVIOUS_EPISODE_GUID';
    readonly previousEpisodeGuid: EpisodeGuid;
}

type MarkEpisodeListenedAction = {
    readonly type: 'MARK_EPISODE_LISTENED';
    readonly episodeGuid: EpisodeGuid;
}

type MarkEpisodeUnlistenedAction = {
    readonly type: 'MARK_EPISODE_UNLISTENED';
    readonly episodeGuid: EpisodeGuid;
}

type AddOrUpdateEpisodeAction = {
    readonly type: 'ADD_OR_UPDATE_EPISODE';
    readonly podcast: Readonly<Podcast>;
    readonly episode: Readonly<Episode>;
}

type SetAudio1PlayingAction = {
    readonly type: 'SET_AUDIO_1_PLAYING';
    readonly audio1Playing: boolean;
}

type SetAudio2PlayingAction = {
    readonly type: 'SET_AUDIO_2_PLAYING';
    readonly audio2Playing: boolean;
}

type SetAudio1SrcAction = {
    readonly type: 'SET_AUDIO_1_SRC';
    readonly audio1Src: string | 'NOT_SET';
}

type SetAudio2SrcAction = {
    readonly type: 'SET_AUDIO_2_SRC';
    readonly audio2Src: string | 'NOT_SET';
}

type SetCurrentEpisodeDownloadIndexAction = {
    readonly type: 'SET_CURRENT_EPISODE_DOWNLOAD_INDEX';
    readonly currentEpisodeDownloadIndex: number;
}

type PodcryptAction = 
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
    SetPodcryptLatestTransactionHashAction |
    SetPodcryptPreviousPayoutDateAction |
    SetPayoutInProgressAction |
    SetPodcastLatestTransactionHash |
    SetCurrentETHPriceInUSDCentsAction |
    SetPayoutTargetInUSDCentsAction |
    SetPayoutIntervalInDaysAction |
    SetNextPayoutDateAction |
    SetPreviousPayoutDateAction |
    SetPodcastPreviousPayoutDate |
    SetEthereumBalanceInWEIAction |
    ResetPodcastTimeListenedSincePreviousPayoutAction |
    SetPlaybackRateAction |
    TogglePlaybackRateMenuAction |
    SubscribeToPodcastAction |
    SetPreparingPlaylistAction |
    PlayPreviousEpisodeAction |
    PlayNextEpisodeAction |
    AddEpisodeToPlaylistAction |
    PlayEpisodeFromPlaylistAction |
    PauseEpisodeFromPlaylistAction |
    CurrentEpisodeCompletedAction |
    UpdateCurrentEpisodeProgressAction |
    UpdateCurrentEpisodeProgressFromSliderAction |
    CurrentEpisodePlayedAction |
    CurrentEpisodePausedAction |
    RemoveEpisodeFromPlaylistAction |
    MoveEpisodeUpAction |
    MoveEpisodeDownAction |
    SetCurrentEpisodeAction |
    SetPreviousEpisodeGuidAction |
    MarkEpisodeListenedAction |
    MarkEpisodeUnlistenedAction |
    AddOrUpdateEpisodeAction | 
    SetPodcastPaymentsEnabledAction | 
    WindowResizeEventAction |
    SetAudio1PlayingAction |
    SetAudio2PlayingAction |
    SetAudio1SrcAction |
    SetAudio2SrcAction |
    SetCurrentEpisodeDownloadIndexAction;

type AudioSources = {
    readonly audio1Src: string | 'NOT_SET';
    readonly audio2Src: string | 'NOT_SET';
}