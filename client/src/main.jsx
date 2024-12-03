import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App';
import Cart from './routes/Cart';
import Checkout from './routes/Checkout';
import Confirmation from './routes/Confirmation';
import Details from './routes/Details';
import Home from './routes/Home';
import Login from './routes/Login';
import Logout from './routes/Logout';
import Signup from './routes/Signup';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
   
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/confirmation",
        element: <Confirmation />,
      },
      {
        path: "/details/:productID",
        element: <Details />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <RouterProvider router={router} />
  </StrictMode>,
)

