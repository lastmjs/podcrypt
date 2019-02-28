import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { pcContainerStyles } from '../services/css';
import { until } from 'lit-html/directives/until.js'; // TODO perhaps functional-element should export everything from lit-html so that I can grab it all from functional-element instead of here

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
                }
            </style>

            <div class="pc-podcast-search-results">
                ${until(searchForPodcasts(props.term), 'Loading...')}
            </div>
        `;
    });

    async function searchForPodcasts(term: string) {
        if (term === null) {
            return;
        }

        const response = await window.fetch(`https://itunes.apple.com/search?country=US&media=podcast&term=${term}`);
        const responseJSON = await response.json();
    
        return html`
            ${responseJSON.results.map((searchResult: any) => {
                const podcast = {
                    feedUrl: searchResult.feedUrl,
                    title: searchResult.trackName,
                    imageUrl: searchResult.artworkUrl60,
                    episodes: []
                };

                return html`
                    <div class="pc-podcasts-search-item">
                        <img src="${searchResult.artworkUrl60}">
                        <div class="pc-podcasts-search-item-text">
                            <div>
                                <a href="podcast-overview?podcast=${encodeURIComponent(JSON.stringify(podcast))}">${searchResult.trackName}</a>
                            </div>

                            <br>

                            <div>
                                <button @click=${() => subscribeToPodcast(podcast)}>Subscribe</button>
                            </div>
                        </div>
                    </div>

                    <hr>
                `;
            })}
        `;
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
});