declare var RSSParser: any;
declare var MediaMetadata: any;
declare var ethers: any;

type Feed = {
    
}

type Podcast = {
    readonly feedUrl: PodcastGuid;
    readonly title: string;
    readonly description: string;
    readonly imageUrl: string | 'NOT_FOUND';
    readonly episodeGuids: ReadonlyArray<EpisodeGuid>;
    readonly previousPayoutDateInMilliseconds: string | 'NEVER';
    readonly latestTransactionHash: string | null;
    readonly ethereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED';
    readonly email: string | 'NOT_SET';
}

type Episode = {
    readonly guid: EpisodeGuid;
    readonly feedUrl: FeedUrl;
    readonly title: string;
    readonly src: string;
    readonly playing: boolean;
    readonly finishedListening: boolean;
    readonly progress: string;
    readonly timestamps: ReadonlyArray<Timestamp>;
    readonly isoDate: string;
}

type Timestamp = {
    readonly type: 'START' | 'STOP';
    readonly actionType: 'CURRENT_EPISODE_PLAYED' | 'CURRENT_EPISODE_PAUSED' | 'CURRENT_EPISODE_COMPLETED';
    readonly milliseconds: string;
}

type PayoutProblem = 'BALANCE_0' | 'PAYOUT_TARGET_0' | 'BALANCE_LESS_THAN_PAYOUT_TARGET' | 'NO_PROBLEM';

type CryptonatorETHPriceAPIEndpoint = `https://api.cryptonator.com/api/ticker/eth-usd`;
type EtherscanETHPriceAPIEndpoint = `https://api.etherscan.io/api?module=stats&action=ethprice`;
type FeedUrl = string;
type EthereumAddress = string;
type CurrentETHPriceState = 'NOT_FETCHED' | 'FETCHING' | 'FETCHED';
type WalletCreationState = 'NOT_CREATED' | 'CREATING' | 'CREATED';
type EpisodeGuid = string;
type PodcastGuid = string;
type Percent = string;
type Proportion = string;

type USDollars = string;
type USDCents = string;

type ETH = string;
type GWEI = string;
type WEI = string;

type Days = string;
type Minutes = string;
type Seconds = string;
type Milliseconds = string;

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
    readonly payoutInProgress: boolean; //TODO this is not used for anything currently
    readonly preparingPlaylist: boolean;
    readonly podcryptPayoutPercentage: Percent;
    readonly podcryptPreviousPayoutDateInMilliseconds: Milliseconds | 'NEVER';
    readonly podcryptLatestTransactionHash: string | null;
    readonly payoutProblem: PayoutProblem;
}