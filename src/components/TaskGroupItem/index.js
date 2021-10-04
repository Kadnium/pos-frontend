import React from 'react'
import ListItem from 'components/ListItem'
import taskGroupGraphics from 'graphics/taskGroups'
// import { getTranslatedTasks } from '../../helpers'
import { useSelector } from 'react-redux'

export const getSubTaskGroupsOrTasksText = (
  tasksTerm,
  taskGroup,
  // language,
  // itemsByGuid,
  translated
) => {
  const term = tasksTerm || 'aktiviteettia'
  const tasksExist = taskGroup.tasks.length > 0
  const tasksGroupsExist = taskGroup.taskgroups.length > 0
  const tasksText = tasksExist ? translated.tasks.length : ''
  const taskGroupsText = tasksGroupsExist ? translated.subGroups.length : ''
  return `${tasksText} ${
    tasksExist && tasksGroupsExist ? '+' : ''
  } ${taskGroupsText} ${term}`
}

const TaskGroupItem = ({
  taskGroup,
  ageGroupGuid,
  language,
  tasksTerm,
  subTitle,
  itemType,
  actionsComponent,
  showActions,
  groupGuid,
}) => {
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  const languageInfo = taskGroup.loca.find((x) => x.lang === language)
  // const translatedSubTaskGroups = getTranslatedTaskGroups(
  //   taskGroup.taskgroups,
  //   itemsByGuid,
  //   language
  // )
  // const translatedTasks = getTranslatedTasks(taskGroup.tasks, language)
  // const translated = {
  //   tasks: translatedTasks,
  //   subGroups: translatedSubTaskGroups,
  // }
  // const hasTasksOrSubGroups =
  //   translated.tasks.length > 0 || translated.subGroups.length > 0

  // return languageInfo && languageInfo.title && hasTasksOrSubGroups ? (
  return (
    <ListItem
      guid={taskGroup.guid}
      showActions={showActions}
      itemType={itemType}
      actionsComponent={actionsComponent}
      ageGroupGuid={ageGroupGuid}
      groupGuid={groupGuid}
      title={languageInfo.title}
      subTitle={
        subTitle ||
        getSubTaskGroupsOrTasksText(
          tasksTerm,
          taskGroup,
          language,
          itemsByGuid
          // translated
        )
      }
      language={language}
      icon={taskGroupGraphics[`Group${taskGroup.guid}`] || null}
    />
  )
}

export default TaskGroupItem
