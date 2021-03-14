//Helper to validate fields in all the possible inputs the web has

module.exports = {
    validateRegisterOrLogin: (dni, password) => {
        let flag = true
        let message = ''
        //Check DNI
        if (dni === '') {
            flag = false
            message = 'Debes introducir un DNI'
        }
        else if (dni.indexOf('.') >= 0) {
            flag = false
            message = 'No debe haber puntos en el campo DNI'
        }
        //Check numeric DNI
        else if ((dni%dni) !== 0) {
            flag = false
            message = 'El DNI debe ser numérico'
        }
        //Check spaces in DNI
        else if (dni.indexOf(' ') >= 0) {
            flag = false
            message = 'No debe haber espacios ingresados en el campo DNI'
        }
        //Check number of digits in DNI
        else if (dni.length !== 8) {
            flag = false
            message = 'El DNI debe tener 8 dígitos'
        }
        //Check password
        else if (password === '') {
            flag = false
            message = 'Debes introducir una contraseña'
        }
        return [flag, message]
    },
    validateTransaction: (from, to, amount) => {
        let flag = true
        let message = ''
        //Check all data present
        if (from === '' || to === '' || amount === '' || from === undefined || to === undefined || amount === undefined ) {
            flag = false
            message = 'Falta ingresar algún campo, revise su origen, destino y monto'
        }
        //Check decimal numbers with "." not ","
        else if (amount.indexOf(',') >= 0) {
            flag = false
            message = 'Recuerde que si desea ingresar números con decimales debe utilizar el punto no la coma'
        }
        //Ckeck spaces in accountTo
        else if (to.indexOf(' ') >= 0) {
            flag = false
            message = 'No debe haber espacios ingresados en el campo destino'
        }
        //Check accountTo without . or ,
        else if (to.indexOf(',') >= 0 || to.indexOf('.') >= 0 ) {
            flag = false
            message = 'No debe haber puntos ni comas en la cuenta destino'
        }
        //Ckeck accountTo numeric
        else if ((to%to) !== 0) {
            flag = false
            message = 'La cuenta destino debe ser numérica'
        }
        //Check different accounts
        else if (from === to) {
            flag = false
            message = "La cuenta de origen y destino deben ser distintas"
        }
        //Check amount numeric and greater than 0
        else if ((amount%amount) !== 0|| parseFloat(amount) <= 0) {
            flag = false
            message = 'El monto debe ser un número mayor a 0'
        }
        return [flag, message]
    },
    validateNewAccount: (amount) => {
        let flag = true
        let message = ''
        //Check amount
        if (amount === undefined) {
            flag = false
            message = 'Debes ingresar un monto'
        }
        //Check spaces in amount
        else if (amount.indexOf(' ') >= 0) {
            flag = false
            message = 'No debe haber espacios ingresados en el campo monto'
        }
        //Check decimal numbers with "." not ","
        else if (amount.indexOf(',') >= 0) {
            flag = false
            message = 'Recuerde que si desea ingresar números con decimales debe utilizar el punto no la coma'
        }
        //Check amount numeric and greater than 0
        else if ((amount%amount) !== 0 || parseFloat(amount) <= 0) {
            flag = false
            message = 'El monto debe ser numérico y mayor a 0'
        }
        return [flag, message]
    },
    validateNewCoin: (name,amount) => {
        let flag = true
        let message = ''
        //Check amount
        if (amount === '') {
            flag = false
            message = 'Debes ingresar un monto'
        }
        //Check name
        else if (name === '') {
            flag = false
            message = 'Debes ingresar un nombre'
        }
        //Check spaces in amount
        else if (amount.indexOf(' ') >= 0) {
            flag = false
            message = 'No debe haber espacios ingresados en el campo monto'
        }
        //Check decimal numbers with "." not ","
        else if (amount.indexOf(',') >= 0) {
            flag = false
            message = 'Recuerde que si desea ingresar números con decimales debe utilizar el punto no la coma'
        }
        //Check amount numeric and greater than 0
        else if ((amount%amount) !== 0 || parseFloat(amount) <= 0) {
            flag = false
            message = 'El monto debe ser numérico y mayor a 0'
        }
        return [flag, message]

    }
}