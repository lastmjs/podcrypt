import { customElement, html } from 'functional-element';
import { StorePromise } from '../state/store';
import { pcContainerStyles } from '../services/css';
import { createWallet } from '../services/balance-calculations';
import { navigate } from '../services/utilities';

StorePromise.then((Store) => {
    customElement('pc-restore-with-phrase', ({ element }) => {
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

    // TODO put loading in
    async function restoreWalletClick(element: any) {
        const pcRestoreWithPhraseInput = element.querySelector('#pc-restore-with-phrase-input');
        const mnemonicPhrase: string = pcRestoreWithPhraseInput.value;

        if (mnemonicPhrase.split(' ').length !== 12) {
            alert('Your secret phrase must have exactly 12 words');
            return;
        }

        await createWallet(Store, mnemonicPhrase);
        navigate(Store, '/wallet');
    }
});