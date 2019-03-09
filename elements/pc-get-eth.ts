import { customElement, html } from 'functional-element';
import { pcContainerStyles } from '../services/css';
import { StorePromise } from '../services/store';

StorePromise.then((Store) => {
    customElement('pc-get-eth', () => {
        return html`
            <style>
                .pc-get-eth-container {
                    ${pcContainerStyles}
                }
            </style>
    
            <div class="pc-get-eth-container">
                <h2>Get ETH</h2>

                <p>There are two main ways to get ETH to your Podcrypt wallet:</p>
                <ul>
                    <li>Buy ETH from within Podcrypt or from an exchange</li>
                    <li>Send ETH from another wallet</li>
                </ul>

                <h3>Buy ETH</h3>

                <h4>Debit card</h4>

                <p>Buying ETH directly from Podcrypt with a debit card is not yet implemented, but is on the horizon.</p>

                <h4>Exchange</h4>

                <p>You can buy ETH on an exchange such as <a href="https://www.coinbase.com" target="_blank">Coinbase</a>.</p>

                <h3>Send ETH</h3>

                <p>If you have access to an Ethereum wallet that already has ETH, then you can use the following address to send ETH to your Podcrypt wallet:</p>
                <p style="word-wrap: break-word">${Store.getState().ethereumAddress}</p>
            </div>
        `;
    });
});