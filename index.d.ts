declare var RSSParser: any;
declare var MediaMetadata: any;
type Milliseconds = number;
declare var ethers: any;

type Feed = {
    
}

type Podcast = {
    readonly feedUrl: PodcastGuid;
    readonly title: string;
    readonly description: string;
    readonly imageUrl: string;
    readonly episodeGuids: ReadonlyArray<EpisodeGuid>;
    readonly previousPayoutDateInMilliseconds: Milliseconds | 'NEVER';
    readonly latestTransactionHash: string | null;
    readonly ethereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED';
    readonly email: string | 'NOT_SET';
}

type Episode = {
    readonly guid: EpisodeGuid;
    readonly title: string;
    readonly src: string;
    readonly playing: boolean;
    readonly finishedListening: boolean;
    readonly progress: number;
    readonly timestamps: ReadonlyArray<Timestamp>;
}

type Timestamp = {
    readonly type: 'START' | 'STOP';
    readonly actionType: 'CURRENT_EPISODE_PLAYED' | 'CURRENT_EPISODE_PAUSED';
    readonly milliseconds: number;
}

type CurrentETHPriceState = 'NOT_FETCHED' | 'FETCHING' | 'FETCHED';
type WalletCreationState = 'NOT_CREATED' | 'CREATING' | 'CREATED';
type EpisodeGuid = string;
type PodcastGuid = string;
type USDCents = number;
type USDollars = number;
type WEI = number;
type GWEI = number;
type ETH = number;
type EthereumAddress = string;
type Days = number;
type Minutes = number;
type Seconds = number;
type USD = number;

type State = {
    readonly version: number;
    readonly currentRoute: {
        readonly pathname: string;
        readonly search: string;
        readonly query: {
            [key: string]: string;
        };
    }
    readonly showMainMenu: boolean;
    readonly currentEpisodeGuid: EpisodeGuid | 'NOT_SET';
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
    readonly previousPayoutDateInMilliseconds: Milliseconds | 'NEVER';
    readonly nextPayoutDateInMilliseconds: Milliseconds | 'NEVER';
    readonly ethereumAddress: EthereumAddress | 'NOT_CREATED';
    readonly ethereumBalanceInWEI: WEI;
    readonly warningCheckbox1Checked: boolean;
    readonly warningCheckbox2Checked: boolean;
    readonly warningCheckbox3Checked: boolean;
    readonly warningCheckbox4Checked: boolean;
    readonly warningCheckbox5Checked: boolean;
    readonly walletCreationState: WalletCreationState;
    readonly podcryptEthereumAddress: EthereumAddress;
    readonly playerPlaying: boolean;
    readonly showPlaybackRateMenu: boolean;
    readonly playbackRate: string;
    readonly currentETHPriceState: CurrentETHPriceState;
    readonly payoutInProgress: boolean;
}