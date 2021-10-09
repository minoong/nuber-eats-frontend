import { gql } from '@apollo/client'

export const RESTAURANT_FRAGMENT = gql`
 fragment RestaurantParts on Restaurant {
  id
  name
  coverImage
  category {
   name
  }
  address
  isPromoted
 }
`
export const CATEGORY_FRAGEMNT = gql`
 fragment CategoryParts on Category {
  id
  name
  coverImage
  slug
  restaurantCount
 }
`
