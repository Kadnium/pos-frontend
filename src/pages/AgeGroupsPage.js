import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow: scroll;
  scroll-snap-type: x mandatory;
`

const AgeGroupSection = styled.div`
  width: 50vw;
  padding: 0 5vw;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;

  :first-child {
    padding-left: 25vw;
  }

  :last-child {
    padding-right: 25vw;
  }
`

const AgeGroupIllustration = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f5f5f5;
`

const AgeGroupsPage = () => {
  const ageGroups = [
    'Sudenpennut',
    'Seikkailijat',
    'Tarpojat',
    'Samoajat',
    'Vaeltajat',
  ]
  return (
    <Container>
      {ageGroups.map((ageGroup, i) => (
        <AgeGroupSection key={i} bg={i}>
          <AgeGroupIllustration />
          {ageGroup}
        </AgeGroupSection>
      ))}
    </Container>
  )
}

export default AgeGroupsPage
