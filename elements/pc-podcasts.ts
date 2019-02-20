import { customElement, html } from 'functional-element';

customElement('pc-podcasts', ({ constructing, element, update, props }) => {
    if (constructing) {
        return {
            searchResults: []
        };
    }

    return html`
        <style>
            .pc-podcasts-container {
                height: 100%;
                background-color: red;
                padding-left: 2%;
                padding-right: 2%;
                padding-top: 5%;
                padding-bottom: 5%;
            }
        </style>

        <div class="pc-podcasts-container">
            pc-podcasts
            <input id="search-input" type="text">
            <button @click=${() => searchForPodcasts(element, update)}>Search</button>

            ${props.searchResults.map((searchResult) => {
                return html`
                    <div>${searchResult.trackName}</div>
                    <img src="${searchResult.artworkUrl30}">
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

    console.log(responseJSON)

    update({
        searchResults: responseJSON.results
    });
}