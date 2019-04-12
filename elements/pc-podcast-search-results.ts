import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import './pc-loading';
import { 
    pcContainerStyles,
    titleTextLarge
 } from '../services/css';
 import './pc-podcast-row';

StorePromise.then((Store) => {
    customElement('pc-podcast-search-results', ({ constructing, props, update }) => {

        if (constructing) {
            return {
                term: null,
                previousTerm: null,
                loaded: false,
                searchResultsUI: ''
            };
        }

        if (props.term !== props.previousTerm) {
            update({
                ...props,
                previousTerm: props.term,
                loaded: false
            });
        }

        searchForPodcasts(props, update);

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
                    .hidden=${props.loaded}
                    .prefix=${"pc-podcast-search-results-"}
                ></pc-loading>
                ${props.searchResultsUI}
            </div>
        `;
    });

    async function searchForPodcasts(props: any, update: any) {

        if (
            props.term === null ||
            props.term === undefined ||
            props.loaded === true
        ) {
            return;
        }

        const responseJSON = await getResponseJSON(props.term);

        if (responseJSON.results.length === 0) {
            update({
                ...props,
                loaded: true,
                previousTerm: props.term,
                searchResultsUI: html`
                    <div>
                        No results
                    </div>
                `
            });
        }
        else {
            const podcastFeedResultsPromises = responseJSON.results.map(async (searchResult: any) => {   

                const podcast: Readonly<Podcast> = {
                    feedUrl: searchResult.feedUrl,
                    artistName: searchResult.artistName,
                    title: searchResult.trackName,
                    description: '',
                    imageUrl: searchResult.artworkUrl60,
                    episodeGuids: [],
                    previousPayoutDateInMilliseconds: 'NEVER',
                    latestTransactionHash: null,
                    ethereumAddress: 'NOT_FOUND',
                    ensName: 'NOT_FOUND',
                    email: 'NOT_SET'
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
                ...props,
                loaded: true,
                previousTerm: props.term,
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