import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { useParams } from 'react-router'

const CREATE_DISH_MUTATION = gql`
 mutation createDish($input: CreateDishInput!) {
  createDish(input: $input) {
   ok
   error
  }
 }
`

interface IParams {
 restaurantId: string
}

const AddDish = () => {
 const params = useParams<IParams>()
 const [createDishMutation, { loading }] = useMutation(CREATE_DISH_MUTATION)
 return <div></div>
}

export default AddDish
