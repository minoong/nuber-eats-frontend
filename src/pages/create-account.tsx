import React from 'react'
import { ApolloError, useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet'
import nuberLogo from '../images/logo.svg'
import FormError from '../components/form-error'
import Button from '../components/button'
import { Link } from 'react-router-dom'
import { UserRole } from '../__generated__/globalTypes'

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
  mode: 'all',
  defaultValues: {
   role: UserRole.Client,
  },
 })

 const [createAccountMutation] = useMutation(CREATE_ACCOUNT_MUTATION, {})
 console.log(watch())
 const onSubmit = () => {}

 return (
  <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
   <Helmet>
    <title>Create Account | Nuber Eats</title>
   </Helmet>
   <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
    <img src={nuberLogo} alt="logo" className="w-52 mb-5" />
    <h4 className="w-full font-medium text-left text-3xl mb-5">Let's get started</h4>
    <form className="grid gap-3 mt-5 w-full mb-5" onSubmit={handleSubmit(onSubmit)}>
     <input
      {...register('email', { required: 'Email is required' })}
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
     <Button canClick={isValid} loading={false} actionText={'Create Account'} />
    </form>
    <div>
     Already have an account?{' '}
     <Link className="text-lime-600 hover:underline" to="/login">
      Create an Account
     </Link>
    </div>
   </div>
  </div>
 )
}

export default CreateAccount
