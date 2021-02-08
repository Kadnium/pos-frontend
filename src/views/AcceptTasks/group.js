import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useParams } from 'react-router-dom'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import { Check } from 'react-feather'
import ListItem from 'components/ListItem'
import { COMPLETION_STATUS, ITEM_TYPES } from 'consts'
import { useSelector } from 'react-redux'
import { StyledAcceptIcon } from '../../components/TaskActionsIcons'
import { useDispatch } from 'react-redux'
import { updateGroupMemberTask } from '../../redux/actionCreators'
import { acceptGroupMemeberTasks } from '../../api'

const StyledAcceptTasks = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.color.background};
  pointer-events: all;
  overflow: auto;
`

const Subheading = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: normal;
`

const Content = styled.div`
  padding: 1rem;

  > ${Subheading} {
    margin-bottom: 1rem;
  }
`

const AcceptTasksAction = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4rem;
  z-index: 1;
  animation: ${keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `} 200ms linear;
`

const ActivityItem = styled.div`
  display: flex;
  align-items: center;

  > span {
    padding: 1rem;
  }

  :last-child {
    justify-content: center;

    > span {
      padding-top: 2rem;
    }
  }
`

const StyledListItem = styled.div`
  padding: 0 3.5rem 2rem 3.5rem;
  text-decoration: none;
`

const initialList = []

const getInitialCheckboxData = group =>
  group.members.map(member => ({
    selected: false,
    name: member.memberName,
    id: member.memberId,
    tasks: member.memberTasks,
  }))

const Group = ({ group }) => {
  const dispatch = useDispatch()
  const { taskGuid } = useParams()
  const groupsData = useSelector(state => state.user.userGroups)
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const [memberIdList, setMemberIdList] = React.useState(initialList)
  const [selectedGroup, setSelectedGroup] = React.useState()
  const [checkboxData, setCheckboxData] = React.useState(
    getInitialCheckboxData(group)
  )
  if (!generalTranslations || !groupsData) return null

  const groupName = group.name
  const ageGroup = group.ageGroup
  const ageGroupId = group.id
  const title = '' + groupName + ' / ' + ageGroup

  function isCompleted(memberTasks) {
    const completedTasks = Object.keys(memberTasks).filter(
      guid => memberTasks[guid] === COMPLETION_STATUS.COMPLETED
    )
    const isCompleted = !!completedTasks.find(guid => guid === taskGuid)

    return isCompleted
  }
  function updateGroup(group) {
    if (selectedGroup) {
      setSelectedGroup(null)
    } else {
      setSelectedGroup(group)
    }
  }

  function handleChange(event) {
    handleCheckboxSelection(Number(event.target.value), event.target.checked)
    const editableList = memberIdList.slice(0)
    if (memberIdList.includes(event.target.value)) {
      const index = memberIdList.findIndex(id => id === event.target.value)
      editableList.splice(index, 1)
    } else {
      editableList.push(event.target.value)
    }
    setMemberIdList(editableList)
  }

  async function handleSubmit() {
    try {
      const data = {
        userIds: memberIdList,
      }
      await acceptGroupMemeberTasks(data, taskGuid)
      for (let id of memberIdList) {
        dispatch(
          updateGroupMemberTask({
            task_guid: taskGuid,
            user_guid: Number(id),
            completion_status: COMPLETION_STATUS.COMPLETED,
            groupGuid: Number(selectedGroup),
          })
        )
      }
    } catch (e) {
      console.log(e)
    }
    setMemberIdList(initialList)
  }

  function handleCheckboxSelection(memberId, isChecked) {
    const editableCheckboxData = checkboxData
    editableCheckboxData.map(member => {
      if (member.id === memberId && isChecked) {
        member.selected = true
      }
      if (member.id === memberId && !isChecked) {
        member.selected = false
      }
    })

    setCheckboxData(editableCheckboxData)
  }

  return (
    <StyledAcceptTasks>
      <Content>
        <Accordion
          allowZeroExpanded
          onChange={() => updateGroup(ageGroupId)}
          key={ageGroupId}
        >
          <AccordionItem key={ageGroupId}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <ListItem
                  key={ageGroupId}
                  ageGroupGuid={ageGroupId}
                  title={title}
                  language="fi"
                  icon={null}
                  itemType={ITEM_TYPES.TASK}
                  showActions
                  showActionsIcon
                />
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <Content>
                {group.members.map(member => {
                  return (
                    <StyledListItem key={member.memberId}>
                      <label
                        style={{ float: 'left', margin: 0 }}
                        htmlFor={member.memberId}
                      >
                        {member.memberName}
                      </label>
                      {isCompleted(member.memberTasks) ? (
                        <Check
                          style={{
                            float: 'right',
                            margin: 0,
                            width: '1.3rem',
                            height: '1.3rem',
                            color: 'green',
                          }}
                        />
                      ) : (
                        <input
                          id={member.memberId}
                          style={{
                            float: 'right',
                            margin: 0,
                            width: '1.3rem',
                            height: '1.3rem',
                          }}
                          type="checkbox"
                          value={member.memberId}
                          onChange={handleChange}
                        />
                      )}
                    </StyledListItem>
                  )
                })}
              </Content>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </Content>
      {memberIdList.length > 0 ? (
        <AcceptTasksAction onClick={handleSubmit}>
          <ActivityItem>
            <StyledAcceptIcon />
            Lisää valituille
          </ActivityItem>
        </AcceptTasksAction>
      ) : null}
    </StyledAcceptTasks>
  )
}

export default Group
