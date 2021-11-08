import React, { useEffect } from 'react'
import styled from 'styled-components'
import striptags from 'striptags'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import DetailPage from 'components/DetailPage'
import ListItem from 'components/ListItem'

import {
  deepFlatten,
  determineLanguageFromUrl,
  getActivityGroupIcon,
  getTermInLanguage,
} from 'helpers'
import { ITEM_TYPES } from 'consts'
import { setItemsByGuid } from 'redux/actionCreators'

const StyledDetailPage = styled(DetailPage)`
  display: grid;
  grid-template-rows: auto auto 1fr;
`

const TaskList = styled.div`
  padding-bottom: 2rem;
  overflow: scroll;
`

const TaskGroup = () => {
  const { id } = useParams()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const userTasks = useSelector((state) => state.tasks)
  const taskGroup = useSelector((state) => state.itemsByGuid[id])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setItemsByGuid(deepFlatten(taskGroup.item.activities)))
  }, [id])

  const activityGroup = useSelector(
    (state) => state.activityGroups[taskGroup.item.id]
  )

  const generalTranslations = useSelector((state) => state.translations.yleiset)
  const favourites = useSelector((state) => state.favourites)

  const mandatoryTasks = []
  const optionalTasks = []

  activityGroup.activities.forEach((activity) => {
    if (activity.mandatory === true) {
      mandatoryTasks.push(activity)
    } else {
      optionalTasks.push(activity)
    }
  })

  const getTask = (task) => {
    const status = userTasks[task.wp_guid]
      ? userTasks[task.wp_guid].toLowerCase()
      : ''
    const task_status = status === 'active' ? 'started' : `task_${status}`
    const icon = getActivityGroupIcon(activityGroup)

    return (
      <ListItem
        key={task.id}
        guid={task.wp_guid}
        ageGroupGuid={taskGroup.item.age_group.wp_guid}
        title={task.title}
        subTitle={getTermInLanguage(
          generalTranslations,
          `${task_status}`,
          language
        )}
        language={language}
        icon={icon}
        itemType={ITEM_TYPES.TASK}
        showActions
        showFavourite
        isFavourite={favourites.includes(task.wp_guid)}
        isLoggedIn={status}
      />
    )
  }

  return (
    <StyledDetailPage
      onBackClick={() =>
        history.push(
          `/guid/${taskGroup.item.age_group.wp_guid}?lang=${language}`
        )
      }
      title={activityGroup.title}
    >
      <TaskList>
        {activityGroup.ingress && <p>{striptags(activityGroup.ingress)}</p>}
        {activityGroup.content && activityGroup.content.length < 700 && (
          <p>{striptags(activityGroup.content)}</p>
        )}
        {activityGroup.activities.length > 0 ? (
          <>
            <h4>
              <span>
                {getTermInLanguage(
                  generalTranslations,
                  'mandatory_plural',
                  language
                )}
              </span>
            </h4>
            {mandatoryTasks.length > 0 ? (
              mandatoryTasks.map((task) => {
                return getTask(task)
              })
            ) : (
              <p>
                <span>
                  {getTermInLanguage(
                    generalTranslations,
                    'no_mandatory_tasks',
                    language
                  )}
                </span>
              </p>
            )}
            <h4>
              <span>
                {getTermInLanguage(
                  generalTranslations,
                  'optional_plural',
                  language
                )}
              </span>
            </h4>
            {optionalTasks.length > 0 ? (
              optionalTasks.map((task) => {
                return getTask(task)
              })
            ) : (
              <p>
                <span>
                  {getTermInLanguage(
                    generalTranslations,
                    'no_optional_tasks',
                    language
                  )}
                </span>
              </p>
            )}
          </>
        ) : (
          <></>
        )}
      </TaskList>
    </StyledDetailPage>
  )
}

export default TaskGroup
