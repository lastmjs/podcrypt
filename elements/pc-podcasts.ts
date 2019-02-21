import { customElement, html } from 'functional-element';
import { Store } from '../services/store';

customElement('pc-podcasts', ({ constructing, connecting, element, update, props }) => {
    if (constructing) {
        return {
            searchResults: []
        };
    }

    return html`
        <style>
            .pc-podcasts-container {
                height: 100%;
                padding-left: 2%;
                padding-right: 2%;
                padding-top: 10%;
                padding-bottom: 5%;
                overflow-y: auto;
            }

            .pc-podcasts-search-input {
                width: 100%;
                font-size: calc(15px + 1vmin);
                border: none;
                border-bottom: 1px solid grey;
            }

            .pc-podcasts-search-item {
                padding: 5%;
                display: grid;
                grid-template-columns: 1fr 9fr;
            }

            .pc-podcasts-search-item-text {
                padding: 5%;
            }

            .pc-podcasts-item-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-gap: 5%;
                margin-top: 5%;
            }

            .pc-podcasts-item {
                box-shadow: 0px 0px 5px grey;
                padding: 5%;
            }
        </style>

        <div class="pc-podcasts-container">
            <input
                id="search-input"
                class="pc-podcasts-search-input"
                type="text"
                placeholder="Search for podcasts"
                @keydown=${(e) => searchInputKeyDown(e, element, update)}
            >

            <div class="pc-podcasts-item-container">
                ${Object.values(Store.getState().podcasts).map((podcast) => {
                    return html`
                        <div class="pc-podcasts-item" ?hidden=${props.searchResults.length !== 0}>
                            <div>
                                <img src="${podcast.imageUrl}">
                            </div>
                            <div>
                                <a href="podcast-overview?podcast=${encodeURIComponent(JSON.stringify(podcast))}">${podcast.title}</a>
                            </div>
                        </div>
                    `;
                })}
            </div>

            ${props.searchResults.map((searchResult) => {
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
        </div>
    `;
})

async function searchForPodcasts(element, update) {
    const searchInput = element.querySelector('#search-input');
    const term = searchInput.value.split(' ').join('+');
    const response = await window.fetch(`https://itunes.apple.com/search?country=US&media=podcast&term=${term}`);
    const responseJSON = await response.json();

    update({
        searchResults: responseJSON.results
    });
}

function searchInputKeyDown(e, element, update) {
    if (e.keyCode === 13) {
        searchForPodcasts(element, update);
    }
}

// TODO defend against adding podcasts multiple times
// TODO only send the dynamic information that we need from here
// TODO put all of the defaults into the redux reducer
function subscribeToPodcast(podcast) {
    Store.dispatch({
        type: 'SUBSCRIBE_TO_PODCAST',
        podcast
    });
}