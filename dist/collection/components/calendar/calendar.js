export class Calendar {
    constructor() {
        this.languageCode = 'en';
        this.isSundayFirst = false;
        this.showToolbar = false;
        this.datePicker = false;
        // TODO: LATER - Add optional list that shows when event is clicked
        // TODO: LATER - add own json with language
        this.languages = {
            en: {
                day_of_week_short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                day_of_week: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                ],
                months: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ]
            },
            de: {
                day_of_week_short: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
                day_of_week: [
                    'Montag',
                    'Dienstag',
                    'Mittwoch',
                    'Donnerstag',
                    'Freitag',
                    'Samstag',
                    'Sonntag'
                ],
                months: [
                    'Januar',
                    'Februar',
                    'März',
                    'April',
                    'Mai',
                    'Juni',
                    'Juli',
                    'August',
                    'September',
                    'Oktober',
                    'November',
                    'Dezember'
                ]
            },
            bs: {
                day_of_week_short: ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'],
                day_of_week: [
                    'Ponedjeljak',
                    'Utorak',
                    'Srijeda',
                    'Četvrtak',
                    'Petak',
                    'Subota',
                    'Nedjelja'
                ],
                months: [
                    'Januar',
                    'Februar',
                    'Mart',
                    'April',
                    'Maj',
                    'Juni',
                    'Juli',
                    'Avgust',
                    'Septembar',
                    'Oktobar',
                    'Novembar',
                    'Decembar'
                ]
            }
        };
        this.newDate = new Date();
        this.currentDay = this.newDate.getDate();
        this.currentMonth = this.newDate.getMonth();
        this.currentYear = this.newDate.getFullYear();
        this.days = [];
        this.events = [];
        this.rangedDays = [];
        this.selectedDays = [];
        this.year = this.newDate.getFullYear();
        this.month = this.newDate.getMonth();
        this.showCalendar = false;
        this.selectionType = 'day';
    }
    selectDay(day, month, year) {
        this.month = month;
        this.year = year;
        this.days = this._getCalendarDays(year, month);
        this._getCurrentMonthEvents();
        this._selectDay({ day: day, month: month + 1, year: year });
    }
    showPreviousMonth() {
        this._showPreviousMonth();
    }
    showNextMonth() {
        this._showNextMonth();
    }
    changeYear(year) {
        this._changeYear(year);
    }
    selectToday() {
        this.selectDay(this.currentDay, this.currentMonth, this.currentYear);
    }
    setEvents(events) {
        this.days = this._getCalendarDays(this.year, this.month);
        this.events = events;
        this._getCurrentMonthEvents();
    }
    getEvents() {
        return this.events;
    }
    getFullMonth() {
        return this.days;
    }
    clearSelectedDay() {
        this.selectedDay = null;
        this.dayIndex = null;
    }
    clearSelectedDays() {
        this.selectedDays = [];
    }
    clearPickedDate() {
        this.pickedDate = null;
    }
    addEvent(eventDay) {
        this.events.push(eventDay);
        this._getCurrentMonthEvents();
        this.clearSelectedDay();
    }
    replaceEvent(eventDay) {
        const eventDayIndex = this._getDayIndex(this.events, eventDay);
        const dayIndex = this._getDayIndex(this.days, eventDay);
        if (eventDayIndex !== -1 && dayIndex !== -1) {
            this._removeEventData(eventDayIndex, dayIndex);
            this.events.push(eventDay);
            this._getCurrentMonthEvents();
        }
    }
    removeEvent(eventDay) {
        const eventDayIndex = this._getDayIndex(this.events, eventDay);
        const dayIndex = this._getDayIndex(this.days, eventDay);
        if (eventDayIndex !== -1 && dayIndex !== -1)
            this._removeEventData(dayIndex, eventDayIndex);
    }
    componentWillLoad() {
        if (this.isSundayFirst)
            this.languages[this.languageCode || 'en'].day_of_week_short.unshift(this.languages[this.languageCode || 'en'].day_of_week_short.pop());
        this.days = this._getCalendarDays(this.year, this.month);
        this._getCurrentMonthEvents();
    }
    normalizeDay(day) {
        switch (day) {
            case 0:
                return 6;
            case 1:
                return 0;
            case 2:
                return 1;
            case 3:
                return 2;
            case 4:
                return 3;
            case 5:
                return 4;
            case 6:
                return 5;
        }
    }
    _getCalendarDays(year, month) {
        const date = new Date(year, month);
        const firstDayOfCurrentMonth = this.isSundayFirst ? date.getDay() : this.normalizeDay(date.getDay());
        const totalDaysInCurrentMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthEnd = new Date(year, month, 0);
        const totalDisplayDays = Math.ceil((totalDaysInCurrentMonth + firstDayOfCurrentMonth) / 7) * 7;
        let days = [];
        let previousMonthLastDay = prevMonthEnd.getDate() - firstDayOfCurrentMonth;
        let firstDayOfNextMonth = 0;
        for (let dayCounter = 0; dayCounter < totalDisplayDays; dayCounter++) {
            const isNextMonth = dayCounter > totalDaysInCurrentMonth + firstDayOfCurrentMonth - 1;
            const day = dayCounter < firstDayOfCurrentMonth
                ? {
                    day: ++previousMonthLastDay,
                    month: this.month,
                    year: date.getFullYear(),
                    hasEvent: false,
                    data: []
                }
                : {
                    day: isNextMonth
                        ? ++firstDayOfNextMonth
                        : dayCounter - firstDayOfCurrentMonth + 1,
                    month: isNextMonth ? this.month + 2 : this.month + 1,
                    year: date.getFullYear(),
                    hasEvent: false,
                    data: []
                };
            days.push(day);
        }
        return days;
    }
    _getRangedDays(startDay, endDay) {
        let rangedDays = [];
        const startDate = new Date(startDay.year, startDay.month - 1, startDay.day);
        const endDate = new Date(endDay.year, endDay.month - 1, endDay.day);
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            let day = {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
            };
            day.data = this._getTodayEvents(day);
            day.hasEvent = (day.data.length > 0) ? true : false;
            rangedDays.push(day);
        }
        return rangedDays;
    }
    _getTodayEvents(today) {
        return this.events.filter(event => event.day == today.day &&
            event.month == today.month &&
            event.year == today.year);
    }
    _getCurrentMonthEvents() {
        for (let i = 0; i < this.days.length; i++) {
            let events = this._getTodayEvents(this.days[i]);
            if (events.length > 0) {
                this.days[i].data = events;
                this.days[i].hasEvent = true;
            }
        }
    }
    _getDayIndex(days, day) {
        let index = -1;
        days.forEach((dayOfMonth, idx) => {
            if (dayOfMonth.day == day.day &&
                dayOfMonth.month == day.month &&
                dayOfMonth.year == day.year)
                index = idx;
        });
        return index;
    }
    _showPreviousMonth() {
        if (this.month === 0) {
            --this.year;
            this.month = 11;
        }
        else {
            --this.month;
        }
        this.days = this._getCalendarDays(this.year, this.month);
        if (this.selectedDay)
            this.dayIndex = this._getDayIndex(this.days, this.selectedDay);
        this._getCurrentMonthEvents();
    }
    _showNextMonth() {
        if (this.month === 11) {
            ++this.year;
            this.month = 0;
        }
        else {
            ++this.month;
        }
        this.days = this._getCalendarDays(this.year, this.month);
        if (this.selectedDay)
            this.dayIndex = this._getDayIndex(this.days, this.selectedDay);
        this._getCurrentMonthEvents();
    }
    _changeYear(event, year) {
        this.year = event.target.value || year;
        this.month = 0;
        this.days = this._getCalendarDays(this.year, this.month);
        if (this.selectedDay)
            this.dayIndex = this._getDayIndex(this.days, this.selectedDay);
        this._getCurrentMonthEvents();
    }
    _changeMonth(event) {
        this.month = this.languages[this.languageCode].months.indexOf(event.target.value);
        this.days = this._getCalendarDays(this.year, this.month);
        if (this.selectedDay)
            this.dayIndex = this._getDayIndex(this.days, this.selectedDay);
        this._getCurrentMonthEvents();
    }
    _changeSelection(event) {
        this.clearSelectedDay();
        this.clearSelectedDays();
        this.clearPickedDate();
        this.selectionType = event.target.value;
    }
    _selectDay(day) {
        if (this.selectedDay === day) {
            this.clearSelectedDay();
        }
        else {
            this.selectedDay = day;
            this.dayIndex = this._getDayIndex(this.days, this.selectedDay);
            this.onDaySelected.emit(day);
            if (this.datePicker) {
                this.pickedDate = this._formatPicked(day);
                setTimeout(() => (this.showCalendar = false), 100);
            }
        }
    }
    _selectMultiple(date) {
        if (this.selectedDays.length === 2) {
            this.clearSelectedDays();
            this.clearSelectedDay();
            this.clearPickedDate();
        }
        if (this.selectedDay && this.selectedDays.length === 0) {
            this.selectedDays.push(this.selectedDay);
            return;
        }
        if (this.selectedDays.length === 0) {
            this.selectedDays.push(date);
            this.pickedDate = this._formatPicked(this.selectedDays[0]);
            return;
        }
        let inputDate = new Date(date.year, date.month - 1, date.day);
        let firstSelectedDate = new Date(this.selectedDays[0].year, this.selectedDays[0].month - 1, this.selectedDays[0].day);
        let inputSmallerThanStartDate = inputDate <= firstSelectedDate;
        if (this.selectedDays.length === 1) {
            inputSmallerThanStartDate ? this.selectedDays.unshift(date) : this.selectedDays.push(date);
            this.pickedDate = `${this._formatPicked(this.selectedDays[0])} - ${this._formatPicked(this.selectedDays[1])}`;
            this.rangedDays = this._getRangedDays(this.selectedDays[0], this.selectedDays[1]);
            this.onRangeSelected.emit(this.rangedDays);
        }
    }
    _onAddEvent() {
        this.onAddEvent.emit({
            action: 'event add',
            eventDay: this.selectedDay
        });
    }
    _onReplaceEvent() {
        this.onReplaceEvent.emit({
            action: 'event replace,',
            eventDay: this.selectedDay.data
        });
    }
    _onRemoveEvent() {
        this.onRemoveEvent.emit({
            action: 'event remove',
            eventDay: this.selectedDay.data
        });
    }
    _removeEventData(dayIndex, eventDayIndex) {
        this.days[dayIndex].data = [];
        this.days[dayIndex].hasEvent = false;
        this.events.splice(eventDayIndex, 1);
        this.clearSelectedDay();
    }
    _switchCalendarBool() {
        this.showCalendar = !this.showCalendar;
    }
    _formatDate(no) {
        return no < 10 ? '0' + no : no.toString();
    }
    _formatPicked(day) {
        return `${this._formatDate(day.day)}-${this._formatDate(day.month)}-${day.year.toString()}`;
    }
    render() {
        let calendar;
        let datePicker;
        let toolbarTemplate;
        let toolbarEventButtons;
        let months = [];
        this.languages[this.languageCode].months.forEach(month => {
            if (month ===
                this.languages[this.languageCode]['months'][this.month]) {
                months.push(h("option", { selected: true, value: month }, month));
            }
            else {
                months.push(h("option", { value: month }, month));
            }
        });
        if (this.selectedDay) {
            toolbarEventButtons = (h("div", { class: "bc_toolbar-end" },
                h("button", { class: "bc_toolbar-action-button bc_button-success", onClick: () => this._onAddEvent() }, "Add event"),
                this.selectedDay.hasEvent ? (h("span", null,
                    h("button", { class: "bc_toolbar-action-button bc_button-success", onClick: () => this._onReplaceEvent() },
                        ' ',
                        "Replace event"),
                    h("button", { class: "bc_toolbar-action-button bc_button-danger", onClick: () => this._onRemoveEvent() }, "Remove all events"))) : ('')));
        }
        if (this.showToolbar) {
            toolbarTemplate = (h("div", null,
                h("div", { class: "bc_calendar-toolbar-top" },
                    h("div", { class: "bc_toolbar-start" },
                        h("button", { class: "bc_toolbar-button", onClick: () => this.selectToday() }, "Today")),
                    toolbarEventButtons),
                h("div", { class: "bc_calendar-toolbar-bottom" },
                    h("select", { class: "bc_selection-select", onChange: (event) => this._changeSelection(event) },
                        h("option", { value: "day", selected: true }, "Day"),
                        h("option", { value: "range" }, "Range")))));
        }
        calendar = (h("div", { class: "bc_calendar-container" },
            h("div", { class: "bc_calendar-header" },
                h("div", { class: "bc_header-left", onClick: () => this._showPreviousMonth() },
                    h("button", { class: "bc_nav-button-left" })),
                h("div", { class: "bc_header-year" },
                    h("select", { class: "bc_header-month-select", onChange: (event) => this._changeMonth(event) }, months),
                    h("input", { class: "bc_year-input-number", type: "number", value: this.year, onChange: (event) => this._changeYear(event) })),
                h("div", { class: "bc_header-right", onClick: () => this._showNextMonth() },
                    h("button", { class: "bc_nav-button-right" }))),
            h("div", { class: "bc_calendar-days bc_calendar-days-name" }, this.languages[this.languageCode || 'en']['day_of_week_short'].map(dayName => h("div", { class: "bc_day-name" }, dayName))),
            h("div", { class: "bc_calendar-days" }, this.days.map(date => (h("div", { class: (this.days.indexOf(date) == this.dayIndex || date === this.selectedDays[0] ? 'bc_active-day' : '')
                    +
                        (date === this.selectedDays[1] ? 'bc_range-end-day' : ''), onClick: () => this.selectionType !== 'range' ? this._selectDay(date) : this._selectMultiple(date) },
                h("span", { class: (date.month !== this.month + 1 ? 'bc_muted-day' : '') +
                        (date.day === this.currentDay &&
                            date.month === this.currentMonth + 1 &&
                            date.year === this.currentYear
                            ? 'bc_current-day'
                            : '') },
                    date.day,
                    h("span", { class: date.hasEvent ? 'bc_day-event-dot' : '' })))))),
            toolbarTemplate));
        datePicker = (h("div", { class: "bc_date-picker" },
            h("div", { class: "bc_input-with-icon", onClick: () => this._switchCalendarBool() },
                h("input", { type: "text", value: this.pickedDate, disabled: true, class: "bc_date-picker-input" }),
                h("i", { class: "bc_calendar-icon" })),
            h("div", { class: "calendar-dropdown" }, this.showCalendar ? calendar : '')));
        return h("div", null, this.datePicker ? datePicker : calendar);
    }
    static get is() { return "bind-calendar-picker"; }
    static get properties() { return {
        "addEvent": {
            "method": true
        },
        "changeYear": {
            "method": true
        },
        "clearPickedDate": {
            "method": true
        },
        "clearSelectedDay": {
            "method": true
        },
        "clearSelectedDays": {
            "method": true
        },
        "datePicker": {
            "type": Boolean,
            "attr": "date-picker"
        },
        "dayIndex": {
            "state": true
        },
        "days": {
            "state": true
        },
        "events": {
            "state": true
        },
        "getEvents": {
            "method": true
        },
        "getFullMonth": {
            "method": true
        },
        "isSundayFirst": {
            "type": Boolean,
            "attr": "is-sunday-first"
        },
        "languageCode": {
            "type": String,
            "attr": "language-code"
        },
        "languages": {
            "state": true
        },
        "month": {
            "state": true
        },
        "pickedDate": {
            "state": true
        },
        "rangedDays": {
            "state": true
        },
        "removeEvent": {
            "method": true
        },
        "replaceEvent": {
            "method": true
        },
        "selectDay": {
            "method": true
        },
        "selectedDay": {
            "state": true
        },
        "selectedDays": {
            "state": true
        },
        "selectionType": {
            "state": true
        },
        "selectToday": {
            "method": true
        },
        "setEvents": {
            "method": true
        },
        "showCalendar": {
            "state": true
        },
        "showNextMonth": {
            "method": true
        },
        "showPreviousMonth": {
            "method": true
        },
        "showToolbar": {
            "type": Boolean,
            "attr": "show-toolbar"
        },
        "year": {
            "state": true
        }
    }; }
    static get events() { return [{
            "name": "onDaySelected",
            "method": "onDaySelected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "onRangeSelected",
            "method": "onRangeSelected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "onAddEvent",
            "method": "onAddEvent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "onReplaceEvent",
            "method": "onReplaceEvent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "onRemoveEvent",
            "method": "onRemoveEvent",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:bind-calendar-picker:**/"; }
}
