class PodcryptButton extends HTMLElement {

    connectedCallback() {

        const href = this.getAttribute('href') || 'https://ovwc5-5yaaa-aaaae-qaa5a-cai.ic0.app/';
        const logoColor = this.getAttribute('logo-color') || 'black';
        const logoHeight = this.getAttribute('logo-height') || '50px';

        const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: 'open' });

        shadowRoot.innerHTML = `
            <style>
                .podcrypt-button-anchor {
                    color: inherit;
                    text-decoration: none;
                }

                .podcrypt-button-image {
                    height: calc(${logoHeight} + 2vmin);
                }

                .podcrypt-button-container {
                    display: inline-flex;
                    align-items: center;
                }

                .podcrypt-button-top-text {
                    font-size: calc(10px + .5vmin);
                    font-weight: bold;
                }

                .podcrypt-button-bottom-text {
                    font-size: calc(15px + .5vmin);
                    font-weight: bold;
                }
            </style>

            <a
                class="podcrypt-button-anchor"
                href="${href}"
                target="_blank"
            >
                <div class="podcrypt-button-container">
                    <img
                        class="podcrypt-button-image"
                        src="https://ovwc5-5yaaa-aaaae-qaa5a-cai.ic0.app/podcrypt-${logoColor}-transparent.png"
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