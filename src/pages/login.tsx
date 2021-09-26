import React from 'react'
import { ApolloError, useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import nuberLogo from '../images/logo.svg'
import FormError from '../components/form-error'
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation'
import Button from '../components/button'
import { Link } from 'react-router-dom'
import { authTokenVar, isLoggedInVar } from '../apollo'
import { LOCALSTORAGE_TOKEN } from '../utils/constants'

const LOGIN_MUTATION = gql`
 mutation loginMutation($loginInput: LoginInput!) {
  login(input: $loginInput) {
   ok
   token
   error
  }
 }
`

interface ILoginForm {
 email: string
 password: string
}

const onCompleted = (data: loginMutation) => {
 const {
  login: { ok, error, token },
 } = data

 if (ok && token) {
  localStorage.setItem(LOCALSTORAGE_TOKEN, token)
  authTokenVar(token)
  isLoggedInVar(true)
 }
}

const Login = () => {
 const {
  register,
  handleSubmit,
  watch,
  formState: { errors, isValid },
  getValues,
 } = useForm<ILoginForm>({
  mode: 'all',
 })

 const [loginMutation, { loading, error, data: loginMutationResult }] = useMutation<
  loginMutation,
  loginMutationVariables
 >(LOGIN_MUTATION, {
  onCompleted,
 })

 const onSubmit = () => {
  if (!loading) {
   const { email, password } = getValues()
   loginMutation({
    variables: {
     loginInput: {
      email,
      password,
     },
    },
   })
  }
 }

 return (
  <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
   <Helmet>
    <title>Login | Nuber Eats</title>
   </Helmet>
   <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
    <img src={nuberLogo} alt="Nuber Eats" className="w-52 mb-5" />
    <h4 className="w-full font-medium text-left text-3xl mb-5">Welcome back</h4>
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
     <Button canClick={isValid} loading={loading} actionText={'Log In'} />
     {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
    </form>
    <div>
     New to Nuber?{' '}
     <Link className="text-lime-600 hover:underline" to="/create-account">
      Create an Account
     </Link>
    </div>
   </div>
  </div>
 )
}

export default Login
