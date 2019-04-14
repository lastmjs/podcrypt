// TODO this should probably be moved to services, we aren't testing pc-wallet.ts, we're testing payout-calculations.ts
// TODO perhaps it is time to upgrade guesswork...we need the browser for these tests
// TODO make sure to check all error conditions, like network going out, functions failing, etc

import * as fc from 'fast-check';
import { StorePromise, getInitialState } from '../services/store';
import { 
    payout,
    getNextPayoutDateInMilliseconds,
    getPayoutInfoForPodcast,
    getPayoutInfoForPodcrypt
 } from '../services/payout-calculations';
import BigNumber from "../node_modules/bignumber.js/bignumber";
import { set } from 'idb-keyval';

const emptyPodcryptWallet = {
    address: `0x0bfdd69C0F2e3c848c915f27C8Bd163A4FA20aF8`,
    privateKey: `0xdb32046c0c7ba79d7b5cc5e4e82efa4aa0929d01007823865b4bd3525df49d64`
};

const notEmptyPodcryptWallet = {
    address: '0x736B50eA67647cCc3a920A881bc98AF8de746595',
    privateKey: `0x7206cf5c63f4f233fe388fc928bb710e775d7756670ae1be7e388466b867ee70`
};

StorePromise.then((Store) => {

    const button = document.createElement('button');

    button.innerHTML = `Run tests`;
    button.style = `position: absolute; z-index: 1000; top: 0; right: 0`;

    button.addEventListener('click', () => {
        runTests();
    });

    document.body.appendChild(button);

    async function runTests() {
        console.log('Running tests');
        
        await test0Podcasts(`Payout with no podcasts`);

        console.log('All tests passed!');
    }

    async function test0Podcasts(message: string) {
        console.log(message);

        await fc.assert(
            await fc.asyncProperty(
                fc.boolean(),
                fc.integer(0, 1000),
                arbPodcastsAndEpisodes(),
                async (
                    arbEmptyPodcryptWallet: boolean,
                    arbPayoutTargetInUSDCents: number,
                    arbPodcastsAndEpisodes: ReadonlyArray<{
                        readonly podcast: Readonly<Podcast>;
                        readonly episodes: ReadonlyArray<Episode>;
                    }>
                ) => {
            
            // console.log('arbPodcastsAndEpisodes', arbPodcastsAndEpisodes);

            // return true;
            const initialState: Readonly<State> = getInitialState(null, 0);

            // TODO is there a way to see what information a transaction that has been sent but not confirmed has? It would be nice to make the transaction verification more robust
            const oldState: Readonly<State> = {
                ...initialState,
                ethereumAddress: arbEmptyPodcryptWallet ? emptyPodcryptWallet.address : notEmptyPodcryptWallet.address,
                walletCreationState: 'CREATED',
                warningCheckbox1Checked: true,
                warningCheckbox2Checked: true,
                warningCheckbox3Checked: true,
                warningCheckbox4Checked: true,
                warningCheckbox5Checked: true,
                payoutTargetInUSDCents: arbPayoutTargetInUSDCents.toString(),
                podcasts: arbPodcastsAndEpisodes.reduce((result, podcastAndEpisodes) => {
                    return {
                        ...result,
                        [podcastAndEpisodes.podcast.feedUrl]: podcastAndEpisodes.podcast
                    };
                }, {}),
                episodes: arbPodcastsAndEpisodes.reduce((result, podcastAndEpisodes) => {
                    return {
                        ...result,
                        ...podcastAndEpisodes.episodes.reduce((result, episode) => {
                            return {
                                ...result,
                                [episode.guid]: episode
                            };
                        }, {})
                    };
                }, {})
            };

            Store.dispatch({
                type: 'SET_STATE',
                state: oldState
            });

            await set('ethereumPrivateKey', arbEmptyPodcryptWallet ? emptyPodcryptWallet.privateKey : notEmptyPodcryptWallet.privateKey);

            await payout(Store, '500');

            const newState: Readonly<State> = Store.getState();

            const previousPayoutDateIsCorrect: boolean = isPreviousPayoutDateCorrect(oldState, newState);
            const nextPayoutDateIsCorrect: boolean = isNextPayoutDateCorrect(oldState, newState);
            const payoutInProgressIsCorrect: boolean = isPayoutInProgressCorrect(newState);
            const podcastTransactionHashesCorrect: boolean = await arePodcastTransactionHashesCorrect(oldState, newState);
            const podcryptTransactionHashCorrect: boolean = await isPodcryptTransactionHashCorrect(oldState, newState);
            const podcryptPreviousPayoutDateIsCorrect: boolean = isPodcryptPreviousPayoutDateCorrect(oldState, newState);

            const result: boolean = (
                previousPayoutDateIsCorrect &&
                nextPayoutDateIsCorrect && 
                payoutInProgressIsCorrect &&
                podcastTransactionHashesCorrect &&
                podcryptTransactionHashCorrect &&
                podcryptPreviousPayoutDateIsCorrect
            );

            console.log('result', result);

            if (result === false) {
                console.log('previousPayoutDateIsCorrect', previousPayoutDateIsCorrect);
                console.log('nextPayoutDateIsCorrect', nextPayoutDateIsCorrect);
                console.log('payoutInProgressIsCorrect', payoutInProgressIsCorrect);
                console.log('podcastTransactionHashesCorrect', podcastTransactionHashesCorrect);
                console.log('podcryptTransactionHashCorrect', podcryptTransactionHashCorrect);
                console.log('podcryptPreviousPayoutDateIsCorrect', podcryptPreviousPayoutDateIsCorrect);
            }

            return result;
        }), {
            numRuns: 10
        });
    }

    function isPreviousPayoutDateCorrect(oldState: Readonly<State>, newState: Readonly<State>): boolean {
        if (newState.payoutProblem === 'NO_PROBLEM') {
            // TODO make this more robust, we could probably check just the month and day and hour maybe...
            return (
                newState.previousPayoutDateInMilliseconds !== 'NEVER' &&
                new Date(parseInt(newState.previousPayoutDateInMilliseconds)).toString() !== 'Invalid Date'
            );
        }
        else {
            // If there is a payoutProblem, then the payout process should not even run
            // Thus, the previousPayoutDateInMilliseconds should remain unchaned
            return oldState.previousPayoutDateInMilliseconds === newState.previousPayoutDateInMilliseconds;
        }
    }

    function isPodcryptPreviousPayoutDateCorrect(oldState: Readonly<State>, newState: Readonly<State>): boolean {
        if (newState.payoutProblem === 'NO_PROBLEM') {
            // TODO make this more robust, we could probably check just the month and day and hour maybe...
            return (
                newState.podcryptPreviousPayoutDateInMilliseconds !== 'NEVER' &&
                new Date(parseInt(newState.podcryptPreviousPayoutDateInMilliseconds)).toString() !== 'Invalid Date'
            );
        }
        else {
            // If there is a payoutProblem, then the payout process should not even run
            // Thus, the previousPayoutDateInMilliseconds should remain unchaned
            return oldState.podcryptPreviousPayoutDateInMilliseconds === newState.podcryptPreviousPayoutDateInMilliseconds;
        }
    }

    function isNextPayoutDateCorrect(oldState: Readonly<State>, newState: Readonly<State>) {
        if (newState.payoutProblem === 'NO_PROBLEM') {
            return getNextPayoutDateInMilliseconds(oldState) === newState.nextPayoutDateInMilliseconds;
        }
        else {
            // If there is a payoutProblem, then the payout process should not even run
            // Thus, the nextPayoutDateInMilliseconds should remain unchanged
            return oldState.nextPayoutDateInMilliseconds === newState.nextPayoutDateInMilliseconds;
        }
    }

    function isPayoutInProgressCorrect(newState: Readonly<State>) {
        return newState.payoutInProgress === false;
    }

    // TODO I think we can redo this more simply now that we have the old and new state available
    async function arePodcastTransactionHashesCorrect(oldState: Readonly<State>, newState: Readonly<State>) {
        const payoutAmountInfosPerPodcast: ReadonlyArray<{
            readonly podcast: Readonly<Podcast>;
            readonly value: WEI;
        }> = await Promise.all(Object.values(oldState.podcasts).map(async (podcast: Readonly<Podcast>) => {
            const payoutInfoForPodcast = await getPayoutInfoForPodcast(oldState, podcast);

            return {
                podcast,
                value: payoutInfoForPodcast.value
            };
        }));
        
        const podcastTransactionHashesCorrect: boolean = payoutAmountInfosPerPodcast.reduce((result: boolean, payoutAmountInfo) => {

            if (result === false) {
                return result;
            }

            const podcastInState: Readonly<Podcast> = newState.podcasts[payoutAmountInfo.podcast.feedUrl];

            if (new BigNumber(payoutAmountInfo.value).gt(0)) {
                return (
                    podcastInState.latestTransactionHash !== null &&
                    podcastInState.latestTransactionHash !== undefined &&
                    payoutAmountInfo.podcast.latestTransactionHash !== podcastInState.latestTransactionHash
                );
            }

            return result;
        }, true);

        return podcastTransactionHashesCorrect;
    }

    async function isPodcryptTransactionHashCorrect(oldState: Readonly<State>, newState: Readonly<State>) {
        const originalPodcryptLatestTransactionHash: string | null = oldState.podcryptLatestTransactionHash;
        const originalPodcryptPayoutInfo = await getPayoutInfoForPodcrypt(oldState);

        const podcryptTransactionHashCorrect: boolean = new BigNumber(originalPodcryptPayoutInfo.value).gt(0) ? (
            originalPodcryptLatestTransactionHash !== null &&
            originalPodcryptLatestTransactionHash !== undefined &&
            originalPodcryptLatestTransactionHash !== newState.podcryptLatestTransactionHash
        ) : true;

        return podcryptTransactionHashCorrect;
    }

    function arbPodcastsAndEpisodes() {
        return fc.array(arbPodcastAndEpisodes());
    }

    function arbPodcastAndEpisodes(): fc.Arbitrary<Readonly<{
        readonly podcast: Readonly<Podcast>;
        readonly episodes: ReadonlyArray<Episode>;
    }>> {
        return fc.constant(0).map((x) => {
            const feedUrl: FeedUrl = 'http://localhost:5000/test-rss-feed.xml';
            const episodes: ReadonlyArray<Episode> = fc.sample(arbEpisodes(feedUrl), 1)[0];

            return {
                podcast: {
                    feedUrl,
                    episodeGuids: episodes.map(episode => episode.guid),
                    artistName: fc.sample(fc.unicodeString(), 1)[0],
                    title: fc.sample(fc.unicodeString())[0],
                    description: fc.sample(fc.unicodeString())[0],
                    imageUrl: fc.sample(fc.constant('NOT_FOUND') , 1)[0],
                    previousPayoutDateInMilliseconds: fc.sample(fc.constant('NEVER') , 1)[0],
                    latestTransactionHash: fc.sample(fc.constant(null) , 1)[0],
                    ethereumAddress: fc.sample(fc.constant('0x') , 1)[0],
                    ensName: fc.sample(fc.constant('NOT_FOUND') , 1)[0],
                    email: fc.sample(fc.constant('NOT_SET') , 1)[0]
                },
                episodes
            };
        });
    }

    function arbEpisodes(feedUrl: FeedUrl): fc.Arbitrary<ReadonlyArray<Episode>> {
        return fc.array(arbEpisode(feedUrl));
    }

    function arbEpisode(feedUrl: FeedUrl): fc.Arbitrary<Readonly<Episode>> {
        return fc.tuple(
            fc.base64String(), // TODO we will probably have clashes here, we need uuids
            fc.constant(feedUrl),
            fc.unicodeString(),
            fc.unicodeString(),
            fc.constant(false),
            fc.boolean(),
            fc.constant('0'),
            arbTimestamps(),
            fc.constant(new Date().toISOString())
        ).map((tup) => {
            return {
                guid: tup[0],
                feedUrl: tup[1],
                title: tup[2],
                src: tup[3],
                playing: tup[4],
                finishedListening: tup[5],
                progress: tup[6],
                timestamps: fc.sample(fc.array(fc.constant(0)), 1)[0].map((x, index) => {
                    return {
                        type: index % 2 === 0 ? 'START' : 'STOP' as any,
                        actionType: index % 2 === 0 ? 'CURRENT_EPISODE_PLAYED' : 'CURRENT_EPISODE_PAUSED' as any,
                        milliseconds: fc.sample(fc.integer(), 1)[0].toString()
                    };
                }),
                isoDate: tup[8]
            };
        });
    }

    function arbTimestamps() {
        return fc.array(arbTimestamp());
    }

    function arbTimestamp() {
        return fc.tuple(
            fc.constant('START'),
            fc.constant('CURRENT_EPISODE_PLAYED'),
            fc.constant('0')
        ).map(tup => {
            const timestamp: Readonly<Timestamp> = {
                type: tup[0] as any,
                actionType: tup[1] as any,
                milliseconds: tup[2]
            };

            return timestamp;
        });
    }
});
