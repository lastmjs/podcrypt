import {customElement, html} from "../_snowpack/pkg/functional-element.js";
import {StorePromise} from "../state/store.js";
import {
  pcContainerStyles,
  alertPadding
} from "../services/css.js";
import {createWallet} from "../services/balance-calculations.js";
import {navigate} from "../services/utilities.js";
import {pcAlert} from "./pc-modal.js";
StorePromise.then((Store) => {
  customElement("pc-restore-with-phrase", ({element}) => {
    return html`
            <style>
                .pc-restore-with-phrase-container {
                    ${pcContainerStyles}
                }

                .pc-restore-with-phrase-input {
                    width: 100%;
                    font-size: calc(15px + 1vmin);
                    border: none;
                    border-bottom: 1px solid grey;
                }
            </style>

            <div class="pc-restore-with-phrase-container">
                <input id="pc-restore-with-phrase-input" type="text" class="pc-restore-with-phrase-input" placeholder="Enter your 12 word secret phrase exactly">
                <br>
                <br>
                <button @click=${() => restoreWalletClick(element)}>Restore wallet</button>
            </div>
        `;
  });
  async function restoreWalletClick(element) {
    const pcRestoreWithPhraseInput = element.querySelector("#pc-restore-with-phrase-input");
    const mnemonicPhrase = pcRestoreWithPhraseInput.value;
    if (mnemonicPhrase.split(" ").length !== 12) {
      pcAlert(html`
                <div style="${alertPadding}">Your secret phrase must have exactly 12 words</div>
            `, Store.getState().screenType);
      return;
    }
    await createWallet(Store, mnemonicPhrase);
    navigate(Store, "/wallet");
  }
});
