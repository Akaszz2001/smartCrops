
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Farmer from './components/ProfilePage/Farmer'
import Customer from './components/ProfilePage/Customer'

import CustomerProductView from './components/Customer/CustomerProductView'
import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import Home from './components/Homepage/Home'
import CompleteFarmerDetails from './components/Farmer/CompleteFarmerDetails'

import FarmerHome from './components/Farmer/FarmerHome'
import Profile from './components/Customer/Profile'
import AddProduct from './components/Farmer/AddProduct'
import ViewProducts from './components/Farmer/ViewProducts'
import CartPage from './components/Customer/Cart'


const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'/farmer',
    element:<Farmer/>
  },
  {
    path:'/customer',
    element:<Customer/>
  },{
    path:'/viewProducts',
    element:<CustomerProductView/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/dashboard',
    element:<Signup/>
  },
  {
    path:'/home',
    element:<Home/>
  },
  {
    path:'/complete-farmer-details',
    element:<CompleteFarmerDetails/>
  },
{
    path:'/farmer-home',
    element:<FarmerHome/>
  },
  {
    path:'/profile',
    element:<Profile/>
  },{
    path:'/addProducts',
    element:<AddProduct/>
  },{
    path:'/viewMyProducts',
    element:<ViewProducts/>
  }
  ,{
    path:'/cart',
    element:<CartPage/>
  }
])
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)
