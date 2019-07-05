// TODO eventually these migration helpers can be deleted, once we are sure no one is on a version that needs the helpers

import BigNumber from 'bignumber.js';

export type Version32Milliseconds = string;

export type Version32Timestamp = {
    readonly type: 'START' | 'STOP';
    readonly actionType: 'CURRENT_EPISODE_PLAYED' | 'CURRENT_EPISODE_PAUSED' | 'CURRENT_EPISODE_COMPLETED'| 'PAUSE_EPISODE_FROM_PLAYLIST' | 'PLAY_EPISODE_FROM_PLAYLIST';
    readonly milliseconds: string;
}

export type Version32Podcast = {
    readonly feedUrl: PodcastGuid;
    readonly artistName: string;
    readonly title: string;
    readonly description: string;
    readonly imageUrl: string | 'NOT_FOUND';
    readonly episodeGuids: ReadonlyArray<EpisodeGuid>;
    readonly previousPayoutDateInMilliseconds: string | 'NEVER';
    readonly latestTransactionHash: string | null;
    readonly ethereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED';
    readonly ensName: ENSName | 'NOT_FOUND';
    readonly email: string | 'NOT_SET';
}

export type Version32Episode = {
    readonly guid: EpisodeGuid;
    readonly feedUrl: FeedUrl;
    readonly title: string;
    readonly src: string;
    readonly playing: boolean;
    readonly finishedListening: boolean;
    readonly progress: string;
    readonly timestamps: ReadonlyArray<Version32Timestamp>;
    readonly isoDate: string;
    readonly downloadState: EpisodeDownloadState;
}

export type Version32State = {
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
        [key: string]: Readonly<Version32Podcast>;
    };
    readonly episodes: {
        [key: string]: Readonly<Version32Episode>;
    };
    readonly payoutTargetInUSDCents: USDCents;
    readonly payoutIntervalInDays: Days;
    readonly currentETHPriceInUSDCents: USDCents | 'UNKNOWN';
    readonly previousPayoutDateInMilliseconds: Version32Milliseconds | 'NEVER';
    readonly nextPayoutDateInMilliseconds: Version32Milliseconds | 'NEVER';
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
    readonly payoutInProgress: boolean; //TODO this is not used for anything currently
    readonly preparingPlaylist: boolean;
    readonly podcryptPayoutPercentage: Percent;
    readonly podcryptPreviousPayoutDateInMilliseconds: Version32Milliseconds | 'NEVER';
    readonly podcryptLatestTransactionHash: string | null;
    readonly payoutProblem: PayoutProblem;
    readonly nonce: number;
}

export type Version33State = {
    readonly version: number;
    readonly currentRoute: Readonly<Route>;
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
    readonly payoutInProgress: boolean; //TODO this is not used for anything currently
    readonly preparingPlaylist: boolean;
    readonly podcryptPayoutPercentage: Percent;
    readonly podcryptPreviousPayoutDate: Milliseconds | 'NEVER';
    readonly podcryptLatestTransactionHash: string | null;
    readonly payoutProblem: PayoutProblem;
    readonly nonce: number;
}

export function calculateTotalTimeForPodcastDuringIntervalInMilliseconds(state: Readonly<Version32State>, podcast: Readonly<Version32Podcast>, previousPayoutDateInMilliseconds: Version32Milliseconds): Version32Milliseconds {
    return podcast.episodeGuids.reduce((result: BigNumber, episodeGuid: EpisodeGuid) => {
        const episode: any = state.episodes[episodeGuid];
        const timestampsDuringInterval: ReadonlyArray<Version32Timestamp> = getTimestampsDuringInterval(podcast, episode.timestamps, previousPayoutDateInMilliseconds);

        return result.plus(timestampsDuringInterval.reduce((result: BigNumber, timestamp: Readonly<Version32Timestamp>, index: number) => {
            const nextTimestamp: Readonly<Version32Timestamp> = timestampsDuringInterval[index + 1];
            const previousTimestamp: Readonly<Version32Timestamp> = timestampsDuringInterval[index - 1];

            if (timestamp.type === 'START') {
                if (
                    nextTimestamp &&
                    nextTimestamp.type === 'STOP'
                ) {
                    return result.minus(timestamp.milliseconds);
                }
                else {
                    return result.plus(0);
                }
            }

            if (timestamp.type === 'STOP') {
                if (
                    previousTimestamp &&
                    previousTimestamp.type === 'START'
                ) {
                    return result.plus(timestamp.milliseconds);
                }
                else {
                    return result.plus(0);
                }
            }

            // TODO this should never happen, should we throw?
            return new BigNumber(0);
        }, new BigNumber(0)));
    }, new BigNumber(0)).toString();
}

function getTimestampsDuringInterval(podcast: Readonly<Version32Podcast>, timestamps: ReadonlyArray<Version32Timestamp> = [], previousPayoutDateInMilliseconds: Version32Milliseconds): ReadonlyArray<Version32Timestamp> {
    // const previousPayoutDateInMilliseconds: Milliseconds = podcast.previousPayoutDateInMilliseconds === 'NEVER' ? '0' : podcast.previousPayoutDateInMilliseconds;
    
    if (previousPayoutDateInMilliseconds === 'NEVER') {
        return timestamps;
    }

    return timestamps.filter((timestamp: Readonly<Version32Timestamp>) => {
        return new BigNumber(timestamp.milliseconds).gt(previousPayoutDateInMilliseconds) && new BigNumber(timestamp.milliseconds).lte(new Date().getTime());
    });
}