import { 
    html,
    render as litRender,
    TemplateResult
} from 'lit-html';
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
    pxSmall,
    alertPadding
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
    getBalanceInETH
} from '../services/balance-calculations';
import { 
    navigate,
    copyTextToClipboard
} from '../services/utilities';
import BigNumber from "../node_modules/bignumber.js/bignumber";
import './pc-loading';
import './pc-button';
import './pc-podcast-row';
import { 
    pcAlert,
    pcConfirm
} from './pc-modal';
import './pc-wallet-warnings';
import './pc-show-mnemonic-phrase';

StorePromise.then((Store) => {

    class PCWallet extends HTMLElement {

        loaded: boolean = false;

        constructor() {
            super();
            Store.subscribe(() => litRender(this.render(Store.getState()), this));
        }

        async connectedCallback() {
            await loadCurrentETHPriceInUSDCents(Store);
            await loadEthereumAccountBalance(Store);

            setTimeout(() => {
                this.loaded = true;

                Store.dispatch({
                    type: 'RENDER'
                });
            });
        }

        render(state: Readonly<State>): Readonly<TemplateResult> {

            const payoutTargetInETH: ETH | 'Loading...' = getPayoutTargetInETH(Store) === 'Loading...' ? 'Loading...' : new BigNumber(getPayoutTargetInETH(Store)).toFixed(4);
            const payoutTargetInUSDCents: USDCents = Store.getState().payoutTargetInUSDCents;
            const payoutTargetInUSD: USDollars = new BigNumber(payoutTargetInUSDCents).dividedBy(100).toFixed(2);
            const nextPayoutLocaleDateString: string = new Date(Store.getState().nextPayoutDate).toLocaleDateString()
            const payoutIntervalInDays: Days = Store.getState().payoutIntervalInDays;
    
            const balanceInUSD: USDollars | 'Loading...' = getBalanceInUSD(Store) === 'Loading...' ? 'Loading...' : getBalanceInUSD(Store) === 'unknown' ? 'unknown' : new BigNumber(getBalanceInUSD(Store)).toFixed(2);
            const balanceInETH: ETH = new BigNumber(getBalanceInETH(Store)).toFixed(4);    

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
                        width: 75%;
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
                        .hidden=${this.loaded && !state.payoutInProgress}
                        .prename=${"pc-wallet-"}
                        .message=${state.payoutInProgress ? 'Processing payments' : ''}
                    ></pc-loading>

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
                                <input
                                    type="number"
                                    value=${payoutTargetInUSD}
                                    @input=${payoutTargetInUSDCentsInputChanged}
                                    class="pc-wallet-input"
                                    min="0"
                                    max="100"
                                    step="1"
                                >
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
                            <pc-button @click=${buyETHClick} .text=${'Buy ETH'}></pc-button>
                        </div>
                        <div style="display: flex; justify-content: center; align-items: center; margin: calc(5px + 1vmin)">
                            <pc-button @click=${receiveETHClick} .text=${'Receive ETH'}></pc-button>
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
                </div>
            `;
        }
    }

    window.customElements.define('pc-wallet', PCWallet);

    async function buyETHClick() {
        
        const state: Readonly<State> = Store.getState();

        if (
            state.warningCheckbox1Checked === false ||
            state.warningCheckbox2Checked === false ||
            state.warningCheckbox3Checked === false ||
            state.warningCheckbox4Checked === false ||
            state.warningCheckbox5Checked === false
        ) {
            const confirmation = await pcConfirm(html`
                <div style="padding: calc(5px + 1vmin)">
                    <pc-wallet-warnings></pc-wallet-warnings>
                </div>
            `, state.screenType);
            
            if (confirmation === true) {
                buyETHClick();
            }
            
            return;
        }

        if (
            state.mnemonicPhraseWarningCheckboxChecked === false
        ) {
            const confirmation = await pcConfirm(html`
                <div style="padding: calc(5px + 1vmin)">
                    <pc-show-mnemonic-phrase></pc-show-mnemonic-phrase>
                </div>
            `, state.screenType);
            
            if (confirmation === true) {
                buyETHClick();
            }
            
            return;
        }
        
        pcAlert(html`<div style="${alertPadding}"><div>Coming soon to most US states:</div><br><div>Buy ETH with your debit card</div></div>`, Store.getState().screenType)
    }

    async function receiveETHClick() {
        const state: Readonly<State> = Store.getState();

        if (
            state.warningCheckbox1Checked === false ||
            state.warningCheckbox2Checked === false ||
            state.warningCheckbox3Checked === false ||
            state.warningCheckbox4Checked === false ||
            state.warningCheckbox5Checked === false
        ) {
            const confirmation = await pcConfirm(html`
                <div style="padding: calc(5px + 1vmin)">
                    <pc-wallet-warnings></pc-wallet-warnings>
                </div>
            `, state.screenType);
            
            if (confirmation === true) {
                receiveETHClick();
            }
            
            return;
        }

        if (
            state.mnemonicPhraseWarningCheckboxChecked === false
        ) {
            const confirmation = await pcConfirm(html`
                <div style="padding: calc(5px + 1vmin)">
                    <pc-show-mnemonic-phrase></pc-show-mnemonic-phrase>
                </div>
            `, state.screenType);
            
            if (confirmation === true) {
                receiveETHClick();
            }
            
            return;
        }

        pcAlert(html`
            <div style="${alertPadding}">

                <p>Send ETH to your Podcrypt Ethereum address:</p>

                <p style="font-weight: bold; word-wrap: break-word">${Store.getState().ethereumAddress}</p>

                <pc-button style="font-size: calc(5px + 1vmin)" .text=${'copy address'} @click=${() => copyTextToClipboard(Store.getState().ethereumAddress)}></pc-button>

                <!-- <p>You can receive ETH in your Podcrypt wallet by sending it from another Ethereum wallet using the address above.</p>

                <p>You may already have an Ethereum wallet with an exchange such as <a href="https://www.coinbase.com" target="_blank">Coinbase</a>, or perhaps you have a browser wallet like <a href="https://metamask.io" target="_blank">MetaMask</a>.</p>

                <p>No matter your wallet, you can use your Podcrypt Ethereum address to receive ETH.</p> -->

            </div>
        `, Store.getState().screenType);
    }

    async function payNowClick() {

        const state: Readonly<State> = Store.getState();

        if (
            state.warningCheckbox1Checked === false ||
            state.warningCheckbox2Checked === false ||
            state.warningCheckbox3Checked === false ||
            state.warningCheckbox4Checked === false ||
            state.warningCheckbox5Checked === false
        ) {
            const confirmation = await pcConfirm(html`
                <div style="padding: calc(5px + 1vmin)">
                    <pc-wallet-warnings></pc-wallet-warnings>
                </div>
            `, state.screenType);
            
            if (confirmation === true) {
                payNowClick();
            }
            
            return;
        }

        if (
            state.mnemonicPhraseWarningCheckboxChecked === false
        ) {
            const confirmation = await pcConfirm(html`
                <div style="padding: calc(5px + 1vmin)">
                    <pc-show-mnemonic-phrase></pc-show-mnemonic-phrase>
                </div>
            `, state.screenType);
            
            if (confirmation === true) {
                payNowClick();
            }
            
            return;
        }

        const result = await pcConfirm(html`
            <div style="${alertPadding}">Are you sure you want to pay out now?</div>
        `, Store.getState().screenType);

        if (result === true) {
            payoutInProgress = true;
            await payout(Store, 500);
            payoutInProgress = false;
        }
    }

    function restoreWithPhrase() {
        navigate(Store, '/restore-with-phrase');
    }

    async function payoutIntervalInDaysInputChanged(e: any) {
        Store.dispatch({
            type: 'SET_PAYOUT_INTERVAL_IN_DAYS',
            payoutIntervalInDays: e.target.value
        });
    
        const nextPayoutDate: Milliseconds = getNextPayoutDate(Store.getState());
    
        Store.dispatch({
            type: 'SET_NEXT_PAYOUT_DATE',
            nextPayoutDate
        });

        await loadEthereumAccountBalance(Store);
    }
    
    async function payoutTargetInUSDCentsInputChanged(e: any) {

        if (e.target.value === '') {
            return;
        }

        await loadCurrentETHPriceInUSDCents(Store);

        Store.dispatch({
            type: 'SET_PAYOUT_TARGET_IN_USD_CENTS',
            payoutTargetInUSDCents: (parseInt(e.target.value) * 100).toString()
        });

        await loadEthereumAccountBalance(Store);
    }

    // TODO figure out a place to store ephemeral state...we might need to just modify the Redux store persistance and remove certain properties
    // TODO this needs to stay in memory only and not be persisted because we want the payout process to continue on a refresh
    let payoutInProgress = false;

    setInterval(async () => {
        if (
            Store.getState().nextPayoutDate !== 'NEVER' &&
            payoutInProgress === false &&
            new Date().getTime() >= Store.getState().nextPayoutDate
        ) {
            payoutInProgress = true;
            await payout(Store, 500);
            payoutInProgress = false;
        }
    }, 30000);

    setInterval(async () => {
        if (Store.getState().currentRoute.pathname === '/wallet') {
            await loadCurrentETHPriceInUSDCents(Store);
            await loadEthereumAccountBalance(Store);
        }
    }, 30000);
});