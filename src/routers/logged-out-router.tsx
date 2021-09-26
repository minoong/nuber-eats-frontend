import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import CreateAccount from '../pages/create-account'
import NotFound from '../pages/errors/404'
import Login from '../pages/login'

export const LoggedOutRouter = () => {
 return (
  <Router>
   <Switch>
    <Route path="/create-account">
     <CreateAccount />
    </Route>
    <Route path="/" exact>
     <Login />
    </Route>
    <Route>
     <NotFound />
    </Route>
   </Switch>
  </Router>
 )
}
