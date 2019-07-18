class PodcryptButton extends HTMLElement {

    connectedCallback() {

        const href = this.getAttribute('href') || 'https://podcrypt.app';
        const logoColor = this.getAttribute('logo-color') || 'black';
        const logoHeight = this.getAttribute('logo-height') || '50px';

        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.innerHTML = `
            <style>
                a {
                    color: inherit;
                    text-decoration: none;
                }

                .podcrypt-button-container {
                    display: flex;
                    align-items: center;
                }

                .podcrypt-button-top-text {
                    font-size: 10px;
                    font-weight: bold;
                }

                .podcrypt-button-bottom-text {
                    font-size: 15px;
                    font-weight: bold;
                }
            </style>

            <a
                href="${href}"
                target="_blank"
            >
                <div class="podcrypt-button-container">
                    <img
                        src="https://podcrypt.app/podcrypt-${logoColor}-transparent.png"
                        height="${logoHeight}"
                    >
                    <div>
                        <div class="podcrypt-button-top-text">Donate with</div>
                        <div class="podcrypt-button-bottom-text">Podcrypt</div>
                    </div>
                </div>
            </a>
        `;
    }

}

window.customElements.define('podcrypt-button', PodcryptButton);