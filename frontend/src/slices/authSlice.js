// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     userInfo: localStorage.getItem('userInfo')
//       ? JSON.parse(localStorage.getItem('userInfo'))
//       : null,
//   };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//         state.userInfo=action.payload
//       localStorage.setItem("userInfo", JSON.stringify(action.payload));
//     },
//     logout: (state, action) => {
//         state.userInfo =null;
//         localStorage.removeItem ('userInfo')
//     }
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";

const initialState = {
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;