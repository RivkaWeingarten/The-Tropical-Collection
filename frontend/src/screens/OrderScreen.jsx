import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UseSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import logo from "../assets/logo-small.png";
import { toast } from "react-toastify";
import PaymentScreen from "./PaymentScreen";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useDeliverOrderMutation,
  useSelectedPaymentMethodMutation
} from "../slices/ordersApiSlice";

import {
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBTypography,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRadio
} from "mdb-react-ui-kit";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";

function OrderScreen() {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [selectedPaymentMethod, { isLoading: loadingPaymentMethod }] = useSelectedPaymentMethodMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =    useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  //user data
  const { userInfo } = useSelector((state) => state.auth);
//   const [changePaymentMethod, setChangePaymentMethod] = useState('PayPal');
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      async function loadPaypalScript() {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      }
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);
  // Format the price above to USD using the locale, style, and currency.
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  //get today's date
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;

  async function onPaidCash() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Payment Successful");
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment Successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  async function handlePaymentMethodClick (value) {
    try {
        
  if(!value){
    toast.error('value is nothing')
  } else{
    await selectedPaymentMethod({orderId, paymentMethod: value});
    
      refetch();
      toast.success(value);
    }
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  }

  async function deliverOrderHandler(){
    try {
      
        await deliverOrder(orderId);
        refetch();
        toast.success("Order Delivered");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    }
  

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" />
  ) : (
    <>
      <MDBContainer className="py-5">
        <MDBCard className="p-4">
          <MDBCardBody>
            <MDBContainer className="mb-2 mt-3">
              <MDBRow className="d-flex align-items-baseline">
                <MDBCol xl="9">
                  <img src={logo} alt="Logo" width="100px" />
                  <p style={{ color: "#7e8d9f", fontSize: "20px" }}>
                    Invoice &gt; &gt; <strong>ID: #{order._id}</strong>
                  </p>
                </MDBCol>
                <MDBCol xl="3" className="float-end">
                  <MDBBtn
                    color="light"
                    ripple="dark"
                    className="text-capitalize border-0"
                  >
                    <MDBIcon
                      fas
                      icon="print"
                      color="primary"
                      className="me-1"
                    />
                    Print
                  </MDBBtn>
                  <MDBBtn
                    color="light"
                    ripple="dark"
                    className="text-capitalize border-0 ms-2"
                  >
                    <MDBIcon
                      far
                      icon="file-pdf"
                      color="danger"
                      className="me-1"
                    />
                    Export
                  </MDBBtn>
                  <hr />
                </MDBCol>
              </MDBRow>
            </MDBContainer>
            <MDBContainer>
              <MDBCol md="12" className="text-center">
                <p className="pt-0">thetropicalcollection.com</p>
              </MDBCol>
            </MDBContainer>
            <MDBRow>
              <MDBCol xl="8">
                <MDBTypography listUnStyled>
                  <li className="text-muted">
                    To:{" "}
                    <span style={{ color: "#5d9fc5" }}>{order.user.name}</span>
                  </li>
                  <li className="text-muted">
                    {order.shippingAddress.address},
                    {order.shippingAddress.city}
                  </li>
                  <li className="text-muted">
                    {order.shippingAddress.state},{" "}
                    {order.shippingAddress.postalCode}
                  </li>
                  <li className="text-muted">
                    <MDBIcon fas icon="phone-alt" /> {222}
                  </li>
                </MDBTypography>
              </MDBCol>
              <MDBCol xl="4">
                <p className="text-muted">Invoice</p>
                <MDBTypography listUnStyled>
                  <li className="text-muted">
                    <MDBIcon fas icon="circle" style={{ color: "#84B0CA" }} />
                    <span className="fw-bold ms-1">ID:</span>#{order._id}
                  </li>
                  <li className="text-muted">
                    <MDBIcon fas icon="circle" style={{ color: "#84B0CA" }} />
                    <span className="fw-bold ms-1">Creation Date: </span>
                    {order.createdAt.substring(0, 10)}
                  </li>
                  <li className="text-muted">
                    <MDBIcon fas icon="circle" style={{ color: "#84B0CA" }} />
                    <span className="fw-bold ms-1">Status:</span>
                    <span className="badge bg-warning text-black fw-bold ms-1">

                      {order.isPaid ? "PAID" : "Unpaid"}
                    </span>

                    {
                      userInfo.isAdmin &&
                      !order.isPaid &&
                      order.paymentMethod==='cash' &&
                     (
                        <MDBBtn
                          color="light"
                          ripple="dark"
                          className="text-capitalize border-0"
                          onClick={onPaidCash}
                        >
                          <MDBIcon
                            fas
                            icon="print"
                            color="primary"
                            className="me-1"
                          />
                          Mark As Paid
                        </MDBBtn>
                      )}
                  </li>
                  <li className="text-muted">
                    <MDBIcon fas icon="circle" style={{ color: "#84B0CA" }} />
                    <span className="fw-bold ms-1">Delivered:</span>
                    <span className="badge bg-warning text-black fw-bold ms-1">
                      {/* here i am checking if delivered, if it is delivered it will 
                     show delivered, otherwise it will show not delivered, except for admin will show button to mark del
                      */}

                      {order.isDelivered ? "Delivered" : "Not Delivered"}
                    </span>

                    {userInfo &&
                      userInfo.isAdmin &&
                      order.isPaid &&
                      !order.isDelivered && (
                        <MDBBtn
                          color="light"
                          ripple="dark"
                          className="text-capitalize border-0"
                          onClick={deliverOrderHandler}
                        >
                          <MDBIcon
                            fas
                            icon="print"
                            color="primary"
                            className="me-1"
                          />
                          Mark as Delivered
                        </MDBBtn>
                      )}
                  </li>
                </MDBTypography>
              </MDBCol>
            </MDBRow>
            <MDBRow className="my-2 mx-1 justify-content-center">
              <MDBTable striped borderless>
                <MDBTableHead
                  className="text-white"
                  style={{ backgroundColor: "#84B0CA" }}
                >
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Description</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Unit Price</th>
                    <th scope="col">Amount</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {order &&
                    order.orderItems?.map((item, index) => (
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{USDollar.format(item.price)}</td>
                        <td>{USDollar.format(item.price * item.qty)}</td>
                      </tr>
                    ))}
                </MDBTableBody>
              </MDBTable>
            </MDBRow>
            <MDBRow>
              <MDBCol xl="8">
              {!order.isPaid && (
                // <PaymentScreen />
                <div>
                <p className="ms-3">
                 
                 <strong>Select Payment Method</strong>
                </p>
                    <MDBRadio name='flexRadioDefault' id='flexRadioDefault1' label='PayPal or CreditCard' value='Paypal'      onClick={() => handlePaymentMethodClick('PayPal')}
             />
                    <MDBRadio name='flexRadioDefault' id='flexRadioDefault2' label='Cash or Venmo' value ='cash'      onClick={() => handlePaymentMethodClick('cash')}
            />
                    </div>
              )}
              </MDBCol>
              <MDBCol xl="3">
                <MDBTypography listUnStyled>
                  <li className="text-muted ms-3">
                    <span class="text-black me-4">SubTotal</span>
                    {USDollar.format(order.itemsPrice)}
                  </li>
                  <li className="text-muted ms-3 mt-2">
                    <span class="text-black me-4">Tax(8%)</span>
                    {USDollar.format(order.itemsPrice * 0.08)}
                  </li>

                  <li className="text-muted ms-3 mt-2">
                    <span class="text-black me-4">Shipping</span>
                    {USDollar.format(order.shippingPrice)}
                  </li>
                </MDBTypography>
                <p className="text-black float-start">
                  <span className="text-black me-3"> Total Amount</span>
                  <span style={{ fontSize: "25px" }}>
                    {USDollar.format(order.itemsPrice * 1.08)}
                  </span>
                </p>
              </MDBCol>
            </MDBRow>
            <hr />
            <MDBRow>
              <MDBCol xl="10">
                <p>Thank you for your purchase</p>

   
              </MDBCol>
              <MDBCol xl="2">
                {/* <Link to= "/payment"> */}
                {/* <Link to= {`/payment/${currentUserId}`}> */}
                {!order.isPaid && order.paymentMethod ==='PayPal' && (
                  <div>
                    {loadingPay && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <div>
                        {/* <MDBBtn
                          onClick={onApproveTest}
                          className="text-capitalize"
                          style={{ backgroundColor: "#60bdf3" }}
                        >
                          Test Pay Order
                        </MDBBtn> */}
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* </Link> */}
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}

export default OrderScreen;
