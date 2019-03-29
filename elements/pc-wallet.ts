import { customElement, html } from 'functional-element';
import { TemplateResult } from 'lit-html';
import { until } from 'lit-html/directives/until';
import { pcContainerStyles } from '../services/css';
import { StorePromise } from '../services/store';
import {
    calculateTotalTimeForPodcastDuringIntervalInMilliseconds,
    calculatePayoutAmountForPodcastDuringIntervalInUSD,
    calculateProportionOfTotalTimeForPodcastDuringInterval
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
import BigNumber from "../node_modules/bignumber.js/bignumber";
import './pc-loading';
import { get } from 'idb-keyval';

StorePromise.then((Store) => {
    customElement('pc-wallet', ({ constructing, connecting, props, update }) => {
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
                    ...props,
                    loaded: true
                });
            });
        }

        return html`
            <style>
                .pc-wallet-container {
                    ${pcContainerStyles}
                    padding-left: 0;
                    padding-right: 0;
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
                            Store.getState().walletCreationState === 'SHOW_MNEMONIC_PHRASE' ?
                                until(mnemonicPhraseUI(), 'Loading...') :
                                warningsUI(update, props)
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
            </div>

            <br>

            <br>

            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center">
                <div style="display: flex; justify-content: center; align-items: center; margin: calc(5px + 1vmin)">
                    <button @click=${() => alert('Coming soon to most US states: Buy ETH with your debit card')} style="font-size: calc(15px + 1vmin); border: none; background-color: white; box-shadow: 0px 0px 1px grey; padding: calc(5px + 1vmin);">Buy ETH</button>
                </div>
                <div style="display: flex; justify-content: center; align-items: center; margin: calc(5px + 1vmin)">
                    <button @click=${() => navigate(Store, '/receive-eth')} style="font-size: calc(15px + 1vmin); border: none; background-color: white; box-shadow: 0px 0px 1px grey; padding: calc(5px + 1vmin);">Receive ETH</button>
                </div>
                <div style="display: flex; justify-content: center; align-items: center; margin: calc(5px + 1vmin)">
                    <button @click=${payNowClick} style="font-size: calc(15px + 1vmin); border: none; background-color: white; box-shadow: 0px 0px 1px grey; padding: calc(5px + 1vmin);">Pay now</button>
                </div>
                <div style="display: flex; justify-content: center; align-items: center; margin: calc(5px + 1vmin)">
                    <button @click=${restoreWithPhrase} style="font-size: calc(15px + 1vmin); border: none; background-color: white; box-shadow: 0px 0px 1px grey; padding: calc(5px + 1vmin);">Restore with phrase</button>
                </div>

            </div>

            <br>

            ${Object.values(Store.getState().podcasts).map((podcast: Podcast) => {
                const previousPayoutDateInMilliseconds: Milliseconds = podcast.previousPayoutDateInMilliseconds !== 'NEVER' && Store.getState().previousPayoutDateInMilliseconds !== 'NEVER' && new BigNumber(podcast.previousPayoutDateInMilliseconds).gt(Store.getState().previousPayoutDateInMilliseconds) ? podcast.previousPayoutDateInMilliseconds : Store.getState().previousPayoutDateInMilliseconds;

                const totalTimeForPodcastDuringIntervalInMilliseconds: Milliseconds = calculateTotalTimeForPodcastDuringIntervalInMilliseconds(Store.getState(), podcast, previousPayoutDateInMilliseconds);
                const totalTimeForPodcastDuringIntervalInMinutes: Minutes = new BigNumber(totalTimeForPodcastDuringIntervalInMilliseconds).dividedBy(60000).integerValue(BigNumber.ROUND_FLOOR).toString();
                const secondsRemainingForPodcastDuringInterval: Seconds = new BigNumber(totalTimeForPodcastDuringIntervalInMilliseconds).mod(60000).dividedBy(1000).integerValue(BigNumber.ROUND_FLOOR).toString();
                // const totalTimeForPodcastDuringIntervalInMinutes: Minutes = Math.floor(totalTimeForPodcastDuringIntervalInMilliseconds / 60000);
                // const secondsRemainingForPodcastDuringInterval: Seconds = Math.round((totalTimeForPodcastDuringIntervalInMilliseconds % 60000) / 1000);

                const payoutAmountForPodcastDuringIntervalInUSD: USDollars = calculatePayoutAmountForPodcastDuringIntervalInUSD(Store.getState(), podcast, previousPayoutDateInMilliseconds);
                const percentageOfTotalTimeForPodcastDuringInterval: Percent = new BigNumber(calculateProportionOfTotalTimeForPodcastDuringInterval(Store.getState(), podcast, previousPayoutDateInMilliseconds)).multipliedBy(100).toString();

                const ethereumAddress: EthereumAddress | 'NOT_FOUND' | 'MALFORMED' = podcast.ethereumAddress;

                return html`
                    <div class="pc-wallet-podcast-item">
                        <div>
                            <img src="${podcast.imageUrl}" width="60" height="60" style="border-radius: 5%">
                        </div>
                        <div style="display:flex; flex-direction: column; padding-left: 5%; padding-top: 1%; flex: 3">
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
                            <div>$${new BigNumber(payoutAmountForPodcastDuringIntervalInUSD).toFixed(2)}, ${new BigNumber(percentageOfTotalTimeForPodcastDuringInterval).toFixed(2)}%, ${totalTimeForPodcastDuringIntervalInMinutes} min ${secondsRemainingForPodcastDuringInterval} sec</div>
                            <br>
                            <div>Last payout: ${podcast.previousPayoutDateInMilliseconds === 'NEVER' ? 'never' : html`<a href="https://${process.env.NODE_ENV !== 'production' ? 'ropsten.' : ''}etherscan.io/tx/${podcast.latestTransactionHash}" target="_blank">${new Date(podcast.previousPayoutDateInMilliseconds).toLocaleString()}</a>`}</div>
                            <div>Next payout: ${nextPayoutLocaleDateString}</div>
                        </div>
                    </div>
                `;
            })}

            <div class="pc-wallet-podcast-item">
                <div>
                    <img src="podcrypt-logo-transparent.png" width="60" height="60" style="border-radius: 5%">
                </div>
                <div style="display:flex; flex-direction: column; padding-left: 5%; padding-top: 1%; flex: 3">
                    <div class="pc-wallet-podcast-item-text">Podcrypt</div>
                    <br>
                    <div>$${new BigNumber(Store.getState().payoutTargetInUSDCents).multipliedBy(Store.getState().podcryptPayoutPercentage).dividedBy(10000).toFixed(2)}, ${Store.getState().podcryptPayoutPercentage}%</div>
                    <br>
                    <div>Last payout: ${Store.getState().previousPayoutDateInMilliseconds === 'NEVER' ? 'never' : html`<a href="https://${process.env.NODE_ENV !== 'production' ? 'ropsten.' : ''}etherscan.io/tx/${Store.getState().podcryptLatestTransactionHash}" target="_blank">${new Date(Store.getState().previousPayoutDateInMilliseconds).toLocaleString()}</a>`}</div>
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

    function warningsUI(update: any, props: any) {
        return html`
            <div style="padding-left: 2%; padding-right: 2%;">
                <div>I understand the following (check each box):</div>
                <br>
                <div>
                    <input 
                        type="checkbox"
                        @change=${checkbox1InputChanged}
                        .checked=${Store.getState().warningCheckbox1Checked}
                    >
                    Podcrypt is offered to me under the terms of the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT license</a>, which essentially means I have a license to do whatever I like with Podcrypt, but there is no warranty as far as possible
                </div>

                <br>

                <div>
                    <input
                        type="checkbox"
                        @change=${checkbox2InputChanged}
                        .checked=${Store.getState().warningCheckbox2Checked}
                    >
                    This is alpha software
                </div>

                <br>

                <div>
                    <input
                        type="checkbox"
                        @change=${checkbox3InputChanged}
                        .checked=${Store.getState().warningCheckbox3Checked}
                    >
                    Anything could go wrong
                </div>

                <br>

                <div>
                    <input
                        type="checkbox"
                        @change=${checkbox4InputChanged}
                        .checked=${Store.getState().warningCheckbox4Checked}
                    >
                    I am responsible for using Podcrypt legally, including determining taxes and other potential legal implications
                </div>

                <br>

                <div>
                    <input
                        type="checkbox"
                        @chaange=${checkbox5InputChanged}
                        .checked=${Store.getState().warningCheckbox5Checked}
                    >
                    Podcrypt Alpha uses the Ethereum network for payments. I should only send ETH to Podcrypt Alpha.
                </div>

                <br>

                <button @click=${() => createWalletClick(update, props)}>Create Wallet</button>
            </div>

        `;
    }

    async function mnemonicPhraseUI() {
        const mnemonicPhrase = await get('ethereumMnemonicPhrase');

        return html`
            <div style="padding-left: 2%; padding-right: 2%">
                <p>Your secret 12 word phrase:</p>
                <h3>${mnemonicPhrase}</h3>
                <p>You should immediately store this phrase somewhere safe. If something terrible happens to your Podcrypt wallet, you may be able to use this phrase to restore it.</p>
                <p>If you do not immediately store this phrase somewhere safe, you are more likely to lose any money that you send to Podcrypt.</p>
                <div>
                    <input 
                        type="checkbox"
                        @change=${mnemonicPhraseWarningInputChanged}
                        .checked=${Store.getState().mnemonicPhraseWarningCheckboxChecked}
                    >
                    I understand
                </div>
                <br>
                <button @click=${goToMyWalletClick}>Go to my wallet</button>
            </div>
        `;
    }

    function payNowClick() {
        const result = confirm('Are you sure you want to pay out now?');

        if (result === true) {
            payout(Store, '500');
        }
    }

    function notVerifiedHelpClick(podcast: Readonly<Podcast>) {
        navigate(Store, `/not-verified-help?feedUrl=${podcast.feedUrl}&podcastEmail=${podcast.email}`);
    }

    function restoreWithPhrase() {
        navigate(Store, '/restore-with-phrase');
    }

    async function createWalletClick(update: any, props: any) {
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
            update({
                ...props,
                loaded: false
            });

            await createWallet(Store);

            update({
                ...props,
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
            alert('Do you want to lose all of your money?');
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
    
        const nextPayoutDateInMilliseconds: Milliseconds = getNextPayoutDateInMilliseconds(Store);
    
        Store.dispatch({
            type: 'SET_NEXT_PAYOUT_DATE_IN_MILLISECONDS',
            nextPayoutDateInMilliseconds
        });

        loadEthereumAccountBalance(Store);
    }
    
    async function payoutTargetInUSDCentsInputChanged(e: any) {
        await loadCurrentETHPriceInUSDCents(Store);
        Store.dispatch({
            type: 'SET_PAYOUT_TARGET_IN_USD_CENTS',
            payoutTargetInUSDCents: parseInt(e.target.value) * 100
        });

        loadEthereumAccountBalance(Store);
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
                payout(Store, '500');
            // }
        }
    }, 30000);

    setInterval(() => {
        if (Store.getState().currentRoute.pathname === '/wallet') {
            console.log('loadEthereumAccountBalance');
            loadEthereumAccountBalance(Store);
        }
    }, 30000);
});