import { 
    html,
    render as litRender,
    TemplateResult
} from 'lit-html';
import { StorePromise } from '../state/store';
import './pc-episode-row';
import { 
    pcContainerStyles,
    standardTextContainer,
    titleTextXLarge
} from '../services/css';
import {
    bytesToMegabytes
} from '../services/utilities'

StorePromise.then((Store) => {

    class PCDownloads extends HTMLElement {
        constructor() {
            super();
            Store.subscribe(async () => litRender(await this.render(Store.getState()), this));
        }

        connectedCallback() {
            setTimeout(() => {
                Store.dispatch({
                    type: 'RENDER'
                });
            });
        }

        async render(state: Readonly<State>): Promise<Readonly<TemplateResult>> {

            const episodes: ReadonlyArray<Episode> = Object.values(state.episodes);
            const downloadedEpisodes: ReadonlyArray<Episode> = episodes.filter((episode: Readonly<Episode>) => {
                return episode.downloadState === 'DOWNLOADED' || episode.downloadState === 'DOWNLOADING';
            });

            const { quota, usage } = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : {
                quota: 'NOT_SUPPORTED',
                usage: 'NOT_SUPPORTED'
            };

            const storageUsed: number | 'NOT_SUPPORTED' = usage === 'NOT_SUPPORTED' || usage === undefined ? 'NOT_SUPPORTED' : bytesToMegabytes(usage);
            const storageAvailable: number | 'NOT_SUPPORTED' = quota === 'NOT_SUPPORTED' || quota === undefined ? 'NOT_SUPPORTED' : bytesToMegabytes(quota);

            return html`
                <style>
                    .pc-downloads-container {
                        ${pcContainerStyles}
                    }

                    .pc-downloads-title {
                        ${titleTextXLarge}
                    }

                    .pc-downloads-quota-text {
                        ${standardTextContainer}
                    }
                </style>

                <div class="pc-downloads-container">
                    <div class="pc-downloads-title">Downloads</div>
                    
                    <br>

                    ${
                        storageUsed !== 'NOT_SUPPORTED' && storageAvailable !== 'NOT_SUPPORTED' ? html`
                            <div class="pc-downloads-quota-text">
                                <div>Storage used: ${storageUsed} MB</div>
                                <br>
                                <div>Storage available: ${storageAvailable} MB</div>
                            </div>
                            <br>
                        ` : ''
                    }

                    ${downloadedEpisodes.map((episode: Readonly<Episode>) => {
                        // TODO why do we have to pass the podcast into the pc-episode-row?
                        // TODO shouldn't it be able to grab the podcast automatically?
                        const podcast: Readonly<Podcast> = state.podcasts[episode.feedUrl];
                        return html`
                            <pc-episode-row
                                .podcast=${podcast}
                                .episode=${episode}
                                .play=${true}
                                .date=${true}
                                .options=${true}
                                .podcastTitle=${true}
                            ></pc-episode-row>
                        `;
                    })}
                </div>
            
            `;
        }
    }

    window.customElements.define('pc-downloads', PCDownloads);
});