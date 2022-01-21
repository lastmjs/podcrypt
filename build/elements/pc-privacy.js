import {customElement, html} from "../_snowpack/pkg/functional-element.js";
import "./pc-loading.js";
import {
  pcContainerStyles,
  titleTextXLarge,
  standardTextContainer
} from "../services/css.js";
customElement("pc-privacy", ({constructing, connecting, update, loaded}) => {
  if (constructing) {
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
            .pc-privacy-container {
                ${pcContainerStyles}
            }

            .pc-privacy-title-text-x-large {
                ${titleTextXLarge}
            }

            .pc-privacy-secondary-text {
                ${standardTextContainer}
            }
        </style>

        <div class="pc-privacy-container">
            <pc-loading
                .hidden=${loaded}
                .prename=${"pc-privacy-"}
            ></pc-loading>

            <div class="pc-privacy-title-text-x-large">Privacy</div>

            <br>

            <div class="pc-privacy-secondary-text">Podcrypt's privacy philosophy is to collect as little personal data from its users as is feasible.</div>

            <br>

            <div class="pc-privacy-secondary-text">Podcrypt essentially collects and records nothing through the app directly. All Ethereum transactions sent from Podcrypt are pseudonymous. It may be possible for you to be identified by your transactions, but not without extra information not found within the transactions themselves.</div>
            
            <br>
            
            <div class="pc-privacy-secondary-text">Your IP address may be recorded by third-party APIs that Podcrypt utilizes. Cookies may also be set on your client by these third-party APIs.</div>
            
            <br>
            
            <div class="pc-privacy-secondary-text">You can see a list of most of Podcrypt's third-party APIs in the <a href="credit">Credits</a> section.</div>
        </div>
    `;
});
