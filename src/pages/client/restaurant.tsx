import { gql, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import Dish from '../../components/dish'
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../utils/fragments'
import { CreateOrderItemInput } from '../../__generated__/globalTypes'
import { restaurant, restaurantVariables } from '../../__generated__/restaurant'

const RESTAURANT_QUERY = gql`
 query restaurant($input: RestaurantInput!) {
  restaurant(input: $input) {
   ok
   error
   restaurant {
    ...RestaurantParts
    menu {
     ...DishParts
    }
   }
  }
 }
 ${RESTAURANT_FRAGMENT}
 ${DISH_FRAGMENT}
`

const CREATE_ORDER_MUTATION = gql`
 mutation createOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
   ok
   error
  }
 }
`

interface IRestaurantParams {
 id: string
}

const Restaurant = () => {
 const params = useParams<IRestaurantParams>()
 const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
  variables: {
   input: {
    restaurantId: +params.id,
   },
  },
 })
 const [orderStarted, setOrderStarted] = useState(false)
 const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([])
 const triggerStartOrder = () => {
  setOrderStarted(true)
 }
 const addItemOrder = (dishId: number) => {
  if (isSelected(dishId)) {
   return
  }
  setOrderItems((current) => [{ dishId }, ...current])
 }

 const removeFromOrder = (dishId: number) => {
  setOrderItems((current) => current.filter((dish) => dish.dishId !== dishId))
 }

 const isSelected = (dishId: number) => {
  return Boolean(orderItems.find((order) => order.dishId === dishId))
 }

 console.log(orderItems)
 return (
  <div>
   <div
    className="bg-gray-800 py-48 bg-cover bg-center"
    style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})` }}
   >
    <div className="bg-white w-3/12 py-8 pl-48">
     <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
     <h5 className="text-sm font-light mb-2">{data?.restaurant.restaurant?.category?.name}</h5>
     <h6 className="text-sm font-light">{data?.restaurant.restaurant?.address}</h6>
    </div>
   </div>
   <div className="container pb-32 flex flex-col items-end mt-20">
    <button className="btn mt-20 px-10" onClick={triggerStartOrder}>
     {orderStarted ? 'Ordering' : 'Start Order'}
    </button>
    <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-16">
     {data?.restaurant.restaurant?.menu.map((dish, index) => (
      <Dish
       isSelected={isSelected(dish.id)}
       id={dish.id}
       orderStarted={orderStarted}
       key={index}
       description={dish.description}
       name={dish.name}
       price={dish.price}
       isCustomer={true}
       options={dish.options}
       addItemOrder={addItemOrder}
       removeFromOrder={removeFromOrder}
      />
     ))}
    </div>
   </div>
  </div>
 )
}

export default Restaurant
