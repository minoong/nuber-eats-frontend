import React from 'react'
import { ApolloError, useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import nuberLogo from '../images/logo.svg'
import FormError from '../components/form-error'
import { Link, useHistory } from 'react-router-dom'
import { UserRole } from '../__generated__/globalTypes'
import { createAccountMutation, createAccountMutationVariables } from '../__generated__/createAccountMutation'
import Button from '../components/commons/button'

const CREATE_ACCOUNT_MUTATION = gql`
 mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
  createAccount(input: $createAccountInput) {
   ok
   error
  }
 }
`

interface ICreateAccountForm {
 email: string
 password: string
 role: UserRole
}

const CreateAccount = () => {
 const {
  register,
  handleSubmit,
  watch,
  formState: { errors, isValid },
  getValues,
 } = useForm<ICreateAccountForm>({
  mode: 'onChange',
  defaultValues: {
   role: UserRole.Client,
  },
 })
 const history = useHistory()
 const onCompleted = (data: createAccountMutation) => {
  const {
   createAccount: { ok, error },
  } = data

  if (ok) {
   alert('Account Created! Log In now!')
   history.push('/')
  }
 }

 const [createAccountMutation, { loading, data: createAccountMutationResult }] = useMutation<
  createAccountMutation,
  createAccountMutationVariables
 >(CREATE_ACCOUNT_MUTATION, { onCompleted })
 const onSubmit = () => {
  if (!loading) {
   const { email, password, role } = getValues()
   createAccountMutation({
    variables: {
     createAccountInput: {
      email,
      password,
      role,
     },
    },
   })
  }
 }

 return (
  <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
   <Helmet>
    <title>Create Account | Nuber Eats</title>
   </Helmet>
   <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
    <img src={nuberLogo} alt="Nuber Eats" className="w-52 mb-5" />
    <h4 className="w-full font-medium text-left text-3xl mb-5">Let's get started</h4>
    <form className="grid gap-3 mt-5 w-full mb-5" onSubmit={handleSubmit(onSubmit)}>
     <input
      {...register('email', {
       required: 'Email is required',
       pattern: {
        value:
         /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: '이메일 형식으로 입력하세요',
       },
      })}
      name="email"
      type="email"
      required
      placeholder="Email"
      className="input"
     />
     {errors.email?.message && <FormError errorMessage={errors.email.message} />}
     <input
      {...register('password', { required: 'Password is required' })}
      name="password"
      type="password"
      required
      placeholder="Password"
      className="input"
     />
     {errors.password?.message && <FormError errorMessage={errors.password.message} />}
     {errors.password?.type === 'minLength' && <FormError errorMessage="Password must be more than 10 chars." />}
     <select {...register('role', { required: true })} className="input" name="role">
      {Object.keys(UserRole).map((role) => (
       <option key={role}>{role}</option>
      ))}
     </select>
     <Button canClick={isValid} loading={loading} actionText={'Create Account'} />
     {createAccountMutationResult?.createAccount.error && (
      <FormError errorMessage={createAccountMutationResult.createAccount.error} />
     )}
    </form>
    <div>
     Already have an account?{' '}
     <Link className="text-lime-600 hover:underline" to="/">
      Create an Account
     </Link>
    </div>
   </div>
  </div>
 )
}

export default CreateAccount
