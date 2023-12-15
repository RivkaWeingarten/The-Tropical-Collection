import bcrypt from 'bcryptjs'

const users=[
    {
        name:"Admin User",
        email:'admin @email.com',
        password:bcrypt.hashSync('123456', 12),
        isAdmin:true,
    },
    {
        name:"Admin User1",
        email:'admin1@email.com',
        password:bcrypt.hashSync('123456', 12),
        isAdmin:false,
    },
    {
        name:"Admin User2",
        email:'admin2@email.com',
        password:bcrypt.hashSync('123456', 12),
        isAdmin:false,
    },
]

export default users;