const express = require('express')
const app = express();
const dbTools = require('./database')
const cors = require('cors')
const port = process.env.PORT || 8080;

//Middleware (tells express to transform anything that it recieves to JSON format)
app.use(express.json())

//Enable cors from all origins (unsafe but practical for this project)
app.use(cors())

//Register
app.post('/api/v1/register', async (req, res) => {
    try {
        const { dni, pass } = req.body
        await dbTools.registerUser(dni, pass)
        res.status(200).send({ message: 'Usuario correctamente registrado' })
    } catch (error) {
        if (error.errno === 1062) {
            res.status(409).send({ message: 'DNI ya registrado' })
        }
        else {
            res.status(500).send({ message: error })
        }
    }
})

//Login
app.post('/api/v1/login', async (req, res) => {
    try {
        const { dni, pass } = req.body
        const result = await dbTools.logInUser(dni, pass)
        if (result.length === 0) {
            throw new Error('DNI o contraseña incorrecta')
        }
        res.status(200).send({ message: 'Usuario correctamente loggeado' })
    } catch (error) {
        if (error.message === 'DNI o contraseña incorrecta') {
            res.status(401).send({ message: error.message })
        }
        else {
            res.status(500).send({ error })
        }
    }
})

//Get accounts from user (I don't have to check if it is an actual user since the person is already logged in)
app.get('/api/v1/accounts', async (req, res) => {
    try {
        const dni = req.query.dni
        const accountsFromUser = await dbTools.getAccountsFromUser(dni)
        if (accountsFromUser.length != 0) {
            res.status(200).send(accountsFromUser)
        }
        else {
            res.status(204).send()
        }
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

//Get accounts that the user could add
app.get('/api/v1/accounts/toAdd', async (req, res) => {
    try {
        const dni = req.query.dni
        const accountsToAdd = await dbTools.getAccountsNotAdded(dni)
        if (accountsToAdd.length != 0) {
            res.status(200).send(accountsToAdd)
        }
        else {
            res.status(200).send({ message: 'Tienes todas las cuentas actualmente disponibles' })
        }
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

//Add account to an user
app.post('/api/v1/accounts/add', async (req, res) => {
    try {
        const { type, balance, dni } = req.body
        await dbTools.addAcount(type, balance, dni)
        res.status(201).send({ message: 'Cuenta añadida con éxito' })
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

//Get transactions of a certain account
app.get('/api/v1/transactions', async (req, res) => {
    try {
        const accountId = req.query.id
        const transactions = await dbTools.getTransactions(accountId)
        if (transactions[0].length == 0 && transactions[1].length == 0) {
            res.status(204).send()
        }
        else {
            res.status(200).send(transactions)
        }
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

//Generate new transaction
app.post('/api/v1/newTransaction', async (req, res) => {
    try {
        const { idFrom, idTo, amount } = req.body
        const accountFrom = await dbTools.getAccount(idFrom)
        const accountTo = await dbTools.getAccount(idTo)

        //accountFrom will always exist, the user selects it from a select tag containing his accounts
        //But I have to check if accountTo exists
        if (accountTo) {
            const balance = await accountFrom.account_Balance
            //User has sufficient balance to transfer
            if (balance >= parseFloat(amount)) {
                const typeFrom = accountFrom.account_Type
                const typeTo = accountTo.account_Type
                //If the accounts have different types, I generate the conversion and then the transaction with it
                if (typeFrom != typeTo) {
                    const rate = await dbTools.getConversionRate(typeFrom, typeTo)
                    await dbTools.generateNewTransactionDifferentTypeOfCoin(idFrom, idTo, amount, rate)
                }
                //Else I just generate the transaction
                else {
                    await dbTools.generateNewTransactionSameTypeOfCoin(idFrom, idTo, amount)
                }
                res.status(201).send({ message: 'Transaccion completada' })
            }
            else {
                throw new Error('No tienes suficiente balance')
            }
        }
        else {
            throw new Error("La cuenta destino no existe")
        }

    } catch (error) {
        if (error.message === 'No tienes suficiente balance') {
            res.status(403).send({ message: error.message })
        }
        else if (error.message === "La cuenta destino no existe") {
            res.status(406).send({ message: error.message })
        }
        else {
            res.status(500).send({ message: error.message })
        }
    }

})

//Add coin to the system
app.post('/api/v1/coins/add', async (req, res) => {
    try {
        const { name, rateUsd } = req.body
        const coinExists = await dbTools.checkCoinExistence(name)
        //If the coin doesn't already exist I generate it
        if (!coinExists) {
            await dbTools.generateNewCoin(name, rateUsd)
            res.status(201).send({ message: 'Moneda añadida con éxito' })
        }
        else{
            res.status(400).send({ message: 'La moneda ya existe' })
        }
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})

