import React from "react";
import {PayPalScriptProvider} from '@paypal/react-paypal-js'
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { ClerkProvider } from '@clerk/clerk-react'
import { Provider } from "react-redux";
import store from "./store";
// import 'bootstrap/dist/css/bootstrap.min.css'
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
// import './index.css';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import EachProductScreen from "./screens/EachProductScreen";
import ErrorScreen from "./screens/ErrorScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PrivateRoute from "./components/PrivateRoute";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdminRoute from "./components/AdminRoute";
import OrderListScreen from "./screens/admin/OrderListScreen";
import ProductListScreen from "./screens/admin/ProductListScreen";
import ProductEditScreen from "./screens/admin/ProductEditScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import UserEditScreen from "./screens/admin/UserEditScreen1";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
    
      <Route path="/" element={<HomeScreen />} />

      <Route path="/products/page/:pageNumber" element={<ProductScreen />} />
      <Route path="/search/:keyword" element={<ProductScreen />} />
      <Route path="/search/:keyword/page/:pageNumber" element={<ProductScreen />} />
      <Route index={true} path="/products" element={<ProductScreen />} />
           <Route path="/products/:id" element={<EachProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="*" element={<ErrorScreen />}></Route>
   
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path='profile' element ={<ProfileScreen/>} />

      </Route>

      <Route path ="" element={<AdminRoute />}>
        <Route path='/admin/orderList' element ={<OrderListScreen />}/>
        <Route path='/admin/productList' element ={<ProductListScreen />}/>
        <Route path='/admin/productList/:pageNumber' element ={<ProductListScreen />}/>
        <Route path='/admin/product/:id/edit' element ={<ProductEditScreen />}/>
        <Route path='/admin/userlist' element ={<UserListScreen />}/>
        <Route path='/admin/user/:id/edit' element ={<UserEditScreen />}/>
        <Route path='admin/user/:id' element ={<ProfileScreen/>} />
      </Route>
     
    </Route>
  )
);
const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
      <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
    </ClerkProvider>
  </React.StrictMode>
); 

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
