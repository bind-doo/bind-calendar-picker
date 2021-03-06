/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */

import '@stencil/core';

declare global {
  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {}
  }
  namespace JSXElements {}

  interface HTMLElement {
    componentOnReady?: () => Promise<this | null>;
  }

  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;

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
      'allowUnselectDate': boolean;
      'clearPickedDate': () => void;
      'clearSelectedDay': () => void;
      'clearSelectedDays': () => void;
      'datePicker': boolean;
      'getCalendarDates': () => any[];
      'getEvents': () => Day[];
      'getFullMonth': () => Day[];
      'isSundayFirst': boolean;
      'languageCode': string;
      'rangeSelect': boolean;
      'removeEvent': (eventDay: Day) => void;
      'replaceEvent': (eventDay: Day) => void;
      'selectDay': (date: any) => void;
      'selectToday': () => void;
      'setEvents': (events: Day[]) => void;
      'setMonth': (month: any) => void;
      'setYear': (year: any) => void;
      'showNextMonth': () => void;
      'showPreviousMonth': () => void;
      'showRangeSelect': boolean;
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
      'allowUnselectDate'?: boolean;
      'datePicker'?: boolean;
      'isSundayFirst'?: boolean;
      'languageCode'?: string;
      'onOnAddEvent'?: (event: CustomEvent) => void;
      'onOnCalendarInit'?: (event: CustomEvent) => void;
      'onOnDaySelected'?: (event: CustomEvent) => void;
      'onOnPeriodChange'?: (event: CustomEvent) => void;
      'onOnRangeSelected'?: (event: CustomEvent) => void;
      'onOnRemoveEvent'?: (event: CustomEvent) => void;
      'onOnReplaceEvent'?: (event: CustomEvent) => void;
      'rangeSelect'?: boolean;
      'showRangeSelect'?: boolean;
      'showToolbar'?: boolean;
    }
  }
}

declare global { namespace JSX { interface StencilJSX {} } }

export declare function defineCustomElements(window: any): void;