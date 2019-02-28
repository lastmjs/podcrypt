import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { pcContainerStyles } from '../services/css';
import { until } from 'lit-html/directives/until.js'; // TODO perhaps functional-element should export everything from lit-html so that I can grab it all from functional-element instead of here
import { navigate } from '../services/utilities';

StorePromise.then((Store) => {
    customElement('pc-podcast-search-results', ({ constructing, props }) => {

        if (constructing) {
            return {
                term: null
            };
        }

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
                ${until(searchForPodcasts(props.term), html`<div style="padding: 5%">Loading...</div>`)}
            </div>
        `;
    });

    async function searchForPodcasts(term: string) {
        if (term === null) {
            return;
        }

        const response = await window.fetch(`https://itunes.apple.com/search?country=US&media=podcast&term=${term}`);
        const responseJSON = await response.json();
    
        if (responseJSON.results.length === 0) {
            return html`
                <div style="padding: 5%">
                    No results
                </div>
            `;
        }
        else {
            return html`
                ${responseJSON.results.map((searchResult: any) => {
                    const podcast = {
                        feedUrl: searchResult.feedUrl,
                        title: searchResult.trackName,
                        imageUrl: searchResult.artworkUrl60,
                        episodes: []
                    };

                    return html`
                        <div class="pc-podcast-search-results-item">
                            <div>
                                <img src="${searchResult.artworkUrl60}">
                            </div>

                            <div
                                class="pc-podcast-search-results-item-text"
                                @click=${() => episodeDescriptionClick(podcast)}
                            >
                                ${searchResult.trackName}
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
                })}
            `;
        }
    }

    // TODO defend against adding podcasts multiple times
    // TODO only send the dynamic information that we need from here
    // TODO put all of the defaults into the redux reducer
    function subscribeToPodcast(podcast: any) {
        Store.dispatch({
            type: 'SUBSCRIBE_TO_PODCAST',
            podcast
        });
    }

    function episodeDescriptionClick(podcast: any) {
        navigate(Store, `podcast-overview?podcast=${encodeURIComponent(JSON.stringify(podcast))}`);
    }
});