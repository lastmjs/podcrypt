import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
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
    createPodcast
} from '../services/utilities';
import BigNumber from "../node_modules/bignumber.js/bignumber";

StorePromise.then((Store) => {
    customElement('pc-podcast-row', ({ props, constructing }) => {

        if (constructing) {
            return {
                podcast: null,
                controls: false,
                verification: false,
                payouts: false,
                usage: false,
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
                }

                .pc-podcast-row-verification-container {
                    margin-top: ${pxXXSmall};
                }

            </style>

            <div class="pc-podcast-row-main-container">
                <div class="pc-podcast-row-image-container">
                    ${props.podcast !== null ? html`
                        <img 
                            class="pc-podcast-row-image"
                            src="${props.podcast.imageUrl}"
                            width="60"
                            height="60"
                        >
                    ` : ``}
                </div>

                <div 
                    class="pc-podcast-row-text-container"
                    @click=${() => podcastClick(props.podcast)}
                >
                    ${
                        props.podcast !== null ? html`
                            
                            ${
                                props.podcast.artistName ?
                                    html`
                                        <div class="pc-podcast-row-text-artist-name">${props.podcast.artistName}</div>
                                    ` : html``
                            }

                            <div class="pc-podcast-row-text-title-container">
                                <div class="pc-podcast-row-text-title">${props.podcast.title}</div>

                                ${
                                    props.verification ?
                                        html`
                                            <div class="pc-podcast-row-verification-container">
                                                ${
                                                    props.podcast.ethereumAddress === 'NOT_FOUND' ? 
                                                        html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${(e: any) => notVerifiedHelpClick(e, props.podcast)}>Not verified - click to help</button>` :
                                                        props.podcast.ethereumAddress === 'MALFORMED' ?
                                                html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${(e: any) => notVerifiedHelpClick(e, props.podcast)}>Not verified - click to help</button>` :
                                                            html`<button style="color: green; border: none; padding: 5px; margin: 5px" @click=${(e: any) => { e.stopPropagation(); alert(`This podcast's Ethereum address: ${props.podcast.ethereumAddress}`)} }>Verified</button>` }
                                            </div>
                                        ` : html``
                                }

                                ${
                                    props.usage ?
                                    html`
                                        <br>
                                        <div>$${new BigNumber(props.payoutAmountForPodcastDuringIntervalInUSD).toFixed(2)}, ${new BigNumber(props.percentageOfTotalTimeForPodcastDuringInterval).toFixed(2)}%, ${props.totalTimeForPodcastDuringIntervalInMinutes} min ${props.secondsRemainingForPodcastDuringInterval} sec</div>
                                    ` :
                                    html``
                                }

                                ${
                                    props.payouts ?
                                    html`
                                        <br>
                                        <div @click=${(e: any) => e.stopPropagation()}>Last payout: ${props.podcast.previousPayoutDateInMilliseconds === 'NEVER' ? 'never' : html`<a href="https://${process.env.NODE_ENV !== 'production' ? 'ropsten.' : ''}etherscan.io/tx/${props.podcast.latestTransactionHash}" target="_blank">${new Date(props.podcast.previousPayoutDateInMilliseconds).toLocaleString()}</a>`}</div>
                                        <br>
                                        <div>Next payout: ${props.nextPayoutLocaleDateString}</div>
                                    ` :
                                    html``
                                }
                            </div>
                        ` : `No podcast found`
                    }
                </div>

                ${
                    props.podcast && props.controls ? 
                        html`
                            <div class="pc-podcast-row-controls-container">
                                <i 
                                    class="material-icons"
                                    @click=${() => subscribeToPodcast(props.podcast.feedUrl)}
                                >
                                    library_add
                                </i>  
                            </div>
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
});