import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import Button from '../../components/commons/button'
import { createRestaurant, createRestaurantVariables } from '../../__generated__/createRestaurant'

const CREATE_RESTAURANT_MUTATION = gql`
 mutation createRestaurant($input: CreateRestaurantInput!) {
  createRestaurant(input: $input) {
   error
   ok
  }
 }
`

interface IFormProps {
 name: string
 address: string
 categoryName: string
}

const AddRestaurants = () => {
 const [createRestaurantMutation, { loading, error, data }] = useMutation<createRestaurant, createRestaurantVariables>(
  CREATE_RESTAURANT_MUTATION,
 )
 const {
  register,
  handleSubmit,
  watch,
  formState: { errors, isValid },
  getValues,
 } = useForm<IFormProps>({
  mode: 'onChange',
 })
 const onSubmit = () => {
  console.log(getValues())
 }
 return (
  <div className="container">
   <Helmet>
    <title>Add Restaurant | Nuber Eats</title>
   </Helmet>
   <h1>Add Restaurant</h1>
   <form onSubmit={handleSubmit(onSubmit)}>
    <input
     className="input"
     type="text"
     placeholder="name"
     {...register('name', {
      required: 'name is required.',
     })}
    />
    <input
     className="input"
     type="text"
     placeholder="address"
     {...register('address', {
      required: 'address is required.',
     })}
    />
    <input
     className="input"
     type="text"
     placeholder="categoryName"
     {...register('categoryName', {
      required: 'categoryName is required.',
     })}
    />
   </form>
   <Button loading={loading} canClick={isValid} actionText={'Create Restaurant'} />
  </div>
 )
}

export default AddRestaurants
