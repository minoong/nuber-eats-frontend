import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { isLoggedInVar } from '../../apollo'
import { App } from '../app'

jest.mock('../../routers/logged-out-router', () => {
 return {
  LoggedOutRouter: () => <span>logged-out</span>,
 }
})
jest.mock('../../routers/logged-in-router', () => {
 return {
  LoggedInRouter: () => <span>logged-in</span>,
 }
})

describe('<App />', () => {
 it('reders LoggedOutRouter', () => {
  const { getByText } = render(<App />)
  getByText('logged-out')
 })
 it('reders LoggedInRouter', async () => {
  await waitFor(() => {
   isLoggedInVar(true)
  })
  const { getByText } = render(<App />)
  getByText('logged-in')
 })
})
