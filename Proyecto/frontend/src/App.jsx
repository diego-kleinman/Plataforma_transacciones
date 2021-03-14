import React from 'react'
import UserStatusProvider from './context/UserStatusProvider'
import Mapper from './components/Mapper'

function App() {
  return (
    <UserStatusProvider>
      <Mapper />
    </UserStatusProvider>
  );
}

export default App;
