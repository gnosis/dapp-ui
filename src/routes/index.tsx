import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Web3Connect from 'components/Test_Web3'

const Hello: React.FC = () => <h1>Hello World!</h1>

const AppRouter: React.FC = () => (
    <Router basename={process.env.BASE_URL}>
        <Route path="/" exact component={Hello} />
        <Route path="/web3" component={Web3Connect} />
    </Router>
)

export default AppRouter
