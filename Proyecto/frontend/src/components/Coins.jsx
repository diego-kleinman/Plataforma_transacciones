import React from 'react'
import axios from 'axios'
import validator from '../validators'

const Coins = () => {
    const [name, setName] = React.useState('')
    const [amount, setAmount] = React.useState('')
    const [error, setError] = React.useState('')
    const [message, setMessage] = React.useState('')

    const generateNewCoin = async (name, amount) => {
        const validation = validator.validateNewCoin(name, amount)
        if (validation[0]) {
            try {
                await axios.post('http://localhost:8080/api/v1/coins/add', {
                    name: name,
                    rateUsd: amount
                })
                setError('')
                setMessage('Moneda correctamente añadida')
                setName('')
                setAmount('')
            } catch (error) {
                let response = error.response
                if (response.status === 400) {
                    setError(response.data.message)
                }
                else {
                    console.log(response);
                }
            }
        }
        else {
            setError(validation[1])
        }
    }

    return (
        <div>
            <h1>Insertar nueva moneda</h1>
            {
                error !== '' ?
                    <div className="col-4 alert alert-danger">
                        {error}
                    </div> : message !== '' ? <div className="col-4 alert alert-info">
                        {message}
                    </div> : null
            }
            <div>
                <input
                    className="col-3"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ingrese nombre de la moneda"
                >
                </input>
            </div>
            <div>
                <input
                    className="col-3 mt-3"
                    type="text"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Ingrese valor en USD"
                >
                </input>
            </div>
            <div>
                <button
                    className="col-2 btn btn-sm btn-info btn-block mt-2"
                    type="button"
                    onClick={() => generateNewCoin(name, amount)}
                > Insertar</button>
            </div>

        </div>
    )
}

export default Coins
