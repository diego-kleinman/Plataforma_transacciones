import React from 'react'
import axios from 'axios'
import { loggedContext } from '../context/UserStatusProvider'
import validator from '../validators'

const AddAcounts = () => {

    const { dni } = React.useContext(loggedContext)

    const [trigger, setTrigger] = React.useState(false)
    const [data, setData] = React.useState([])
    const [error, setError] = React.useState('')
    const [message, setMessage] = React.useState('')
    const [userInput, setUserInput] = React.useState({})

    React.useEffect(() => {
        //Get accounts addable data
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/accounts/toAdd?dni=${dni}`);
                if (response.data.message === 'Tienes todas las cuentas actualmente disponibles') {
                    setError(response.data.message);
                }
                else {
                    setData(response.data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [trigger, dni, error])

    const addAccount = async (coin_Type, balance) => {
        const validation = validator.validateNewAccount(balance)
        if (validation[0]) {
            try {
                await axios.post('http://localhost:8080/api/v1/accounts/add', {
                    type: coin_Type,
                    balance: balance,
                    dni: dni
                })
                setMessage('Cuenta correctamente añadida')
                //Change dependency to trigger useEffect again and refresh accounts that the user can add
                setTrigger(!trigger)
            } catch (error) {
                console.log(error.response);
            }
        }
        else {
            setMessage(validation[1])
        }
    }
    
    const handleChange = evt => {
        const name = evt.target.name;
        const newValue = evt.target.value;
        setUserInput({ ...userInput, [name]: newValue });
    }
    return (
        <div>
            <h1>Añadir cuentas</h1>
            {
                message !== '' ? <div className="alert alert-info">{message}</div> : null
            }
            {
                error === '' ? (
                    <ul className="list-group">
                        {   data.length > 0 ?
                            data.map(item => (
                                <li key={item.coin_Type} className="list-group-item col-6">
                                    <strong>Cuenta : {item.coin_Name}</strong>
                                    <button
                                        className="btn btn-warning btn-sm float-end mx-1"
                                        onClick={e => addAccount(item.coin_Type, userInput[item.coin_Type])}
                                    >
                                        Agregar
                                    </button>
                                    <input
                                        className="float-end"
                                        type="text"
                                        name={item.coin_Type}
                                        onChange={handleChange}
                                        placeholder="Ingrese monto inicial"
                                    >
                                    </input>
                                </li>
                            )) : null
                        }
                    </ul>
                ) : <div className="col-6 alert alert-warning">{error}</div>
            }
        </div>
    )
}

export default AddAcounts
