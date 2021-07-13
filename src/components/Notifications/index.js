import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Bell } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'

import useOnClickOutside from '../../hooks/onClickOutSide'
import Notification, { UnreadNotificator } from './Notification'
import { markNotificationsViewed, markNotificationViewed } from '../../api'
import {
  markAllNotificationsRead,
  markNotificationRead,
  toggleShowNotifications,
} from '../../redux/actionCreators'

const BUTTON_HEIGHT = '1rem'

const Container = styled.div`
  position: relative;
  margin-right: 1.5rem;
`

const BellContainer = styled.div`
  position: relative;
`

const ARROW_SIZE = '0.5rem'
const ArrowUp = styled.div`
  width: 0;
  height: 0;
  border-left: ${ARROW_SIZE} solid transparent;
  border-right: ${ARROW_SIZE} solid transparent;
  border-bottom: ${ARROW_SIZE} solid ${({ theme }) => theme.color.gradientDark};

  position: absolute;
  top: -${ARROW_SIZE};
  right: 4.15rem;
`

const PADDING = 1
const TOP = 4
const Dropdown = styled.div`
  top: ${TOP}rem;
  right: 0;
  color: white;
  width: calc(100vw - ${2 * PADDING}rem);
  height: calc(100vh - ${2 * PADDING}rem - ${TOP}rem);
  padding: ${PADDING}rem;
  position: fixed;
  background: ${({ theme }) => theme.color.gradientDark};
  padding-bottom: ${BUTTON_HEIGHT};
  display: flex;
  flex-direction: column;
`

const NotificationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-item; start;
  overflow-y: scroll;
  text-align: left;
`

const MarkAllRead = styled.div`
  width: 100%;
  height: ${BUTTON_HEIGHT};
  background: ${({ theme }) => theme.color.gradientDark};
  text-align: center;
  bottom: 0;
  cursor: pointer;
  color: white;
  margin-top: auto;
  border-top: 1px solid ${({ theme }) => theme.color.default};
  padding: 0rem;
  padding-top: 0.3rem;
`

const containsUnread = notifications => {
  if (!notifications) return false

  const unread = notifications.find(notification => !notification.viewed)

  return !!unread
}

const Notifications = () => {
  const containerRef = useRef()
  const [hasUnread, setHasUnread] = useState(false)
  const notifications = useSelector(state => state.notifications.list)
  const showDropdown = useSelector(state => state.notifications.show)
  const dispatch = useDispatch()

  useOnClickOutside(
    containerRef,
    () => showDropdown && dispatch(toggleShowNotifications())
  )

  useEffect(() => {
    const unread = containsUnread(notifications)
    if (unread) setHasUnread(true)
    else if (!unread && hasUnread) setHasUnread(false)
  }, [notifications])

  const markNotificationsRead = async () => {
    const result = await markNotificationsViewed()
    if (result.success) {
      dispatch(markAllNotificationsRead())
      dispatch(toggleShowNotifications())
    } else {
      // TODO: Error handling
    }
  }

  const markSingleNotificationRead = async notification => {
    const result = await markNotificationViewed(notification.id)
    if (result.success) {
      dispatch(markNotificationRead(notification.id))
    } else {
      // TODO: Error handling
    }
  }

  return (
    <Container ref={containerRef}>
      <BellContainer>
        <Bell onClick={() => dispatch(toggleShowNotifications())} />
        {hasUnread && <UnreadNotificator />}
      </BellContainer>
      {showDropdown && (
        <Dropdown>
          <ArrowUp />
          <NotificationsContainer>
            {notifications &&
              notifications.map(notification => (
                <Notification
                  key={notification.id}
                  notification={notification}
                  markRead={() => markSingleNotificationRead(notification)}
                />
              ))}
          </NotificationsContainer>
          <MarkAllRead onClick={markNotificationsRead}>
            Mark all as read
          </MarkAllRead>
        </Dropdown>
      )}
    </Container>
  )
}

export default Notifications
