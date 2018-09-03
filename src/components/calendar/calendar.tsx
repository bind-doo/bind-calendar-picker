import {
	Component,
	Prop,
	Method,
	State,
	Event,
	EventEmitter
} from '@stencil/core';
import { Day } from './interfaces/interfaces';

@Component({
	tag: 'bind-calendar-picker',
	styleUrl: 'calendar.scss'
})
export class Calendar {
	@Prop() languageCode: string = 'en';
	@Prop() isSundayFirst: boolean = false;
	@Prop() showToolbar: boolean = false;
	@Prop() datePicker: boolean = false;
	@Prop() showRangeSelect: boolean = false;
	@Prop() allowUnselectDate: boolean = false;
	@Prop() rangeSelect: boolean = false;

	@Event() onDaySelected: EventEmitter;
	@Event() onRangeSelected: EventEmitter;
	@Event() onAddEvent: EventEmitter;
	@Event() onReplaceEvent: EventEmitter;
	@Event() onRemoveEvent: EventEmitter;

	@Method()
	selectDay(date): void {
		const { day, month, year } = date;
		this.month = month - 1;
		this.year = year;
		this.days = this._getCalendarDays(year, month - 1);
		this._getCurrentMonthEvents();
		this._selectDay({ day: day, month: month, year: year });
	}

	@Method()
	showPreviousMonth(): void {
		this._showPreviousMonth();
	}

	@Method()
	showNextMonth(): void {
		this._showNextMonth();
	}

	@Method()
	setYear(year): void {
		this._setYear(year);
	}

	@Method()
	setMonth(month): void {
		this._setMonth(month);
	}

	@Method()
	selectToday(): void {
		const currentDate: Day = {
			day: this.currentDay,
			month: this.currentMonth,
			year: this.currentYear
		};

		if (this.selectedDays.length > 0 && this.selectionType === 'range') {
            this.clearSelectedDays();
            this.selectedDays[0] = currentDate;
		}

		this.selectDay(currentDate);
	}

	@Method()
	setEvents(events: Array<Day>): void {
		this.days = this._getCalendarDays(this.year, this.month);
		this.events = events;
		this._getCurrentMonthEvents();
	}

	@Method()
	getEvents(): Array<Day> {
		return this.events;
	}

	@Method()
	getFullMonth(): Array<Day> {
		return this.days;
	}

	@Method()
	clearSelectedDay(): void {
		this.selectedDay = null;
		this.dayIndex = null;
	}

	@Method()
	clearSelectedDays(): void {
		this.selectedDays = [];
	}

	@Method()
	clearPickedDate(): void {
		this.pickedDate = null;
	}

	@Method()
	addEvent(eventDay: Day): void {
		this.events.push(eventDay);
		this._getCurrentMonthEvents();
		this.clearSelectedDay();
	}

	@Method()
	replaceEvent(eventDay: Day): void {
		const eventDayIndex = this._getDayIndex(this.events, eventDay);
		const dayIndex = this._getDayIndex(this.days, eventDay);

		if (eventDayIndex !== -1 && dayIndex !== -1) {
			this._removeEventData(eventDayIndex, dayIndex);
			this.events.push(eventDay);
			this._getCurrentMonthEvents();
		}
	}

	@Method()
	removeEvent(eventDay: Day): void {
		const eventDayIndex = this._getDayIndex(this.events, eventDay);
		const dayIndex = this._getDayIndex(this.days, eventDay);

		if (eventDayIndex !== -1 && dayIndex !== -1)
			this._removeEventData(dayIndex, eventDayIndex);
	}

