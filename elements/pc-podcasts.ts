import { customElement, html } from 'functional-element';
import { StorePromise } from '../state/store';
import { 
    pcContainerStyles,
    pxMedium,
    color1Medium,
    pxLarge
 } from '../services/css';
import { 
    navigate
} from '../services/utilities';
import './pc-loading';
import './pc-podcast-row';

StorePromise.then((Store) => {
    customElement('pc-podcasts', ({ 
        constructing, 
        connecting, 
        element, 
        update, 
        loaded
    }) => {

        if (constructing) {
            Store.subscribe(update);
            return {
                loaded: false
            };
        }

        if (connecting) {
            setTimeout(() => {
                update({
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
                    border-bottom: 1px solid ${color1Medium};
                    font-family: Ubuntu;
                    background-color: transparent;
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
                    .hidden=${loaded}
                    .prename=${"pc-podcasts-"}
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
                                    <pc-podcast-row
                                        .podcast=${podcast}
                                        .verification=${true}
                                        .options=${true}
                                    ></pc-podcast-row>
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
});