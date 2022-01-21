import {customElement, html} from "../_snowpack/pkg/functional-element.js";
import "./pc-loading.js";
import {
  pcContainerStyles,
  titleTextLarge,
  titleTextXLarge,
  standardTextContainer
} from "../services/css.js";
customElement("pc-contact", ({constructing, connecting, update, loaded}) => {
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
            .pc-contact-container {
                ${pcContainerStyles}
            }

            .pc-contact-title-text-x-large {
                ${titleTextXLarge}
            }

            .pc-contact-title-text-large {
                ${titleTextLarge}
            }

            .pc-contact-secondary-text {
                ${standardTextContainer}
            }
        </style>

        <div class="pc-contact-container">
            <pc-loading
                .hidden=${loaded}
                .prename=${"pc-contact-"}
            ></pc-loading>

            <div class="pc-contact-title-text-x-large">Contact</div>

            <br>

            <div class="pc-contact-secondary-text">Bugs, errors, issues, suggestions? Reach out if you need something:</div>

            <br>

            <div class="pc-contact-title-text-large">Telegram</div>

            <br>

            <div class="pc-contact-secondary-text">
                <a href="https://t.me/podcrypt" target="_blank">t.me/podcrypt</a>
            </div>

            <br>

            <div class="pc-contact-title-text-large">Twitter</div>

            <br>

            <div class="pc-contact-secondary-text">
                <a href="https://twitter.com/lastmjs" target="_blank">@lastmjs</a>
            </div>

            <br>

            <div class="pc-contact-title-text-large">Email</div>
            
            <br>

            <div class="pc-contact-secondary-text"><a href="mailto:jordanlast@podcrypt.app">jordanlast@podcrypt.app</a></div>
            

        </div>
    `;
});
