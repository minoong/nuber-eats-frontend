import { gql, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import Restaurant from '../../components/restaurant'
import { CATEGORY_FRAGEMNT, RESTAURANT_FRAGMENT } from '../../utils/fragments'
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery'

const RESTAURANTS_QUERY = gql`
 query restaurantsPageQuery($input: RestaurantsInput!) {
  allCategories {
   ok
   error
   categories {
    ...CategoryParts
   }
  }
  restaurants(input: $input) {
   ok
   error
   totalPages
   totalResults
   results {
    ...RestaurantParts
   }
  }
 }
 ${RESTAURANT_FRAGMENT}
 ${CATEGORY_FRAGEMNT}
`

interface IFormProps {
 searchTerm: string
}

const Restaurants = () => {
 const [page, setPage] = useState(1)
 const { data, loading } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
  variables: {
   input: {
    page,
   },
  },
 })

 const onNextPageClick = () => setPage((current) => current + 1)
 const onPrevPageClick = () => setPage((current) => current - 1)

 const {
  register,
  handleSubmit,
  watch,
  formState: { errors, isValid },
  getValues,
 } = useForm<IFormProps>()
 const history = useHistory()
 const onSearchSubmit = () => {
  const { searchTerm } = getValues()
  history.push({
   pathname: '/search',
   search: `?term=${searchTerm}`,
  })
 }

 return (
  <div>
   <Helmet>
    <title>Search | Nuber Eats</title>
   </Helmet>
   <form onSubmit={handleSubmit(onSearchSubmit)} className="bg-gray-800 w-full py-40 flex items-center justify-center">
    <input
     {...register('searchTerm', {
      required: true,
      min: 3,
     })}
     name="searchTerm"
     type="search"
     className="input rounded-md border-0 w-3/4 md:w-3/12"
     placeholder="Search restaurants..."
    />
   </form>
   {!loading && (
    <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
     <div className="flex justify-around max-w-sm mx-auto">
      {data?.allCategories.categories?.map((category) => (
       <Link to={`/category/${category.slug}`} key={category.id}>
        <div className="flex flex-col group items-center cursor-pointer">
         <div
          className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-200"
          style={{ backgroundImage: `url(${category.coverImage})` }}
         ></div>
         <span className="mt-1 text-sm text-center font-medium">{category.name}</span>
        </div>
       </Link>
      ))}
     </div>
     <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-16">
      {data?.restaurants.results?.map((restaurant) => (
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
