import { customElement, html } from 'functional-element';
import { StorePromise } from '../state/store';
import { 
    pcContainerStyles,
    pxMedium,
    color1Medium,
    pxLarge,
    alertPadding
 } from '../services/css';
import './pc-loading';
import './pc-podcast-row';
import '@vaadin/vaadin-tabs';
import './pc-podcast-search-results';
import './pc-podcast-row';

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
                    .hidden=${loading}
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
                    <vaadin-tab @click=${() => update({ tabIndex: 1 })}>Featured</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 2 })}>Crypto</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 3 })}>Technology</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 4 })}>Science</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 5 })}>Business</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 6 })}>Travel</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 7 })}>Health</vaadin-tab>
                    <vaadin-tab @click=${() => update({ tabIndex: 8 })}>Search Results</vaadin-tab>
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

                <div ?hidden=${tabIndex !== 1}>
                    <div style="color: grey; padding-top: calc(10px + 1vmin)">Featured podcasts are sponsors of Podcrypt</div>
                    <pc-podcast-row
                        .podcast=${{
                            feedUrl: 'http://feeds.soundcloud.com/users/soundcloud:users:440547243/sounds.rss',
                            artistName: 'Health Unchained Podcast',
                            title: 'Health Unchained Podcast',
                            description: '',
                            imageUrl: 'http://i1.sndcdn.com/avatars-000444462669-s38tlv-original.jpg',
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
                        }}
                        .controls=${true}
                        .options=${true}
                    >
                    </pc-podcast-row>

                    <pc-podcast-row
                        .podcast=${{
                            feedUrl: 'https://www.spreaker.com/show/2886866/episodes/feed',
                            artistName: 'Vocast',
                            title: 'Des Ondes Vocast',
                            description: '',
                            imageUrl: 'https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/4ac55801c6267ea462fd591a136ced4f.jpg',
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
                        }}
                        .controls=${true}
                        .options=${true}
                    >
                    </pc-podcast-row>

                    <pc-podcast-row
                        .podcast=${{
                            feedUrl: 'https://podcrypt.app/podcrypt-lectures-feed.xml',
                            artistName: 'Jordan Last',
                            title: 'Podcrypt Lectures',
                            description: '',
                            imageUrl: '../podcrypt-black-transparent.png',
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
                        }}
                        .controls=${true}
                        .options=${true}
                    >
                    </pc-podcast-row>

                    <pc-podcast-row
                        .podcast=${{
                            feedUrl: '',
                            artistName: 'Podcrypt',
                            title: 'Are you a podcaster interested in this spot? Click to claim it',
                            description: '',
                            imageUrl: '../podcrypt-black-transparent.png',
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
                        }}
                        .clickTemplate=${html`
                            <div style="${alertPadding}">
                                <p>This spot costs 175 DAI or USDC per month.</p>
                                <p>If you want it, send an email with the name of your podcast to <a href="mailto:jordanlast@podcrypt.app?subject=${encodeURIComponent('Interested in featured podcasts spot 4')}">jordanlast@podcrypt.app</a> with the subject "Interested in featured podcasts spot 4".</p>
                            </div>
                        `}
                    >
                    </pc-podcast-row>

                    <pc-podcast-row
                        .podcast=${{
                            feedUrl: '',
                            artistName: 'Podcrypt',
                            title: 'Are you a podcaster interested in this spot? Click to claim it',
                            description: '',
                            imageUrl: '../podcrypt-black-transparent.png',
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
                        }}
                        .clickTemplate=${html`
                            <div style="${alertPadding}">
                                <p>This spot costs 150 DAI or USDC per month.</p>
                                <p>If you want it, send an email with the name of your podcast to <a href="mailto:jordanlast@podcrypt.app?subject=${encodeURIComponent('Interested in featured podcasts spot 5')}">jordanlast@podcrypt.app</a> with the subject "Interested in featured podcasts spot 5".</p>
                            </div>
                        `}
                    >
                    </pc-podcast-row>

                    <pc-podcast-row
                        .podcast=${{
                            feedUrl: '',
                            artistName: 'Podcrypt',
                            title: 'Are you a podcaster interested in this spot? Click to claim it',
                            description: '',
                            imageUrl: '../podcrypt-black-transparent.png',
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
                        }}
                        .clickTemplate=${html`
                            <div style="${alertPadding}">
                                <p>This spot costs 125 DAI or USDC per month.</p>
                                <p>If you want it, send an email with the name of your podcast to <a href="mailto:jordanlast@podcrypt.app?subject=${encodeURIComponent('Interested in featured podcasts spot 6')}">jordanlast@podcrypt.app</a> with the subject "Interested in featured podcasts spot 6".</p>
                            </div>
                        `}
                    >
                    </pc-podcast-row>

                    <pc-podcast-row
                        .podcast=${{
                            feedUrl: '',
                            artistName: 'Podcrypt',
                            title: 'Are you a podcaster interested in this spot? Click to claim it',
                            description: '',
                            imageUrl: '../podcrypt-black-transparent.png',
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
                        }}
                        .clickTemplate=${html`
                            <div style="${alertPadding}">
                                <p>This spot costs 100 DAI or USDC per month.</p>
                                <p>If you want it, send an email with the name of your podcast to <a href="mailto:jordanlast@podcrypt.app?subject=${encodeURIComponent('Interested in featured podcasts spot 7')}">jordanlast@podcrypt.app</a> with the subject "Interested in featured podcasts spot 7".</p>
                            </div>
                        `}
                    >
                    </pc-podcast-row>

                    <pc-podcast-row
                        .podcast=${{
                            feedUrl: '',
                            artistName: 'Podcrypt',
                            title: 'Are you a podcaster interested in this spot? Click to claim it',
                            description: '',
                            imageUrl: '../podcrypt-black-transparent.png',
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
                        }}
                        .clickTemplate=${html`
                            <div style="${alertPadding}">
                                <p>This spot costs 75 DAI or USDC per month.</p>
                                <p>If you want it, send an email with the name of your podcast to <a href="mailto:jordanlast@podcrypt.app?subject=${encodeURIComponent('Interested in featured podcasts spot 8')}">jordanlast@podcrypt.app</a> with the subject "Interested in featured podcasts spot 8".</p>
                            </div>
                        `}
                    >
                    </pc-podcast-row>

                    <pc-podcast-row
                        .podcast=${{
                            feedUrl: '',
                            artistName: 'Podcrypt',
                            title: 'Are you a podcaster interested in this spot? Click to claim it',
                            description: '',
                            imageUrl: '../podcrypt-black-transparent.png',
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
                        }}
                        .clickTemplate=${html`
                            <div style="${alertPadding}">
                                <p>This spot costs 50 DAI or USDC per month.</p>
                                <p>If you want it, send an email with the name of your podcast to <a href="mailto:jordanlast@podcrypt.app?subject=${encodeURIComponent('Interested in featured podcasts spot 9')}">jordanlast@podcrypt.app</a> with the subject "Interested in featured podcasts spot 9".</p>
                            </div>
                        `}
                    >
                    </pc-podcast-row>

                    <pc-podcast-row
                        .podcast=${{
                            feedUrl: '',
                            artistName: 'Podcrypt',
                            title: 'Are you a podcaster interested in this spot? Click to claim it',
                            description: '',
                            imageUrl: '../podcrypt-black-transparent.png',
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
                        }}
                        .clickTemplate=${html`
                            <div style="${alertPadding}">
                                <p>This spot costs 25 DAI or USDC per month.</p>
                                <p>If you want it, send an email with the name of your podcast to <a href="mailto:jordanlast@podcrypt.app?subject=${encodeURIComponent('Interested in featured podcasts spot 10')}">jordanlast@podcrypt.app</a> with the subject "Interested in featured podcasts spot 10".</p>
                            </div>
                        `}
                    >
                    </pc-podcast-row>
                </div>

                ${tabIndex === 2 ? html`<pc-podcast-search-results .term=${'crypto'} .limit=${20}></pc-podcast-search-results>` : ''}
                ${tabIndex === 3 ? html`<pc-podcast-search-results .term=${'technology'} .limit=${20}></pc-podcast-search-results>` : ''}
                ${tabIndex === 4 ? html`<pc-podcast-search-results .term=${'science'} .limit=${20}></pc-podcast-search-results>` : ''}
                ${tabIndex === 5 ? html`<pc-podcast-search-results .term=${'business'} .limit=${20}></pc-podcast-search-results>` : ''}
                ${tabIndex === 6 ? html`<pc-podcast-search-results .term=${'travel'} .limit=${20}></pc-podcast-search-results>` : ''}
                ${tabIndex === 7 ? html`<pc-podcast-search-results .term=${'health'} .limit=${20}></pc-podcast-search-results>` : ''}
                ${tabIndex === 8 ? html`<pc-podcast-search-results .term=${searchTerm} .limit=${50}></pc-podcast-search-results>` : ''}

            </div>
        `;
    });
    
    function searchInputKeyDown(e: any, element: any, update) {
        if (e.keyCode === 13) {
            const searchInput = element.querySelector('#search-input');
            const term = searchInput.value.split(' ').join('+');
            update({
                searchTerm: term,
                tabIndex: 8
            });
        }
    }
});