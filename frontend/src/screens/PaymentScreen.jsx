import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";
import Header from "../components/Header";

function PaymentScreen() {
  const [paymentMethod, setPaymentMethod] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);
  function submitHandler(e) {
    e.preventDefault();
    setPaymentMethod(e.target.value);
    dispatch(savePaymentMethod(paymentMethod));
    // navigate("/placeorder");
  }
  return (
    <>
      {/* <Header /> */}
      {/* <FormContainer> */}
        {/* <CheckoutSteps step1 step2 step3 /> */}
        {/* <p>Payment Method</p> */}
        {/* <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as="legend"></Form.Label>
            <Col>
              <Form.Check
                type="radio"
                className="my-2"
                label="PayPal or Credit Card"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
              
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
              <Form.Check
                type="radio"
                className="my-2"
                label="Cash or Venmo"
                id="cash"
                name="cash"
                value="cash"
              
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>


      </FormContainer> */}

<div>
      <p>Payment Method</p>
      <Form>
        <Form.Group>
          <Form.Label as="legend">Select a payment method:</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={submitHandler}
            ></Form.Check>
            <Form.Check
              type="radio"
              label="Cash or Venmo"
              id="cash"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === 'Cash'}
              onChange={submitHandler}
            ></Form.Check>
          </Col>
        </Form.Group>
      </Form>
     
      <p>Selected Payment Method: {paymentMethod}</p>
    </div>
    </>
  );
}

export default PaymentScreen;
