import React from 'react'
import validator from '../validators'
import admin from '../adminCredentials'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { loggedContext } from '../context/UserStatusProvider'

//withRouter generate props, I pass them as parameters

const Login = (props) => {

    const { setLogged, dni, setDni, setAdmin } = React.useContext(loggedContext)
    const [pass, setPass] = React.useState('')
    const [error, setError] = React.useState(null)
    const [message, setMessage] = React.useState(null)
    const [isRegister, setIsRegister] = React.useState(true)

    //Decide between login, register or error
    const processData = (e) => {
        e.preventDefault()
        const resultOfValidation = validator.validateRegisterOrLogin(dni, pass)

        if (isRegister && resultOfValidation[0]) {
            registerUser()
        }
        else if (!isRegister && resultOfValidation[0]) {
            loginUser()
        }
        else {
            setError(resultOfValidation[1]);
        }
    }

    const loginUser = React.useCallback(async () => {
        try {
            await axios.post('http://localhost:8080/api/v1/login', {
                dni: dni,
                pass: pass
            })
            setPass('')
            setError(null)
            setLogged(true)
            const adminObject = admin.getCredentials()
            if (dni === adminObject.dni && pass === adminObject.pass) {
                setAdmin(true)
            }
            props.history.push('/home')
        } catch (error) {
            let response = error.response
            if (response.status === 401) {
                setError(response.data.message)
            }
            else {
                console.log(response);
            }
        }
    }, [dni, pass, props.history, setLogged, setAdmin])

    const registerUser = React.useCallback(async () => {
        try {
            await axios.post('http://localhost:8080/api/v1/register', {
                dni: dni,
                pass: pass
            })
            setDni('')
            setPass('')
            setError(null)
            setMessage('Usuario registrado correctamente')
        } catch (error) {
            let response = error.response
            if (response.status === 409) {
                setError(response.data.message)
            }
            else {
                console.log(response);
            }
        }
    }, [dni, pass, setDni])

    return (
        <div className="mt-5">
            <h3 className="text-center">
                {
                    isRegister ? 'Registro de usuarios' : 'Login de acceso'
                }
            </h3>
            <hr />
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    <form onSubmit={processData}>
                        {
                            error ? (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            ) : message ? (
                                <div className="alert alert-info">
                                    {message}
                                </div>
                            ) : null
                        }
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Ingrese Cédula"
                            onChange={e => setDni(e.target.value)}
                            value={dni}
                        />
                        <input
                            type="password"
                            className="form-control mb-2"
                            placeholder="Ingrese Contraseña"
                            maxLength="45"
                            onChange={e => setPass(e.target.value)}
                            value={pass}
                        />
                        <button
                            className="col-12 btn btn-lg btn-dark btn-block"
                            type="submit"
                        >
                            {
                                isRegister ? 'Registrarse' : 'Ingresar'
                            }
                        </button>
                        <button
                            className="col-12 btn btn-sm btn-info btn-block mt-2"
                            type="button"
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {
                                isRegister ? '¿Ya estás registrado?' : '¿No tienes cuenta?'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login)
