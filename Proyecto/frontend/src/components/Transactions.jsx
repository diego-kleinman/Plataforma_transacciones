import React from 'react'
import axios from 'axios'
import { loggedContext } from '../context/UserStatusProvider'

const Transactions = () => {
    const { dni } = React.useContext(loggedContext)

    const [transactionsOut, setTransactionsOut] = React.useState([])
    const [transactionsIn, setTransactionsIn] = React.useState([])
    const [showing, setShowing] = React.useState(false)
    const [errorShowing, setErrorShowing] = React.useState('')
    const [accounts, setAccounts] = React.useState([])
    const [error, setError] = React.useState('')

    React.useEffect(() => {
        //Get accounts from user
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/accounts?dni=${dni}`);
                if (response.status === 204) {
                    setError('No tienes cuentas aún, crea una en la sección "Añadir cuentas"');
                }
                else {
                    setAccounts(response.data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [dni])

    const fetchTransactions = async (account_Id) => {
        //Get transactions for a certain account
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/transactions?id=${account_Id}`);
            if (response.status === 204) {
                setErrorShowing('No tienes movimientos asociados a esta cuenta');
            }
            else {
                setErrorShowing('')
                setShowing(true)
                setTransactionsOut(response.data[0])
                setTransactionsIn(response.data[1])
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div>
            <h1 className="title">Selecciona una cuenta</h1>
            {
                error === '' ? (
                    <ul className="list-group">
                        {   accounts.length > 0 ?
                            accounts.map(item => (
                                <li key={item.account_Id} className="list-group-item col-6">
                                    <strong>Cuenta Nro: {item.account_Id}</strong> - {item.coin_Name}
                                    <button
                                        className="btn btn-dark btn-sm float-end mx-1"
                                        onClick={e => fetchTransactions(item.account_Id)}
                                    >
                                        Ver movimientos
                                    </button>
                                </li>
                            )) : null
                        }
                    </ul>
                ) : <div className="alert alert-warning">{error}</div>
            }
            {
                showing ? (
                    <h4>Movimientos (Montos mostrados en la moneda correspondiente a tus cuentas)</h4>)
                    : null
            }
            {
                errorShowing === '' ?
                    (<ul className="list-group">
                        {
                            transactionsOut.map(item => (
                                <li key={item.transaction_Id} className="list-group-item col-6">
                                    Transacción : {item.transaction_Id} / Origen : {item.transaction_From} / Destino : {item.transaction_To} / Monto : {parseFloat(item.transaction_AmountFrom)}
                                </li>
                            ))
                        }
                        {
                            transactionsIn.map(item => (
                                <li key={item.transaction_Id} className="list-group-item col-6">
                                    Transacción : {item.transaction_Id} / Origen : {item.transaction_From} / Destino : {item.transaction_To} / Monto : {parseFloat(item.transaction_AmountTo)}
                                </li>
                            ))
                        }
                    </ul>) : <div className="col-6 alert alert-warning">{errorShowing}</div>
            }

        </div>
    )
}

export default Transactions
