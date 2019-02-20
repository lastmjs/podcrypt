import { customElement, html } from 'functional-element';
import { Store } from '../services/store';

customElement('pc-menu', () => {
    return html`
        pc-menu
        <a href="/podcasts">Podcasts</a>
        <a href="/playlist">Playlist</a>
        <a href="/player">Player</a>
        <a href="/wallet">Wallet</a>
    `;
})