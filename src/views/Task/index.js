import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DetailPage from 'components/DetailPage'
import { fetchTaskDetails } from 'api'
import { determineLanguageFromUrl, getTermInLanguage } from 'helpers'

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: scroll;

  > p {
    margin: 1.2rem 0;
    white-space: pre-line;
  }
`

const StyledDetailPage = styled(DetailPage)`
  display: grid;
  grid-template-rows: auto auto 1fr;
`

const SubHeading = styled.h5`
  margin: 0;
  opacity: 0.5;
`

const Task = () => {
  const { guid } = useParams()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const task = useSelector(state => state.itemsByGuid[guid])
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const [details, setDetails] = useState()
  const [suggestions, setSuggestions] = useState()

  const getSuggestionDetails = useCallback(
    async d => {
      const suggestionsInLanguage = d.suggestions_details.find(
        s => s.lang === language
      )
      if (suggestionsInLanguage) {
        const res = await fetch(suggestionsInLanguage.details)
        const data = await res.json()
        setSuggestions(data.items)
      }
    },
    [language]
  )

  const getTaskDetails = useCallback(async () => {
    const res = await fetchTaskDetails(task.item.guid, language)
    setDetails(res)
    getSuggestionDetails(res)
  }, [task, language, getSuggestionDetails])

  useEffect(() => {
    getTaskDetails()
  }, [getTaskDetails])

  const translations = task.item.languages.find(x => x.lang === language)

  const renderDetails = () => {
    if (!details || !generalTranslations) return null
    const { ingress, content } = details
    return (
      <DetailsContainer>
        {content && <p>{details.content}</p>}
        {ingress && (
          <>
            <SubHeading>
              {getTermInLanguage(generalTranslations, 'task_target', language)}
            </SubHeading>
            <p>{details.ingress}</p>
          </>
        )}
        {suggestions && (
          <>
            <SubHeading>
              {getTermInLanguage(generalTranslations, 'tips', language)}
            </SubHeading>
            {suggestions.map(suggestion => (
              <p key={suggestion.guid}>{suggestion.content}</p>
            ))}
          </>
        )}
      </DetailsContainer>
    )
  }

  if (!task) return null
  return (
    <StyledDetailPage
      onBackClick={() =>
        history.push(`/guid/${task.parentGuid}?lang=${language}`)
      }
      title={translations ? translations.title : task.item.title}
    >
      {renderDetails()}
    </StyledDetailPage>
  )
}

export default Task
