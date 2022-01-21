import '../../common/version-40d6eda9.js';
import '../../@polymer/polymer/lib/elements/custom-style.js';
import '../../@webcomponents/shadycss/entrypoints/custom-style-interface.js';
import '../../common/custom-style-interface-ecf5e7b2.js';
import '../../common/style-gather-11e17af0.js';
import '../../@polymer/polymer/lib/elements/dom-module.js';
import '../../common/boot-5426e289.js';
import '../../common/settings-5ea5e1bf.js';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<custom-style>
  <style>
    html {
      --lumo-size-xs: 1.625rem;
      --lumo-size-s: 1.875rem;
      --lumo-size-m: 2.25rem;
      --lumo-size-l: 2.75rem;
      --lumo-size-xl: 3.5rem;

      /* Icons */
      --lumo-icon-size-s: 1.25em;
      --lumo-icon-size-m: 1.5em;
      --lumo-icon-size-l: 2.25em;
      /* For backwards compatibility */
      --lumo-icon-size: var(--lumo-icon-size-m);
    }
  </style>
</custom-style>`;

document.head.appendChild($_documentContainer.content);
