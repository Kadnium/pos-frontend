import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { X } from 'react-feather'
import { useSelector } from 'react-redux'
import { determineLanguageFromUrl, getTermInLanguage } from 'helpers'
import Group from './group'

const StyledAcceptTasks = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.color.background};
  pointer-events: all;
  overflow: auto;
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
const AcceptTasks = () => {
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const groupsData = useSelector((state) => state.user.userGroups)
  const translations = useSelector((state) => state.translations)
  if (!translations || !groupsData) return null

  return (
    <StyledAcceptTasks>
      <Header>
        <Subheading>
          {getTermInLanguage(translations, 'lisaa-ryhmalaisille')}
        </Subheading>
        <CloseIcon onClick={() => history.push(`/?lang=${language}`)} />
      </Header>
      <Content>
        <Subheading>
          {getTermInLanguage(translations, 'omat-ryhmat')}
        </Subheading>
        {groupsData.map((group, i) => {
          return (
            <Group
              key={group.id}
              group={group}
              isLast={i === groupsData.length - 1}
            />
          )
        })}
      </Content>
    </StyledAcceptTasks>
  )
}

export default AcceptTasks
