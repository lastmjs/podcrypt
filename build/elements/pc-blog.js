import {
  html,
  render as litRender
} from "../_snowpack/pkg/lit-html.js";
import {
  pcContainerStyles
} from "../services/css.js";
class PCBlog extends HTMLElement {
  set postName(val) {
    if (val !== null) {
      (async () => {
        const {post} = await import(`../blog-posts/${val}.ts`);
        console.log(post);
        this.render(post);
      })();
      console.log("postName", val);
    }
  }
  connectedCallback() {
    this.render();
  }
  render(templateResult) {
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
window.customElements.define("pc-blog", PCBlog);
