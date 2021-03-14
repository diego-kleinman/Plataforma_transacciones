const database = require('./cloneDatabase')

//************************ Testing Loggin ****************************/
test('Admin exists', async () => {
    const data = await database.logInUser('11111111', '123')
    expect(data.length).toBe(1)
})

test('User exists', async () => {
    const data = await database.logInUser('47963085', '1234')
    expect(data.length).toBe(1)
})

test('Incorrect DNI loggin', async () => {
    const data = await database.logInUser('47963086', '1234567')
    expect(data.length).toBe(0)
})

test('Incorrect Password loggin', async () => {
    const data = await database.logInUser('11111111', '12345')
    expect(data.length).toBe(0)
})

//************************ Testing Register **************************/

test('Register duplicate DNI', async () => {
    try {
        await database.registerUser('11111111', '123')
    } catch (error) {
        expect(error.errno).toBe(1062)
    }
})

//************************ Testing Accounts **************************/

test('Get account from user', async () => {
    const accounts = await database.getAccountsFromUser('47963085')
    expect(accounts.length).toBe(1)
})

test('Get accounts a user could add', async () => {
    const accounts = await database.getAccountsNotAdded('47963085')
    expect(accounts.length).toBe(2)
})

//************************ Testing Transactions **********************/

test('Get transactions from account', async () => {
    const transactions = await database.getTransactions('1')
    expect(transactions[0].length).toBe(1)
})

test('Get transactions to account', async () => {
    const transactions = await database.getTransactions('2')
    expect(transactions[1].length).toBe(1)
})

test('Get transactions empty', async () => {
    const transactions = await database.getTransactions('3')
    expect(transactions[0].length).toBe(0)
    expect(transactions[1].length).toBe(0)
})
