export type Version34Podcast = {
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
}