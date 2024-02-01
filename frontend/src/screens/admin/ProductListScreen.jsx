import React from "react";
import Header from "../../components/Header";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, } from "react-bootstrap";
import {  FaTrash, FaEdit } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useParams } from "react-router-dom";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Paginate from "../../components/Paginate";

function ProductListScreen() {
  const {pageNumber }= useParams()
  const { data, isLoading, error, refetch } = useGetProductsQuery({pageNumber});

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

    const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();


 async function deleteHandler(id) {
  if (window.confirm("Are you sure you want to delete this product?")) {
    try {
      await deleteProduct(id);
      refetch();
      toast.success('Product Deleted')
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }
  }

  async function createProductHandler() {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  }

  return (
    <>
      <Header />
      <>
        <Row className="align-items-center">
          <Col>
            <h1>Products</h1>
          </Col>

          <Col className="text-end">
            <Button className="btn-sm m-3" onClick={createProductHandler}>
              <FaEdit /> Create Product
            </Button>
          </Col>
        </Row>
        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}


        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Table
              striped
              hover
              responsive
              className="table-sm"
              style={{ backgroundColor: "white" }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>

                      <Button
                        variant="light"
                        className="btn-sm mx-2"
                        style={{ color: "red" }}
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Paginate pages ={data.pages} page={data.page} isAdmin={true} />
          </>
        )}
      </>
    </>
  );
}

export default ProductListScreen;
