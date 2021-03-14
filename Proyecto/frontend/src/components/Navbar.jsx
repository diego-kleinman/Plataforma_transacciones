import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { loggedContext } from '../context/UserStatusProvider'

const Navbar = (props) => {

    const { logged, setLogged, setDni, admin, setAdmin } = React.useContext(loggedContext)

    const closeSession = () => {
        setDni('')
        setLogged(false)
        setAdmin(false)
        props.history.push('/login')
    }

    const redirect = (to) => {
        props.history.push(`/${to}`)
    }

    return (
        <div className="navbar navbar-dark bg-dark">
            <Link className="navbar-brand" to="/home">Ripio</Link>
            <div>
                {
                    (logged && !admin) ? (
                        <div className="d-flex">
                            <button
                                className="btn btn-dark"
                                onClick={() => { redirect("accounts") }}
                            >
                                Cuentas
                            </button>
                            <button
                                className="btn btn-dark"
                                onClick={() => { redirect("accounts/add") }}
                            >
                                Añadir Cuentas
                            </button>
                            <button
                                className="btn btn-dark"
                                onClick={() => { redirect("transactions") }}
                            >
                                Movimientos
                            </button>
                            <button
                                className="btn btn-dark"
                                onClick={() => { redirect("transfer") }}
                            >
                                Transferir
                            </button>
                            <button
                                className="btn btn-dark"
                                onClick={() => { closeSession() }}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    ) :

                        (logged && admin) ? (
                            <div className="d-flex">
                                <button
                                    className="btn btn-dark"
                                    onClick={() => { redirect("coins") }}
                                >
                                    Monedas
                            </button>
                                <button
                                    className="btn btn-dark"
                                    onClick={() => { closeSession() }}
                                >
                                    Cerrar sesión
                            </button>
                            </div>
                        ) : null
                }
            </div>
        </div>
    )
}

export default withRouter(Navbar)