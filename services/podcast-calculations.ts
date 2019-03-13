import BigNumber from "../node_modules/bignumber.js/bignumber";

export function calculatePayoutAmountForPodcryptDuringCurrentIntervalInWEI(state: Readonly<State>): WEI | 'UNKNOWN' {    
    const payoutTargetInUSDCents: USDCents = state.payoutTargetInUSDCents;    
    const payoutForPodcryptInUSDCents: USDCents = new BigNumber(state.podcryptPayoutPercentage).multipliedBy(payoutTargetInUSDCents).dividedBy(100).toString();
    const currentETHPriceInUSDCents: USDCents | 'UNKNOWN' = state.currentETHPriceInUSDCents;
    
    if (currentETHPriceInUSDCents === 'UNKNOWN') {
        return 'UNKNOWN';
    }

    const payoutForPodcryptInWEI: WEI = new BigNumber(payoutForPodcryptInUSDCents).dividedBy(currentETHPriceInUSDCents).multipliedBy(1e18).toString(); // TODO are there precision issues with converting 1e18 to a BigNumber?

    return payoutForPodcryptInWEI;
}


export function calculatePayoutAmountForPodcastDuringCurrentIntervalInWEI(state: Readonly<State>, podcast: Readonly<Podcast>): WEI | 'UNKNOWN' {    
    const payoutForPodcastInUSDCents: USDCents = calculatePayoutAmountForPodcastDuringCurrentIntervalInUSDCents(state, podcast);
    const currentETHPriceInUSDCents: USDCents | 'UNKNOWN' = state.currentETHPriceInUSDCents;
    
    if (currentETHPriceInUSDCents === 'UNKNOWN') {
        return 'UNKNOWN';
    }

    const payoutForPodcastInWEI: WEI = new BigNumber(payoutForPodcastInUSDCents).dividedBy(new BigNumber(currentETHPriceInUSDCents)).multipliedBy(1e18).toString();

    return payoutForPodcastInWEI;
}

export function calculatePayoutAmountForPodcastDuringCurrentIntervalInUSD(state: Readonly<State>, podcast: Readonly<Podcast>): USDollars {    
    const payoutForPodcastInUSDCents: USDCents = calculatePayoutAmountForPodcastDuringCurrentIntervalInUSDCents(state, podcast);
    const payoutForPodcastInUSD: USDollars = new BigNumber(payoutForPodcastInUSDCents).dividedBy(100).toString();
    return payoutForPodcastInUSD;
}

function calculatePayoutAmountForPodcastDuringCurrentIntervalInUSDCents(state: Readonly<State>, podcast: Readonly<Podcast>): USDCents {
    const proportionOfTotalTimeForPodcastDuringCurrentInterval: Proportion = calculateProportionOfTotalTimeForPodcastDuringCurrentInterval(state, podcast);        
    const payoutTargetInUSDCents: USDCents = state.payoutTargetInUSDCents;
    const payoutForPodcastInUSDCents: USDCents = new BigNumber(proportionOfTotalTimeForPodcastDuringCurrentInterval).multipliedBy(payoutTargetInUSDCents).toString();
    
    return payoutForPodcastInUSDCents;
}

export function calculateTotalTimeForPodcastDuringCurrentIntervalInMilliseconds(state: Readonly<State>, podcast: Readonly<Podcast>): Milliseconds {
    return podcast.episodeGuids.reduce((result: BigNumber, episodeGuid: EpisodeGuid) => {
        const episode: Readonly<Episode> = state.episodes[episodeGuid];
        const timestampsDuringCurrentInterval: ReadonlyArray<Timestamp> = getTimestampsDuringCurrentInterval(podcast, episode.timestamps);

        return result.plus(timestampsDuringCurrentInterval.reduce((result: BigNumber, timestamp: Readonly<Timestamp>, index: number) => {
            const nextTimestamp: Readonly<Timestamp> = timestampsDuringCurrentInterval[index + 1];
            const previousTimestamp: Readonly<Timestamp> = timestampsDuringCurrentInterval[index - 1];

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

// TODO this is not truly the proportion of total time, more the proportion of the donation, since Podcrypt may take a piece of the proportion, and by default will
export function calculateProportionOfTotalTimeForPodcastDuringCurrentInterval(state: Readonly<State>, podcast: Readonly<Podcast>): Proportion {
    const grossTotalTimeDuringCurrentIntervalInMilliseconds: Milliseconds = calculateTotalTimeDuringCurrentIntervalInMilliseconds(state);
    
    if (new BigNumber(grossTotalTimeDuringCurrentIntervalInMilliseconds).eq(0)) {
        return '0';
    }

    const podcryptPayoutPercentage: Percent = state.podcryptPayoutPercentage;
    const netTotalTimeDuringCurrentIntervalInMilliseconds: Milliseconds = new BigNumber(grossTotalTimeDuringCurrentIntervalInMilliseconds).dividedBy(new BigNumber(100).minus(podcryptPayoutPercentage).dividedBy(100)).toString();
    const totalTimeForPodcastDuringCurrentIntervalInMilliseconds: Milliseconds = calculateTotalTimeForPodcastDuringCurrentIntervalInMilliseconds(state, podcast);

    return new BigNumber(totalTimeForPodcastDuringCurrentIntervalInMilliseconds).dividedBy(netTotalTimeDuringCurrentIntervalInMilliseconds).toString();
}

function calculateTotalTimeDuringCurrentIntervalInMilliseconds(state: Readonly<State>): Milliseconds {
    return Object.values(state.podcasts).reduce((result: BigNumber, podcast: Readonly<Podcast>) => {
        return result.plus(calculateTotalTimeForPodcastDuringCurrentIntervalInMilliseconds(state, podcast));
    }, new BigNumber(0)).toString();
}

function getTimestampsDuringCurrentInterval(podcast: Readonly<Podcast>, timestamps: ReadonlyArray<Timestamp>): ReadonlyArray<Timestamp> {
    const previousPayoutDateInMilliseconds: Milliseconds = podcast.previousPayoutDateInMilliseconds === 'NEVER' ? '0' : podcast.previousPayoutDateInMilliseconds;
    
    return timestamps.filter((timestamp: Readonly<Timestamp>) => {
        return new BigNumber(timestamp.milliseconds).gt(previousPayoutDateInMilliseconds) && new BigNumber(timestamp.milliseconds).lte(new Date().getTime());
    });
}