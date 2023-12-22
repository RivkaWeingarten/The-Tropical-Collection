import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from '../components/Loader'
import FormContainer from "../components/FormContainer";


import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import {  toast} from 'react-toastify'
import Header from "../components/Header";
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const dispatch = useDispatch();
const navigate = useNavigate();

const [login, {isLoading}] = useLoginMutation()

const {userInfo} =useSelector((state) => state.auth)

const { search} =useLocation()
const sp = new URLSearchParams(search)
const redirect =sp.get('redirect') || '/products';

useEffect(()=>{
    if (userInfo){
        navigate(redirect)
    }
}, [ navigate, userInfo, redirect])

  const submitHandler = async(e) => {
    e.preventDefault();
    try{
        const res= await login({email, password}).unwrap()
        dispatch(setCredentials({...res,}))
        navigate(redirect)
    }catch(err){
      
 toast.error(err?.data?.message||err.error)

    }
    e.preventDefault();
  };    


  return (
    <>
    <Header />
    <FormContainer>
         
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
          Sign In
        </Button>
        {isLoading && <Loader />}
      </Form>
      <Row className="py-3">
        <Col>
        Don't have an account 
        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}> 
        {/* <Link to= '/register'>  */}
        Register
        </Link>
     
       </Col>
      </Row>
    </FormContainer>
    </>
  );
}

export default LoginScreen;


