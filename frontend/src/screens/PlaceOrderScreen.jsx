import {useEffect}from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import {Button, Row, Col, ListGroup, Card, Image} from 'react-bootstrap'
import {toast} from 'react-toastify'
import CheckoutSteps from '../components/CheckoutSteps'
import Header from '../components/Header'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { clearCartItems } from '../slices/cartSlice'

function PlaceOrderScreen() {
    const navigate = useNavigate()
   
    const cart = useSelector((state)=> state.cart)

//if no payment method redirect to payment, if no address redirect to shipping
useEffect(() => {
if (!cart.shippingAddress.address){
navigate('/shipping')
}else if (!cart.paymentMethod){
    navigate('/payment')
}
}, [cart.paymentMethod, cart.shippingAddress.address])
  return (
   <>
   <Header />
   <CheckoutSteps step1 step2 step3 step4 />
   <Row>
    <Col md ={8}>
        <ListGroup variant='flush'>
            <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                    <strong>Address:</strong>
                    {cart.shippingAddress.address}, {cart.shippingAddress.city}, 
                    {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </p>
            </ListGroup.Item>

            <ListGroup.Item>
            <h2>Payment Method</h2>
            <strong>Method:</strong>
            {cart.paymentMethod}

            
            </ListGroup.Item>

            <ListGroup.Item>
                <h2>Order Items</h2>
            </ListGroup.Item>
        </ListGroup>
    </Col>
    <Col md ={4}>Columns</Col>
   </Row>
   </>
  )
}

export default PlaceOrderScreen