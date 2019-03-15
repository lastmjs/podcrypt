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
import { navigate } from '../services/utilities';
import '../node_modules/ethers/dist/ethers.min.js';
import BigNumber from "../node_modules/bignumber.js/bignumber";
import './pc-loading';

const ethersProvider = new ethers.providers.EtherscanProvider('ropsten');

StorePromise.then((Store) => {
    customElement('pc-wallet', ({ constructing, connecting, props, update }) => {
        if (constructing) {
            Store.subscribe(update);

            loadEthereumAccountBalance(Store, ethersProvider);
            loadCurrentETHPriceInUSDCents(Store);

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
                <pc-loading
                    .hidden=${props.loaded}
                    .prefix=${"pc-wallet-"}
                ></pc-loading>

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
        const payoutTargetInETH: ETH | 'Loading...' = getPayoutTargetInETH(Store) === 'Loading...' ? 'Loading...' : new BigNumber(getPayoutTargetInETH(Store)).toFixed(4);
        const payoutTargetInUSDCents: USDCents = Store.getState().payoutTargetInUSDCents;
        const payoutTargetInUSD: USDollars = new BigNumber(payoutTargetInUSDCents).dividedBy(100).toFixed(2);
        const nextPayoutLocaleDateString: string = new Date(new BigNumber(Store.getState().nextPayoutDateInMilliseconds).toNumber()).toLocaleDateString()
        const payoutIntervalInDays: Days = Store.getState().payoutIntervalInDays;

        const balanceInUSD: USDollars | 'Loading...' = getBalanceInUSD(Store) === 'Loading...' ? 'Loading...' : getBalanceInUSD(Store) === 'unknown' ? 'unknown' : new BigNumber(getBalanceInUSD(Store)).toFixed(2);
        const balanceInETH: ETH = new BigNumber(getBalanceInETH(Store)).toFixed(4);

        return html`
            <h3>Balance</h3>

            <div style="display: grid; grid-template-columns: 1fr 1fr">
                <div
                    style="display: flex; flex-direction: column; align-items: center; justify-content: center;"
                >
                    <div style="font-size: calc(30px + 1vmin);">${balanceInUSD}</div>
                    <div style="font-size: calc(15px + 1vmin); color: grey">USD</div>
                </div>

                <div
                    style="display: flex; flex-direction: column; align-items: center; justify-content: center;"
                >
                    <div style="font-size: calc(30px + 1vmin);">${balanceInETH}</div>
                    <div style="font-size: calc(15px + 1vmin); color: grey">ETH</div>
                </div>
            </div>

            <h3>
                Payout
            </h3>

            <div style="display: grid; grid-template-columns: 1fr 1fr; grid-row-gap: calc(30px + 1vmin)">
                <div
                    style="display: flex; flex-direction: column; align-items: center; justify-content: center;"
                >
                    <div style="font-size: calc(30px + 1vmin);">
                        <input
                            type="number"
                            value=${payoutTargetInUSD}
                            @input=${payoutTargetInUSDCentsInputChanged}
                            style="text-align: center; font-size: calc(30px + 1vmin); border: none; border-bottom: 1px solid grey;"
                            min="0"
                            max="100"
                            step="0.01"
                        >
                    </div>
                    <div style="font-size: calc(15px + 1vmin); color: grey">USD</div>
                </div>

                <div
                    style="display: flex; flex-direction: column; align-items: center; justify-content: center;"
                >
                    <div style="font-size: calc(30px + 1vmin);">${payoutTargetInETH}</div>
                    <div style="font-size: calc(15px + 1vmin); color: grey">ETH</div>
                </div>

                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <input 
                        type="number"
                        value=${payoutIntervalInDays}
                        @input=${payoutIntervalInDaysInputChanged}
                        style="text-align: center; font-size: calc(30px + 1vmin); border: none; border-bottom: 1px solid grey"
                        min="1"
                        max="30"
                    >
                    <div style="font-size: calc(15px + 1vmin); color: grey">Days</div>
                </div>

                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="font-size: calc(25px + 1vmin);">${nextPayoutLocaleDateString}</div>
                    <div style="font-size: calc(15px + 1vmin); color: grey">Next payout</div>
                </div>

            </div>

            <br>

            <br>

            <div style="display: flex; align-items: center; justify-content: center">
                <div style="display: flex; justify-content: center; align-items: center; margin: calc(10px + 1vmin)">
                    <button @click=${() => navigate(Store, '/get-eth')} style="font-size: calc(15px + 1vmin); border: none; background-color: white; box-shadow: 0px 0px 1px grey; padding: calc(10px + 1vmin);">Get ETH</button>
                </div>
                <div style="display: flex; justify-content: center; align-items: center; margin: calc(10px + 1vmin)">
                    <button @click=${() => payout(Store, ethersProvider, '500')} style="font-size: calc(15px + 1vmin); border: none; background-color: white; box-shadow: 0px 0px 1px grey; padding: calc(10px + 1vmin);">Pay now</button>
                </div>
            </div>

            <br>

            ${Object.values(Store.getState().podcasts).map((podcast: Podcast) => {
                const totalTimeForPodcastDuringCurrentIntervalInMilliseconds: Milliseconds = calculateTotalTimeForPodcastDuringCurrentIntervalInMilliseconds(Store.getState(), podcast);
                const totalTimeForPodcastDuringCurrentIntervalInMinutes: Minutes = new BigNumber(totalTimeForPodcastDuringCurrentIntervalInMilliseconds).dividedBy(60000).toFixed(0);
                const secondsRemainingForPodcastDuringCurrentInterval: Seconds = new BigNumber(totalTimeForPodcastDuringCurrentIntervalInMilliseconds).mod(60000).dividedBy(1000).toFixed(0);
                // const totalTimeForPodcastDuringCurrentIntervalInMinutes: Minutes = Math.floor(totalTimeForPodcastDuringCurrentIntervalInMilliseconds / 60000);
                // const secondsRemainingForPodcastDuringCurrentInterval: Seconds = Math.round((totalTimeForPodcastDuringCurrentIntervalInMilliseconds % 60000) / 1000);

                const payoutAmountForPodcastDuringCurrentIntervalInUSD: USDollars = calculatePayoutAmountForPodcastDuringCurrentIntervalInUSD(Store.getState(), podcast);
                const percentageOfTotalTimeForPodcastDuringCurrentInterval: Percent = new BigNumber(calculateProportionOfTotalTimeForPodcastDuringCurrentInterval(Store.getState(), podcast)).multipliedBy(100).toString();

                const ethereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED' = podcast.ethereumAddress;

                return html`
                    <div class="pc-wallet-podcast-item">
                        <div>
                            <img src="${podcast.imageUrl}" width="60" height="60">
                        </div>
                        <div style="display:flex: flex-direction: column; padding-left: 5%">
                            <div class="pc-wallet-podcast-item-text">${podcast.title}</div>
                            <div>
                                ${
                                    ethereumAddress === 'NOT_FOUND' ? 
                                        html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${() => notVerifiedHelpClick(podcast)}>Not verified - click to help</button>` :
                                        ethereumAddress === 'MALFORMED' ?
                                            html`<button style="color: red; border: none; padding: 5px; margin: 5px" @click=${() => notVerifiedHelpClick(podcast)}>Not verified - click to help</button>` :
                                            html`<button style="color: green; border: none; padding: 5px; margin: 5px" @click=${() => alert(`This podcast's Ethereum address: ${podcast.ethereumAddress}`)}>Verified</button>`}
                            </div>
                            <br>
                            <div>$${new BigNumber(payoutAmountForPodcastDuringCurrentIntervalInUSD).toFixed(2)}, ${new BigNumber(percentageOfTotalTimeForPodcastDuringCurrentInterval).toFixed(2)}%, ${totalTimeForPodcastDuringCurrentIntervalInMinutes} min ${secondsRemainingForPodcastDuringCurrentInterval} sec</div>
                            <br>
                            <div>Last payout: ${podcast.previousPayoutDateInMilliseconds === 'NEVER' ? 'never' : html`<a href="https://ropsten.etherscan.io/tx/${podcast.latestTransactionHash}" target="_blank">${new Date(podcast.previousPayoutDateInMilliseconds).toLocaleDateString()}</a>`}</div>
                            <div>Next payout: ${nextPayoutLocaleDateString}</div>
                        </div>
                    </div>
                `;
            })}

            <div class="pc-wallet-podcast-item">
                <div>
                    <img src="podcrypt-logo-transparent.png" width="60" height="60">
                </div>
                <div style="display:flex: flex-direction: column; padding-left: 5%">
                    <div class="pc-wallet-podcast-item-text">Podcrypt</div>
                    <br>
                    <div>$${new BigNumber(Store.getState().payoutTargetInUSDCents).multipliedBy(Store.getState().podcryptPayoutPercentage).dividedBy(1000).toFixed(2)}, ${Store.getState().podcryptPayoutPercentage}%</div>
                    <br>
                    <div>Last payout: ${Store.getState().previousPayoutDateInMilliseconds === 'NEVER' ? 'never' : html`<a href="https://ropsten.etherscan.io/tx/${Store.getState().podcryptLatestTransactionHash}" target="_blank">${new Date(Store.getState().previousPayoutDateInMilliseconds).toLocaleDateString()}</a>`}</div>
                    <div>Next payout: ${nextPayoutLocaleDateString}</div>
                </div>
            </div>
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

    function notVerifiedHelpClick(podcast: Readonly<Podcast>) {
        navigate(Store, `/not-verified-help?feedUrl=${podcast.feedUrl}&podcastEmail=${podcast.email}`);
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
        const nextPayoutLocaleDateString: string = new Date(new BigNumber(Store.getState().nextPayoutDateInMilliseconds).toNumber()).toLocaleDateString();

        console.log('currentLocaleDateString', currentLocaleDateString);
        console.log('nextPayoutLocaleDateString', nextPayoutLocaleDateString);

        console.log('now milliseconds', new Date().getTime());
        console.log('nextPayoutDateInMilliseconds', Store.getState().nextPayoutDateInMilliseconds);

        if (
            new BigNumber(new Date().getTime()).gte(Store.getState().nextPayoutDateInMilliseconds)
        ) {
            // TODO Figure out what to do here
            // TODO we only want the interval check to kick in if there is no payment in progress
            // TODO but if there are errors in the payout, and the user refreshes the browser, then
            // TODO the redux store will say there is a payout in progress, when there is not
            // TODO we could use a variable just in memory, but that seems messy and I do not want to store state
            // TODO outside of Redux if at all possible...think about it
            // if (!Store.getState().payoutInProgress) {
                payout(Store, ethersProvider, '500');
            // }
        }
    }, 60000);
});