import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { pcContainerStyles } from '../services/css';
import { 
    navigate
} from '../services/utilities';

StorePromise.then((Store) => {
    customElement('pc-podcasts', ({ constructing, connecting, element, update, props }) => {
        if (constructing) {
            return {
                searchResults: []
            };
        }
    
        return html`
            <style>
                .pc-podcasts-container {
                    ${pcContainerStyles}
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
                    @keydown=${(e: any) => searchInputKeyDown(e, element)}
                >
    
                <div class="pc-podcasts-item-container">
                    ${Object.values((Store.getState() as any).podcasts as ReadonlyArray<any>).map((podcast) => {
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
            </div>
        `;
    });
    
    function searchInputKeyDown(e: any, element: any) {
        if (e.keyCode === 13) {
            const searchInput = element.querySelector('#search-input');
            const term = searchInput.value.split(' ').join('+');
            navigate(Store, `/podcast-search-results?term=${term}`);
        }
    }
});