export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  export const updateCart = (state) => {
    //Calculate items price
    state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );
      //if order is over 100 shipping is free else 10$
      state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
      //tax 8%
      state.taxPrice = addDecimals(
        Number((0.08 * state.itemsPrice).toFixed(2))
      );
      //total price
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2);

      localStorage.setItem("cart", JSON.stringify(state));
      return state
  }