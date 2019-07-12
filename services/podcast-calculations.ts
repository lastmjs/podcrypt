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


export function calculatePayoutAmountForPodcastDuringIntervalInWEI(state: Readonly<State>, podcast: Readonly<Podcast>, previousPayoutDate: Milliseconds | 'NEVER'): WEI | 'UNKNOWN' {    
    const payoutForPodcastInUSDCents: USDCents = calculatePayoutAmountForPodcastDuringIntervalInUSDCents(state, podcast, previousPayoutDate);
    const currentETHPriceInUSDCents: USDCents | 'UNKNOWN' = state.currentETHPriceInUSDCents;
    
    if (currentETHPriceInUSDCents === 'UNKNOWN') {
        return 'UNKNOWN';
    }

    const payoutForPodcastInWEI: WEI = new BigNumber(payoutForPodcastInUSDCents).dividedBy(new BigNumber(currentETHPriceInUSDCents)).multipliedBy(1e18).toString();

    return payoutForPodcastInWEI;
}

export function calculatePayoutAmountForPodcastDuringIntervalInUSD(state: Readonly<State>, podcast: Readonly<Podcast>, previousPayoutDateInMilliseconds: Milliseconds | 'NEVER'): USDollars {    
    const payoutForPodcastInUSDCents: USDCents = calculatePayoutAmountForPodcastDuringIntervalInUSDCents(state, podcast, previousPayoutDateInMilliseconds);
    const payoutForPodcastInUSD: USDollars = new BigNumber(payoutForPodcastInUSDCents).dividedBy(100).toString();
    return payoutForPodcastInUSD;
}

function calculatePayoutAmountForPodcastDuringIntervalInUSDCents(state: Readonly<State>, podcast: Readonly<Podcast>, previousPayoutDate: Milliseconds | 'NEVER'): USDCents {
    const proportionOfTotalTimeForPodcastDuringInterval: Proportion = calculateProportionOfTotalTimeForPodcastDuringInterval(state, podcast, previousPayoutDate);        
    const payoutTargetInUSDCents: USDCents = state.payoutTargetInUSDCents;
    const payoutForPodcastInUSDCents: USDCents = new BigNumber(proportionOfTotalTimeForPodcastDuringInterval).multipliedBy(payoutTargetInUSDCents).toString();
    
    return payoutForPodcastInUSDCents;
}

// TODO this is not truly the proportion of total time, more the proportion of the donation, since Podcrypt may take a piece of the proportion, and by default will
export function calculateProportionOfTotalTimeForPodcastDuringInterval(state: Readonly<State>, podcast: Readonly<Podcast>, previousPayoutDate: Milliseconds | 'NEVER'): Proportion {
    
    if (podcast.paymentsEnabled === false) {
        return '0';
    }
    
    const grossTotalTimeDuringIntervalInMilliseconds: Milliseconds = calculateTotalTimeDuringIntervalInMilliseconds(state);
    
    if (new BigNumber(grossTotalTimeDuringIntervalInMilliseconds).eq(0)) {
        return '0';
    }

    const podcryptPayoutPercentage: Percent = state.podcryptPayoutPercentage;
    const netTotalTimeDuringIntervalInMilliseconds: Readonly<BigNumber> = new BigNumber(grossTotalTimeDuringIntervalInMilliseconds).dividedBy(new BigNumber(100).minus(podcryptPayoutPercentage).dividedBy(100));
    const totalTimeForPodcastDuringIntervalInMilliseconds: Milliseconds = podcast.timeListenedSincePreviousPayoutDate;

    return new BigNumber(totalTimeForPodcastDuringIntervalInMilliseconds).dividedBy(netTotalTimeDuringIntervalInMilliseconds).toString();
}

function calculateTotalTimeDuringIntervalInMilliseconds(state: Readonly<State>): Milliseconds {
    return Object.values(state.podcasts).reduce((result: Milliseconds, podcast: Readonly<Podcast>) => {
        if (podcast.paymentsEnabled === true) {
            return result + podcast.timeListenedSincePreviousPayoutDate;
        }
        else {
            return result;
        }
    }, 0);
}