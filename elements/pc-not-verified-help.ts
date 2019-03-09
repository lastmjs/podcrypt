import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';
import { StorePromise } from '../services/store';

StorePromise.then((Store) => {
    customElement('pc-not-verified-help', ({ constructing, props }) => {

        if (constructing) {
            return {
                podcastEmail: null,
                feedUrl: null
            };
        }

        console.log(props);
    
        return html`
            <style>
                .pc-not-verified-help-container {
                    ${pcContainerStyles}
                }
            </style>
    
            <div class="pc-not-verified-help-container">
                <h2>Podcast not verified</h2>
                <p>
                    No Ethereum address was found for this podcast.
                    You can help by contacting the podcast owner and asking them to add their Ethereum address to their main podcast description.
                </p>
                <p>
                    You could say something like the following in an email:
                </p>

                ${props.podcastEmail ? html`<h3>To</h3> <p>${props.podcastEmail}</p>` : html``}

                <h3>Subject</h3>
                <p>I'd like to donate to your podcast</p>
                
                <h3>Body</h3>
                <p>Hi,</p>
                <p>
                    I've been using a podcast app called Podcrypt: https://podcrypt.app
                </p>
                <p style="overflow-wrap: break-word">
                    It allows me to send cryptocurrency donations to podcasts with an Ethereum address.
                    Your podcast does not have an Ethereum address in its main description.
                    As you can see, you are unverified: https://podcrypt.app/podcast-overview?feedUrl=${props.feedUrl}
                </p>
                <p>
                    To be able to receive donations, all you have to do is add your Ethereum address to your podcast's main description.
                    If you're unfamiliar with Ethereum, then Coinbase or MetaMask are good ways to get an address and start receiving donations.
                </p>
                <p>
                    Coinbase: https://www.coinbase.com
                </p>
                <p>
                    MetaMask: https://metamask.io
                </p>
    
                <p>Thanks!</p>
            </div>
        `;
    });
});