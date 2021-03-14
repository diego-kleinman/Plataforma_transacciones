import React from 'react'
import axios from 'axios'
import { loggedContext } from '../context/UserStatusProvider'

const Accounts = () => {

    const { dni } = React.useContext(loggedContext)

    const [data, setData] = React.useState([])
    const [error, setError] = React.useState('')

    React.useEffect(() => {
        //Get accounts data
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/accounts?dni=${dni}`);
                if (response.status === 204) {
                    setError('No tienes cuentas aún, crea una en la sección "Añadir cuentas"');
                }
                else {
                    setData(response.data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [dni, error])



    return (
        <div>
            <h1 className="title">Cuentas</h1>
            {
                error === '' ? (
                    <ul className="list-group">
                        {   data.length > 0 ?
                            data.map(item => (
                                <li key={item.account_Id} className="list-group-item col-6">
                                    <strong>Cuenta Nro: {item.account_Id}</strong> - {parseFloat(item.account_Balance)} {item.coin_Name}
                                </li>
                            )) : null
                        }
                    </ul>
                ) : <div className="col-6 alert alert-warning">{error}</div>
            }

        </div>
    )
}

export default Accounts
