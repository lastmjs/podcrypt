import { customElement, html } from 'functional-element';
import './pc-loading';
import {
    pcContainerStyles,
    titleTextLarge,
    titleTextXLarge,
    standardTextContainer
} from '../services/css';

customElement('pc-contact', ({ constructing, connecting, update, loaded }) => {

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

            <div class="pc-contact-title-text-large">OpenChat</div>

            <br>

            <div class="pc-contact-secondary-text">
                <a href="https://6hsbt-vqaaa-aaaaf-aaafq-cai.ic0.app/#/ahst4-sqaaa-aaaaf-ablbq-cai" target="_blank">https://6hsbt-vqaaa-aaaaf-aaafq-cai.ic0.app/#/ahst4-sqaaa-aaaaf-ablbq-cai</a>
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

            <div class="pc-contact-secondary-text"><a href="mailto:jordan.michael.last@gmail.com">jordan.michael.last@gmail.com</a></div>
            

        </div>
    `;
});