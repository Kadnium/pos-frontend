import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { renderWithTheme } from 'test'
import TaskGroupItem from './index'

const taskGroupItemProps = {
  taskGroup: {
    guid: '1234',
    tasks: [{ guid: '1' }, { guid: '2' }, { guid: '3' }],
    taskgroups: [{ guid: '4' }, { guid: '5' }, { guid: '6' }],
    languages: [{ lang: 'fi', title: 'Sudenpennut' }],
  },
  ageGroupIndex: 2,
  language: 'sv',
}

const TestComponent = (
  <MemoryRouter>
    <TaskGroupItem {...taskGroupItemProps} />
  </MemoryRouter>
)

describe('TaskGroupItem component', () => {
  it('renders the amounts of given subTaskGroups and tasks', () => {
    const { getByTestId } = renderWithTheme(TestComponent)
    const elem = getByTestId('tasks-text')
    expect(elem.innerHTML).toBe(
      `${taskGroupItemProps.taskGroup.tasks.length} aktiviteettia ${taskGroupItemProps.taskGroup.taskgroups.length} aktiviteettiryhmää`
    )
  })
})
