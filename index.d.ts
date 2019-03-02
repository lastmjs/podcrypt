declare var RSSParser: any;
declare var MediaMetadata: any;
declare var Web3: any; // TODO the types are available in the web3 repo

type Episode = {
    guid: string;
    title: string;
    src: string;
    playing: boolean;
    finishedListening: boolean;
    progress: number;
}

type WalletCreationState = 'NOT_CREATED' | 'CREATING' | 'CREATED';