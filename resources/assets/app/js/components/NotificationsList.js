import React, { Fragment } from 'react'
import SvgIcon from "./UI/SvgIcon"
import { Link } from 'react-router-dom'

const NotificationDefault = ({ id, title }) =>
    <div className="notification-item__link">
        <span className="notification-item__icon">
            <SvgIcon name="folder" />
        </span>
        <span
            className="notification-item__text"
            dangerouslySetInnerHTML={{__html:title}}
        />
    </div>

const NotificationTask = ({ title, data }) =>
    <Link
        to={`/programs/${data.program_id}/${data.module_id}/${data.task_id}`}
        className="notification-item__link"
    >
        <span className="notification-item__icon">
            <SvgIcon name="calendar" />
        </span>
        <span
            className="notification-item__text"
            dangerouslySetInnerHTML={{__html:title}}
        />
    </Link>

const NotificationProgram = ({ title, data }) =>
    <Link
        to={`/programs/${data.program_id}/expert`}
        className="notification-item__link"
    >
        <span className="notification-item__icon">
            <SvgIcon name="doc" />
        </span>
        <span
            className="notification-item__text"
            dangerouslySetInnerHTML={{__html:title}}
        />
    </Link>

class NotificationsList extends React.Component {
    getGroups() {
        const { items } = this.props

        return items.reduce((res, currentValue) => {
            if (res.indexOf(currentValue.group) === -1) {
                res.push(currentValue.group)
            }
            return res
        }, []).map(group => ({
            group: group,
            items: items.filter(_el => _el.group === group)
        }))
    }

    getItemByType(item) {
        switch (item.type) {
            case 'task': return <NotificationTask {...item} />
            case 'program': return <NotificationProgram {...item} />
            default: return <NotificationDefault {...item} />
        }
    }

    render() {
        const { deleteNotification } = this.props

        return (
            <Fragment>
                {this.getGroups().map(({ group, items }, index) => (
                    <div className="notification-item" key={index}>
                        <div
                            className="notification-item__title"
                            dangerouslySetInnerHTML={{__html:group}}
                        />
                        {items.map(item => (
                            <div className="notification-item__info" key={item.id}>
                                {this.getItemByType(item)}
                                <button
                                    className="notification-item__remove-btn"
                                    type="button"
                                    onClick={() => deleteNotification(item.id)}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </Fragment>
        )
    }
}

export default NotificationsList