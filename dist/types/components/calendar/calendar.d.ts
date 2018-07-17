import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { Day } from './interfaces/interfaces';
export declare class Calendar {
    languageCode: string;
    isSundayFirst: boolean;
    showToolbar: boolean;
    datePicker: boolean;
    onDaySelected: EventEmitter;
    onRangeSelected: EventEmitter;
    onAddEvent: EventEmitter;
    onReplaceEvent: EventEmitter;
    onRemoveEvent: EventEmitter;
    selectDay(day: any, month: any, year: any): void;
    showPreviousMonth(): void;
    showNextMonth(): void;
    changeYear(year: any): void;
    selectToday(): void;
    setEvents(events: Array<Day>): void;
    getEvents(): Array<Day>;
    getFullMonth(): Array<Day>;
    clearSelectedDay(): void;
    clearSelectedDays(): void;
    clearPickedDate(): void;
    addEvent(eventDay: Day): void;
    replaceEvent(eventDay: Day): void;
    removeEvent(eventDay: Day): void;
    private languages;
    private newDate;
    private currentDay;
    private currentMonth;
    private currentYear;
    private days;
    private events;
    private rangedDays;
    private selectedDay;
    private selectedDays;
    private dayIndex;
    private year;
    private month;
    private showCalendar;
    private pickedDate;
    private selectionType;
    componentWillLoad(): void;
    normalizeDay(day: number): number;
    private _getCalendarDays(year, month);
    private _getRangedDays(startDay, endDay);
    private _getTodayEvents(today);
    private _getCurrentMonthEvents();
    private _getDayIndex(days, day);
    private _showPreviousMonth();
    private _showNextMonth();
    private _changeYear(event?, year?);
    private _changeMonth(event);
    private _changeSelection(event);
    private _selectDay(day);
    private _selectMultiple(date);
    private _onAddEvent();
    private _onReplaceEvent();
    private _onRemoveEvent();
    private _removeEventData(dayIndex, eventDayIndex);
    private _switchCalendarBool();
    private _formatDate(no);
    private _formatPicked(day);
    render(): JSX.Element;
}
