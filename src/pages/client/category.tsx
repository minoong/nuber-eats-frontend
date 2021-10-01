import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
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
 const params = useParams<ICategoryParams>()
 const { data, loading } = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
  variables: {
   input: {
    page: 1,
    slug: params.slug,
   },
  },
 })

 console.log(data)

 return <div>Category</div>
}

export default Category
