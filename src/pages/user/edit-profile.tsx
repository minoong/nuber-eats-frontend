import { gql, useApolloClient, useMutation } from '@apollo/client'
import React, { FormEventHandler } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import Button from '../../components/commons/button'
import { useMe } from '../../hooks/useMe'
import { editProfile, editProfileVariables } from '../../__generated__/editProfile'

const EDIT_PROFILE_MUTATION = gql`
 mutation editProfile($input: EditProfileInput!) {
  editProfile(input: $input) {
   ok
   error
  }
 }
`

interface IFormProps {
 email?: string
 password: string
}

const EditProfile = () => {
 const client = useApolloClient()
 const { data: userData, refetch } = useMe()
 const onCompleted = (data: editProfile) => {
  const {
   editProfile: { error, ok },
  } = data
  if (ok && userData) {
   const {
    me: { email: prevEmail, id },
   } = userData
   const { email: newEmail } = getValues()

   if (prevEmail !== newEmail) {
    client.writeFragment({
     id: `User:${id}`,
     fragment: gql`
      fragment EditedUser on User {
       verified
       email
      }
     `,
     data: {
      verified: false,
      email: newEmail,
     },
    })
   }
   //    await refetch()
  }
 }
 const [editProfile, { loading, data, error }] = useMutation<editProfile, editProfileVariables>(EDIT_PROFILE_MUTATION, {
  onCompleted,
 })
 const {
  register,
  handleSubmit,
  watch,
  formState: { errors, isValid },
  getValues,
 } = useForm<IFormProps>({
  mode: 'onChange',
  defaultValues: {
   email: userData?.me.email,
  },
 })
 const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
  //   e.preventDefault()
  const { email, password } = getValues()
  editProfile({
   variables: {
    input: {
     email,
     ...(password !== '' && { password }),
    },
   },
  })
 }

 console.log(data, error)
 return (
  <div className="pt-52 flex flex-col justify-center items-center">
   <Helmet>
    <title>Edit Profile | Nuber Eats</title>
   </Helmet>
   <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
   <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
    <input
     {...register('email', {
      pattern: {
       value:
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
       message: '이메일 형식으로 입력하세요',
      },
     })}
     name="email"
     className="input"
     type="email"
     placeholder="Email"
    />
    <input {...register('password')} name="password" className="input" type="password" placeholder="Password" />
    <Button loading={loading} canClick={isValid} actionText={'Save Profile'} />
    {data?.editProfile.error}
   </form>
  </div>
 )
}

export default EditProfile
