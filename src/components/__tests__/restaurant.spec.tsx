import { render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Restaurant from '../restaurant'

describe('<Restaurant />', () => {
 it('renders OK with props', () => {
  const { getByText, container } = render(
   <Router>
    <Restaurant id="1" coverImage="x" name="nameTest" categoryName="catTest" />
   </Router>,
  )
  getByText('nameTest')
  getByText('catTest')
  expect(container.firstChild).toHaveAttribute('href', '/restaurants/1')
 })
})
