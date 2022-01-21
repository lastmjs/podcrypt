import {html} from "../_snowpack/pkg/lit-html.js";
import {
  titleTextXLarge,
  standardTextContainer
} from "../services/css.js";
export const post = html`

    <style>
        .podcrypt-beta-title-text-x-large {
            ${titleTextXLarge}
        }

        .podcrypt-beta-standard-text {
            ${standardTextContainer}
        }


        
    </style>

    <div class="podcrypt-beta-title-text-x-large">
        Podcrypt Beta
    </div>

    <br>

    <div class="podcrypt-beta-standard-text">
        Podcrypt Beta is live now!
        In fact, if you're reading this you are already within the app.
        Start listening to some podcasts in the <a href="javascript:void">Podcasts section</a>.
    </div>
`;
