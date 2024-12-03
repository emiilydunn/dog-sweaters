import {Outlet} from 'react-router-dom';
import Nav from './ui/Nav';

function App() {
  return (
    <>
      <div>
        <Nav />
      </div>


    <div>
      <Outlet />
    </div>
    </>
  )
}

export default App
