import { customElement, html } from 'functional-element';
import { StorePromise } from '../state/store';
import './pc-loading';
import { 
    pcContainerStyles,
    titleTextLarge
 } from '../services/css';
 import './pc-podcast-row';

StorePromise.then((Store) => {
    customElement('pc-podcast-search-results', ({ 
        constructing, 
        update,
        term,
        previousTerm,
        loaded,
        searchResultsUI
    }) => {

        if (constructing) {
            return {
                term: null,
                previousTerm: null,
                loaded: false,
                searchResultsUI: ''
            };
        }

        if (term !== previousTerm) {
            update({
                previousTerm: term,
                loaded: false
            });
        }

        searchForPodcasts(update, term, loaded);

        return html`
            <style>
                .pc-podcast-search-results {
                    ${pcContainerStyles}
                }    

                .pc-podcast-search-results-title {
                    ${titleTextLarge}
                }
            </style>

            <div class="pc-podcast-search-results">
                <pc-loading
                    .hidden=${loaded}
                    .prename=${"pc-podcast-search-results-"}
                ></pc-loading>
                ${searchResultsUI}
            </div>
        `;
    });

    async function searchForPodcasts(update: any, term: any, loaded: any) {

        if (
            term === null ||
            term === undefined ||
            loaded === true
        ) {
            return;
        }

        const responseJSON = await getResponseJSON(term);

        if (responseJSON.results.length === 0) {
            update({
                loaded: true,
                previousTerm: term,
                searchResultsUI: html`
                    <div>
                        No results
                    </div>
                `
            });
        }
        else {
            const podcastFeedResultsPromises = responseJSON.results.map(async (searchResult: ItunesSearchResult) => {   

                const podcast: Readonly<Podcast> = {
                    feedUrl: searchResult.feedUrl,
                    artistName: searchResult.artistName,
                    title: searchResult.trackName,
                    description: '',
                    imageUrl: searchResult.artworkUrl60,
                    episodeGuids: [],
                    previousPayoutDate: 'NEVER',
                    latestTransactionHash: 'NOT_SET',
                    ethereumAddress: 'NOT_FOUND',
                    ensName: 'NOT_FOUND',
                    email: 'NOT_SET',
                    timeListenedTotal: 0,
                    timeListenedSincePreviousPayoutDate: 0,
                    lastStartDate: 'NEVER'
                };

                return html`
                    <pc-podcast-row
                        .podcast=${podcast}
                        .controls=${true}
                        .options=${true}
                    ></pc-podcast-row>                      
                `;
            });

            const podcastFeedResults = await Promise.all(podcastFeedResultsPromises);

            update({
                loaded: true,
                previousTerm: term,
                searchResultsUI: html`
                    <div class="pc-podcast-search-results-title">Search results</div>
                    ${podcastFeedResults}
                `
            });
        }
    }

    async function getResponseJSON(term: string) {
        if (
            term.startsWith('https://') ||
            term.startsWith('http://')
        ) {
            return {
                results: [{
                    feedUrl: term
                }]
            };
        }
        else {
            const response = await window.fetch(`https://itunes.apple.com/search?country=US&media=podcast&term=${term}`);
            const responseJSON = await response.json();
            return responseJSON;
        }
    }
});