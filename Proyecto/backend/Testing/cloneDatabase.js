const mysql = require('mysql2/promise')

const connect = async () => {
    const conn = await mysql.createConnection({
        host: "localhost",
        user: "Test",
        password: "password",
        database: "Ripio testing",
        port: "3306"
    })
    return conn
}

module.exports = {
    //Check if a person can log in
    logInUser: async (ci, pass) => {
        let sqlQuery = 'SELECT user_Ci FROM Users WHERE user_Ci = ? AND user_Password = ?'
        let conn = undefined
        try {
            conn = await connect()
            const query = await conn.execute(sqlQuery, [ci, pass])
            const res = await JSON.parse(JSON.stringify(query))[0]
            await conn.end()
            return res
        } catch (error) {
            console.log(error)
            await conn.end()
            return
        }
    },
    //Register a new user
    registerUser: async (ci, password) => {
        let sqlQuery = 'INSERT INTO Users (user_Ci,user_Password) VALUES (?,?)'
        let conn = undefined
        try {
            conn = await connect()
            await conn.execute(sqlQuery, [ci, password])
            await conn.end()
        } catch (error) {
            await conn.end()
            throw error
        }
    },
    //Get accounts from a certain user
    getAccountsFromUser: async (ci) => {
        let sqlQuery = 'SELECT account_Id,coin_Name,account_Balance,account_Ci FROM Accounts,Coins WHERE coin_Type = account_Type AND account_Ci = ?'
        let conn = undefined
        try {
            conn = await connect()
            const query = await conn.execute(sqlQuery, [ci])
            const res = await JSON.parse(JSON.stringify(query))[0]
            await conn.end()
            return res
        } catch (error) {
            await conn.end()
            throw error
        }
    },
    //Get types of accounts a user doesn´t have
    getAccountsNotAdded: async (ci) => {
        let sqlQuery = 'SELECT * FROM Coins WHERE coin_Type NOT IN (SELECT account_Type FROM Accounts WHERE account_Ci = ?)'
        let conn = undefined
        try {
            conn = await connect()
            const query = await conn.execute(sqlQuery, [ci])
            const res = await JSON.parse(JSON.stringify(query))[0]
            await conn.end()
            return res
        } catch (error) {
            await conn.end()
            throw error
        }
    },
    //Add account to a user (Due to not having deposit feature when you create an account you can set the initial balance)
    addAcount: async (type, balance, ci) => {
        let sqlQuery = 'INSERT INTO Accounts (account_Type,account_Balance,account_Ci) VALUES (?,?,?)'
        let conn = undefined
        try {
            conn = await connect()
            await conn.execute(sqlQuery, [type, balance, ci])
            await conn.end()
        } catch (error) {
            await conn.end()
            throw error
        }
    },
    //Get transactions asociated with an account
    getTransactions: async (accountId) => {
        let sqlQueryOut = 'SELECT transaction_Id,transaction_From,transaction_To,transaction_AmountFrom FROM Transactions WHERE transaction_From = ?'
        let sqlQueryIn = 'SELECT transaction_Id,transaction_From,transaction_To,transaction_AmountTo FROM Transactions WHERE transaction_To = ?'
        let conn = undefined
        try {
            conn = await connect()
            const outTransactions = await conn.execute(sqlQueryOut, [accountId])
            const inTransactions = await conn.execute(sqlQueryIn, [accountId])
            const outJson = await JSON.parse(JSON.stringify(outTransactions))[0]
            const inJson = await JSON.parse(JSON.stringify(inTransactions))[0]
            await conn.end()
            return [outJson, inJson]
        } catch (error) {
            await conn.end()
            throw error
        }
    },
    //Get an account
    getAccount: async (accountId) => {
        let sqlQuery = 'SELECT * FROM Accounts WHERE account_Id = ?'
        let conn = undefined
        try {
            conn = await connect()
            const query = await conn.execute(sqlQuery, [accountId])
            const res = await JSON.parse(JSON.stringify(query))[0]
            await conn.end()
            return res[0]
        } catch (error) {
            await conn.end()
            throw error
        }
    },
    //New transaction between same type of account coins (atomic function)
    generateNewTransactionSameTypeOfCoin: async (accountFrom, accountTo, amount) => {
        let conn = undefined
        let insertQuery = 'INSERT INTO Transactions (transaction_From,transaction_To,transaction_AmountFrom,transaction_AmountTo) VALUES (?,?,?,?)'
        let balanceQuery1 = 'UPDATE Accounts SET account_Balance = account_Balance - ? WHERE account_Id = ?'
        let balanceQuery2 = 'UPDATE Accounts SET account_Balance = account_Balance + ? WHERE account_Id = ?'
        try {
            conn = await connect()
            await conn.beginTransaction()
            await conn.execute(insertQuery, [accountFrom, accountTo, amount, amount])
            await conn.execute(balanceQuery1, [amount, accountFrom])
            await conn.execute(balanceQuery2, [amount, accountTo])
            conn.commit()
            await conn.end()
        } catch (error) {
            conn.rollback()
            await conn.end()
            throw error
        }
    },
    //New transaction between different types of account coins (atomic function)
    generateNewTransactionDifferentTypeOfCoin: async (accountFrom, accountTo, amount, conversionRate) => {
        let conn = undefined
        let insertQuery = 'INSERT INTO Transactions (transaction_From,transaction_To,transaction_AmountFrom,transaction_AmountTo) VALUES (?,?,?,?)'
        let balanceQuery1 = 'UPDATE Accounts SET account_Balance = account_Balance - ? WHERE account_Id = ?'
        let balanceQuery2 = 'UPDATE Accounts SET account_Balance = account_Balance + ? WHERE account_Id = ?'
        try {
            conn = await connect()
            await conn.beginTransaction()
            await conn.execute(insertQuery, [accountFrom, accountTo, amount, amount * conversionRate])
            await conn.execute(balanceQuery1, [amount, accountFrom])
            await conn.execute(balanceQuery2, [amount * conversionRate, accountTo])
            conn.commit()
            await conn.end()
        } catch (error) {
            conn.rollback()
            await conn.end()
            throw error
        }
    },
    //Get rate of conversion between coins
    getConversionRate: async (typeFrom, typeTo) => {
        let sqlQuery = 'SELECT conversion_Rate FROM Conversions WHERE conversion_From = ? AND conversion_To = ?'
        let conn = undefined
        try {
            conn = await connect()
            const query = await conn.execute(sqlQuery, [typeFrom, typeTo])
            const res = await JSON.parse(JSON.stringify(query))[0]
            await conn.end()
            return res[0].conversion_Rate
        } catch (error) {
            await conn.end()
            throw error
        }
    },
    //Get the name of a certain coinType
    getCoinName: async (coinType) => {
        let sqlQuery = 'SELECT coin_Name FROM Coins WHERE coin_Type = ?'
        let conn = undefined
        try {
            conn = await connect()
            const query = await conn.execute(sqlQuery, [coinType])
            const res = await JSON.parse(JSON.stringify(query))[0]
            await conn.end()
            return res[0].coin_Name
        } catch (error) {
            await conn.end()
            throw error
        }
    },
    //Generate new coin and conversions for it
    generateNewCoin: async (name, rateUsd) => {
        let conn = undefined
        let queryCoins = 'SELECT coin_Type,coin_RateUsd FROM Coins WHERE coin_Name != ?'
        let queryInsertCoin = 'INSERT INTO Coins (coin_Name,coin_RateUsd) VALUES (?,?)'
        let queryGetCoin = 'SELECT coin_Type,coin_RateUsd FROM Coins WHERE coin_Name = ?'
        try {
            conn = await connect()
            await conn.beginTransaction()
            await conn.execute(queryInsertCoin, [name, rateUsd])
            const getCoinInserted = await conn.execute(queryGetCoin, [name])
            const aux = await JSON.parse(JSON.stringify(getCoinInserted))[0]
            const getDifferentCoins = await conn.execute(queryCoins, [name])
            const res = await JSON.parse(JSON.stringify(getDifferentCoins))[0]
            //There is some other coins apart from inserted, that means I have to generate conversions for the other coins
            //back and forth
            if (res.length !== 0) {
                try {
                    await generateConversions(aux[0], res)
                } catch (error) {
                    throw error
                }
            }
            conn.commit()
            await conn.end()
        } catch (error) {
            conn.rollback()
            await conn.end()
            throw error
        }
    },
    //Check if a certain coin exists
    checkCoinExistence: async (name) => {
        let sqlQuery = 'SELECT * FROM Coins WHERE coin_Name = ?'
        let conn = undefined
        try {
            conn = await connect()
            const query = await conn.execute(sqlQuery, [name])
            const res = await JSON.parse(JSON.stringify(query))[0]
            await conn.end()
            if(res.length != 0){
                return true
            }
            return false
        } catch (error) {
            await conn.end()
            throw error
        }
    }

}

//Generate conversions from a coin to all the others already being used
const generateConversions = async (coinInserted, otherCoins) => {
    let conn = undefined
    try {
        conn = await connect()
        await conn.beginTransaction()
        //Foreach coin I generate and insert a conversion 
        //(using the values in USD from each one and fixing them to be decimals with 10 digits after comma)
        for (let i = 0; i < otherCoins.length; i++) {
            let coin = otherCoins[i]
            let rateFrom = (coinInserted.coin_RateUsd / coin.coin_RateUsd).toFixed(10)
            let rateTo = (coin.coin_RateUsd / coinInserted.coin_RateUsd).toFixed(10)
            let insertConversion = 'INSERT INTO Conversions (conversion_From,conversion_To,conversion_Rate) VALUES (?,?,?)'
            await conn.execute(insertConversion, [coinInserted.coin_Type, coin.coin_Type, rateFrom])
            await conn.execute(insertConversion, [coin.coin_Type, coinInserted.coin_Type, rateTo])
        }
        conn.commit()
        await conn.end()
    } catch (error) {
        conn.rollback()
        await conn.end()
        throw error
    }
}