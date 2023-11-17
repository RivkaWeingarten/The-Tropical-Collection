import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";

function Products({ product }) {
  // my-3 is margin y axis 3 and padding all around 3 and also rounded
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image}
          variant="top"
          height="300px"
          width="50px"
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        {/* <Card.Text as="div">
          <Ratings
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text> */}
        <Card.Text as="h3">
          ${product.price}
          <Button
            variant="outline-primary float-end"

            // disabled={product.countInStock === 0}
          >
            Add To Cart
          </Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Products;
