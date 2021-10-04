import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useParams } from 'react-router'
import Restaurant from '../../components/restaurant'
import { CATEGORY_FRAGEMNT, RESTAURANT_FRAGMENT } from '../../utils/fragments'
import { category, categoryVariables } from '../../__generated__/category'

const CATEGORY_QUERY = gql`
 query category($input: CategoryInput!) {
  category(input: $input) {
   ok
   error
   totalPages
   totalResults
   restaurants {
    ...RestaurantParts
   }
   category {
    ...CategoryParts
   }
  }
 }
 ${RESTAURANT_FRAGMENT}
 ${CATEGORY_FRAGEMNT}
`

interface ICategoryParams {
 slug: string
}

const Category = () => {
 const [page, setPage] = useState(1)
 const onNextPageClick = () => setPage((current) => current + 1)
 const onPrevPageClick = () => setPage((current) => current - 1)
 const params = useParams<ICategoryParams>()
 const { data, loading } = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
  variables: {
   input: {
    page,
    slug: params.slug,
   },
  },
 })

 console.log('123123', data)

 return (
  <div>
   <Helmet>
    <title>Category {params.slug} | Nuber Eats</title>
   </Helmet>
   {!loading && (
    <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
     <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-16">
      {data?.category.restaurants?.map((restaurant) => (
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
       Page {page} of {data?.category.totalPages}
      </span>
      {page !== data?.category.totalPages ? (
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

export default Category
