import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import DataState from "./context/data/dataState"
import Header from "./components/layout/Header"
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Data from "./components/pages/data"
import TermsOfService from "./components/pages/TermsOfService"
import Alert from './components/alerts/Alert'
export const App = () => {
    return (
        <DataState>
            <Router>
            <Header />
            <Alert />
            <div className="container-sm align-middle">
                <Switch>
                    <Route exact path="/" component={Data}></Route>
                    <Route exact path="/terms_of_service" component={TermsOfService}></Route>
                </Switch>
            </div>
            </Router>
        </DataState>
    )
}

ReactDOM.render(<App />, document.getElementById("app"))