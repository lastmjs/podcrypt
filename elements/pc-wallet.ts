import { customElement, html } from 'functional-element';
import { TemplateResult } from 'lit-html';
import { until } from 'lit-html/directives/until';
import { 
    pcContainerStyles,
    standardTextContainer,
    secondaryTextSmall,
    color1Medium,
    pxXXLarge,
    normalShadow,
    pxXSmall,
    pxXXXSmall,
    colorBlackMedium,
    pxSmall
 } from '../services/css';
import { StorePromise } from '../state/store';
import {
    calculatePayoutAmountForPodcastDuringIntervalInUSD,
    calculateProportionOfTotalTimeForPodcastDuringInterval
} from '../services/podcast-calculations';
import {
    getNextPayoutDate,
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
import BigNumber from "../node_modules/bignumber.js/bignumber";
import './pc-loading';
import { get } from 'idb-keyval';
import './pc-button';
import './pc-podcast-row';
import { pcAlert } from './pc-modal';

StorePromise.then((Store) => {
    customElement('pc-wallet', ({ constructing, connecting, update, loaded }) => {
        if (constructing) {
            Store.subscribe(update);

            loadEthereumAccountBalance(Store);
            loadCurrentETHPriceInUSDCents(Store);
            
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
                .pc-wallet-container {
                    ${pcContainerStyles}
                }
    
                .pc-wallet-podcast-item {
                    box-shadow: 0px 5px 5px -5px grey;
                    padding: 5%;
                    margin-top: 2%;
                    display: flex;
                    justify-content: center;
                }

                .pc-wallet-podcast-item-text {
                    font-size: calc(12px + 1vmin);
                    text-overflow: ellipsis;
                    flex: 1;
                    cursor: pointer;
                    font-weight: bold;
                }

                .pc-wallet-secondary-text {
                    ${standardTextContainer}
                }

                .pc-wallet-secondary-text-without-container {
                    ${secondaryTextSmall}
                }

                .pc-wallet-input {
                    text-align: center;
                    font-size: ${pxXXLarge};
                    border: none;
                    border-bottom: 1px solid ${color1Medium};
                    background-color: transparent;
                }

                .pc-wallet-podcrypt-container {
                    box-shadow: ${normalShadow};
                    display: flex;
                    padding: ${pxXSmall};
                    margin-top: ${pxXSmall};
                    margin-bottom: ${pxXSmall};
                    border-radius: ${pxXXXSmall};
                    justify-content: center;
                    background-color: white;
                    font-size: ${pxSmall};
                    font-family: Ubuntu;
                    color: ${colorBlackMedium};l
                }
            </style>
    
            <div class="pc-wallet-container">
                <pc-loading
                    .hidden=${loaded && !Store.getState().payoutInProgress}
                    .prename=${"pc-wallet-"}
                    .message=${Store.getState().payoutInProgress ? 'Processing payments' : ''}
                ></pc-loading>

                ${
                    Store.getState().walletCreationState === 'CREATED' ? 
                        walletUI() :
                        Store.getState().walletCreationState === 'CREATING' ?
                            html`<div>Creating wallet...</div>` :
                            Store.getState().walletCreationState === 'SHOW_MNEMONIC_PHRASE' ?
                                until(mnemonicPhraseUI(), 'Loading...') :
                                warningsUI(update)
                }
            </div>
        `;
    })

    function walletUI(): Readonly<TemplateResult> {
        const payoutTargetInETH: ETH | 'Loading...' = getPayoutTargetInETH(Store) === 'Loading...' ? 'Loading...' : new BigNumber(getPayoutTargetInETH(Store)).toFixed(4);
        const payoutTargetInUSDCents: USDCents = Store.getState().payoutTargetInUSDCents;
        const payoutTargetInUSD: USDollars = new BigNumber(payoutTargetInUSDCents).dividedBy(100).toFixed(2);
        const nextPayoutLocaleDateString: string = new Date(Store.getState().nextPayoutDate).toLocaleDateString()
        const payoutIntervalInDays: Days = Store.getState().payoutIntervalInDays;

        const balanceInUSD: USDollars | 'Loading...' = getBalanceInUSD(Store) === 'Loading...' ? 'Loading...' : getBalanceInUSD(Store) === 'unknown' ? 'unknown' : new BigNumber(getBalanceInUSD(Store)).toFixed(2);
        const balanceInETH: ETH = new BigNumber(getBalanceInETH(Store)).toFixed(4);

        return html`
            <div style="padding-left: 2%; padding-right: 2%">
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
                                class="pc-wallet-input"
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
                            value=${payoutIntervalInDays.toString()}
                            @input=${payoutIntervalInDaysInputChanged}
                            class="pc-wallet-input"
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
            </div>

            <br>

            <br>

            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center">
                <div style="display: flex; justify-content: center; align-items: center; margin: calc(5px + 1vmin)">
                    <pc-button @click=${() => pcAlert(html`<div>Coming soon to most US states:</div><br><div>Buy ETH with your debit card</div>`, Store.getState().screenType)} .text=${'Buy ETH'}></pc-button>
                </div>
                <div style="display: flex; justify-content: center; align-items: center; margin: calc(5px + 1vmin)">
                    <pc-button @click=${() => navigate(Store, '/receive-eth')} .text=${'Receive ETH'}></pc-button>
                </div>
                <div style="display: flex; justify-content: center; align-items: center; margin: calc(5px + 1vmin)">
                    <pc-button @click=${payNowClick} .text=${'Pay now'}></pc-button>
                </div>
                <div style="display: flex; justify-content: center; align-items: center; margin: calc(5px + 1vmin)">
                    <pc-button @click=${restoreWithPhrase} .text=${'Restore with phrase'}></pc-button>
                </div>

            </div>

            <br>

            ${Object.values(Store.getState().podcasts).map((podcast: Readonly<Podcast>) => {
                const previousPayoutDate: Milliseconds | 'NEVER' = podcast.previousPayoutDate !== 'NEVER' && Store.getState().previousPayoutDate !== 'NEVER' && podcast.previousPayoutDate > Store.getState().previousPayoutDate ? podcast.previousPayoutDate : Store.getState().previousPayoutDate;

                const totalTimeForPodcastDuringIntervalInMilliseconds: Milliseconds = podcast.timeListenedSincePreviousPayoutDate;
                const totalTimeForPodcastDuringIntervalInMinutes: Minutes = Math.floor(totalTimeForPodcastDuringIntervalInMilliseconds / 60000);
                const secondsRemainingForPodcastDuringInterval: Seconds = Math.floor((totalTimeForPodcastDuringIntervalInMilliseconds % 60000) / 1000);
                // const totalTimeForPodcastDuringIntervalInMinutes: Minutes = Math.floor(totalTimeForPodcastDuringIntervalInMilliseconds / 60000);
                // const secondsRemainingForPodcastDuringInterval: Seconds = Math.round((totalTimeForPodcastDuringIntervalInMilliseconds % 60000) / 1000);

                const payoutAmountForPodcastDuringIntervalInUSD: USDollars = calculatePayoutAmountForPodcastDuringIntervalInUSD(Store.getState(), podcast, previousPayoutDate);
                const percentageOfTotalTimeForPodcastDuringInterval: Percent = new BigNumber(calculateProportionOfTotalTimeForPodcastDuringInterval(Store.getState(), podcast, previousPayoutDate)).multipliedBy(100).toString();

                return html`
                    <pc-podcast-row
                        .podcast=${podcast}
                        .verification=${true}
                        .payouts=${true}
                        .usage=${true}
                        .options=${true}
                        .payoutAmountForPodcastDuringIntervalInUSD=${payoutAmountForPodcastDuringIntervalInUSD}
                        .percentageOfTotalTimeForPodcastDuringInterval=${percentageOfTotalTimeForPodcastDuringInterval}
                        .totalTimeForPodcastDuringIntervalInMinutes=${totalTimeForPodcastDuringIntervalInMinutes}
                        .secondsRemainingForPodcastDuringInterval=${secondsRemainingForPodcastDuringInterval}
                        .nextPayoutLocaleDateString=${nextPayoutLocaleDateString}
                    ></pc-podcast-row>
                `;
            })}

            <div class="pc-wallet-podcrypt-container">
                <div>
                    <img src="podcrypt-white-on-black.png" width="60" height="60" style="border-radius: 5%">
                </div>
                <div style="display:flex; flex-direction: column; padding-left: 5%; padding-top: 1%; flex: 3">
                    <div class="pc-wallet-podcast-item-text">Podcrypt</div>
                    <br>
                    <div>$${new BigNumber(Store.getState().payoutTargetInUSDCents).multipliedBy(Store.getState().podcryptPayoutPercentage).dividedBy(10000).toFixed(2)}, ${Store.getState().podcryptPayoutPercentage}%</div>
                    <br>
                    <div>Last payout: ${Store.getState().previousPayoutDate === 'NEVER' ? 'never' : html`<a href="https://${process.env.NODE_ENV !== 'production' ? 'ropsten.' : ''}etherscan.io/tx/${Store.getState().podcryptLatestTransactionHash}" target="_blank">${new Date(Store.getState().podcryptPreviousPayoutDate).toLocaleString()}</a>`}</div>
                    <br>
                    <div>Next payout: ${nextPayoutLocaleDateString}</div>
                </div>
            </div>
        `;
    }

    function warningsUI(update: any) {
        return html`
            <div>
                <div class="pc-wallet-secondary-text">I understand the following:</div>
                <br>
                <div class="pc-wallet-secondary-text">
                    <input 
                        type="checkbox"
                        @change=${checkbox1InputChanged}
                        .checked=${Store.getState().warningCheckbox1Checked}
                    >
                    Podcrypt is offered to me under the terms of the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT license</a>, which essentially means I have a license to do whatever I like with Podcrypt, but there is no warranty as far as possible
                </div>

                <br>

                <div class="pc-wallet-secondary-text">
                    <input
                        type="checkbox"
                        @change=${checkbox2InputChanged}
                        .checked=${Store.getState().warningCheckbox2Checked}
                    >
                    This is alpha software
                </div>

                <br>

                <div class="pc-wallet-secondary-text">
                    <input
                        type="checkbox"
                        @change=${checkbox3InputChanged}
                        .checked=${Store.getState().warningCheckbox3Checked}
                    >
                    Anything could go wrong
                </div>

                <br>

                <div class="pc-wallet-secondary-text">
                    <input
                        type="checkbox"
                        @change=${checkbox4InputChanged}
                        .checked=${Store.getState().warningCheckbox4Checked}
                    >
                    I am responsible for using Podcrypt legally, including determining taxes and other potential legal implications
                </div>

                <br>

                <div class="pc-wallet-secondary-text">
                    <input
                        type="checkbox"
                        @change=${checkbox5InputChanged}
                        .checked=${Store.getState().warningCheckbox5Checked}
                    >
                    Podcrypt Alpha uses the Ethereum network for payments. I should only send ETH to Podcrypt Alpha.
                </div>

                <br>

                <pc-button
                    .text=${'Create Wallet'}
                    @click=${() => createWalletClick(update)}
                ></pc-button>

            </div>

        `;
    }

    async function mnemonicPhraseUI() {
        const mnemonicPhrase = await get('ethereumMnemonicPhrase');

        return html`
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
                        @change=${mnemonicPhraseWarningInputChanged}
                        .checked=${Store.getState().mnemonicPhraseWarningCheckboxChecked}
                    >
                    I understand
                </div>
                <br>
                <pc-button @click=${goToMyWalletClick} .text=${'Go to My Wallet'}></pc-button>
            </div>
        `;
    }

    function payNowClick() {
        const result = confirm('Are you sure you want to pay out now?');

        if (result === true) {
            payout(Store, 500);
        }
    }

    function restoreWithPhrase() {
        navigate(Store, '/restore-with-phrase');
    }

    async function createWalletClick(update: any) {
        const warningsAccepted = 
            Store.getState().warningCheckbox1Checked &&
            Store.getState().warningCheckbox2Checked &&
            Store.getState().warningCheckbox3Checked &&
            Store.getState().warningCheckbox4Checked &&
            Store.getState().warningCheckbox5Checked;

        if (!warningsAccepted) {
            pcAlert(html`
                <div>Silly you, you must understand</div>
            `, Store.getState().screenType);
        }
        else {
            update({
                loaded: false
            });

            await createWallet(Store);

            update({
                loaded: true
            });
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

    function mnemonicPhraseWarningInputChanged(e: any) {
        Store.dispatch({
            type: 'SET_MNEMONIC_PHRASE_WARNING_CHECKBOX_CHECKED',
            checked: e.target.checked
        });
    }

    function goToMyWalletClick() {
        const mnemonicPhraseWarningAccepted: boolean = Store.getState().mnemonicPhraseWarningCheckboxChecked;

        if (!mnemonicPhraseWarningAccepted) {
            pcAlert(html`
                <div>Do you want to lose all of your money?</div>
            `, Store.getState().screenType);
        }
        else {
            Store.dispatch({
                type: 'SET_WALLET_CREATION_STATE',
                walletCreationState: 'CREATED'
            });
        }
    }

    function payoutIntervalInDaysInputChanged(e: any) {
        Store.dispatch({
            type: 'SET_PAYOUT_INTERVAL_IN_DAYS',
            payoutIntervalInDays: e.target.value
        });
    
        const nextPayoutDate: Milliseconds = getNextPayoutDate(Store.getState());
    
        Store.dispatch({
            type: 'SET_NEXT_PAYOUT_DATE',
            nextPayoutDate
        });

        loadEthereumAccountBalance(Store);
    }
    
    async function payoutTargetInUSDCentsInputChanged(e: any) {
        await loadCurrentETHPriceInUSDCents(Store);
        Store.dispatch({
            type: 'SET_PAYOUT_TARGET_IN_USD_CENTS',
            payoutTargetInUSDCents: (parseInt(e.target.value) * 100).toString()
        });

        loadEthereumAccountBalance(Store);
    }

    setInterval(() => {
        // const currentLocaleDateString: string = new Date().toLocaleDateString();
        // const nextPayoutLocaleDateString: string = new Date(new BigNumber(Store.getState().nextPayoutDate).toNumber()).toLocaleDateString();

        if (
            new Date().getTime() >= Store.getState().nextPayoutDate
        ) {
            // TODO Figure out what to do here
            // TODO we only want the interval check to kick in if there is no payment in progress
            // TODO but if there are errors in the payout, and the user refreshes the browser, then
            // TODO the redux store will say there is a payout in progress, when there is not
            // TODO we could use a variable just in memory, but that seems messy and I do not want to store state
            // TODO outside of Redux if at all possible...think about it
            // if (!Store.getState().payoutInProgress) {
                payout(Store, 500);
            // }
        }
    }, 30000);

    setInterval(() => {
        if (Store.getState().currentRoute.pathname === '/wallet') {
            loadEthereumAccountBalance(Store);
        }
    }, 30000);
});