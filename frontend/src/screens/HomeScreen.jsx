import { useContext } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Container } from "react-bootstrap";
// import { CurrentUser } from "../contexts/CurrentUser.js";
function HomeScreen() {
//   const { currentUser } = useContext(CurrentUser);

  // console.log(`is admin ${currentUser.isAdmin}`)

  return (
    <Container fluid>
    <Row>
    <Col xs={12} md={6} lg={6}>
      <Image src='https://thetropicalcollection.com/fruit-dish.jpeg' alt='fruit dish' fluid  className="full-height"></Image>
    </Col>
    <Col xs={12} md={6} lg={6} className="d-flex align-items-center justify-content-center">
          <div className="transparent-bg">
      <ListGroup variant="flush justify-content-start">
        <ListGroup.Item className="transparent-bg text-center">
          <h3 >Fresh Fruits Is Our Only Ingredient</h3>
        </ListGroup.Item>
      
        <ListGroup.Item className="transparent-bg text-center">
            <Image src='https://thetropicalcollection.com/logo-small.png' alt='fruit dish' width='200px' height ='200px'fluid >
   </Image>
   </ListGroup.Item>
        
        <ListGroup.Item className="transparent-bg text-center">
            <Link to ='/products'>
            <Button
              className="home-button"
              type="button"
             
            >
              See Our Products
            </Button>
            </Link>
          </ListGroup.Item>
      </ListGroup>
      </div>
    </Col>
    </Row>
</Container>
  
  );
}

export default HomeScreen;
