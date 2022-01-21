import {customElement, html} from "../_snowpack/pkg/functional-element.js";
import {StorePromise} from "../state/store.js";
import "./pc-loading.js";
import {
  pcContainerStyles,
  titleTextLarge,
  titleTextXLarge,
  standardTextContainer
} from "../services/css.js";
StorePromise.then((Store) => {
  customElement("pc-not-verified-help", ({
    constructing,
    connecting,
    update,
    podcastEmail,
    feedUrl,
    loaded
  }) => {
    if (constructing) {
      return {
        podcastEmail: "NOT_SET",
        feedUrl: null,
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
    const subjectText = `Donating to your podcast with Podcrypt`;
    const bodyText = `Hi,

I've been listening to your podcast on podcrypt.app.
            
Unfortunately, I can't send you ETH donations because your podcast isn't verified: https://ovwc5-5yaaa-aaaae-qaa5a-cai.ic0.app/podcast-overview?feedUrl=${feedUrl}

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
                    .hidden=${loaded}
                    .prename=${"pc-not-verified-help-"}
                ></pc-loading>

                <div class="pc-not-verified-title-text-x-large">Podcast not verified</div>

                <br>

                <div class="pc-not-verified-secondary-text">
                    No Ethereum address was found for this podcast.
                    You can help by contacting the podcast owner and asking them to add their Ethereum address to their main podcast description.
                    An example of what you could say is included below.
                </div>

                <br>

                ${podcastEmail !== "NOT_SET" ? html`
                            <div class="pc-not-verified-secondary-text">
                                <a href="mailto:${podcastEmail}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}">Click here to send this email from your email app</a>
                            </div>

                            <br>
                        ` : html``}

                ${podcastEmail !== "NOT_SET" ? html`
                            <div class="pc-not-verified-title-text-large">To</div> 
                            <br> 
                            <div class="pc-not-verified-secondary-text">${podcastEmail}</div>
                            <br>
                        ` : html``}

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
