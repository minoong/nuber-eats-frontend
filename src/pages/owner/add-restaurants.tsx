import { gql, useApolloClient, useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import Button from '../../components/commons/button'
import FormError from '../../components/form-error'
import { createRestaurant, createRestaurantVariables } from '../../__generated__/createRestaurant'
import { MY_RESTAURANTS_QUERY } from './my-restaurants'

const CREATE_RESTAURANT_MUTATION = gql`
 mutation createRestaurant($input: CreateRestaurantInput!) {
  createRestaurant(input: $input) {
   error
   ok
   restaurantId
  }
 }
`

interface IFormProps {
 name: string
 address: string
 categoryName: string
 file: FileList
}

const AddRestaurant = () => {
 const client = useApolloClient()
 const history = useHistory()
 const [imageUrl, setImageUrl] = useState('')
 const onCompleted = (data: createRestaurant) => {
  const {
   createRestaurant: { ok, restaurantId },
  } = data
  if (ok) {
   const { name, categoryName, address } = getValues()
   setUploading(false)
   const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY })
   client.writeQuery({
    query: MY_RESTAURANTS_QUERY,
    data: {
     myRestaurants: {
      ...queryResult.myRestaurants,
      restaurants: [
       {
        address,
        category: {
         name: categoryName,
         __typename: 'Category',
        },
        coverImage: imageUrl,
        id: restaurantId,
        isPromoted: false,
        name,
        __typename: 'Restaurant',
       },
       ...queryResult.myRestaurants.restaurants,
      ],
     },
    },
   })
   history.push('/')
  }
 }
 const [createRestaurantMutation, { data, error }] = useMutation<createRestaurant, createRestaurantVariables>(
  CREATE_RESTAURANT_MUTATION,
  {
   onCompleted,
  },
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
 const [uploading, setUploading] = useState(false)

 const onSubmit = async () => {
  try {
   setUploading(true)
   const { file, name, categoryName, address } = getValues()
   const actualFile = file[0]
   const formBody = new FormData()
   formBody.append('file', actualFile)
   const { url: coverImage } = await (
    await fetch('http://127.0.0.1:4000/uploads/', {
     method: 'POST',
     body: formBody,
    })
   ).json()

   setImageUrl(() => coverImage)

   console.log(coverImage)

   createRestaurantMutation({
    variables: {
     input: {
      name,
      categoryName,
      address,
      coverImage,
     },
    },
   })
  } catch (e) {}
 }
 return (
  <div className="container flex flex-col items-center mt-52">
   <Helmet>
    <title>Add Restaurant | Nuber Eats</title>
   </Helmet>
   <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
   <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
    <input className="input" type="text" placeholder="Name" {...register('name', { required: 'Name is required.' })} />
    <input
     className="input"
     type="text"
     placeholder="Address"
     {...register('address', { required: 'Address is required.' })}
    />
    <input
     className="input"
     type="text"
     placeholder="Category Name"
     {...register('categoryName', { required: 'Category Name is required.' })}
    />
    <div>
     <input type="file" accept="image/*" {...register('file', { required: true })} />
    </div>
    <Button loading={uploading} canClick={isValid} actionText="Create Restaurant" />
    {data?.createRestaurant?.error && <FormError errorMessage={data.createRestaurant.error} />}
   </form>
  </div>
 )
}

export default AddRestaurant
