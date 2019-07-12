import BigNumber from 'bignumber.js';
import {
    getPayoutTargetInWEI
} from '../services/payout-calculations';

export function PayoutReducer(
    state: Readonly<State>,
    action: 
        SetPodcryptLatestTransactionHashAction |
        SetPodcryptPreviousPayoutDateAction |
        SetPayoutInProgressAction |
        SetPodcastLatestTransactionHash |
        SetCurrentETHPriceInUSDCentsAction |
        SetPayoutTargetInUSDCentsAction |
        SetPayoutIntervalInDaysAction |
        SetNextPayoutDateAction |
        SetPreviousPayoutDateAction |
        SetPodcastPreviousPayoutDate |
        SetEthereumBalanceInWEIAction |
        ResetPodcastTimeListenedSincePreviousPayoutAction |
        SetPodcastPaymentsEnabledAction
): Readonly<State> {

    if (action.type === 'SET_PODCAST_PAYMENTS_ENABLED') {

        const currentPodcast: Readonly<Podcast> | undefined = state.podcasts[action.feedUrl];

        if (
            currentPodcast === null ||
            currentPodcast === undefined
        ) {
            return state;
        }

        const newPodcast: Readonly<Podcast> = {
            ...currentPodcast,
            paymentsEnabled: action.paymentsEnabled
        };

        return {
            ...state,
            podcasts: {
                ...state.podcasts,
                [newPodcast.feedUrl]: newPodcast
            }
        };
    }

    if (action.type === 'SET_PODCRYPT_LATEST_TRANSACTION_HASH') {
        return {
            ...state,
            podcryptLatestTransactionHash: action.podcryptLatestTransactionHash
        };
    }

    if (action.type === 'SET_PODCRYPT_PREVIOUS_PAYOUT_DATE') {
        return {
            ...state,
            podcryptPreviousPayoutDate: action.podcryptPreviousPayoutDate
        };
    }
    
    if (action.type === 'SET_PAYOUT_IN_PROGRESS') {
        return {
            ...state,
            payoutInProgress: action.payoutInProgress
        };
    }

    if (action.type === 'SET_PODCAST_LATEST_TRANSACTION_HASH') {
        return {
            ...state,
            podcasts: {
                ...state.podcasts,
                [action.feedUrl]: {
                    ...state.podcasts[action.feedUrl],
                    latestTransactionHash: action.latestTransactionHash
                }
            }
        };
    }

    if (action.type === 'SET_CURRENT_ETH_PRICE_IN_USD_CENTS') {
        return {
            ...state,
            currentETHPriceInUSDCents: action.currentETHPriceInUSDCents
        };
    }

    if (action.type === 'SET_PAYOUT_TARGET_IN_USD_CENTS') {
        return {
            ...state,
            payoutTargetInUSDCents: action.payoutTargetInUSDCents
        };
    }

    if (action.type === 'SET_PAYOUT_INTERVAL_IN_DAYS') {
        return {
            ...state,
            payoutIntervalInDays: action.payoutIntervalInDays
        };
    }

    if (action.type === 'SET_NEXT_PAYOUT_DATE') {
        return {
            ...state,
            nextPayoutDate: action.nextPayoutDate
        };
    }

    if (action.type === 'SET_PREVIOUS_PAYOUT_DATE') {
        return {
            ...state,
            previousPayoutDate: action.previousPayoutDate
        };
    }

    if (action.type === 'SET_PODCAST_PREVIOUS_PAYOUT_DATE') {
        return {
            ...state,
            podcasts: {
                ...state.podcasts,
                [action.feedUrl]: {
                    ...state.podcasts[action.feedUrl],
                    previousPayoutDate: action.previousPayoutDate
                }
            }
        };
    }

    if (action.type === 'SET_ETHEREUM_BALANCE_IN_WEI') {
        const newEthereumBalanceInWEI: WEI = action.ethereumBalanceInWEI;
        const payoutTargetInWEI: WEI = getPayoutTargetInWEI(state);

        const newEthereumBalanceInWEIBigNumber = new BigNumber(newEthereumBalanceInWEI);
        const payoutTargetInWEIBigNumber = new BigNumber(payoutTargetInWEI);

        const newPayoutProblem = newEthereumBalanceInWEIBigNumber.eq(0) ? 'BALANCE_0' : payoutTargetInWEIBigNumber.eq(0) ? 'PAYOUT_TARGET_0' : newEthereumBalanceInWEIBigNumber.lt(payoutTargetInWEIBigNumber) ? 'BALANCE_LESS_THAN_PAYOUT_TARGET' : 'NO_PROBLEM';

        return {
            ...state,
            payoutProblem: newPayoutProblem,
            ethereumBalanceInWEI: newEthereumBalanceInWEI
        };
    }

    if (action.type === 'RESET_PODCAST_TIME_LISTENED_SINCE_PREVIOUS_PAYOUT') {
        const podcast: Readonly<Podcast> = state.podcasts[action.feedUrl];
        const newPodcast: Readonly<Podcast> = {
            ...podcast,
            timeListenedSincePreviousPayoutDate: 0
        };

        return {
            ...state,
            podcasts: {
                ...state.podcasts,
                [action.feedUrl]: newPodcast
            }
        };
    }

    return state;
}