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
export const DISH_FRAGMENT = gql`
 fragment DishParts on Dish {
  id
  name
  price
  photo
  description
  options {
   name
   extra
   chioces {
    name
    extra
   }
  }
 }
`
export const ORDERS_FRAGMENT = gql`
 fragment OrderParts on Order {
  id
  createdAt
  total
 }
`
