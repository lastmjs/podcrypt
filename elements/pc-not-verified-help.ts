import { customElement, html } from 'functional-element';
import { StorePromise } from '../services/store';
import './pc-loading';
import {
    pcContainerStyles,
    titleTextLarge,
    titleTextXLarge,
    standardTextContainer
} from '../services/css';

StorePromise.then((Store) => {
    customElement('pc-not-verified-help', ({ constructing, connecting, props, update }) => {

        if (constructing) {
            return {
                podcastEmail: null,
                feedUrl: null,
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

        const subjectText: string = `Donating to your podcast with Podcrypt`;
        const bodyText: string = `
Hi,

I've been listening to your podcast on podcrypt.app.
            
Unfortunately, I can't send you ETH donations because your podcast isn't verified: https://podcrypt.app/podcast-overview?feedUrl=${props.feedUrl}

To get verified all you have to do is put your Ethereum address or ENS name into your podcast's main description.
        
Would you consider doing this? You'd at least get some donations from me.

Thanks!
        `;
    
        return html`
            <style>
                .pc-not-verified-help-container {
                    ${pcContainerStyles}
                }

                .pc-not-verified-title-text-x-large {
                    ${titleTextXLarge}
                }

                .pc-not-verified-title-text-large {
                    ${titleTextLarge}
                }

                .pc-not-verified-secondary-text {
                    ${standardTextContainer}
                }
            </style>
    
            <div class="pc-not-verified-help-container">
                <pc-loading
                    .hidden=${props.loaded}
                    .prefix=${"pc-not-verified-help-"}
                ></pc-loading>

                <div class="pc-not-verified-title-text-x-large">Podcast not verified</div>

                <br>

                <div class="pc-not-verified-secondary-text">
                    No Ethereum address was found for this podcast.
                    You can help by contacting the podcast owner and asking them to add their Ethereum address to their main podcast description.
                    An example of what you could say is included below.
                </div>

                <br>

                ${
                    props.podcastEmail ? 
                        html`
                            <div class="pc-not-verified-secondary-text">
                                <a href="mailto:${props.podcastEmail}?subject=${subjectText}&body=${bodyText}">Click here to send this email from your email app</a>
                            </div>

                            <br>
                        ` : 
                        html``
                }

                ${
                    props.podcastEmail ? 
                        html`
                            <div class="pc-not-verified-title-text-large">To</div> 
                            <br> 
                            <div class="pc-not-verified-secondary-text">${props.podcastEmail}</div>
                            <br>
                        ` : 
                        html``
                    }

                <div class="pc-not-verified-title-text-large">Subject</div>

                <br>

                <div class="pc-not-verified-secondary-text">${subjectText}</div>
                
                <br>

                <div class="pc-not-verified-title-text-large">Body</div>

                <br>
                
                <div class="pc-not-verified-secondary-text" style="white-space: pre-wrap;">${bodyText}</div>

            </div>
        `;
    });
});