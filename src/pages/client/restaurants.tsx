import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import React from 'react'
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery'

const RESTAURANTS_QUERY = gql`
 query restaurantsPageQuery($input: RestaurantsInput!) {
  allCategories {
   ok
   error
   categories {
    id
    name
    coverImage
    slug
    restaurantCount
   }
  }
  restaurants(input: $input) {
   ok
   error
   totalPages
   totalResults
   results {
    id
    name
    coverImage
    category {
     name
    }
    address
    isPromoted
   }
  }
 }
`

const Restaurants = () => {
 const { data, loading, error } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
  variables: {
   input: {
    page: 1,
   },
  },
 })
 return (
  <div>
   <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
    <input type="text" className="input rounded-md border-0 w-3/12" placeholder="Search restaurants..." />
   </form>
   {!loading && (
    <div className="max-w-screen-2xl mx-auto mt-8">
     <div className="flex justify-around max-w-sm mx-auto">
      {data?.allCategories.categories?.map((category) => (
       <div className="flex flex-col group items-center cursor-pointer">
        <div
         className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-200"
         style={{ backgroundImage: `url(${category.coverImage})` }}
        ></div>
        <span className="mt-1 text-sm text-center font-medium">{category.name}</span>
       </div>
      ))}
     </div>
     <div className="grid mt-4 grid-cols-3 gap-x-5 gap-y-10">
      {data?.restaurants.results?.map((restaurant) => (
       <div>
        <div
         className="bg-red-500 bg-cover bg-center mb-3 py-28"
         style={{ backgroundImage: `url(${restaurant.coverImage})` }}
        ></div>
        <h3 className="text-lg font-medium">{restaurant.name}</h3>
        <span className="border-t-2 border-gray-200">{restaurant.category?.name}</span>
       </div>
      ))}
     </div>
    </div>
   )}
   <div></div>
  </div>
 )
}

export default Restaurants
