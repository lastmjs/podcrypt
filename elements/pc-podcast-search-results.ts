import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { 
    navigate,
    createPodcast
} from '../services/utilities';
import './pc-loading';
import { 
    pcContainerStyles,
    pxXSmall,
    color1Full,
    pxSmall,
    pxXXXSmall,
    normalShadow,
    colorBlackMedium,
    pxXXSmall,
    pxXLarge
 } from '../services/css';

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
                }

                .pc-podcast-search-results-item {
                    box-shadow: ${normalShadow};
                    display: flex;
                    padding: ${pxXSmall};
                    margin-top: ${pxXSmall};
                    margin-bottom: ${pxXSmall};
                    border-radius: ${pxXXXSmall};
                    justify-content: center;
                    background-color: white;
                }
    
                .pc-podcast-search-results-item-text {
                    font-size: ${pxSmall};
                    font-family: Ubuntu;
                    text-overflow: ellipsis;
                    flex: 1;
                    padding-left: ${pxXSmall};
                    cursor: pointer;
                    color: ${colorBlackMedium};
                }

                .pc-podcast-search-results-item-artist-name {
                    font-size: ${pxXSmall};
                    color: ${color1Full};
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    width: 60vw; /*TODO I want this width to be based on its container*/
                    margin-bottom: ${pxXXSmall};
                    font-weight: bold;
                }

                .pc-podcast-search-results-item-controls-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: ${pxXLarge}
                }

                .pc-podcast-search-results-item-subscribe-control {
                    font-size: ${pxSmall};
                    cursor: pointer;
                }

                .pc-podcast-search-results-item-image {
                    border-radius: ${pxXXXSmall};
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
                    <div>
                        No results
                    </div>
                `
            });
        }
        else {
            const podcastFeedResultsPromises = responseJSON.results.map(async (searchResult: any) => {   
                return html`
                    <div class="pc-podcast-search-results-item">
                        <div>
                            <img class="pc-podcast-search-results-item-image" src="${searchResult.artworkUrl60}" width="60" height="60">
                        </div>

                        <div
                            class="pc-podcast-search-results-item-text"
                            @click=${() => podcastTitleClick(searchResult.feedUrl)}
                        >
                            <div class="pc-podcast-search-results-item-artist-name">${searchResult.artistName}</div>
                            ${searchResult.trackName}
                        </div>

                        <div class="pc-podcast-search-results-item-controls-container">
                            <i 
                                class="material-icons"
                                @click=${() => subscribeToPodcast(searchResult.feedUrl)}
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
            const response = await window.fetch(`https://itunes.apple.com/search?country=US&media=podcast&term=${term}`);
            const responseJSON = await response.json();
            return responseJSON;
        }
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

    function podcastTitleClick(feedUrl: string) {
        navigate(Store, `podcast-overview?feedUrl=${feedUrl}`);
    }
});