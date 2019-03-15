import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { pcContainerStyles } from '../services/css';
import { 
    navigate,
    createPodcast
} from '../services/utilities';
import './pc-loading';

StorePromise.then((Store) => {
    customElement('pc-podcast-search-results', ({ constructing, props, update }) => {

        if (constructing) {
            return {
                term: null,
                previousTerm: null,
                loaded: false,
                searchResultsUI: ''
            };
        }

        if (props.term !== props.previousTerm) {
            update({
                ...props,
                previousTerm: props.term,
                loaded: false
            });
        }

        searchForPodcasts(props, update);

        return html`
            <style>
                .pc-podcast-search-results {
                    ${pcContainerStyles}
                    padding-left: 0;
                    padding-right: 0;
                }

                .pc-podcast-search-results-item {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 4px 2px -2px grey;
                    padding: 2%;
                }
    
                .pc-podcast-search-results-item-text {
                    font-size: calc(12px + 1vmin);
                    font-weight: bold;
                    text-overflow: ellipsis;
                    flex: 1;
                    padding: 2%;
                    cursor: pointer;
                }

                .pc-podcast-search-results-item-controls-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pc-podcast-search-results-item-subscribe-control {
                    font-size: calc(12px + 1vmin);
                    cursor: pointer;
                }
            </style>

            <div class="pc-podcast-search-results">
                <pc-loading
                    .hidden=${props.loaded}
                    .prefix=${"pc-podcast-search-results-"}
                ></pc-loading>
                ${props.searchResultsUI}
            </div>
        `;
    });

    async function searchForPodcasts(props: any, update: any) {

        if (
            props.term === null ||
            props.term === undefined ||
            props.loaded === true
        ) {
            return;
        }

        const responseJSON = await getResponseJSON(props.term);

        if (responseJSON.results.length === 0) {
            update({
                ...props,
                loaded: true,
                previousTerm: props.term,
                searchResultsUI: html`
                    <div style="padding: 5%">
                        No results
                    </div>
                `
            });
        }
        else {
            const podcastFeedResultsPromises = responseJSON.results.map(async (searchResult: any) => {   
                const podcast: Readonly<Podcast | null> = await createPodcast(searchResult.feedUrl);

                if (podcast === null) {
                    return html`<div>Podcast could not be loaded</div>`;
                }

                return html`
                    <div class="pc-podcast-search-results-item">
                        <div>
                            <img src="${searchResult.artworkUrl60}" width="60" height="60">
                        </div>

                        <div
                            class="pc-podcast-search-results-item-text"
                            @click=${() => episodeDescriptionClick(podcast.feedUrl)}
                        >
                            ${searchResult.trackName}
                            <div>
                                ${
                                    podcast.ethereumAddress === 'NOT_FOUND' ? 
                                        html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${(e: any) => notVerifiedHelpClick(e, podcast)}>Not verified - click to help</button>` :
                                        podcast.ethereumAddress === 'MALFORMED' ?
                                html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${(e: any) => notVerifiedHelpClick(e, podcast)}>Not verified - click to help</button>` :
                                            html`<button style="color: green; border: none; padding: 5px; margin: 5px" @click=${(e: any) => { e.stopPropagation(); alert(`This podcast's Ethereum address: ${podcast.ethereumAddress}`)} }>Verified</button>` }
                            </div>

                        </div>

                        <div class="pc-podcast-search-results-item-controls-container">
                            <i 
                                class="material-icons"
                                style="font-size: 25px; cursor: pointer"
                                @click=${() => subscribeToPodcast(podcast)}
                            >
                                library_add
                            </i>  
                        </div>
                    </div>
                `;
            });

            const podcastFeedResults = await Promise.all(podcastFeedResultsPromises);

            update({
                ...props,
                loaded: true,
                previousTerm: props.term,
                searchResultsUI: html`
                    ${podcastFeedResults}
                `
            });
        }
    }

    async function getResponseJSON(term: string) {
        if (
            term.startsWith('https://') ||
            term.startsWith('http://')
        ) {
            return {
                results: [{
                    feedUrl: term
                }]
            };
        }
        else {
            const response = await window.fetch(`https://itunes.apple.com/search?country=US&media=podcast&term=${props.term}`);
            const responseJSON = await response.json();
            return responseJSON;
        }
    }

    // TODO defend against adding podcasts multiple times
    // TODO only send the dynamic information that we need from here
    // TODO put all of the defaults into the redux reducer
    function subscribeToPodcast(podcast: Readonly<Podcast>) {
        Store.dispatch({
            type: 'SUBSCRIBE_TO_PODCAST',
            podcast
        });
    }

    function episodeDescriptionClick(feedUrl: string) {
        navigate(Store, `podcast-overview?feedUrl=${feedUrl}`);
    }

    function notVerifiedHelpClick(e: any, podcast: Readonly<Podcast>) {
        e.stopPropagation();

        navigate(Store, `/not-verified-help?feedUrl=${podcast.feedUrl}&podcastEmail=${podcast.email}`);
    }
});