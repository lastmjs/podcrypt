import { i as idlePeriod } from './async-ea1a09a1.js';
import { D as Debouncer, e as enqueueDebouncer } from './debounce-ac221512.js';
import './boot-5426e289.js';
import { u as usageStatistics } from './vaadin-usage-statistics-1e49874d.js';

if (!window.Vaadin) {
  window['Vaadin'] = {};
}

/**
 * Array of Vaadin custom element classes that have been finalized.
 */
window['Vaadin'].registrations = window.Vaadin.registrations || [];

// Use the hack to prevent polymer-modulizer from converting to exports
window['Vaadin'].developmentModeCallback = window.Vaadin.developmentModeCallback || {};
window['Vaadin'].developmentModeCallback['vaadin-usage-statistics'] = function() {
  if (usageStatistics) {
    usageStatistics();
  }
};

let statsJob;

/**
 * @polymerMixin
 */
const ElementMixin = superClass => class VaadinElementMixin extends superClass {
  /** @protected */
  static _finalizeClass() {
    super._finalizeClass();

    // Registers a class prototype for telemetry purposes.
    if (this.is) {
      window.Vaadin.registrations.push(this);

      if (window.Vaadin.developmentModeCallback) {
        statsJob = Debouncer.debounce(statsJob,
          idlePeriod, () => {
            window.Vaadin.developmentModeCallback['vaadin-usage-statistics']();
          }
        );
        enqueueDebouncer(statsJob);
      }
    }
  }
  ready() {
    super.ready();
    if (document.doctype === null) {
      console.warn(
        'Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.'
      );
    }
  }
};

export { ElementMixin as E };
