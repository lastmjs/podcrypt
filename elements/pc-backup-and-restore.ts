import { 
    html,
    render as litRender,
    TemplateResult
} from 'lit-html';
import { StorePromise } from '../state/store';
import {
    pcContainerStyles,
    titleTextLarge,
    titleTextXLarge
} from '../services/css';
import { 
    pcAlert,
    pcConfirm
} from './pc-modal';

StorePromise.then((Store) => {
    class PCBackupAndRestore extends HTMLElement {
        
        constructor() {
            super();
            Store.subscribe(() => litRender(this.render(Store.getState()), this));
        }

        connectedCallback() {
            setTimeout(() => {
                Store.dispatch({
                    type: 'RENDER'
                })
            });
        }

        async backup() {
            const confirmation = await pcConfirm(html`
                <div>This will generate a backup file with all of your Podcrypt data, excluding downloaded audio and your wallet's private information.</div>
                <br>
                <div>Do you want to continue?</div>
            `, Store.getState().screenType);

            if (confirmation === false) {
                return;
            }

            // TODO think about revoking urls...it probably won't be an issue
            const blob = new Blob([JSON.stringify(Store.getState(), null, 2)], {
                type: 'application/json'
            });
            const blobURL = window.URL.createObjectURL(blob);

            let link: HTMLAnchorElement = document.createElement('a');

            link.setAttribute('href', blobURL);
            link.setAttribute('download', `podcrypt-podcast-backup-${new Date()}.json`);

            const mouseEvent = new MouseEvent('click');

            link.dispatchEvent(mouseEvent);

            // document.body.appendChild(link);

            // link.click();

            // document.body.removeChild(link);
        }

        async restoreClick(e: any) {

            // is trusted means it came from the user
            if (e.isTrusted) {
                e.preventDefault();
    
                const confirmation = await pcConfirm(html`
                    <div>This will completely erase your Podcrypt data and restore everything to the state of the uploaded backup file, excluding downloaded audio and your wallet's private information.</div>
                    <br>
                    <div>Do you want to continue?</div>
                `, Store.getState().screenType);
            
                if (confirmation === true) {
                    this.querySelector('input').dispatchEvent(new MouseEvent('click'));
                }
            }
        }

        restore(e: any) {
            const reader: FileReader = new FileReader();

            reader.onload = (e: any) => {
                const newState: Readonly<State> = JSON.parse(e.target.result);

                Store.dispatch({
                    type: 'SET_STATE',
                    state: newState
                });

                pcAlert(html`
                    <div>Restore complete</div>
                `, Store.getState().screenType);
            };

            reader.readAsText(e.target.files[0]);
        }
        
        render(state: Readonly<State>): Readonly<TemplateResult> {
            return html`
                <style>
                    .pc-backup-and-restore-container {
                        ${pcContainerStyles}
                    }

                    .pc-backup-and-restore-title-text-x-large {
                        ${titleTextXLarge}
                    }

                    .pc-backup-and-restore-title-text-large {
                        ${titleTextLarge}
                    }

                    .pc-backup-and-restore-button {
                        cursor: pointer;
                    }
                </style>

                <div class="pc-backup-and-restore-container">
                    <div class="pc-backup-and-restore-title-text-x-large">Backup and Restore</div>

                    <br>

                    <div class="pc-backup-and-restore-title-text-large">Backup</div>
                    <br>
                    <button class="pc-backup-and-restore-button" @click=${() => this.backup()}>Download backup file</button>    

                    <br>
                    <br>

                    <div class="pc-backup-and-restore-title-text-large">Restore</div>
                    <br>
                    <input 
                        type="file"
                        accept="text/json"
                        @click=${(e: any) => this.restoreClick(e)}
                        @change=${(e: any) => this.restore(e)}
                    >             
                </div>
            `;
        }
    }
    
    window.customElements.define('pc-backup-and-restore', PCBackupAndRestore);
});

