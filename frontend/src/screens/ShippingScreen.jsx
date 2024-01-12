import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from "../slices/cartSlice";
import Header from "../components/Header";
import CheckoutSteps from "../components/CheckoutSteps";

function ShippingScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState({
    address: shippingAddress.address || "",
    city: shippingAddress.city || "",
    state: shippingAddress.state || "",
    postalCode: shippingAddress.postalCode || "",
    country: shippingAddress.country || "",
  });

  function submitHandler(e) {
    e.preventDefault();
    dispatch(saveShippingAddress(address));
    navigate("/payment");
  }
  return (
    <>
    <Header />
    <FormContainer>
        <CheckoutSteps step1 step2/>
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="my-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            name="address"
            value={address.address}
            placeholder="Enter Address"
            type="address"
            onChange={(e) =>
              setAddress({ ...address, address: e.target.value })
            }
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" className="my-2">
          <Form.Label>City</Form.Label>
          <Form.Control
            name="city"
            value={address.city}
            placeholder="Enter City"
            type="city"
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" className="my-2">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            name="postalCode"
            value={address.postalCode}
            placeholder="Enter Zip Code"
            type="zip"
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
          ></Form.Control>


        </Form.Group>
        <Form.Group controlId="state" className="my-2">
          <Form.Label>State</Form.Label>
          <Form.Control
            name="state"
            value={address.state}
            placeholder="Enter State"
            type="state"
            onChange={(e) =>
              setAddress({ ...address, state: e.target.value })
            }
          ></Form.Control>
        </Form.Group>
        

        <Form.Group controlId="country" className="my-2">
          <Form.Label>Country</Form.Label>
          <Form.Control
            name="country"
            value={address.country}
            placeholder="Enter Country"
            type="country"
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary" className="my-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
    </>
  );
}

export default ShippingScreen;
