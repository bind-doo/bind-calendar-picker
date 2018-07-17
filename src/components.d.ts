/**
 * This is an autogenerated file created by the Stencil build process.
 * It contains typing information for all components that exist in this project
 * and imports for stencil collections that might be configured in your stencil.config.js file
 */

import '@stencil/core';

declare global {
  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {}
  }
  namespace JSXElements {}

  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;
    componentOnReady(done: (ele?: this) => void): void;

    forceUpdate(): void;
  }

  interface HTMLAttributes {}
}

import {
  Day,
} from './components/calendar/interfaces/interfaces';

declare global {

  namespace StencilComponents {
    interface BindCalendarPicker {
      'addEvent': (eventDay: Day) => void;
      'changeYear': (year: any) => void;
      'clearPickedDate': () => void;
      'clearSelectedDay': () => void;
      'clearSelectedDays': () => void;
      'datePicker': boolean;
      'getEvents': () => Day[];
      'getFullMonth': () => Day[];
      'isSundayFirst': boolean;
      'languageCode': string;
      'removeEvent': (eventDay: Day) => void;
      'replaceEvent': (eventDay: Day) => void;
      'selectDay': (day: any, month: any, year: any) => void;
      'selectToday': () => void;
      'setEvents': (events: Day[]) => void;
      'showNextMonth': () => void;
      'showPreviousMonth': () => void;
      'showToolbar': boolean;
    }
  }

  interface HTMLBindCalendarPickerElement extends StencilComponents.BindCalendarPicker, HTMLStencilElement {}

  var HTMLBindCalendarPickerElement: {
    prototype: HTMLBindCalendarPickerElement;
    new (): HTMLBindCalendarPickerElement;
  };
  interface HTMLElementTagNameMap {
    'bind-calendar-picker': HTMLBindCalendarPickerElement;
  }
  interface ElementTagNameMap {
    'bind-calendar-picker': HTMLBindCalendarPickerElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'bind-calendar-picker': JSXElements.BindCalendarPickerAttributes;
    }
  }
  namespace JSXElements {
    export interface BindCalendarPickerAttributes extends HTMLAttributes {
      'datePicker'?: boolean;
      'isSundayFirst'?: boolean;
      'languageCode'?: string;
      'onOnAddEvent'?: (event: CustomEvent) => void;
      'onOnDaySelected'?: (event: CustomEvent) => void;
      'onOnRangeSelected'?: (event: CustomEvent) => void;
      'onOnRemoveEvent'?: (event: CustomEvent) => void;
      'onOnReplaceEvent'?: (event: CustomEvent) => void;
      'showToolbar'?: boolean;
    }
  }
}

declare global { namespace JSX { interface StencilJSX {} } }

export declare function defineCustomElements(window: any): void;