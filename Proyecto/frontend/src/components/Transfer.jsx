import React from 'react'
import axios from 'axios'
import { loggedContext } from '../context/UserStatusProvider'
import validator from '../validators'

const Transfer = () => {

    const { dni } = React.useContext(loggedContext)

    const [data, setData] = React.useState([])
    const [error, setError] = React.useState('')
    const [message, setMessage] = React.useState('')
    const [accountTo, setAccountTo] = React.useState('')
    const [ammount, setAmmount] = React.useState('')
    const [trigger, setTrigger] = React.useState(false)

    React.useEffect(() => {
        //Get accounts
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/accounts?dni=${dni}`);
                if (response.status === 204) {
                    setError('No tienes cuentas aún, crea una en la sección "Añadir cuentas"');
                }
                else {
                    setError('')
                    setData(response.data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [dni, error, trigger])

    //Generate transaction
    const send = async (idFrom, idTo, amount) => {
        const validation = validator.validateTransaction(idFrom, idTo, ammount)
        if (validation[0]) {
            try {
                await axios.post('http://localhost:8080/api/v1/newTransaction', {
                    idFrom: idFrom,
                    idTo: idTo,
                    amount: amount
                })
                setMessage('Enviado correctamente')
                setTrigger(!trigger)
                setAccountTo('')
                setAmmount('')
            } catch (error) {
                let response = error.response
                if (response.status === 403 || response.status === 406) {
                    setError(response.data.message)
                }
                else {
                    console.log(response);
                }
            }
        }
        else {
            setMessage(validation[1])
        }
    }

    return (
        <div>
            {
                message !== '' ? <div className="alert alert-info col-6">{message}</div> : null
            }
            <h3>Cuenta Origen</h3>
            {
                error === '' ? (
                    <div className="transfer">
                        <select className="form-select" id="transferField" style={{ width: '300px', margintop: '5px' }}>
                            {
                                data.map(item => (
                                    <option key={item.account_Id} value={item.account_Id}>
                                        Cuenta Nro: {item.account_Id} - {parseFloat(item.account_Balance)} {item.coin_Name}
                                    </option>
                                ))
                            }
                        </select>
                        <h3>Cuenta destino</h3>
                        <input
                            className="form-control mb-2"
                            style={{ width: '300px', margintop: '5px' }}
                            placeholder="Ingrese cuenta destino"
                            onChange={e => setAccountTo(e.target.value)}
                            value={accountTo}
                        />
                        <h3>Monto</h3>
                        <input
                            className="form-control mb-2"
                            style={{ width: '300px', margintop: '5px' }}
                            placeholder="Ingrese monto"
                            onChange={e => setAmmount(e.target.value)}
                            value={ammount}
                        />
                        <div>
                            <button
                                className="btn btn-info btn-sm col-2 mt-3"
                                onClick={e => send(document.getElementById("transferField").value, accountTo, ammount)}
                            >
                                Enviar
                                </button>
                        </div>
                    </div>

                ) : <div className="alert alert-warning">{error}</div>
            }
        </div>
    )
}

export default Transfer
