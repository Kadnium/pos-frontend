import {
  SET_USER,
  SET_USER_GROUPS,
  SET_GROUP_MEMBER_TASK,
  SET_GROUP_MEMBER_TASKGROUP,
} from 'redux/actionTypes'

const setTask = (user, taskData) => {
  const groupIndex = user.userGroups.findIndex((group) => {
    return group.id === taskData.groupGuid
  })
  const memberIndex = user.userGroups[groupIndex].members.findIndex(
    (member) => member.memberId === taskData.user_guid
  )

  const tasks = Object.assign(
    {},
    user.userGroups[groupIndex].members[memberIndex].memberTasks
  )
  tasks[taskData.task_guid] = taskData.completion_status

  const userGroups = user.userGroups.slice(0)
  const groupMembers = user.userGroups[groupIndex].members.slice(0)
  groupMembers[memberIndex].memberTasks = tasks
  userGroups[groupIndex].members = groupMembers
  return {
    ...user,
    userGroups,
  }
}

const setTaskGroup = (user, taskGroupData) => {
  const groupIndex = user.userGroups.findIndex((group) => {
    return group.id === taskGroupData.groupGuid
  })
  const memberIndex = user.userGroups[groupIndex].members.findIndex(
    (member) => member.memberId === taskGroupData.user_guid
  )

  const taskGroups = Object.assign(
    {},
    user.userGroups[groupIndex].members[memberIndex].memberTaskGroups
  )
  taskGroups[taskGroupData.taskgroup_guid] = taskGroupData.completed

  const userGroups = user.userGroups.slice(0)
  const groupMembers = user.userGroups[groupIndex].members.slice(0)
  groupMembers[memberIndex].memberTaskGroups = taskGroups
  userGroups[groupIndex].members = groupMembers

  return {
    ...user,
    userGroups,
  }
}

export const user = (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      action.payload.canMarkDone = true
      return {
        ...state,
        ...action.payload,
      }
    case SET_USER_GROUPS:
      return {
        ...state,
        userGroups: action.payload,
      }
    case SET_GROUP_MEMBER_TASK:
      return setTask(state, action.payload)
    case SET_GROUP_MEMBER_TASKGROUP:
      return setTaskGroup(state, action.payload)
    default:
      return state
  }
}
