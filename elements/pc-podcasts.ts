import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { pcContainerStyles } from '../services/css';
import { 
    navigate
} from '../services/utilities';

StorePromise.then((Store) => {
    customElement('pc-podcasts', ({ constructing, element, update, props }) => {
        if (constructing) {
            Store.subscribe(update);
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
    
                .pc-podcasts-item {
                    box-shadow: 0px 0px 5px grey;
                    padding: 2%;
                    margin-top: 2%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .pc-podcasts-item-text {
                    font-size: calc(12px + 1vmin);
                    text-overflow: ellipsis;
                    flex: 1;
                    padding: 2%;
                    cursor: pointer;
                    font-weight: bold;
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
    
                ${Object.values((Store.getState() as any).podcasts as ReadonlyArray<any>).map((podcast) => {
                    return html`
                        <div class="pc-podcasts-item">
                            <div>
                                <img src="${podcast.imageUrl}" width="60" height="60">
                            </div>
                            <div class="pc-podcasts-item-text" @click=${() => podcastClick(podcast)}>
                                ${podcast.title}
                            </div>
                        </div>
                    `;
                })}
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

    function podcastClick(podcast: any) {
        navigate(Store, `podcast-overview?podcast=${encodeURIComponent(JSON.stringify(podcast))}`);
    }
});