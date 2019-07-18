class PodcryptButton extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `
            <style>
            </style>

            <a
                href="https://podcrypt.app/podcast-overview?feedUrl=${this.getAttribute('feedUrl')}"
            >
                <img
                    src="https://podcrypt.app/podcrypt-black-transparent.png"
                    height="50px"
                >
            </a>
        `;
    }

}

window.customElements.define('podcrypt-button', PodcryptButton);