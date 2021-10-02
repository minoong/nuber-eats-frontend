import { ApolloProvider } from '@apollo/client'
import { render, RenderResult, waitFor } from '@testing-library/react'
import { createMockClient, MockApolloClient } from 'mock-apollo-client'
import { BrowserRouter as Router } from 'react-router-dom'
import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import Login, { LOGIN_MUTATION } from '../login'
import userEvent from '@testing-library/user-event'

describe('<Login />', () => {
 let renderResult: RenderResult
 let mockedClient: MockApolloClient
 beforeEach(async () => {
  await waitFor(() => {
   mockedClient = createMockClient()
   renderResult = render(
    <Router>
     <HelmetProvider>
      <ApolloProvider client={mockedClient}>
       <Login />
      </ApolloProvider>
     </HelmetProvider>
    </Router>,
   )
  })
 })
 it('should render OK', async () => {
  await waitFor(() => {
   expect(document.title).toBe('Login | Nuber Eats')
  })
 })

 it('displays email validation errors', async () => {
  const { getByPlaceholderText, debug, getByRole } = renderResult
  const email = getByPlaceholderText(/email/i)

  await waitFor(() => {
   userEvent.type(email, 'this@wont')
  })

  let errorMessage = getByRole('alert')
  expect(errorMessage).toHaveTextContent('이메일 형식으로 입력하세요')
  await waitFor(() => {
   userEvent.clear(email)
  })
  errorMessage = getByRole('alert')
  expect(errorMessage).toHaveTextContent(/Email is required/i)
 })

 it('display password required errors', async () => {
  const { getByPlaceholderText, debug, getByRole } = renderResult
  const email = getByPlaceholderText(/email/i)
  const submitBtn = getByRole('button')

  await waitFor(() => {
   userEvent.type(email, 'this@wont.com')
   userEvent.click(submitBtn)
  })
  const errorMessage = getByRole('alert')
  expect(errorMessage).toHaveTextContent(/Password is required/i)
 })

 it('submits form and calls mutation', async () => {
  const { getByPlaceholderText, debug, getByRole } = renderResult
  const email = getByPlaceholderText(/email/i)
  const password = getByPlaceholderText(/password/i)
  const submitBtn = getByRole('button')

  const formData = {
   email: 'real@test.com',
   password: '123',
  }
  const mockedMutationResponse = jest.fn().mockResolvedValue({
   data: {
    login: {
     ok: true,
     token: 'XXX',
     error: 'mutation-error',
    },
   },
  })
  mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse)
  jest.spyOn(Storage.prototype, 'setItem')
  await waitFor(() => {
   userEvent.type(email, formData.email)
   userEvent.type(password, formData.password)
   userEvent.click(submitBtn)
  })
  expect(mockedMutationResponse).toHaveBeenCalledTimes(1)
  expect(mockedMutationResponse).toHaveBeenCalledWith({
   loginInput: {
    email: formData.email,
    password: formData.password,
   },
  })
  const errorMessage = getByRole('alert')
  expect(errorMessage).toHaveTextContent(/mutation-error/i)
  expect(localStorage.setItem).toHaveBeenCalledWith('nuber-token', 'XXX')
 })
})
