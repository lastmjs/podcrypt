import {
  html,
  render as litRender
} from "../_snowpack/pkg/lit-html.js";
import {StorePromise} from "../state/store.js";
import {get} from "../_snowpack/pkg/idb-keyval.js";
import {
  standardTextContainer,
  secondaryTextSmall
} from "../services/css.js";
StorePromise.then((Store) => {
  class PCShowMnemonicPhrase extends HTMLElement {
    constructor() {
      super();
      Store.subscribe(async () => litRender(await this.render(Store.getState()), this));
    }
    connectedCallback() {
      setTimeout(() => {
        Store.dispatch({
          type: "RENDER"
        });
      });
    }
    mnemonicPhraseWarningInputChanged(e) {
      Store.dispatch({
        type: "SET_MNEMONIC_PHRASE_WARNING_CHECKBOX_CHECKED",
        checked: e.target.checked
      });
      Store.dispatch({
        type: "SET_WALLET_CREATION_STATE",
        walletCreationState: "CREATED"
      });
    }
    async render(state) {
      const mnemonicPhrase = await get("ethereumMnemonicPhrase");
      return html`
                <style>
                    .pc-wallet-secondary-text-without-container {
                        ${secondaryTextSmall}
                    }

                    .pc-wallet-secondary-text {
                       ${standardTextContainer}
                    }

                </style>

                <div>
                    <br>
                    <div class="pc-wallet-secondary-text-without-container">Your secret 12 word phrase:</div>

                    <br>

                    <div class="pc-wallet-secondary-text">${mnemonicPhrase}</div>
                    
                    <br>
                    
                    <div class="pc-wallet-secondary-text-without-container">You should immediately store this phrase somewhere safe. If something terrible happens to your Podcrypt wallet, you may be able to use this phrase to restore it.</div>
                    
                    <br>

                    <div class="pc-wallet-secondary-text-without-container">If you do not immediately store this phrase somewhere safe, you are more likely to lose any money that you send to Podcrypt.</div>
                    
                    <br>

                    <div class="pc-wallet-secondary-text">
                        <input 
                            type="checkbox"
                            @change=${(e) => this.mnemonicPhraseWarningInputChanged(e)}
                            .checked=${state.mnemonicPhraseWarningCheckboxChecked}
                        >
                        I understand
                    </div>
                </div>
            `;
    }
  }
  window.customElements.define("pc-show-mnemonic-phrase", PCShowMnemonicPhrase);
});
