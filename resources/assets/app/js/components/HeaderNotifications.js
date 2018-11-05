import React from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import SvgIcon from './UI/SvgIcon'
import NotificationsList from './NotificationsList'

const HeaderNotifications = ({
  deleteNotification,
  data: { loading, error, notifications, refetch }
}) =>
  <>
    <button className="notification-btn" type="button">
      <SvgIcon name="bell" className="notification-btn__icon" />
      {(!loading && !error && notifications.length > 0) && (
        <div className="notification-btn__counter"><span>{notifications.length}</span></div>
      )}
    </button>

    {(!loading && !error && notifications.length > 0) && (
      <div className="notifications" data-uk-dropdown="mode: click; pos: right-top;">
        <div className="notifications__inner">
          <NotificationsList
            items={notifications}
            deleteNotification={deleteNotification}
            reloadNotifications={refetch}
          />
        </div>
      </div>
    )}
  </>

const query = gql`
query {
  notifications {
    id
    title
    group
    icon
    uri
  }
}
`
const mutation = gql`
mutation DeleteNotification($id: Int!) {
  deleteNotification(id: $id) {
    id
  }
}
`
export default compose(
  graphql(query, {
    options: {
      fetchPolicy: "network-only"
    }
  }),
  graphql(mutation, { name: 'deleteNotification' })
)(HeaderNotifications)