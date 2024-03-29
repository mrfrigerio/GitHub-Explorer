import { BrowserRouter, Switch, Route } from 'react-router-dom'

import React from 'react'

import Main from './pages/Main'
import Repository from './pages/Repository'

export default function Routes() {
  return (
    <BrowserRouter>
      {/* <Switch> Garante que apenas uma <Route> seja invocada por vez */}
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/repository/:repository" component={Repository} />
      </Switch>
    </BrowserRouter>
  )
}
