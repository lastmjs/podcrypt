import { customElement, html } from 'functional-element';

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

            .pc-podcasts-item {
                padding: 5%;
                display: grid;
                grid-template-columns: 1fr 9fr;
            }

            .pc-podcasts-item-text {
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

            ${props.searchResults.map((searchResult) => {
                return html`
                    <div class="pc-podcasts-item">
                        <img src="${searchResult.artworkUrl60}">
                        <div class="pc-podcasts-item-text">
                            <a href="podcast-overview?feedUrl=${encodeURIComponent(searchResult.feedUrl)}">${searchResult.trackName}</a>
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