import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { pcContainerStyles } from '../services/css';
import { 
    navigate
} from '../services/utilities';
import './pc-loading';

StorePromise.then((Store) => {
    customElement('pc-podcasts', ({ constructing, connecting, element, update, props }) => {

        if (constructing) {
            Store.subscribe(update);
            return {
                searchResults: [],
                loaded: false
            };
        }

        if (connecting) {
            setTimeout(() => {
                update({
                    ...props,
                    loaded: true
                });
            });
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
                <pc-loading .hidden=${props.loaded} .prefix=${"pc-podcasts-"}></pc-loading>

                <input
                    id="search-input"
                    class="pc-podcasts-search-input"
                    type="text"
                    placeholder="Search or enter feed URL"
                    @keydown=${(e: any) => searchInputKeyDown(e, element)}
                >
    
                ${
                    Object.values(Store.getState().podcasts).length === 0 ? 
                    html`<div style="display: flex; align-items: center; justify-content: center; margin-top: 25%; font-size: calc(20px + 1vmin); color: grey">You have no podcasts</div>` :
                    html`
                        ${Object.values(Store.getState().podcasts).map((podcast) => {
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
                    `
                }
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
        navigate(Store, `podcast-overview?feedUrl=${podcast.feedUrl}`);
    }
});