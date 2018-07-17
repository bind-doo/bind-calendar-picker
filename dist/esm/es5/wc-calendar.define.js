// WcCalendar: Custom Elements Define Library, ES Module/ES5 Target
import { defineCustomElement } from './wc-calendar.core.js';
import {
  Calendar
} from './wc-calendar.components.js';

export function defineCustomElements(window, opts) {
  defineCustomElement(window, [
    Calendar
  ], opts);
}