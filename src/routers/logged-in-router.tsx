import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { UserRole } from '../__generated__/globalTypes'
import Restaurants from '../pages/client/restaurants'
import Header from '../components/commons/header'
import { useMe } from '../hooks/useMe'
import NotFound from '../pages/errors/404'
import ConfirmEmail from '../pages/user/confirm-email'
import EditProfile from '../pages/user/edit-profile'
import Search from '../pages/client/search'

const ClientRoutes = [
 <Route key={1} path="/" exact>
  <Restaurants />
 </Route>,
 <Route key={2} path="/confirm">
  <ConfirmEmail />
 </Route>,
 <Route key={3} path="/edit-profile">
  <EditProfile />
 </Route>,
 <Route key={4} path="/search">
  <Search />
 </Route>,
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
    {data.me.role === UserRole.Client && ClientRoutes}
    <Route>
     <NotFound />
    </Route>
    {/* <Redirect to="/" /> */}
   </Switch>
  </Router>
 )
}
