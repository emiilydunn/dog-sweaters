import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './ui/Nav';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <div>
        <Nav isLoggedIn={isLoggedIn} />
      </div>
      <div>
        <Outlet context={[isLoggedIn, setIsLoggedIn]} /> 
      </div>
    </>
  );
}

export default App;
