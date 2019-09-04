import { 
    html,
    render as litRender,
    TemplateResult
} from 'lit-html';

class PCModal extends HTMLElement {

    closeClick() {
        // this.dispatchEvent(new CustomEvent('close'));
        document.body.removeChild(this);
    }

    render(templateResult: Readonly<TemplateResult>, screenType: ScreenType) {
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
                    top: 25vh;
                    padding: calc(50px + 1vmin);
                    padding-bottom: calc(75px + 1vmin);
                    z-index: 1000;
                    border-radius: calc(1vmin);
                    box-sizing: border-box;
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

                .pc-modal-close-button {
                    position: absolute;
                    bottom: calc(10px + 1vmin);
                    right: calc(10px + 1vmin);
                    border: none;
                    background-color: white;
                    cursor: pointer;
                    padding-left: calc(15px + 1vmin);
                    padding-right: calc(15px + 1vmin);
                    padding-top: calc(5px + 1vmin);
                    padding-bottom: calc(5px + 1vmin);
                    color: white;
                    background-color: grey;
                    font-weight: bold;
                    border-radius: calc(1vmin);
                }
            </style>

            <div class="pc-modal-main-container">
                ${templateResult}
                <button class="pc-modal-close-button" @click=${() => this.closeClick()}>Close</button>
            </div>

            <div class="pc-modal-background"></div>
        `, this);
    }
}

window.customElements.define('pc-modal', PCModal);

export function pcAlert(templateResult: Readonly<TemplateResult>, screenType: ScreenType) {
    const pcModal = document.createElement('pc-modal');

    pcModal.render(templateResult, screenType);

    document.body.appendChild(pcModal);
}

export function pcConfirm(templateResult: Readonly<TemplateResult>, screenType: ScreenType) {
    return new Promise((resolve) => {
        const pcModal = document.createElement('pc-modal');

        pcModal.render(templateResult, screenType);

        document.body.appendChild(pcModal);

        // pcModal.addEventListener('')
    });
}