import { 
    html,
    render as litRender,
    TemplateResult
} from 'lit-html';
import { StorePromise } from '../state/store';
import { 
    standardTextContainer
 } from '../services/css';

StorePromise.then((Store) => {
    class PCWalletWarnings extends HTMLElement {

        constructor() {
            super();
            Store.subscribe(() => litRender(this.render(Store.getState()), this));
        }

        connectedCallback() {
            setTimeout(() => {
                Store.dispatch({
                    type: 'RENDER'
                });
            });
        }

        checkbox1InputChanged(e: any) {
            Store.dispatch({
                type: 'SET_WARNING_CHECKBOX_1_CHECKED',
                checked: e.target.checked
            });    
        }

        checkbox2InputChanged(e: any) {
            Store.dispatch({
                type: 'SET_WARNING_CHECKBOX_2_CHECKED',
                checked: e.target.checked
            });    
        }

        checkbox3InputChanged(e: any) {
            Store.dispatch({
                type: 'SET_WARNING_CHECKBOX_3_CHECKED',
                checked: e.target.checked
            });    
        }

        render(state: Readonly<State>): Readonly<TemplateResult> {
            return html`
                <style>
                    .pc-wallet-secondary-text {
                        ${standardTextContainer}
                    }
                </style>

                <div>
                    <div class="pc-wallet-secondary-text">I understand and agree to the following:</div>
                    <br>
                    <div class="pc-wallet-secondary-text">
                        <input 
                            type="checkbox"
                            @change=${(e: any) => this.checkbox1InputChanged(e)}
                            .checked=${state.warningCheckbox1Checked}
                        >
                        Podcrypt is offered to me under the terms of the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT license</a>, which essentially means I have a license to do whatever I like with Podcrypt, but there is no warranty as far as possible
                    </div>

                    <br>

                    <div class="pc-wallet-secondary-text">
                        <input
                            type="checkbox"
                            @change=${(e: any) => this.checkbox2InputChanged(e)}
                            .checked=${state.warningCheckbox2Checked}
                        >
                        I am responsible for and agree to use Podcrypt legally, including determining taxes and other potential legal implications
                    </div>

                    <div class="pc-wallet-secondary-text">
                        <input
                            type="checkbox"
                            @change=${(e: any) => this.checkbox3InputChanged(e)}
                            .checked=${state.warningCheckbox3Checked}
                        >
                        This is beta software
                    </div>

                </div>
            `;
        }
    }
    
    window.customElements.define('pc-wallet-warnings', PCWalletWarnings);
});
