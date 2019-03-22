import BigNumber from "../node_modules/bignumber.js/bignumber";

export function calculatePayoutAmountForPodcryptDuringIntervalInWEI(state: Readonly<State>): WEI | 'UNKNOWN' {    
    const payoutTargetInUSDCents: USDCents = state.payoutTargetInUSDCents;    
    const payoutForPodcryptInUSDCents: USDCents = new BigNumber(state.podcryptPayoutPercentage).multipliedBy(payoutTargetInUSDCents).dividedBy(100).toString();
    const currentETHPriceInUSDCents: USDCents | 'UNKNOWN' = state.currentETHPriceInUSDCents;
    
    if (currentETHPriceInUSDCents === 'UNKNOWN') {
        return 'UNKNOWN';
    }

    const payoutForPodcryptInWEI: WEI = new BigNumber(payoutForPodcryptInUSDCents).dividedBy(currentETHPriceInUSDCents).multipliedBy(1e18).toString(); // TODO are there precision issues with converting 1e18 to a BigNumber?

    return payoutForPodcryptInWEI;
}


export function calculatePayoutAmountForPodcastDuringIntervalInWEI(state: Readonly<State>, podcast: Readonly<Podcast>, previousPayoutDateInMilliseconds: Milliseconds): WEI | 'UNKNOWN' {    
    const payoutForPodcastInUSDCents: USDCents = calculatePayoutAmountForPodcastDuringIntervalInUSDCents(state, podcast, previousPayoutDateInMilliseconds);
    const currentETHPriceInUSDCents: USDCents | 'UNKNOWN' = state.currentETHPriceInUSDCents;
    
    if (currentETHPriceInUSDCents === 'UNKNOWN') {
        return 'UNKNOWN';
    }

    const payoutForPodcastInWEI: WEI = new BigNumber(payoutForPodcastInUSDCents).dividedBy(new BigNumber(currentETHPriceInUSDCents)).multipliedBy(1e18).toString();

    return payoutForPodcastInWEI;
}

export function calculatePayoutAmountForPodcastDuringIntervalInUSD(state: Readonly<State>, podcast: Readonly<Podcast>, previousPayoutDateInMilliseconds: Milliseconds): USDollars {    
    const payoutForPodcastInUSDCents: USDCents = calculatePayoutAmountForPodcastDuringIntervalInUSDCents(state, podcast, previousPayoutDateInMilliseconds);
    const payoutForPodcastInUSD: USDollars = new BigNumber(payoutForPodcastInUSDCents).dividedBy(100).toString();
    return payoutForPodcastInUSD;
}

function calculatePayoutAmountForPodcastDuringIntervalInUSDCents(state: Readonly<State>, podcast: Readonly<Podcast>, previousPayoutDateInMilliseconds: Milliseconds): USDCents {
    const proportionOfTotalTimeForPodcastDuringInterval: Proportion = calculateProportionOfTotalTimeForPodcastDuringInterval(state, podcast, previousPayoutDateInMilliseconds);        
    const payoutTargetInUSDCents: USDCents = state.payoutTargetInUSDCents;
    const payoutForPodcastInUSDCents: USDCents = new BigNumber(proportionOfTotalTimeForPodcastDuringInterval).multipliedBy(payoutTargetInUSDCents).toString();
    
    return payoutForPodcastInUSDCents;
}

export function calculateTotalTimeForPodcastDuringIntervalInMilliseconds(state: Readonly<State>, podcast: Readonly<Podcast>, previousPayoutDateInMilliseconds: Milliseconds): Milliseconds {
    return podcast.episodeGuids.reduce((result: BigNumber, episodeGuid: EpisodeGuid) => {
        const episode: Readonly<Episode> = state.episodes[episodeGuid];
        const timestampsDuringInterval: ReadonlyArray<Timestamp> = getTimestampsDuringInterval(podcast, episode.timestamps, previousPayoutDateInMilliseconds);

        return result.plus(timestampsDuringInterval.reduce((result: BigNumber, timestamp: Readonly<Timestamp>, index: number) => {
            const nextTimestamp: Readonly<Timestamp> = timestampsDuringInterval[index + 1];
            const previousTimestamp: Readonly<Timestamp> = timestampsDuringInterval[index - 1];

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
export function calculateProportionOfTotalTimeForPodcastDuringInterval(state: Readonly<State>, podcast: Readonly<Podcast>, previousPayoutDateInMilliseconds: Milliseconds): Proportion {
    const grossTotalTimeDuringIntervalInMilliseconds: Milliseconds = calculateTotalTimeDuringIntervalInMilliseconds(state, previousPayoutDateInMilliseconds);
    
    if (new BigNumber(grossTotalTimeDuringIntervalInMilliseconds).eq(0)) {
        return '0';
    }

    const podcryptPayoutPercentage: Percent = state.podcryptPayoutPercentage;
    const netTotalTimeDuringIntervalInMilliseconds: Milliseconds = new BigNumber(grossTotalTimeDuringIntervalInMilliseconds).dividedBy(new BigNumber(100).minus(podcryptPayoutPercentage).dividedBy(100)).toString();
    const totalTimeForPodcastDuringIntervalInMilliseconds: Milliseconds = calculateTotalTimeForPodcastDuringIntervalInMilliseconds(state, podcast, previousPayoutDateInMilliseconds);

    return new BigNumber(totalTimeForPodcastDuringIntervalInMilliseconds).dividedBy(netTotalTimeDuringIntervalInMilliseconds).toString();
}

function calculateTotalTimeDuringIntervalInMilliseconds(state: Readonly<State>, previousPayoutDateInMilliseconds: Milliseconds): Milliseconds {
    return Object.values(state.podcasts).reduce((result: BigNumber, podcast: Readonly<Podcast>) => {
        return result.plus(calculateTotalTimeForPodcastDuringIntervalInMilliseconds(state, podcast, previousPayoutDateInMilliseconds));
    }, new BigNumber(0)).toString();
}

function getTimestampsDuringInterval(podcast: Readonly<Podcast>, timestamps: ReadonlyArray<Timestamp>, previousPayoutDateInMilliseconds: Milliseconds): ReadonlyArray<Timestamp> {
    // const previousPayoutDateInMilliseconds: Milliseconds = podcast.previousPayoutDateInMilliseconds === 'NEVER' ? '0' : podcast.previousPayoutDateInMilliseconds;
    
    return timestamps.filter((timestamp: Readonly<Timestamp>) => {
        return new BigNumber(timestamp.milliseconds).gt(previousPayoutDateInMilliseconds) && new BigNumber(timestamp.milliseconds).lte(new Date().getTime());
    });
}