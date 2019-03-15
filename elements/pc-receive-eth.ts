import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';
import { StorePromise } from '../services/store';
import './pc-loading';

StorePromise.then((Store) => {
    customElement('pc-receive-eth', ({ constructing, connecting, update, props }) => {

        if (constructing) {
            Store.subscribe(update);

            return {
                loaded: false
            };
        }

        if (connecting) {
            setTimeout(() => {
                update({
                    ...props,
                    loaded: true
                });
            });
        }

        return html`
            <style>
                .pc-receive-eth-container {
                    ${pcContainerStyles}
                }
            </style>
    
            <div class="pc-receive-eth-container">
                <pc-loading
                    .hidden=${props.loaded}
                    .prefix=${"pc-receive-eth-"}
                ></pc-loading>

                <h2>Receive ETH</h2>

                <p>Your Podcrypt Ethereum address:</p>

                <p style="font-weight: bold; word-wrap: break-word">${Store.getState().ethereumAddress}</p>

                <p>You can receive ETH in your Podcrypt wallet by sending it from another Ethereum wallet using the address above.</p>

                <p>You may already have an Ethereum wallet with an exchange such as <a href="https://www.coinbase.com" target="_blank">Coinbase</a>, or perhaps you have a browser wallet like <a href="https://metamask.io" target="_blank">MetaMask</a>.</p>

                <p>No matter your wallet, you can use your Podcrypt Ethereum address to receive ETH.</p>
            </div>
        `;
    });
});