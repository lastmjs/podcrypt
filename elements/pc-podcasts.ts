import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import { 
    pcContainerStyles,
    pxMedium,
    pxXSmall,
    color1Full,
    color1Light,
    pxSmall,
    pxLarge,
    pxXXXSmall
 } from '../services/css';
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
                    font-size: ${pxMedium};
                    border: none;
                    border-bottom: 1px solid ${color1Light};
                    font-family: Ubuntu;
                    background-color: transparent;
                }
    
                .pc-podcasts-item {
                    box-shadow: 0px 0px 1px grey;
                    display: flex;
                    padding: ${pxXSmall};
                    margin-top: ${pxXSmall};
                    margin-bottom: ${pxXSmall};
                    border-radius: ${pxXXXSmall};
                    justify-content: center;
                    background-color: white;
                }

                .pc-podcasts-item-text {
                    font-size: ${pxSmall};
                    font-family: Ubuntu;
                    text-overflow: ellipsis;
                    flex: 1;
                    padding-left: ${pxXSmall};
                    cursor: pointer;
                }

                .pc-podcasts-item-image {
                    border-radius: ${pxXXXSmall};
                }

                .pc-podcasts-empty-text {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: calc(75px + 1vmin);
                    font-size: ${pxLarge};
                    color: grey;
                }
            </style>
    
            <div class="pc-podcasts-container">
                <pc-loading
                    .hidden=${props.loaded}
                    .prefix=${"pc-podcasts-"}
                >
                </pc-loading>

                <input
                    id="search-input"
                    class="pc-podcasts-search-input"
                    type="text"
                    placeholder="Search by term or feed URL"
                    @keydown=${(e: any) => searchInputKeyDown(e, element)}
                >
    
                ${
                    Object.values(Store.getState().podcasts).length === 0 ? 
                        html`<div class="pc-podcasts-empty-text">Search for podcasts above</div>` :
                        html`
                            ${Object.values(Store.getState().podcasts).map((podcast) => {
                                return html`
                                    <div class="pc-podcasts-item">
                                        <div>
                                            <img 
                                                class="pc-podcasts-item-image"
                                                src="${podcast.imageUrl}"
                                                width="60"
                                                height="60"
                                            >
                                        </div>
                                        <div 
                                            class="pc-podcasts-item-text"
                                            @click=${() => podcastClick(podcast)}
                                        >
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