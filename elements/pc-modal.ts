import { 
    html,
    render as litRender,
    TemplateResult
} from 'lit-html';

export class PCModal extends HTMLElement {

    okayClick() {
        this.dispatchEvent(new CustomEvent('okay'));
        document.body.removeChild(this);
    }

    cancelClick() {
        this.dispatchEvent(new CustomEvent('cancel'));
        document.body.removeChild(this);
    }

    closeClick() {
        this.dispatchEvent(new CustomEvent('close'));
        document.body.removeChild(this);
    }

    render(
        templateResult: Readonly<TemplateResult>, 
        screenType: ScreenType,
        modalType: ModalType
    ) {
        litRender(html`
            <style>
                .pc-modal-main-container {
                    position: fixed;
                    background-color: white;
                    width: ${screenType === 'DESKTOP' ? '25%' : '90%'};
                    box-shadow: 0px 0px 4px grey;
                    margin-left: auto;
                    margin-right: auto;
                    left: 0;
                    right: 0;
                    top: 10vh;
                    z-index: 1000;
                    border-radius: calc(1vmin);
                    box-sizing: border-box;
                    max-height: 80vh;
                    overflow-y: scroll;
                }

                .pc-modal-content-container {
                }

                .pc-modal-background {
                    position: fixed;
                    top: 0;
                    right: 0;
                    z-index: 999;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, .5);
                }

                .pc-modal-button-container {
                    padding: calc(10px + 1vmin);
                    display: flex;
                }

                .pc-modal-button {
                    padding-left: calc(15px + 1vmin);
                    padding-right: calc(15px + 1vmin);
                    padding-top: calc(5px + 1vmin);
                    padding-bottom: calc(5px + 1vmin);
                    cursor: pointer;
                    font-weight: bold;
                    border-radius: calc(1vmin);
                    border: none;
                }

                .pc-modal-close-button {
                    color: white;
                    background-color: grey;
                    margin-left: auto;
                }

                .pc-modal-okay-button {
                    color: white;
                    background-color: grey;
                }

                .pc-modal-cancel-button {
                    color: black;
                    background-color: white;
                    margin-left: auto;
                }
            </style>

            <div class="pc-modal-main-container">
                <div class="pc-modal-content-container">
                    ${templateResult}
                </div>

                <div 
                    ?hidden=${modalType !== 'CONFIRM'}
                >
                    <div class="pc-modal-button-container">
                        <button class="pc-modal-button pc-modal-cancel-button" @click=${() => this.cancelClick()}>Cancel</button>
                        <button class="pc-modal-button pc-modal-okay-button" @click=${() => this.okayClick()}>Okay</button>
                    </div>
                </div>

                <div 
                    ?hidden=${modalType !== 'ALERT'}
                >
                    <div class="pc-modal-button-container">
                        <button class="pc-modal-button pc-modal-close-button" @click=${() => this.closeClick()}>Close</button>
                    </div>
                </div>
            </div>

            <div class="pc-modal-background"></div>
        `, this);
    }
}

window.customElements.define('pc-modal', PCModal);

export function pcAlert(templateResult: Readonly<TemplateResult>, screenType: ScreenType) {
    const pcModal: Readonly<PCModal> = document.createElement('pc-modal') as Readonly<PCModal>;

    pcModal.render(templateResult, screenType, 'ALERT');

    document.body.appendChild(pcModal);
}

export function pcConfirm(templateResult: Readonly<TemplateResult>, screenType: ScreenType) {
    return new Promise((resolve) => {
        const pcModal: Readonly<PCModal> = document.createElement('pc-modal') as Readonly<PCModal>;

        pcModal.render(templateResult, screenType, 'CONFIRM');

        document.body.appendChild(pcModal);

        pcModal.addEventListener('okay', () => {
            resolve(true);
        });

        pcModal.addEventListener('cancel', () => {
            resolve(false);
        });
    });
}