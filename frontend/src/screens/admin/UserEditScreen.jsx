import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useUpdateUserMutation,
  useGetUserDetailsQuery,

 } from "../../slices/usersApiSlice";
import Header from "../../components/Header";

function UserEditScreen() {

    const { id: userId } = useParams();

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    isAdmin: false,
      });

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] =
    useUpdateUserMutation();

  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      setEditUser(user);
    }
  }, [user]);

  async function submitHandler(e) {
    e.preventDefault();
    const result = await updateUser(editUser);
        if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("User Updated");
      navigate("/admin/userlist");
    }
  }
  return (
    <div>UserEditScreen</div>
  )
}

export default UserEditScreen