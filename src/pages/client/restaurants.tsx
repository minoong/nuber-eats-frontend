import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import Restaurant from '../../components/restaurant'
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
 const [page, setPage] = useState(1)
 const { data, loading, error } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
  variables: {
   input: {
    page,
   },
  },
 })

 const onNextPageClick = () => setPage((current) => current + 1)
 const onPrevPageClick = () => setPage((current) => current - 1)
 return (
  <div>
   <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
    <input type="text" className="input rounded-md border-0 w-3/12" placeholder="Search restaurants..." />
   </form>
   {!loading && (
    <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
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
     <div className="grid mt-4 grid-cols-3 gap-x-5 gap-y-16">
      {data?.restaurants.results?.map((restaurant) => (
       <Restaurant
        id={restaurant.id + ''}
        coverImage={restaurant.coverImage}
        name={restaurant.name}
        categoryName={restaurant.category?.name}
       />
      ))}
     </div>
     <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
      {page > 1 ? (
       <button onClick={onPrevPageClick} className="focus:outline-none font-medium text-2xl">
        &larr;
       </button>
      ) : (
       <div></div>
      )}
      <span>
       Page {page} of {data?.restaurants.totalPages}
      </span>
      {page !== data?.restaurants.totalPages ? (
       <button onClick={onNextPageClick} className="focus:outline-none font-medium text-2xl">
        &rarr;
       </button>
      ) : (
       <div></div>
      )}
     </div>
    </div>
   )}
  </div>
 )
}

export default Restaurants