	@State()
	private languages = {
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

	private newDate: Date = new Date();

	private currentDay: number = this.newDate.getDate();
	private currentMonth: number = this.newDate.getMonth() + 1;
	private currentYear: number = this.newDate.getFullYear();

	@State() private days: Array<Day> = [];
	@State() private events: Array<Day> = [];
	@State() private rangedDays: Array<Day> = [];

	@State() private selectedDay: Day;
	@State() private selectedDays: Array<Day> = [];

	@State() private dayIndex: number;

	@State() private year: number = this.newDate.getFullYear();
	@State() private month: number = this.newDate.getMonth();

	@State() private showCalendar: boolean = false;
	@State() private pickedDate: any;
	@State() private selectionType: string = '';



	componentWillLoad() {
		if (this.isSundayFirst)
			this.languages[this.languageCode || 'en'].day_of_week_short.unshift(
				this.languages[this.languageCode || 'en'].day_of_week_short.pop()
			);
		this.days = this._getCalendarDays(this.year, this.month);
		this._getCurrentMonthEvents();
        !this.rangeSelect ? this.selectionType = 'day' : this.selectionType = 'range';
		console.log(this.selectionType)
	}

	normalizeDay(day: number): number {
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

	private _getCalendarDays(year: number, month: number): Array<Day> {
		const date: Date = new Date(year, month);

		const firstDayOfCurrentMonth: number = this.isSundayFirst ? date.getDay() : this.normalizeDay(date.getDay());
		const totalDaysInCurrentMonth: number = new Date(year, month + 1, 0).getDate();
		const prevMonthEnd: Date = new Date(year, month, 0);

		const totalDisplayDays: number =
			Math.ceil((totalDaysInCurrentMonth + firstDayOfCurrentMonth) / 7) * 7;
		let days: Array<Day> = [];

		let previousMonthLastDay: number =
			prevMonthEnd.getDate() - firstDayOfCurrentMonth;
		let firstDayOfNextMonth: number = 0;

		for (let dayCounter = 0; dayCounter < totalDisplayDays; dayCounter++) {

			const isNextMonth: boolean =
				dayCounter > totalDaysInCurrentMonth + firstDayOfCurrentMonth - 1;
			const day: Day =
				dayCounter < firstDayOfCurrentMonth
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

	private _getRangedDays(startDay: Day, endDay: Day): Array<Day> {
		let rangedDays: Array<Day> = [];

		const startDate: Date = new Date(startDay.year, startDay.month - 1, startDay.day);
		const endDate: Date = new Date(endDay.year, endDay.month - 1, endDay.day);

		for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
			let day: Day = {
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

	private _getTodayEvents(today: Day): Array<Day> {
		return this.events.filter(
			event =>
				event.day == today.day &&
				event.month == today.month &&
				event.year == today.year
		);
	}

	private _getCurrentMonthEvents(): void {
		for (let i = 0; i < this.days.length; i++) {
			let events = this._getTodayEvents(this.days[i]);
			if (events.length > 0) {
				this.days[i].data = events;
				this.days[i].hasEvent = true;
			}
		}
	}

	private _getDayIndex(days: Array<Day>, day: Day): number {
		let index: number = -1;
		days.forEach((dayOfMonth, idx) => {
			if (
				dayOfMonth.day == day.day &&
				dayOfMonth.month == day.month &&
				dayOfMonth.year == day.year
			)
				index = idx;
		});
		return index;
	}

	private _showPreviousMonth(): void {
		if (this.month === 0) {
			--this.year;
			this.month = 11;
		} else {
			--this.month;
		}

		this.days = this._getCalendarDays(this.year, this.month);
		if (this.selectedDay)
			this.dayIndex = this._getDayIndex(this.days, this.selectedDay);
		this._getCurrentMonthEvents();
	}

	private _showNextMonth(): void {
		if (this.month === 11) {
			++this.year;
			this.month = 0;
		} else {
			++this.month;
		}
		this.days = this._getCalendarDays(this.year, this.month);
		if (this.selectedDay)
			this.dayIndex = this._getDayIndex(this.days, this.selectedDay);
		this._getCurrentMonthEvents();
	}

	private _setYear(event?, year?): void {
		this.year = event.target.value || year;
		this.month = 0;
		this.days = this._getCalendarDays(this.year, this.month);
		if (this.selectedDay) this.dayIndex = this._getDayIndex(this.days, this.selectedDay);
		this._getCurrentMonthEvents();
	}

	private _setMonth(month): void {
		this.month = this.languages[this.languageCode].months.indexOf(month);
		this.days = this._getCalendarDays(this.year, this.month);
		if (this.selectedDay) this.dayIndex = this._getDayIndex(this.days, this.selectedDay);
		this._getCurrentMonthEvents();
	}

	private _changeSelection(selection: string): void {
		this.clearSelectedDay();
		this.clearSelectedDays();
		this.clearPickedDate();
		this.selectionType = selection;
	}

	private _selectDay(day: Day): void {
		if (this.selectedDay === day && this.allowUnselectDate) {
			this.clearSelectedDay();
		} else {
			this.dayIndex = this._getDayIndex(this.days, day);
			this.selectedDay = this.days[this.dayIndex];
			this.onDaySelected.emit(this.selectedDay);
			if (this.datePicker) {
				this.pickedDate = this._formatPicked(day);
				setTimeout(() => (this.showCalendar = false), 100);
			}
		}
	}

	private _selectMultiple(date: Day): void {

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

	private _onAddEvent(): void {
		this.onAddEvent.emit({
			action: 'event add',
			eventDay: this.selectedDay
		});
	}

	private _onReplaceEvent(): void {
		this.onReplaceEvent.emit({
			action: 'event replace,',
			eventDay: this.selectedDay.data
		});
	}

	private _onRemoveEvent(): void {
		this.onRemoveEvent.emit({
			action: 'event remove',
			eventDay: this.selectedDay.data
		});
	}

	private _removeEventData(dayIndex, eventDayIndex): void {
		this.days[dayIndex].data = [];
		this.days[dayIndex].hasEvent = false;
		this.events.splice(eventDayIndex, 1);
		this.clearSelectedDay();
	}

	private _switchCalendarBool(): void {
		this.showCalendar = !this.showCalendar;
	}

	private _formatDate(no: number): string {
		return no < 10 ? '0' + no : no.toString();
	}

	private _formatPicked(day: Day): string {
		return `${this._formatDate(day.day)}-${this._formatDate(day.month)}-${day.year.toString()}`;
	}

	private _isCurrentDay(date): boolean {
		return date.day === this.currentDay && date.month === this.currentMonth && date.year === this.currentYear;
	}

    private _checkIsDateInRange(date, selectedDays): boolean {
        if (selectedDays.length < 2) return;

        const current = new Date(date.year, date.month, date.day);
        const firstSelected = new Date(selectedDays[0].year, selectedDays[0].month, selectedDays[0].day)
        const lastSelected = new Date(selectedDays[1].year, selectedDays[1].month, selectedDays[1].day);

        return (current >= firstSelected && current <= lastSelected);
    }

	render() {
		let calendar;
		let datePicker;

		let toolbarTemplate;
		let toolbarEventButtons;

		let months = [];

		this.languages[this.languageCode].months.forEach(month => {
			if (
				month ===
				this.languages[this.languageCode]['months'][this.month]
			) {
				months.push(
					<option selected={true} value={month}>
						{month}
					</option>
				);
			} else {
				months.push(<option value={month}>{month}</option>);
			}
		});

		if (this.selectedDay) {
			toolbarEventButtons = (
				<div class="bc-toolbar-end">
					<button class="bc-toolbar-action-button bc-add-event-button bc-button-success" onClick={() => this._onAddEvent()}>
						Add event
          </button>
				</div>
			);
		}

		if (this.showToolbar) {
			toolbarTemplate = (
				<div>
					<div class="bc-calendar-toolbar-main">
						<div class="bc-toolbar-start">
							<button class="bc-toolbar-button bc-today-button" onClick={() => this.selectToday()}>
								Today
                            </button>
						</div>
						<div>
							{toolbarEventButtons}
						</div>
					</div>

					{this.selectedDay && this.selectedDay.hasEvent ?
						<div class="bc-calendar-toolbar-second">
							<button class="bc-toolbar-action-button bc-modify-events-button bc-button-success" onClick={() => this._onReplaceEvent()}>
								Replace event
                </button>
							<button class="bc-toolbar-action-button bc-modify-events-button bc-button-danger" onClick={() => this._onRemoveEvent()}>
								Remove all events
                </button>
						</div>
						:
						''
					}
				</div>
			);
		}

		calendar = (
			<div class="bc-calendar-container">
				<div class="bc-calendar-header">
					<div class="bc-header-left" onClick={() => this._showPreviousMonth()}>
						<button class="bc-nav-button-left">
							<i class="bc-arrow-icon bc-arrow-left"></i>
						</button>
					</div>

					<div class="bc-header-year">
						<select
							class="bc-header-month-select"
							onChange={(event: UIEvent) => this._setMonth(event.target['value'])}
						>
							{months}
						</select>
						<input
							class="bc-year-input-number"
							type="number"
							value={this.year}
							onChange={(event: UIEvent) => this.setYear(event)}
						/>
					</div>

					<div class="bc-header-right" onClick={() => this._showNextMonth()}>
						<button class="bc-nav-button-right">
                            <i class="bc-arrow-icon bc-arrow-right"></i>
						</button>
					</div>
				</div>

				<div class="bc-calendar-days bc-calendar-days-name">
					{this.languages[this.languageCode || 'en']['day_of_week_short'].map(
						dayName => <div class="bc-day-name">{dayName}</div>
					)}
				</div>


				<div class="bc-calendar-days">
					{this.days.map(date => (
						<div
							class={
								('bc-day-container ')
								+
								((this.days.indexOf(date) == this.dayIndex || date === this.selectedDays[0]) && this.selectedDays.length <= 1 ? 'bc-active-day' : '')
								+
								(this._checkIsDateInRange(date, this.selectedDays) ? 'bc-active-day' : '')
							}
							onClick={() => this.selectionType !== 'range' ? this._selectDay(date) : this._selectMultiple(date)}
						>
							<span
								class={
									(date.month !== this.month + 1 ? 'bc-muted-day' : '') +
									(this._isCurrentDay(date) ? 'bc-current-day' : '') +
									(date.month === this.month + 1 && !this._isCurrentDay(date) ? 'bc-day-number' : '')
								}
							>
								{date.day}
								<span class={date.hasEvent ? 'bc-day-event-dot' : ''} style={date.hasEvent ? date.data[0].style : ''} />
							</span>
						</div>
					))}
				</div>
				{toolbarTemplate}
                {this.showRangeSelect ?
                    <div class="bc-range-select">
                        <select class="bc-selection-select" onChange={(event: UIEvent) => this._changeSelection(event.target['value'])}>
                            <option value="day" selected={true}>Day</option>
                            <option value="range">Range</option>
                        </select>
                    </div>
                    :
                    ''
                }
			</div>
		);

		datePicker = (
			<div class="bc-date-picker">
				<div class="bc-input-with-icon" onClick={() => this._switchCalendarBool()}>
					<input
						type="text"
						value={this.pickedDate}
						disabled={true}
						class="bc-date-picker-input" />
					<i class="bc-calendar-icon" />
				</div>
				<div class="calendar-dropdown">{this.showCalendar ? calendar : ''}</div>
			</div>
		);

		return <div>{this.datePicker ? datePicker : calendar}</div>;
	}
}
