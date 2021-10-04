import { ApolloProvider } from '@apollo/client'
import { RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMockClient, MockApolloClient } from 'mock-apollo-client'
import React from 'react'
import { render, waitFor } from '../../test-utils'
import { UserRole } from '../../__generated__/globalTypes'
import CreateAccount, { CREATE_ACCOUNT_MUTATION } from '../create-account'

const mockPush = jest.fn()

jest.mock('react-router-dom', () => {
 const realModule = jest.requireActual('react-router-dom')
 return {
  ...realModule,
  useHistory: () => {
   return {
    push: mockPush,
   }
  },
 }
})

describe('<CreateAccount />', () => {
 let mockedClent: MockApolloClient
 let renderResult: RenderResult
 beforeEach(async () => {
  await waitFor(() => {
   mockedClent = createMockClient()
   renderResult = render(
    <ApolloProvider client={mockedClent}>
     <CreateAccount />
    </ApolloProvider>,
   )
  })
 })
 it('renders OK', async () => {
  await waitFor(() => {
   expect(document.title).toBe('Create Account | Nuber Eats')
  })
 })

 it('renders validation errors', async () => {
  const { getByRole, getByPlaceholderText } = renderResult
  const email = getByPlaceholderText(/email/i)
  const button = getByRole('button')

  await waitFor(() => {
   userEvent.type(email, 'wont@work')
  })

  let errorMessage = getByRole('alert')
  expect(errorMessage).toHaveTextContent('이메일 형식으로 입력하세요')
  await waitFor(() => {
   userEvent.clear(email)
  })
  errorMessage = getByRole('alert')
  expect(errorMessage).toHaveTextContent(/Email is required/i)
  await waitFor(() => {
   userEvent.type(email, 'test@email.com')
   userEvent.click(button)
  })
  errorMessage = getByRole('alert')
  expect(errorMessage).toHaveTextContent(/Password is required/i)
 })

 it('submits mutation with form values', async () => {
  const { getByRole, getByPlaceholderText } = renderResult
  const email = getByPlaceholderText(/email/i)
  const password = getByPlaceholderText(/password/i)
  const button = getByRole('button')
  const formData = {
   email: 'working@email.com',
   password: '12',
   role: UserRole.Client,
  }

  const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
   data: {
    createAccount: {
     ok: true,
     error: 'mutation-error',
    },
   },
  })

  jest.spyOn(window, 'alert').mockImplementation(() => null)

  mockedClent.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedLoginMutationResponse)

  await waitFor(() => {
   userEvent.type(email, formData.email)
   userEvent.type(password, formData.password)
   userEvent.click(button)
  })
  expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1)
  expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
   createAccountInput: {
    email: formData.email,
    password: formData.password,
    role: formData.role,
   },
  })
  expect(window.alert).toHaveBeenCalledWith('Account Created! Log In now!')
  const mutationError = getByRole('alert')
  expect(mockPush).toHaveBeenCalledWith('/')
  expect(mutationError).toHaveTextContent('mutation-error')
 })
 afterAll(() => {
  jest.clearAllMocks()
 })
})
