import { customElement, html } from 'functional-element';
import { StorePromise } from '../state/store';
import { 
    pxXSmall,
    pxSmall,
    pxXXXSmall,
    normalShadow,
    colorBlackMedium,
    color1Full,
    pxXXSmall,
    pxXLarge
 } from '../services/css';
import { 
    navigate,
    createPodcast,
    getFeed,
    addEpisodeToPlaylist,
    copyTextToClipboard
} from '../services/utilities';
import BigNumber from "../node_modules/bignumber.js/bignumber";

StorePromise.then((Store) => {
    customElement('pc-podcast-row', ({ 
        constructing,
        podcast,
        controls,
        verification,
        payouts,
        usage,
        options,
        payoutAmountForPodcastDuringIntervalInUSD,
        percentageOfTotalTimeForPodcastDuringInterval,
        totalTimeForPodcastDuringIntervalInMinutes,
        secondsRemainingForPodcastDuringInterval,
        nextPayoutLocaleDateString
    }) => {

        if (constructing) {
            return {
                podcast: null,
                controls: false,
                verification: false,
                payouts: false,
                usage: false,
                options: false,
                payoutAmountForPodcastDuringIntervalInUSD: null,
                percentageOfTotalTimeForPodcastDuringInterval: null,
                totalTimeForPodcastDuringIntervalInMinutes: null,
                secondsRemainingForPodcastDuringInterval: null,
                nextPayoutLocaleDateString: null
            };
        }

        return html`
            <style>
                .pc-podcast-row-main-container {
                    box-shadow: ${normalShadow};
                    display: flex;
                    padding: ${pxXSmall};
                    margin-top: ${pxXSmall};
                    margin-bottom: ${pxXSmall};
                    border-radius: ${pxXXXSmall};
                    justify-content: center;
                    background-color: white;
                    position: relative;
                }

                .pc-podcast-row-image-container {
                }

                .pc-podcast-row-image {
                    border-radius: ${pxXXXSmall};
                }

                .pc-podcast-row-text-container {
                    flex: 1;
                    cursor: pointer;
                    padding-left: ${pxXSmall};
                }

                .pc-podcast-row-text-artist-name {
                    font-size: ${pxXSmall};
                    color: ${color1Full};
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    width: 60vw; /*TODO I want this width to be based on its container*/
                    margin-bottom: ${pxXXSmall};
                    font-weight: bold;
                }

                .pc-podcast-row-text-title {
                    font-weight: bold;
                }

                .pc-podcast-row-text-title-container {
                    font-size: ${pxSmall};
                    font-family: Ubuntu;
                    color: ${colorBlackMedium};
                }

                .pc-podcast-row-controls-container {
                    display: flex;
                    padding-left: ${pxXSmall};
                    cursor: pointer;
                    font-size: ${pxXLarge};
                    align-items: center;
                    justify-content: center;
                }

                .pc-podcast-row-verification-container {
                    margin-top: ${pxXXSmall};
                }

                .pc-podcast-row-options-select {
                    border: none;
                    background-color: transparent;
                    width: 35px;
                    cursor: pointer;
                    position: absolute;
                    top: 5px;
                    right: 5px;
                }

            </style>

            <div class="pc-podcast-row-main-container">
                <div class="pc-podcast-row-image-container">
                    ${podcast !== null ? html`
                        <img 
                            class="pc-podcast-row-image"
                            src="${podcast.imageUrl}"
                            width="60"
                            height="60"
                        >
                    ` : ``}
                </div>

                <div 
                    class="pc-podcast-row-text-container"
                    @click=${() => podcastClick(podcast)}
                >
                    ${
                        podcast !== null ? html`
                            
                            ${
                                podcast.artistName ?
                                    html`
                                        <div class="pc-podcast-row-text-artist-name">${podcast.artistName}</div>
                                    ` : html``
                            }

                            <div class="pc-podcast-row-text-title-container">
                                <div class="pc-podcast-row-text-title">${podcast.title}</div>

                                ${
                                    verification ?
                                        html`
                                            <div class="pc-podcast-row-verification-container">
                                                ${
                                                    podcast.ethereumAddress === 'NOT_FOUND' ? 
                                                        html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${(e: any) => notVerifiedHelpClick(e, podcast)}>Not verified - click to help</button>` :
                                                        podcast.ethereumAddress === 'MALFORMED' ?
                                                html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${(e: any) => notVerifiedHelpClick(e, podcast)}>Not verified - click to help</button>` :
                                                            html`<button style="color: green; border: none; padding: 5px; margin: 5px" @click=${(e: any) => { e.stopPropagation(); alert(`This podcast's Ethereum address: ${podcast.ethereumAddress}`)} }>Verified</button>` }
                                            </div>
                                        ` : html``
                                }

                                ${
                                    usage ?
                                    html`
                                        <br>
                                        <div>$${new BigNumber(payoutAmountForPodcastDuringIntervalInUSD).toFixed(2)}, ${new BigNumber(percentageOfTotalTimeForPodcastDuringInterval).toFixed(2)}%, ${totalTimeForPodcastDuringIntervalInMinutes} min ${secondsRemainingForPodcastDuringInterval} sec</div>
                                    ` :
                                    html``
                                }

                                ${
                                    payouts ?
                                    html`
                                        <br>
                                        <div @click=${(e: any) => e.stopPropagation()}>Last payout: ${podcast.previousPayoutDate === 'NEVER' ? 'never' : html`<a href="https://${process.env.NODE_ENV !== 'production' ? 'ropsten.' : ''}etherscan.io/tx/${podcast.latestTransactionHash}" target="_blank">${new Date(parseInt(podcast.previousPayoutDate)).toLocaleString()}</a>`}</div>
                                        <br>
                                        <div>Next payout: ${nextPayoutLocaleDateString}</div>
                                    ` :
                                    html``
                                }
                            </div>
                        ` : `No podcast found`
                    }
                </div>

                ${
                    podcast && controls ? 
                        html`
                            <div class="pc-podcast-row-controls-container">
                                <i 
                                    class="material-icons"
                                    @click=${() => subscribeToPodcast(podcast.feedUrl)}
                                >
                                    library_add
                                </i>  
                            </div>
                        ` : 
                        html``
                }

                ${
                    options ?
                    html`
                        <select
                            @change=${(e: any) => optionsChange(e, podcast)}
                            class="pc-podcast-row-options-select"
                        >
                            <option>...</option>
                            <option>Copy podcast URL</option>
                            <option>Add all episodes to playlist: oldest -> newest</option>
                            <option>Add all episodes to playlist: newest -> oldest</option>
                            <option>Delete</option>
                        </select>
                    ` :
                    html``
                }
            </div>
        `;
    });

    function podcastClick(podcast: any) {
        navigate(Store, `podcast-overview?feedUrl=${podcast.feedUrl}`);
    }

    async function subscribeToPodcast(feedUrl: FeedUrl) {
        const podcast: Readonly<Podcast> | null = await createPodcast(feedUrl);

        if (podcast === null) {
            alert('Could not subscribe to podcast');
            return;
        }

        Store.dispatch({
            type: 'SUBSCRIBE_TO_PODCAST',
            podcast
        });
    }

    function notVerifiedHelpClick(e: any, podcast: Readonly<Podcast>) {
        e.stopPropagation();

        navigate(Store, `/not-verified-help?feedUrl=${podcast.feedUrl}&podcastEmail=${podcast.email}`);
    }

    async function optionsChange(e: any, podcast: Readonly<Podcast>) {

        // TODO constantize each of the options in the dropdown

        if (e.target.value === 'Delete') {
            const confirmation = confirm('Are you sure you want to delete this podcast and all of its data?');

            if (confirmation === true) {
                Store.dispatch({
                    type: 'DELETE_PODCAST',
                    podcast
                });
            }
        }

        if (e.target.value === 'Add all episodes to playlist: oldest -> newest') {
            const feed: Readonly<Feed> | null = await getFeed(podcast.feedUrl);

            if (feed === null) {
                alert('The feed could not be loaded');
                return;
            }

            const sortedItems = [...feed.items].sort((a: any, b: any) => {
                return new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime();
            });

            sortedItems.forEach((item: any) => {
                addEpisodeToPlaylist(Store, podcast, item);
            });
        }

        if (e.target.value === 'Add all episodes to playlist: newest -> oldest') {
            const feed: Readonly<Feed> | null = await getFeed(podcast.feedUrl);

            if (feed === null) {
                alert('The feed could not be loaded');
                return;
            }

            feed.items.forEach((item: any) => {
                addEpisodeToPlaylist(Store, podcast, item);
            });
        }

        if (e.target.value === 'Copy podcast URL') {
            copyTextToClipboard(`${window.location.origin}/podcast-overview?feedUrl=${podcast.feedUrl}`);
        }

        e.target.value = '...';
    }
});