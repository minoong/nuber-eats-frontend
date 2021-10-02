import { useLazyQuery } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useHistory, useLocation } from 'react-router'
import Restaurant from '../../components/restaurant'
import { RESTAURANT_FRAGMENT } from '../../utils/fragments'
import { searchRestaurant, searchRestaurantVariables } from '../../__generated__/searchRestaurant'

const SEARCH_RESTAURANT = gql`
 query searchRestaurant($input: SearchRestaurantInput!) {
  searchRestaurant(input: $input) {
   ok
   error
   totalPages
   totalResults
   restaurants {
    ...RestaurantParts
   }
  }
 }
 ${RESTAURANT_FRAGMENT}
`

const Search = () => {
 const [page, setPage] = useState(1)
 const onNextPageClick = () => setPage((current) => current + 1)
 const onPrevPageClick = () => setPage((current) => current - 1)
 const location = useLocation()
 const history = useHistory()
 const [queryReadyToStart, { loading, data, called }] = useLazyQuery<searchRestaurant, searchRestaurantVariables>(
  SEARCH_RESTAURANT,
 )
 useEffect(() => {
  const [_, query] = location.search.split('?term=')

  if (!query) {
   return history.replace('/')
  }

  queryReadyToStart({
   variables: {
    input: {
     page,
     query,
    },
   },
  })
 }, [])
 return (
  <div>
   <Helmet>
    <title>Search | Nuber Eats</title>
   </Helmet>
   {!loading && (
    <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
     <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-16">
      {data?.searchRestaurant.restaurants?.map((restaurant) => (
       <Restaurant
        key={restaurant.id}
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
       Page {page} of {data?.searchRestaurant.totalPages}
      </span>
      {page !== data?.searchRestaurant.totalPages ? (
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

export default Search
