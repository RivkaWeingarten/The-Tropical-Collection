import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Header from '../components/Header'
import Loader from '../components/Loader.jsx'
// import products from "../products"
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice.js";
import Message from '../components/Message.jsx'
const HomeScreen = () => {
 
const{data:products, isLoading, error} =useGetProductsQuery()

  return (
    <>
<Header />
{ isLoading ? (<Loader />) :  error?(<Message variant="danger">{error?.data?.message||error.error}</Message>) :(<>   <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id}  md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row></>)}
   
    </>
  );
};

export default HomeScreen;