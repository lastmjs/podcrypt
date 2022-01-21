import { F as FlattenedNodesObserver } from './flattened-nodes-observer-890f36a6.js';
import { D as Debouncer } from './debounce-ac221512.js';
import { t as timeOut } from './async-ea1a09a1.js';

/**
@license
Copyright (c) 2017 Vaadin Ltd.
This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
*/

/**
 * A mixin for `nav` elements, facilitating navigation and selection of childNodes.
 *
 * @polymerMixin
 */
const ListMixin = superClass => class VaadinListMixin extends superClass {
  static get properties() {
    return {
      /**
       * Used for mixin detection because `instanceof` does not work with mixins.
       */
      _hasVaadinListMixin: {
        value: true
      },

      /**
       * The index of the item selected in the items array
       */
      selected: {
        type: Number,
        reflectToAttribute: true,
        notify: true
      },

      /**
       * Define how items are disposed in the dom.
       * Possible values are: `horizontal|vertical`.
       * It also changes navigation keys from left/right to up/down.
       */
      orientation: {
        type: String,
        reflectToAttribute: true,
        value: ''
      },

      /**
       * The list of items from which a selection can be made.
       * It is populated from the elements passed to the light DOM,
       * and updated dynamically when adding or removing items.
       *
       * The item elements must implement `Vaadin.ItemMixin`.
       *
       * Note: unlike `<vaadin-combo-box>`, this property is read-only,
       * so if you want to provide items by iterating array of data,
       * you have to use `dom-repeat` and place it to the light DOM.
       */
      items: {
        type: Array,
        readOnly: true,
        notify: true
      },

      /**
       * The search buffer for the keyboard selection feature.
       */
      _searchBuf: {
        type: String,
        value: ''
      }
    };
  }

  static get observers() {
    return ['_enhanceItems(items, orientation, selected)'];
  }

  ready() {
    super.ready();
    this.addEventListener('keydown', e => this._onKeydown(e));
    this.addEventListener('click', e => this._onClick(e));

    this._observer = new FlattenedNodesObserver(this, info => {
      this._setItems(this._filterItems(Array.from(this.children)));
    });
  }

  _enhanceItems(items, orientation, selected) {
    if (items) {
      this.setAttribute('aria-orientation', orientation || 'vertical');
      this.items.forEach(item => {
        orientation ? item.setAttribute('orientation', orientation) : item.removeAttribute('orientation');
        item.updateStyles();
      });

      this._setFocusable(selected);

      const itemToSelect = items[selected];
      items.forEach(item => item.selected = item === itemToSelect);
      if (itemToSelect && !itemToSelect.disabled) {
        this._scrollToItem(selected);
      }
    }
  }

  get focused() {
    return this.getRootNode().activeElement;
  }

  _filterItems(array) {
    return array.filter(e => e._hasVaadinItemMixin);
  }

  _onClick(event) {
    if (event.metaKey || event.shiftKey || event.ctrlKey) {
      return;
    }

    const item = this._filterItems(event.composedPath())[0];
    let idx;
    if (item && !item.disabled && ((idx = this.items.indexOf(item)) >= 0)) {
      this.selected = idx;
    }
  }

  _searchKey(currentIdx, key) {
    this._searchReset = Debouncer.debounce(
      this._searchReset,
      timeOut.after(500),
      () => this._searchBuf = ''
    );
    this._searchBuf += key.toLowerCase();
    const increment = 1;
    const condition = item => !item.disabled &&
      item.textContent.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().indexOf(this._searchBuf) === 0;

    if (!this.items.some(item => item.textContent.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().indexOf(this._searchBuf) === 0)) {
      this._searchBuf = key.toLowerCase();
    }

    const idx = this._searchBuf.length === 1 ? currentIdx + 1 : currentIdx;
    return this._getAvailableIndex(idx, increment, condition);
  }

  _onKeydown(event) {
    if (event.metaKey || event.ctrlKey) {
      return;
    }

    // IE names for arrows do not include the Arrow prefix
    const key = event.key.replace(/^Arrow/, '');

    const currentIdx = this.items.indexOf(this.focused);

    if (/[a-zA-Z0-9]/.test(key) && key.length === 1) {
      const idx = this._searchKey(currentIdx, key);
      if (idx >= 0) {
        this._focus(idx);
      }
      return;
    }

    const condition = item => !item.disabled;
    let idx, increment;

    if (this._vertical && key === 'Up' || !this._vertical && key === 'Left') {
      increment = -1;
      idx = currentIdx - 1;
    } else if (this._vertical && key === 'Down' || !this._vertical && key === 'Right') {
      increment = 1;
      idx = currentIdx + 1;
    } else if (key === 'Home') {
      increment = 1;
      idx = 0;
    } else if (key === 'End') {
      increment = -1;
      idx = this.items.length - 1;
    }

    idx = this._getAvailableIndex(idx, increment, condition);
    if (idx >= 0) {
      this._focus(idx);
      event.preventDefault();
    }
  }

  _getAvailableIndex(idx, increment, condition) {
    const totalItems = this.items.length;
    for (let i = 0; typeof idx == 'number' && i < totalItems; i++, idx += (increment || 1)) {
      if (idx < 0) {
        idx = totalItems - 1;
      } else if (idx >= totalItems) {
        idx = 0;
      }

      const item = this.items[idx];
      if (condition(item)) {
        return idx;
      }
    }
    return -1;
  }

  _setFocusable(idx) {
    idx = this._getAvailableIndex(idx, 1, item => !item.disabled);
    const item = this.items[idx] || this.items[0];
    this.items.forEach(e => e.tabIndex = e === item ? 0 : -1);
  }

  _focus(idx) {
    const item = this.items[idx];
    this.items.forEach(e => e.focused = e === item);
    this._setFocusable(idx);
    this._scrollToItem(idx);
    item.focus();
  }

  focus() {
    // In initialisation (e.g vaadin-select) observer might not been run yet.
    this._observer && this._observer.flush();
    const firstItem = this.querySelector('[tabindex="0"]') || (this.items ? this.items[0] : null);
    firstItem && firstItem.focus();
  }

  /* @protected */
  get _scrollerElement() {
    // Returning scroller element of the component
  }

  // Scroll the container to have the next item by the edge of the viewport
  _scrollToItem(idx) {
    const item = this.items[idx];
    if (!item) {
      return;
    }

    const props = this._vertical ? ['top', 'bottom'] : ['left', 'right'];
    const scrollerRect = this._scrollerElement.getBoundingClientRect();
    const nextItemRect = (this.items[idx + 1] || item).getBoundingClientRect();
    const prevItemRect = (this.items[idx - 1] || item).getBoundingClientRect();

    let scrollDistance = 0;
    if (nextItemRect[props[1]] >= scrollerRect[props[1]]) {
      scrollDistance = nextItemRect[props[1]] - scrollerRect[props[1]];
    } else if (prevItemRect[props[0]] <= scrollerRect[props[0]]) {
      scrollDistance = prevItemRect[props[0]] - scrollerRect[props[0]];
    }

    this._scroll(scrollDistance);
  }

  /* @protected */
  get _vertical() {
    return this.orientation !== 'horizontal';
  }

  _scroll(pixels) {
    this._scrollerElement['scroll' + (this._vertical ? 'Top' : 'Left')] += pixels;
  }
};

export { ListMixin as L };
