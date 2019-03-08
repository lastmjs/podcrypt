declare var RSSParser: any;
declare var MediaMetadata: any;
declare var Web3: any; // TODO the types are available in the web3 repo

type Milliseconds = number;

type Podcast = {
    readonly feedUrl: string;
    readonly title: string;
    readonly description: string;
    readonly imageUrl: string;
    readonly episodes: ReadonlyArray<Episode>;
    readonly previousPayoutDateInMilliseconds: Milliseconds | null;
}

type Episode = {
    readonly guid: string;
    readonly title: string;
    readonly src: string;
    readonly playing: boolean;
    readonly finishedListening: boolean;
    readonly progress: number;
    readonly timestamps: ReadonlyArray<Timestamp>;
}

type Timestamp = {

}

type WalletCreationState = 'NOT_CREATED' | 'CREATING' | 'CREATED';
type EpisodeGuid = string;
type USDCents = number;
type USDollars = number;
type WEI = number;
type GWEI = number;
type ETH = number;
type EthereumPublicKey = string;

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
    readonly payoutIntervalInDays: number;
    readonly currentETHPriceInUSDCents: USDCents | null;
    readonly previousPayoutDateInMilliseconds: Milliseconds | null;
    readonly nextPayoutDateInMilliseconds: Milliseconds | null;
    readonly ethereumAddress: EthereumPublicKey | null;
    readonly ethereumBalanceInWEI: WEI;
    readonly warningCheckbox1Checked: boolean;
    readonly warningCheckbox2Checked: boolean;
    readonly warningCheckbox3Checked: boolean;
    readonly warningCheckbox4Checked: boolean;
    readonly warningCheckbox5Checked: boolean;
    readonly walletCreationState: WalletCreationState;
    readonly podcryptEthereumAddress: EthereumPublicKey;
    readonly playerPlaying: boolean;
    readonly showPlaybackRateMenu: boolean;
    readonly playbackRate: string;
}