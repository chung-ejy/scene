import React from 'react'
import ReactDOM from 'react-dom'
import DataState from "./context/data/dataState"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
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
            <Footer />
            </Router>
        </DataState>
    )
}

ReactDOM.render(<App />, document.getElementById("app"))