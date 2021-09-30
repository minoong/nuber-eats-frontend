import { useLazyQuery } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useHistory, useLocation } from 'react-router'
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
 const location = useLocation()
 const history = useHistory()
 const [queryReadyToStart, { loading, data, called }] = useLazyQuery<searchRestaurant, searchRestaurantVariables>(
  SEARCH_RESTAURANT,
 )
 useEffect(() => {
  const [_, query] = location.search.split('?term=')
  console.log(query)

  if (!query) {
   return history.replace('/')
  }

  queryReadyToStart({
   variables: {
    input: {
     page: 1,
     query,
    },
   },
  })
 }, [])
 console.log(loading, data, called)
 return (
  <div>
   <Helmet>
    <title>Search | Nuber Eats</title>
   </Helmet>
   <h1>Search page</h1>
  </div>
 )
}

export default Search
