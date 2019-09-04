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
        searchResultsUI,
        limit
    }) => {

        if (constructing) {
            return {
                term: null,
                limit: 50,
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

        searchForPodcasts(update, term, limit, loaded);

        return html`
            <style>
                .pc-podcast-search-results {
                    position: relative;
                }    
            </style>

            <div class="pc-podcast-search-results">
                ${searchResultsUI}
            </div>
        `;
    });

    async function searchForPodcasts(update: any, term: any, limit: number, loaded: any) {

        if (
            term === null ||
            term === undefined ||
            loaded === true
        ) {
            return;
        }

        const responseJSON = await getResponseJSON(term, limit);

        if (responseJSON.results.length === 0) {
            update({
                loaded: true,
                previousTerm: term,
                searchResultsUI: html`
                    <div style="padding: calc(10px + 1vmin)">
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
                    lastStartDate: 'NEVER',
                    paymentsEnabled: false
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
                    ${podcastFeedResults}
                `
            });
        }
    }

    async function getResponseJSON(term: string, limit: number) {
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
            const response = await window.fetch(`https://itunes.apple.com/search?country=US&media=podcast&term=${term}&limit=${limit}`);
            const responseJSON = await response.json();
            return responseJSON;
        }
    }
});