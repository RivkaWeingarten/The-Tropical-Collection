import React from 'react'
import Header from '../../components/Header'
import { LinkContainer } from 'react-router-bootstrap'
import {Table, Button } from 'react-bootstrap'
import {FaTrash, FaEdit, FaCheck} from 'react-icons/fa'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice'
import {toast} from 'react-toastify'

function UserListScreen() {

    
const {data: users, isLoading, error, refetch} = useGetUsersQuery()
const [deleteUser, {isLoading:loadingDelete}]=useDeleteUserMutation()

async function deleteHandler(id) {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success('Customer Deleted')
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
    }
  return (
    <>
    <Header />
    <>
    <h1>Customers</h1>

    {loadingDelete && <Loader />}
    {isLoading ? <Loader /> : error ? <Message variant ='danger'>{error}
    </Message> :(
      <Table style= {{backgroundColor:'white'}} striped hover responsive className='table-sm'>
<thead>
  <tr>
    <th>ID</th>
    <th>NAME</th>
    <th>EMAIL</th>
    <th>ADMIN</th>
    <th></th>
 
  </tr>
</thead>
<tbody>
  {users.map((user) => (
    <tr key={(user._id)}>
<td>{user._id}</td>
<td>{user.name}</td>
<td><a href={`mailto:${user.email}`}>{user.email}</a></td>

<td>{user.isAdmin ? (<FaCheck style={{color:'green'}} />) : ('')}</td>

<td><LinkContainer to = {`/admin/user/${user._id}/edit`} >
  <Button variant ='light' className ='btn sm'> <FaEdit/></Button>
  </LinkContainer>

  <Button variant ='light' className ='btn sm' onClick= {()=>deleteHandler(user._id)}> <FaTrash/></Button>
  </td>
    </tr>
  ))}

  
</tbody>
      </Table>
    )}
     </>
    </>
  )
}

export default UserListScreen