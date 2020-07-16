import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { X } from 'react-feather'
import ListItem from 'components/ListItem'
import { ITEM_TYPES } from 'consts'
import { useSelector } from 'react-redux'
import { determineLanguageFromUrl, getTermInLanguage } from 'helpers'
import { fetchGroups } from 'api'

const StyledManage = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.color.background};
  pointer-events: all;
`

const Header = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 1rem;
  padding-top: 1.5rem;
  text-align: center;
  background-color: #1a1a1a;
`

const Subheading = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: normal;
`

const CloseIcon = styled(X)`
  position: absolute;
  top: 1.45rem;
  right: 1rem;
`

const Content = styled.div`
  padding: 1rem;

  > ${Subheading} {
    margin-bottom: 1rem;
  }
`

const Manage = () => {
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const [groupsData, setGroupsData] = useState([])
  const [isFetchingData, setIsFetchingData] = useState(false)
  const generalTranslations = useSelector(state => state.translations.yleiset)
  if (!generalTranslations) return null

  if (!Object.entries(groupsData).length && !isFetchingData) {
    setIsFetchingData(true)
    fetchGroups()
      .then(groupsData => {
        setGroupsData(groupsData)
      })
      .catch(error => {
        console.error(error)
        return error
      })
      .finally(() => {
        setIsFetchingData(false)
      })
  }

  // TODO: käännös alla olevalle Omat laumat otsikolle
  return (
    <StyledManage>
      <Header>
        <Subheading>
          {getTermInLanguage(generalTranslations, 'manage', language)}
        </Subheading>
        <CloseIcon onClick={() => history.push('/')} />
      </Header>
      <Content>
        <Subheading>Omat laumat</Subheading>
        {groupsData.map(group => {
          const groupName = group.name
          const ageGroup = group.ageGroup
          const ageGroupId = group.id
          const groupMembers = group.members.length + ' partiolaista'
          const title = '' + groupName + ' / ' + ageGroup
          return (
            <ListItem
              key={ageGroupId}
              ageGroupGuid={ageGroupId}
              title={title}
              subTitle={groupMembers}
              language="fi"
              icon={null}
              itemType={ITEM_TYPES.TASK}
              showActions
            />
          )
        })}
        <Subheading>
          {getTermInLanguage(generalTranslations, 'notifications', language)}
        </Subheading>
        <ListItem
          ageGroupGuid={'default'}
          title="Viittaveljet / Sudenpennut 2"
          subTitle="Jäsen 1 liittyi"
          language="fi"
          icon={null}
          itemType={ITEM_TYPES.TASK}
          showActions
        />
      </Content>
    </StyledManage>
  )
}

export default Manage
