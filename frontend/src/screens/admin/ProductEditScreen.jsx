import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
 } from "../../slices/productsApiSlice";
import Header from "../../components/Header";

function ProductEditScreen() {
  const { id: productId } = useParams();

  const [editProduct, setEditProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
  });

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUploadImage }] =
    useUploadProductImageMutation();


  const navigate = useNavigate();


  useEffect(() => {
    if (product) {
      setEditProduct(product);
    }
  }, [product]);

  async function submitHandler(e) {
    e.preventDefault();
    const result = await updateProduct(editProduct);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Product Updated");
      navigate("/admin/productlist");
    }
  }

  async function uploadFileHandler(e) {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setEditProduct({ ...editProduct, image: res.image });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <>
      <Header />
      <>
        <Link to="/admin/productlist" className="btn btn-light my-3">
          Go Back
        </Link>

        <FormContainer>
          <h1>Edit Product</h1>
          {loadingUpdate && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="my-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="price" className="my-2">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Price"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="image" className="my-2">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Image URL"
                  value={editProduct.image}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, image: e.target.value })
                  }
                ></Form.Control>

                <Form.Control
                  type="file"
                  label="Choose File"
                  onChange={uploadFileHandler}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="category" className="my-2">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, category: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="description" className="my-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value,
                    })
                  }
                ></Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary" className="my-2">
                Update
              </Button>
            </Form>
          )}
        </FormContainer>
      </>
    </>
  );
}

export default ProductEditScreen;
