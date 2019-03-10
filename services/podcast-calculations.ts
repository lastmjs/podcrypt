export function calculatePayoutAmountForPodcryptDuringCurrentIntervalInWEI(state: Readonly<State>): WEI {    
    const payoutTargetInUSDCents: USDCents = state.payoutTargetInUSDCents;    
    const payoutForPodcryptInUSDCents: USDCents = (state.podcryptPayoutPercentage * payoutTargetInUSDCents) / 100;
    const currentETHPriceInUSDCents: USDCents | 'UNKNOWN' = state.currentETHPriceInUSDCents;
    
    if (currentETHPriceInUSDCents === 'UNKNOWN') {
        return 0;
    }

    const payoutForPodcryptInWEI: WEI = (payoutForPodcryptInUSDCents / currentETHPriceInUSDCents) * 1e18;

    return payoutForPodcryptInWEI;
}


export function calculatePayoutAmountForPodcastDuringCurrentIntervalInWEI(state: Readonly<State>, podcast: Readonly<Podcast>): WEI {    
    const payoutForPodcastInUSDCents: USDCents = calculatePayoutAmountForPodcastDuringCurrentIntervalInUSDCents(state, podcast);
    const currentETHPriceInUSDCents: USDCents | 'UNKNOWN' = state.currentETHPriceInUSDCents;
    
    if (currentETHPriceInUSDCents === 'UNKNOWN') {
        return 0;
    }

    const payoutForPodcastInWEI: WEI = (payoutForPodcastInUSDCents / currentETHPriceInUSDCents) * 1e18;

    return payoutForPodcastInWEI;
}

export function calculatePayoutAmountForPodcastDuringCurrentIntervalInUSD(state: Readonly<State>, podcast: Readonly<Podcast>): USD {    
    const payoutForPodcastInUSDCents: USDCents = calculatePayoutAmountForPodcastDuringCurrentIntervalInUSDCents(state, podcast);
    const payoutForPodcastInUSD: USD = payoutForPodcastInUSDCents / 100;
    return payoutForPodcastInUSD;
}

function calculatePayoutAmountForPodcastDuringCurrentIntervalInUSDCents(state: Readonly<State>, podcast: Readonly<Podcast>): USDCents {
    const proportionOfTotalTimeForPodcastDuringCurrentInterval: number = calculateProportionOfTotalTimeForPodcastDuringCurrentInterval(state, podcast);        
    const payoutTargetInUSDCents: USDCents = state.payoutTargetInUSDCents;
    const payoutForPodcastInUSDCents: USDCents = proportionOfTotalTimeForPodcastDuringCurrentInterval * payoutTargetInUSDCents;
    
    return payoutForPodcastInUSDCents;
}

export function calculateTotalTimeForPodcastDuringCurrentIntervalInMilliseconds(state: Readonly<State>, podcast: Readonly<Podcast>): Milliseconds {
    return podcast.episodeGuids.reduce((result: number, episodeGuid: EpisodeGuid) => {
        const episode: Readonly<Episode> = state.episodes[episodeGuid];
        const timestampsDuringCurrentInterval: ReadonlyArray<Timestamp> = getTimestampsDuringCurrentInterval(podcast, episode.timestamps);

        return result + timestampsDuringCurrentInterval.reduce((result: number, timestamp: Readonly<Timestamp>, index: number) => {
            const nextTimestamp: Readonly<Timestamp> = timestampsDuringCurrentInterval[index + 1];
            const previousTimestamp: Readonly<Timestamp> = timestampsDuringCurrentInterval[index - 1];

            if (timestamp.type === 'START') {
                if (
                    nextTimestamp &&
                    nextTimestamp.type === 'STOP'
                ) {
                    return result - timestamp.milliseconds;
                }
                else {
                    return result + 0;
                }
            }

            if (timestamp.type === 'STOP') {
                if (
                    previousTimestamp &&
                    previousTimestamp.type === 'START'
                ) {
                    return result + timestamp.milliseconds;
                }
                else {
                    return result + 0;
                }
            }

            // TODO this should never happen, should we throw?
            return 0;
        }, 0);
    }, 0);
}

// TODO this is not truly the proportion of total time, more the proportion of the donation, since Podcrypt may take a piece of the proportion, and by default will
export function calculateProportionOfTotalTimeForPodcastDuringCurrentInterval(state: Readonly<State>, podcast: Readonly<Podcast>): number {
    const grossTotalTimeDuringCurrentIntervalInMilliseconds: Milliseconds = calculateTotalTimeDuringCurrentIntervalInMilliseconds(state);
    
    if (grossTotalTimeDuringCurrentIntervalInMilliseconds === 0) {
        return 0;
    }

    const podcryptPayoutPercentage: number = state.podcryptPayoutPercentage;

    // const podcryptPortionOfGrossTotalTimeDuringCurrentIntervalInMilliseconds: Milliseconds = grossTotalTimeDuringCurrentIntervalInMilliseconds + ((grossTotalTimeDuringCurrentIntervalInMilliseconds * podcryptPayoutPercentage) / 100);
    // const netTotalTimeDuringCurrentIntervalInMilliseconds: Milliseconds = grossTotalTimeDuringCurrentIntervalInMilliseconds + ((grossTotalTimeDuringCurrentIntervalInMilliseconds * podcryptPayoutPercentage) / 100);
    const netTotalTimeDuringCurrentIntervalInMilliseconds: Milliseconds = grossTotalTimeDuringCurrentIntervalInMilliseconds / ((100 - podcryptPayoutPercentage) / 100);

    const totalTimeForPodcastDuringCurrentIntervalInMilliseconds: Milliseconds = calculateTotalTimeForPodcastDuringCurrentIntervalInMilliseconds(state, podcast);

    return totalTimeForPodcastDuringCurrentIntervalInMilliseconds / netTotalTimeDuringCurrentIntervalInMilliseconds;
}

function calculateTotalTimeDuringCurrentIntervalInMilliseconds(state: Readonly<State>): Milliseconds {
    return Object.values(state.podcasts).reduce((result: number, podcast: Readonly<Podcast>) => {
        return result + calculateTotalTimeForPodcastDuringCurrentIntervalInMilliseconds(state, podcast);
    }, 0);
}

function getTimestampsDuringCurrentInterval(podcast: Readonly<Podcast>, timestamps: ReadonlyArray<Timestamp>): ReadonlyArray<Timestamp> {
    const previousPayoutDateInMilliseconds: Milliseconds = podcast.previousPayoutDateInMilliseconds === 'NEVER' ? 0 : podcast.previousPayoutDateInMilliseconds;
    
    return timestamps.filter((timestamp: Readonly<Timestamp>) => {
        return timestamp.milliseconds > previousPayoutDateInMilliseconds && timestamp.milliseconds <= new Date().getTime();
    });
}