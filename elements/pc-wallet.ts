import { customElement, html } from 'functional-element';
import { TemplateResult } from 'lit-html';
import { pcContainerStyles } from '../services/css';
import { StorePromise } from '../services/store';
import {
    calculateTotalTimeForPodcastDuringCurrentIntervalInMilliseconds,
    calculatePayoutAmountForPodcastDuringCurrentIntervalInUSD,
    calculateProportionOfTotalTimeForPodcastDuringCurrentInterval
} from '../services/podcast-calculations';
import {
    getNextPayoutDateInMilliseconds,
    getPayoutTargetInETH,
    payout
} from '../services/payout-calculations';
import {
    loadEthereumAccountBalance,
    loadCurrentETHPriceInUSDCents,
    getBalanceInUSD,
    getBalanceInETH,
    createWallet
} from '../services/balance-calculations';

const ethersProvider = new ethers.providers.EtherscanProvider('ropsten');

StorePromise.then((Store) => {
    customElement('pc-wallet', ({ constructing, update }) => {
        if (constructing) {
            Store.subscribe(update);

            loadEthereumAccountBalance(Store, ethersProvider);
            loadCurrentETHPriceInUSDCents(Store);
        }

        return html`
            <style>
                .pc-wallet-container {
                    ${pcContainerStyles}
                }
    
                .pc-wallet-podcast-item {
                    box-shadow: 0px 0px 5px grey;
                    padding: 2%;
                    margin-top: 2%;
                    display: flex;
                    justify-content: center;
                    /* align-items: center; */
                }

                .pc-wallet-podcast-item-text {
                    font-size: calc(12px + 1vmin);
                    text-overflow: ellipsis;
                    flex: 1;
                    cursor: pointer;
                    font-weight: bold;
                }
            </style>
    
            <div class="pc-wallet-container">
                ${
                    Store.getState().walletCreationState === 'CREATED' ? 
                        walletUI() :
                        Store.getState().walletCreationState === 'CREATING' ?
                            html`<div>Creating wallet...</div>` :
                            walletWarnings()
                }
            </div>
        `;
    })

    function walletUI(): Readonly<TemplateResult> {
        const payoutTargetInETH: ETH | 'Loading...' = getPayoutTargetInETH(Store);
        const payoutTargetInUSDCents: USDCents = Store.getState().payoutTargetInUSDCents;
        const payoutTargetInUSD: USD = payoutTargetInUSDCents / 100;
        const nextPayoutLocaleDateString: string = new Date(Store.getState().nextPayoutDateInMilliseconds).toLocaleDateString()
        const payoutIntervalInDays: Days = Store.getState().payoutIntervalInDays;

        return html`
            <h3>Public key</h3>

            <div
                style="word-wrap: break-word;"
            >
                ${Store.getState().ethereumAddress}
            </div>

            <h3>Balance</h3>

            <div
                style="font-size: calc(15px + 1vmin);"
            >
                USD: ${getBalanceInUSD(Store)}
            </div>

            <br>

            <div
                style="font-size: calc(15px + 1vmin);"
            >
                ETH: ${getBalanceInETH(Store)}
            </div>

            <h3>
                Payout target
            </h3>

            <div style="font-size: calc(15px + 1vmin);">
                USD:
                <input
                    type="number"
                    value=${payoutTargetInUSD.toString()}
                    @input=${payoutTargetInUSDCentsInputChanged}
                    style="font-size: calc(15px + 1vmin); border: none; border-bottom: 1px solid grey;"
                    min="0"
                    max="100"
                >
            </div>

            <br>

            <div style="font-size: calc(15px + 1vmin);">ETH: ${payoutTargetInETH}</div>

            <h3>
                Payout interval
            </h3>

            <div style="font-size: calc(15px + 1vmin);">
                Days:
                <input 
                    type="number"
                    value=${payoutIntervalInDays.toString()}
                    @input=${payoutIntervalInDaysInputChanged}
                    style="font-size: calc(15px + 1vmin); border: none; border-bottom: 1px solid grey"
                    min="1"
                    max="30"
                >
            </div>

            <h3>
                Next payout date
            </h3>

            <div style="font-size: calc(15px + 1vmin);">${nextPayoutLocaleDateString}</div>

            <br>

            <button @click=${() => payout(Store, ethersProvider)}>Manual payout</button>

            <br>
            <br>
            <hr>
            <br>

            ${Object.values(Store.getState().podcasts).map((podcast: Podcast) => {
                const totalTimeForPodcastDuringCurrentIntervalInMilliseconds: Milliseconds = calculateTotalTimeForPodcastDuringCurrentIntervalInMilliseconds(Store.getState(), podcast);
                const totalTimeForPodcastDuringCurrentIntervalInMinutes: Minutes = Math.floor(totalTimeForPodcastDuringCurrentIntervalInMilliseconds / 60000);
                const secondsRemainingForPodcastDuringCurrentInterval: Seconds = Math.round((totalTimeForPodcastDuringCurrentIntervalInMilliseconds % 60000) / 1000);

                const payoutAmountForPodcastDuringCurrentIntervalInUSD: USD = calculatePayoutAmountForPodcastDuringCurrentIntervalInUSD(Store.getState(), podcast);
                const percentageOfTotalTimeForPodcastDuringCurrentInterval: number = calculateProportionOfTotalTimeForPodcastDuringCurrentInterval(Store.getState(), podcast) * 100;

                const ethereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED' = podcast.ethereumAddress;

                return html`
                    <div class="pc-wallet-podcast-item">
                        <div>
                            <img src="${podcast.imageUrl}">
                        </div>
                        <div style="display:flex: flex-direction: column; padding-left: 5%">
                            <div class="pc-wallet-podcast-item-text">${podcast.title}</div>
                            <div>
                                ${
                                    ethereumAddress === 'NOT_FOUND' ? 
                                        html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${() => alert(`No Ethereum address was found for this podcast. You can help by contacting the podcast owner and asking them to add their Ethereum address to their main podcast description.${podcast.email === 'NOT_SET' ? '' : ` Their email is: ${podcast.email}`}`)}>Not verified - click to help</button>` :
                                        ethereumAddress === 'MALFORMED' ?
                                            html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${() => alert(`The Ethereum address for this podcast is malformed. You can help by contacting the podcast owner and asking them to add a correctly formatted Ethereum address to their main podcast description.${podcast.email === 'NOT_SET' ? '' : ` Their email is: ${podcast.email}`}`)}>Not verified - click to help</button>` :
                                            html`<button style="color: green; border: none; padding: 5px; margin: 5px" @click=${() => alert(`This podcast's Ethereum address: ${podcast.ethereumAddress}`)}>Verified</button>`}
                            </div>
                            <br>
                            <div>$${payoutAmountForPodcastDuringCurrentIntervalInUSD.toFixed(2)}, ${percentageOfTotalTimeForPodcastDuringCurrentInterval.toFixed(1)}%, ${totalTimeForPodcastDuringCurrentIntervalInMinutes} min ${secondsRemainingForPodcastDuringCurrentInterval} sec</div>
                            <br>
                            <div>Last payout: ${podcast.previousPayoutDateInMilliseconds === 'NEVER' ? 'never' : html`<a href="https://ropsten.etherscan.io/tx/${podcast.latestTransactionHash}" target="_blank">${new Date(podcast.previousPayoutDateInMilliseconds).toLocaleDateString()}</a>`}</div>
                            <div>Next payout: ${nextPayoutLocaleDateString}</div>
                        </div>
                    </div>
                `;
            })}
<!-- 
            <div class="pc-wallet-podcast-item">
                <h4>Podcrypt</h4>
                10%
            </div>

            <hr> -->
        `;
    }

    function walletWarnings() {
        return html`
            <div>I understand the following:</div>
            <br>
            <div>
                <input 
                    type="checkbox"
                    @input=${checkbox1InputChanged}
                    .checked=${Store.getState().warningCheckbox1Checked}
                >
                Podcrypt is offered to me under the terms of the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT license</a>
            </div>
            <div>
                <input
                    type="checkbox"
                    @input=${checkbox2InputChanged}
                    .checked=${Store.getState().warningCheckbox2Checked}
                >
                This is pre-alpha software
            </div>
            <div>
                <input
                    type="checkbox"
                    @input=${checkbox3InputChanged}
                    .checked=${Store.getState().warningCheckbox3Checked}
                >
                Anything could go wrong
            </div>
            <div>
                <input
                    type="checkbox"
                    @input=${checkbox4InputChanged}
                    .checked=${Store.getState().warningCheckbox4Checked}
                >
                My Podcrypt data will probably be wiped regularly during the pre-alpha
            </div>
            <div>
                <input
                    type="checkbox"
                    @input=${checkbox5InputChanged}
                    .checked=${Store.getState().warningCheckbox5Checked}
                >
                Podcrypt Pre-alpha uses the Ropsten test network for payments. I should NOT send real ETH to Podcrypt Pre-alpha.
            </div>
            <br>
            <button @click=${createWalletClick}>Create Wallet</button>
        `;
    }

    function createWalletClick() {
        const warningsAccepted = 
            Store.getState().warningCheckbox1Checked &&
            Store.getState().warningCheckbox2Checked &&
            Store.getState().warningCheckbox3Checked &&
            Store.getState().warningCheckbox4Checked &&
            Store.getState().warningCheckbox5Checked;

        if (!warningsAccepted) {
            alert('Silly you, you must understand');
        }
        else {
            createWallet(Store, ethersProvider);
        }
    }

    function checkbox1InputChanged(e: any) {
        Store.dispatch({
            type: 'SET_WARNING_CHECKBOX_1_CHECKED',
            checked: e.target.checked
        });
    }

    function checkbox2InputChanged(e: any) {
        Store.dispatch({
            type: 'SET_WARNING_CHECKBOX_2_CHECKED',
            checked: e.target.checked
        });
    }

    function checkbox3InputChanged(e: any) {
        Store.dispatch({
            type: 'SET_WARNING_CHECKBOX_3_CHECKED',
            checked: e.target.checked
        });
    }

    function checkbox4InputChanged(e: any) {
        Store.dispatch({
            type: 'SET_WARNING_CHECKBOX_4_CHECKED',
            checked: e.target.checked
        });
    }

    function checkbox5InputChanged(e: any) {
        Store.dispatch({
            type: 'SET_WARNING_CHECKBOX_5_CHECKED',
            checked: e.target.checked
        });
    }

    function payoutIntervalInDaysInputChanged(e: any) {
        Store.dispatch({
            type: 'SET_PAYOUT_INTERVAL_IN_DAYS',
            payoutIntervalInDays: e.target.value
        });
    
        const nextPayoutDateInMilliseconds: Milliseconds = getNextPayoutDateInMilliseconds(Store);
    
        Store.dispatch({
            type: 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS',
            nextPayoutDateInMilliseconds
        });
    }
    
    async function payoutTargetInUSDCentsInputChanged(e: any) {
        await loadCurrentETHPriceInUSDCents(Store);
        Store.dispatch({
            type: 'SET_PAYOUT_TARGET_IN_USD_CENTS',
            payoutTargetInUSDCents: parseInt(e.target.value) * 100
        });
    }

    setInterval(() => {
        const currentLocaleDateString: string = new Date().toLocaleDateString();
        const nextPayoutLocaleDateString: string = new Date(Store.getState().nextPayoutDateInMilliseconds).toLocaleDateString();

        console.log('currentLocaleDateString', currentLocaleDateString);
        console.log('nextPayoutLocaleDateString', nextPayoutLocaleDateString);

        console.log('now milliseconds', new Date().getTime());
        console.log('nextPayoutDateInMilliseconds', Store.getState().nextPayoutDateInMilliseconds);

        if (
            new Date().getTime() >= Store.getState().nextPayoutDateInMilliseconds
        ) {
            payout(Store, ethersProvider);
        }
    }, 60000);
});