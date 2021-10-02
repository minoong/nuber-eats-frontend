import { render } from '@testing-library/react'
import React from 'react'
import Button from '../commons/button'

describe('<Button />', () => {
 it('should render OK with props', () => {
  const { getByText } = render(<Button canClick={true} loading={false} actionText={'test'} />)
  getByText('test')
 })

 it('should display loading', () => {
  const { container, getByText } = render(<Button canClick={false} loading={true} actionText={'test'} />)

  getByText('Loading...')
  expect(container.firstChild).toHaveClass('bg-gray-300 pointer-events-none')
 })
})
