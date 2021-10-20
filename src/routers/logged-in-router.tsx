import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { UserRole } from '../__generated__/globalTypes'
import Restaurants from '../pages/client/restaurants'
import { Header } from '../components/commons/header'
import { useMe } from '../hooks/useMe'
import NotFound from '../pages/errors/404'
import ConfirmEmail from '../pages/user/confirm-email'
import EditProfile from '../pages/user/edit-profile'
import Search from '../pages/client/search'
import Category from '../pages/client/category'
import Restaurant from '../pages/client/restaurant'
import MyRestaurants from '../pages/owner/my-restaurants'
import AddRestaurants from '../pages/owner/add-restaurants'
import MyRestaurant from '../pages/owner/my-restaurant'
import AddDish from '../pages/owner/add-dish'
import Order from '../pages/user/order'

const commonRoutes = [
 { path: '/confirm', component: <ConfirmEmail /> },
 { path: '/edit-profile', component: <EditProfile /> },
 { path: '/orders/:id', component: <Order /> },
]

const clientRoutes = [
 {
  path: '/category/:slug',
  exact: false,
  component: <Category />,
 },
 {
  path: '/search',
  exact: false,
  component: <Search />,
 },
 {
  path: '/restaurants/:id',
  exact: false,
  component: <Restaurant />,
 },
 {
  path: '',
  exact: true,
  component: <Restaurants />,
 },
]

const restaurantRoutes = [
 { path: '/', component: <MyRestaurants /> },
 { path: '/add-restaurant', component: <AddRestaurants /> },
 { path: '/restaurants/:id', component: <MyRestaurant /> },
 { path: '/restaurants/:restaurantId/add-dish', component: <AddDish /> },
]

export const LoggedInRouter = () => {
 const { data, loading, error } = useMe()

 if (!data || loading || error) {
  return (
   <div className="h-screen flex justify-center items-center">
    <span className="font-medium text-xl tracking-wide">Loading...</span>
   </div>
  )
 }

 return (
  <Router>
   <Header />
   <Switch>
    {commonRoutes.map((route) => (
     <Route exact key={route.path} path={route.path}>
      {route.component}
     </Route>
    ))}

    {data.me.role === UserRole.Owner &&
     restaurantRoutes.map((route) => (
      <Route exact key={route.path} path={route.path}>
       {route.component}
      </Route>
     ))}

    {data.me.role === UserRole.Client &&
     clientRoutes.map((route) => (
      <Route exact key={route.path} path={route.path}>
       {route.component}
      </Route>
     ))}
    <Route>
     <NotFound />
    </Route>
    {/* <Redirect to="/" /> */}
   </Switch>
  </Router>
 )
}
