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
import '@vaadin/vaadin-tabs';
import './pc-podcast-search-results';

StorePromise.then((Store) => {
    customElement('pc-podcasts', ({ 
        constructing, 
        connecting, 
        element, 
        update, 
        loaded,
        tabIndex,
        searchTerm
    }) => {

        if (constructing) {
            Store.subscribe(update);
            return {
                loaded: false,
                tabIndex: 'NOT_SET',
                searchTerm: ''
            };
        }

        if (connecting) {
            setTimeout(() => {
                update({
                    loaded: true,
                    tabIndex: Object.values(Store.getState().podcasts).length === 0 ? 1 : 0
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
                    @keydown=${(e: any) => searchInputKeyDown(e, element, update)}
                >

                <vaadin-tabs .selected=${tabIndex}>
                    <vaadin-tab @click=${() => update({ tabIndex: 0 })}>My Podcasts</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 1 })}>Crypto</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 2 })}>Technology</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 3 })}>Science</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 4 })}>Business</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 5 })}>Travel</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 6 })}>Health</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 7 })}>Search Results</vaadin-tab>
                </vaadin-tabs>

                <div ?hidden=${tabIndex !== 0}>
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

                <pc-podcast-search-results .term=${'crypto'} .limit=${10} ?hidden=${tabIndex !== 1}></pc-podcast-search-results>
                <pc-podcast-search-results .term=${'technology'} .limit=${10} ?hidden=${tabIndex !== 2}></pc-podcast-search-results>
                <pc-podcast-search-results .term=${'science'} .limit=${10} ?hidden=${tabIndex !== 3}></pc-podcast-search-results>
                <pc-podcast-search-results .term=${'business'} .limit=${10} ?hidden=${tabIndex !== 4}></pc-podcast-search-results>
                <pc-podcast-search-results .term=${'travel'} .limit=${10} ?hidden=${tabIndex !== 5}></pc-podcast-search-results>
                <pc-podcast-search-results .term=${'health'} .limit=${10} ?hidden=${tabIndex !== 6}></pc-podcast-search-results>
                <pc-podcast-search-results .term=${searchTerm} .limit=${50} ?hidden=${tabIndex !== 7}></pc-podcast-search-results>                

            </div>
        `;
    });
    
    function searchInputKeyDown(e: any, element: any, update) {
        if (e.keyCode === 13) {
            const searchInput = element.querySelector('#search-input');
            const term = searchInput.value.split(' ').join('+');
            update({
                searchTerm: term,
                tabIndex: 6
            });
            // navigate(Store, `/podcast-search-results?term=${term}`);
        }
    }
});