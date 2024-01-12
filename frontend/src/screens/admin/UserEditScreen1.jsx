import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Col, Row, Table} from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

import { LinkContainer } from "react-router-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} from "../../slices/usersApiSlice";

import { useGetOrdersByUserIdQuery } from "../../slices/ordersApiSlice";
import Header from "../../components/Header";



function UserEditScreen1() {
  const { id: userId } = useParams();

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    isAdmin: false,
    password: "",
    confirmPassword: "",
   
  });

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  const { data: orders, isLoading: loadingUserOrders} = useGetOrdersByUserIdQuery(userId);
  const dispatch = useDispatch();
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
  
  
      // Check if user.orders is an array before updating the state
      const ordersArray = Array.isArray(user.orders) ? user.orders : [];
  
      setEditUser((prevEditUser) => ({
        ...prevEditUser,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        orders: ordersArray,
        // Add other fields as needed
      }));
    }
  }, [user]);

  async function submitHandler(e) {
    e.preventDefault();
    console.log(editUser)
    const result = await updateUser(editUser);
    if (result.error) {
      toast.error(result.error);
    } else {
      if (editUser.password !== editUser.confirmPassword) {
        toast.error("Passwords do not match");
      } else {
        toast.success("User Updated");
        // dispatch(setCredentials(result));
        navigate("/admin/userlist");
      }
    }
  }

  return (
    <>
      <Header />
     
      <>
        <Link to="/admin/userlist" className="btn btn-light my-3">
          Go Back
        </Link>
       
  
          <h2>{editUser.name}</h2>
          
          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Row>
            <Col md={3}>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="my-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  //   placeholder="Enter name"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="price" className="my-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  //   placeholder="Enter Price"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                ></Form.Control>
     

              <Form.Group controlId="password" className="my-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Change Password"
                value={editUser.password}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="my-2">
              <Form.Label> Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={editUser.confirmPassword}
                onChange={(e) => setEditUser({ ...editUser, confirmPassword: e.target.value })}
              ></Form.Control>
            </Form.Group>

            </Form.Group>
              <Form.Group controlId="image" className="my-2">
                <Form.Label>Is Admin</Form.Label>
                <Form.Check
                  type="checkbox"
                  placeholder="Enter Image URL"
                  checked={editUser.isAdmin}
                  onChange={(e) =>
                    setEditUser({ ...editUser, image: e.target.checked })
                  }
                ></Form.Check>
              </Form.Group>

              <Button type="submit" variant="primary" className="my-2">
                Update
              </Button>
            </Form>
         </Col>

         <Col md={9}>
          <h2>Orders</h2>
          <Table striped hover responsive className="table-sm" style={{backgroundColor:'white'}}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}

                    </td>
                    <td>
                        <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn-sm" variant="light">
                            Details
                        </Button>
                        </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
              </Table>
          </Col>
         </Row>
         

            
          )}
     
      </>
    </>
  );
}

export default UserEditScreen1;
