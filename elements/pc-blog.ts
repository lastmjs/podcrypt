import { 
    html,
    render as litRender,
    TemplateResult
} from 'lit-html';
import {
    pcContainerStyles,
    titleTextMedium,
    titleTextLarge,
    titleTextXLarge,
    standardTextContainer
} from '../services/css';

class PCBlog extends HTMLElement {

    set postName(val: string) {

        if (val !== null) {

            (async () => {
                const { post } = await import(`../blog-posts/${val}.ts`);
                console.log(post);
    
                this.render(post);
            })();
    
            console.log('postName', val);
        }

    }

    connectedCallback() {
        // litRender(this.render(), this);   
        this.render();
    }

    render(templateResult: Readonly<TemplateResult>): Readonly<TemplateResult> {

        litRender(html`
            <style>
                .pc-blog-container {
                    ${pcContainerStyles}
                }
            </style>

            <div class="pc-blog-container">
                <div>Podcrypt Blog</div>

                <br>

                Coming soon

                <!-- ${templateResult} -->
            </div>
        `, this);
    }
}

window.customElements.define('pc-blog', PCBlog);