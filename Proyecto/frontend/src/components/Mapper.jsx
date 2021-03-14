import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Transfer from './Transfer';
import Login from './Login';
import Home from './Home';
import Navbar from './Navbar';
import { loggedContext } from '../context/UserStatusProvider'
import Accounts from './Accounts';
import Transactions from './Transactions'
import AddAcounts from './AddAcounts';
import Coins from './Coins'

//Components that maps components depending on logged and admin status

const Mapper = () => {

    const { logged, admin } = React.useContext(loggedContext)

    return (
        <Router>
            <div >
                {
                    (logged && !admin) ? (
                        <Switch>
                            <Route path="/transfer" exact>
                                <Navbar />
                                <Transfer />
                            </Route>
                            <Route path="/home" exact>
                                <Navbar />
                                <Home />
                            </Route>
                            <Route path="/accounts" exact>
                                <Navbar />
                                <Accounts />
                            </Route>
                            <Route path="/transactions" exact>
                                <Navbar />
                                <Transactions />
                            </Route>
                            <Route path="/accounts/add" exact>
                                <Navbar />
                                <AddAcounts />
                            </Route>
                        </Switch>
                    ) :
                        (logged && admin) ? (
                            //Is logged and is Admin
                            <Switch>
                                <Route path="/home" exact>
                                    <Navbar />
                                    <Home />
                                </Route>
                                <Route path="/coins">
                                    <Navbar />
                                    <Coins />
                                </Route>
                            </Switch>
                        ) :
                            (
                                //Si no está loggeado va a login y está bien, pero la ruta queda mal 
                                <Switch>
                                    <Route path="/">
                                        <Login />
                                    </Route>
                                </Switch>
                            )
                }
            </div>
        </Router>
    )
}

export default Mapper
