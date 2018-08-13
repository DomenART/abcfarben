import React, { Fragment } from 'react'
import moment from 'moment'
import classNames from 'classnames'
import Http from '../Http'
import SvgIcon from "./UI/SvgIcon"

class Calendar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            weekStartOn: 1,
            dayList: [],
            events: [],
            resources: [],
            curYear: new Date().getFullYear(),
            curMonth: new Date().getMonth(),
            curDate: new Date().getDate()
        }

        this.modal = React.createRef()

        this.prevMonth = this.prevMonth.bind(this)
        this.nextMonth = this.nextMonth.bind(this)
        this.showModal = this.showModal.bind(this)
    }

    dayList() {
        let dateObj = new Date()
        let firstDay = new Date(this.state.curYear, this.state.curMonth, 1)
        let dayOfWeek = firstDay.getDay()
        // Calculate the offset based on the current date
        if (this.state.weekStartOn > dayOfWeek) {
            dayOfWeek = dayOfWeek - this.state.weekStartOn + 7
        } else if (this.state.weekStartOn < dayOfWeek) {
            dayOfWeek = dayOfWeek - this.state.weekStartOn
        } else {
            dayOfWeek = dayOfWeek - 1;
        }
        let startDate = new Date(firstDay)
        startDate.setDate(firstDay.getDate() - dayOfWeek)
        let item, days = [], tmpItem
        for (let i = 0; i < 42; i++) {
            item = new Date(startDate)
            item.setDate(startDate.getDate() + i)
            tmpItem = {
                date: this.dateFormat(item),
                day: item.getDate(),
                status: this.state.curMonth === item.getMonth(),
                events: []
            }
            this.state.events.forEach(row => {
                if (tmpItem.date === row.created_at.split(' ')[0]) {
                    tmpItem.events.push(row)
                }
            })
            // for (let index in this.state.events) {
            //     if (tmpItem.date === index) {
            //         tmpItem.events = this.state.events[index]
            //     }
            // }
            days.push(tmpItem)
        }
        return days
    }

    dateFormat(dateObj) {
        return moment(dateObj).format("YYYY-MM-DD")
    }

    getCurrentDate() {
        return new Date(this.state.curYear, this.state.curMonth, this.state.curDate)
    }

    setCurrentDate(date) {
        let arr = date.format("YYYY/MM/D").split('/')

        this.setState({
            curYear: arr[0],
            curMonth: arr[1] - 1,
            curDate: arr[2]
        })
    }

    prevMonth() {
        this.setCurrentDate(moment(this.getCurrentDate()).subtract(1, 'months'))
    }

    nextMonth() {
        this.setCurrentDate(moment(this.getCurrentDate()).add(1, 'months'))
    }

    loadEvents(events) {
        if (events.length > 0) {
            this.setState({
                resources: events
            }, this.showModal)
        }
    }

    showModal() {
        UIkit.modal(this.modal.current).show()
    }

    componentDidMount() {
        Http.get('/api/events').then(response => {
            this.setState({
                events: response.data
            })
        })
    }

    render() {
        const resources = this.state.resources && Object.keys(this.state.resources).map(key => {
            let item = this.state.resources[key]

            return (
                <div className='calendar-event' key={item.id}>
                    <div className="calendar-event__title">
                        {item.pagetitle}
                    </div>
                    <div className="calendar-event__desc">
                        {item.introtext}
                    </div>
                    <a href={item.uri} className="calendar-event__more">Подробнее &rarr;</a>
                </div>
            )
        })

        moment.locale('ru')

        return (
            <div className="main-aside__section">
                <button className="main-aside__link calendar-btn" type="button" data-uk-toggle="target: #aside-calendar">
                    <SvgIcon name="calendar" className="calendar-btn__icon" />
                    <span className="calendar-btn__title">Календарь</span>
                </button>
                <div className="calendar" id="aside-calendar" hidden>
                    <div className="calendar__control">
                        <button
                            className="calendar__control-prev"
                            type="button"
                            onClick={this.prevMonth}
                        />
                        <div className="calendar__control-month">
                            {moment(this.getCurrentDate()).format("MMMM")}
                        </div>
                        <button
                            className="calendar__control-next"
                            type="button"
                            onClick={this.nextMonth}
                        />
                    </div>
                    <div className="calendar-table">
                        <div className="calendar-table__item calendar-table__item_headline">ПН</div>
                        <div className="calendar-table__item calendar-table__item_headline">ВТ</div>
                        <div className="calendar-table__item calendar-table__item_headline">СР</div>
                        <div className="calendar-table__item calendar-table__item_headline">ЧТ</div>
                        <div className="calendar-table__item calendar-table__item_headline">ПТ</div>
                        <div className="calendar-table__item calendar-table__item_headline">СБ</div>
                        <div className="calendar-table__item calendar-table__item_headline">ВС</div>
                        {this.dayList().map(item => (
                            <div
                                className={classNames('calendar-table__item', {
                                    'calendar-table__item_events': Boolean(item.events.length),
                                    'calendar-table__item_inactive': !item.status,
                                    'calendar-table__item_active': item.status,
                                    'calendar-table__item_today': item.date === this.dateFormat(new Date())
                                })}
                                dangerouslySetInnerHTML={{__html:item.day}}
                                key={item.date}
                                onClick={() => this.loadEvents(item.events)}
                            />
                        ))}
                    </div>
                    
                    <div ref={this.modal} data-uk-modal>
                        <div className="events uk-modal-dialog uk-modal-body">
                            <button className="close uk-modal-close" type="button" data-uk-close />
                            {this.state.resources.map(row => (
                                <div className="events-item">
                                    <div className="events-item__heading">
                                        <SvgIcon name="folder" className="events-item__heading-icon" />
                                        <h3 className="events-item__heading-desc">
                                            {row.annotation ? row.annotation : moment(row.created_at).format("DD MMMM YYYY")}
                                        </h3>
                                    </div>
                                    <h3
                                        className="events-item__title"
                                        dangerouslySetInnerHTML={{__html:row.title}}
                                    />
                                    <div
                                        className="events-item__text"
                                        dangerouslySetInnerHTML={{__html:row.content}}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Calendar