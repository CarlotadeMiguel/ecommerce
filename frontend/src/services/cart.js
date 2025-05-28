// // src/services/cart.js
// import api from "./api";

// export const getCart = async () => {
//   try {
//     const response = await api.get("/cart");
//     return response.data;
//   } catch {
//     return { items: [] };
//   }
// };

// export const addToCart = async (productId, quantity = 1) => {
//   try {
//     console.log("Adding to cart:", productId, quantity);
//     const response = await api.post("/cart/add", {
//       product_id: productId,
//       quantity: quantity
//     });
//     return response.data;
//   } catch (error) {
//     if (error.response?.status === 401) {
//       console.log(error.response)
//       // localStorage.removeItem("accessToken");
//       // window.location = "/login";
//     }
//     throw error;
//   }
// };