import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { useParams } from 'react-router'
import { RESTAURANT_FRAGMENT } from '../../utils/fragments'
import { restaurant, restaurantVariables } from '../../__generated__/restaurant'

const RESTAURANT_QUERY = gql`
 query restaurant($input: RestaurantInput!) {
  restaurant(input: $input) {
   ok
   error
   restaurant {
    ...RestaurantParts
   }
  }
 }
 ${RESTAURANT_FRAGMENT}
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
  </div>
 )
}

export default Restaurant
