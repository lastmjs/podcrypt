import { customElement, html } from 'functional-element';
import './pc-loading';
import {
    pcContainerStyles,
    titleTextMedium,
    titleTextLarge,
    titleTextXLarge,
    standardTextContainer
} from '../services/css';
import '../podcrypt-button';
import {
    navigate
} from '../services/utilities';
import {
    StorePromise
} from '../state/store';

StorePromise.then((Store) => {

    customElement('pc-about', ({ constructing, connecting, update, loaded }) => {
    
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
                .pc-about-container {
                    ${pcContainerStyles}
                }
    
                .pc-about-title-text-x-large {
                    ${titleTextXLarge}
                }
    
                .pc-about-title-text-large {
                    ${titleTextLarge}
                }
    
                .pc-about-title-text-medium {
                    ${titleTextMedium}
                }
    
                .pc-about-secondary-text {
                    ${standardTextContainer}
                }
            </style>
    
            <div class="pc-about-container">
                <pc-loading
                    .hidden=${loaded}
                    .prename=${"pc-about-"}
                ></pc-loading>
    
                <div class="pc-about-title-text-x-large">About Podcrypt</div>
    
                <br>
    
                <div class="pc-about-secondary-text">
                    Podcrypt allows you to listen to and optionally donate back to podcasts automatically, fairly, and peer-to-peer.
                </div>
    
                <br>
    
                <div id="podcast-listeners" class="pc-about-title-text-large">Podcast listeners</div>
    
                <br>
    
                <div class="pc-about-secondary-text">
                    You can listen to podcasts for free, just search for your favorites in the <a href="javascript:void" @click=${() => navigate(Store, '/')}>Podcasts</a> section.
                </div>
    
                <br>
    
                <div class="pc-about-secondary-text">
                    <div>If you want to start donating:</div>
                    <ul>
                        <li>Go to your <a href="javascript:void" @click=${() => navigate(Store, '/wallet')}>Podcrypt Wallet</a></li>
                        <li>Buy or receive ETH</li>
                        <li>Choose a donation amount</li>
                        <li>Choose a payout interval</li>
                        <li>Get listening. Payouts will occur automatically</li>
                    </ul>
                </div>
    
                <br>
    
                <div id="podcasters" class="pc-about-title-text-large">Podcasters</div>
    
                <br>
    
                <div class="pc-about-secondary-text">
                    To start receiving donations, put your Ethereum address or ENS name into the main description of your podcast (not into episode descriptions). If you don't already have an Ethereum address from somewhere like <a href="https://www.coinbase.com" target="_blank">Coinbase</a> or <a href="https://metamask.io/" target="_blank">MetaMask</a>, you can use the one that Podcrypt generates for you and stores locally on your device. Here it is:    
                </div>

                <br>

                <div class="pc-about-secondary-text">${Store.getState().ethereumAddress}</div>

                <br>
    
                <div class="pc-about-secondary-text">
                    Once verified, encourage your audience to listen to the show on Podcrypt. Navigate to the ... menu of your podcast on Podcrypt to copy a shareable URL. Navigate to the ... menu of your episodes on Podcrypt to copy a shareable URL. You can place these URLs into your main and episode descriptions for your podcast.
                </div>
    
                <br>

                <div class="pc-about-secondary-text">Once you start receiving ETH, you can use an exchange such as <a href="https://www.coinbase.com" target="_blank">Coinbase</a>, <a href="https://www.kraken.com" target="_blank">Kraken</a>, or <a href="https://gemini.com" target="_blank">Gemini</a> to convert your ETH into good ol' United States Dollars.</div>

                <br>
    
                <podcrypt-button></podcrypt-button>
    
                <br>
                <br>
    
                <div class="pc-about-secondary-text">You can embed a "Donate With Podcrypt" button on your website. Just put the following script element into the head or body of your website:</div>
                
                <br>
    
                <div class="pc-about-secondary-text">
                    &#x3C;script type=&#x22;module&#x22; src=&#x22;https://podcrypt.app/podcrypt-button.js&#x22;&#x3E;&#x3C;/script&#x3E;
                </div>
    
                <br>
    
                <div class="pc-about-secondary-text">
                    Then place the button anywhere you like, replacing the href value with the actual URL to your podcast or episode on Podcrypt:
                </div>
    
                <br>
    
                <div class="pc-about-secondary-text">
                    &#x3C;podcrypt-button href=&#x22;the-url-to-your-podcast-or-episode&#x22;&#x3E;&#x3C;/podcrypt-button&#x3E;
                </div>

                <br>

                <div id="roadmap" class="pc-about-title-text-large">Roadmap</div>
    
                <br>

                <div class="pc-about-secondary-text">
                    This roadmap is subject to change at any time, but is a good reflection of Podcrypt's current course:
                </div>

                <br>

                <div class="pc-about-secondary-text">
                    <ul>
                        <li>
                            Q3 2019
                            <ul>
                                <li>Enable crypto purchases with debit card or bank account</li>
                                <li>Start <a href="https://makerdao.com/en/dai" target="_blank">DAI</a> integration</li>
                            </ul>
                        </li>

                        <li>
                            Q4 2019
                            <ul>
                                <li>Finish <a href="https://makerdao.com/en/dai" target="_blank">DAI</a> integration</li>
                                <li><a href="https://www.coinbase.com/usdc" target="_blank">USDC</a> integration</li>
                                <li>Bitcoin integration</li>
                                <li>Send funds from wallet</li>
                                <li>Manual one-off podcast tips</li>
                                <li>Configurable podcast payout weights per unit of time</li>
                                <li>Encrypted cloud backups/multi-device unified accounts</li>
                                <li>Robust security with detailed explanations</li>
                                <li>Release whitepaper</li>
                            </ul>
                        </li>

                        <li>
                            2020
                            <ul>
                                <li>Multi-Collateral DAI integration</li>
                                <li>Arbitrary custom playlists</li>
                                <li>Perks for those who donate (exclusive content, early releases, podcast tokens, etc)</li>
                                <li>Allow users to sell their own data</li>
                                <li>Podcast crowdfunding</li>
                                <li>Decentralized podcast directory</li>
                            </ul>
                        </li>
                    </ul>
                </div>

            </div>
        `;
    });
});
