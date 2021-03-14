import React from 'react'

//React context API status provider

export const loggedContext = React.createContext()

const UserStatusProvider = (props) => {

    //User starts as not logged (false) and not admin, with no dni set
    const [logged, setLogged] = React.useState(false)
    const [admin, setAdmin] = React.useState(false)
    const [dni, setDni] = React.useState('')
    
    return (
        <loggedContext.Provider value={{ logged, setLogged, dni, setDni, admin, setAdmin }}>
            {props.children}
        </loggedContext.Provider>
    )
}

export default UserStatusProvider
