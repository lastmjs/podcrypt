import { 
    html,
    render as litRender,
    TemplateResult
} from 'lit-html';
import { StorePromise } from '../state/store';
import {
    pcContainerStyles,
    titleTextLarge,
    titleTextXLarge,
    standardTextContainer
} from '../services/css';

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

        backup() {
            const confirmation = confirm(`This will generate a backup file with all of your Podcrypt data, excluding downloaded audio and your wallet's private information. Do you want to continue?`);

            if (confirmation === false) {
                return;
            }

            const jsonFileContents: string = `data:text/json;charset=utf-8,${JSON.stringify(Store.getState(), null, 2)}`;

            let link: HTMLAnchorElement = document.createElement('a');

            link.setAttribute('href', jsonFileContents);
            link.setAttribute('download', `podcrypt-podcast-backup-${new Date().toLocaleDateString()}.json`);

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        }

        restoreClick(e: any) {
            const confirmation = confirm(`This will completely erase your Podcrypt data and restore everything to the state of the uploaded backup file, excluding downloaded audio and your wallet's private information. Do you want to continue?`);
        
            if (confirmation === false) {
                e.preventDefault();
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

                alert('Restore complete');
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
                </style>

                <div class="pc-backup-and-restore-container">
                    <div class="pc-backup-and-restore-title-text-x-large">Backup and Restore</div>

                    <br>

                    <div class="pc-backup-and-restore-title-text-large">Backup</div>
                    <br>
                    <button @click=${() => this.backup()}>Download backup file</button>    

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

