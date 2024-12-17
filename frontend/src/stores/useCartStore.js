import { create } from "zustand";
import axios from '../lib/axios.js';
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try{
			const response = await axios.get("/coupon");
			set({ coupon: response.data });
		}catch(error) {
			console.log("Error fetching coupon:", error);
		}
	},

	applyCoupon: async (code) => {
		try{
			const response = await axios.post("/coupon/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch(error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},

	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		try {
			const res = await axios.get("/cart");
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},

	clearCart: async() => {
		try{
			await axios.delete("/cart", {});
			console.log("clearCart is called!!!!")
			set({ cart: [], coupon: null, total: 0, subtotal: 0 });
		} catch(error) {
			console.error('Failed to clear cart:', error);
        	toast.error('Failed to clear cart');
		}
	},

	addToCart: async (product) => {
		try {
			await axios.post("/cart", { productId: product._id });
			toast.success("Product added to cart");

			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart: newCart };
			});
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred");
		}
	},

	removeFromCart: async (productId) => {
		await axios.delete(`/cart`, { data: { productId } });
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
		get().calculateTotals();
	},

	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		await axios.put(`/cart/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
	},
	
	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));

































////////////////////////////////////////////////////////////////////////////////
// export const useCartStore = create((set, get) => ({
//     cart: [],
//     coupon: null,
//     total: 0,
//     subtotal: 0,
//     isCouponApplied: false,
//     //{1} getCartItems
//     getCartItems: async() => {
//         try{
//             const res = await axios.get("/cart");
//             set({ cart: res.data });
//             //console.log("Cart Items from Backend:", res.data);
//             //here also👇
//             get().calculateTotal();
//         }catch(error) {
//             set({ cart: [] });
//             toast.error(error.response.data.error || "Failed to fetch cart items");
//         }
//     },
//     //{2} addToCart 
//     addToCart: async(product) => {
//         try {
//             await axios.post("/cart", { productId: product._id }); //because in the backend use.cartItems array we are just storing the product's id not all the fields of product
//             toast.success("Product added to cart");
//             // now the edge case if user clicks the add to cart again we just need to update it's quantity field!!
//             set((previousState) => {
//                 const existingItem = previousState.cart.find((p) => p._id === product._id);
//                 const newCart = existingItem
//                                 ? previousState.cart.map((p) =>  p._id === product._id  ? { ...p, quantity: p.quantity + 1} : p )
//                                 : [...previousState.cart, {...product, quantity: 1}];
//                 return { cart: newCart };
//             });
//             //👇whenever we add something to cart the just call the calculateTotal
//             get().calculateTotal();
//         } catch(error) {
//             toast.error(error.response.data.error || "Failed to add item to cart");
//         }
//     },
//     //{3} removeFromCart 
//     removeFromCart: async(productId) => {
//         try {
//             await axios.delete("/cart", { data: { productId } });
//             console.log( productId );
//             set((previousState) => ({
//                 cart: previousState.cart.filter((p) => p._id !== productId)
//             }));
//             get().calculateTotal();
//         } catch(error) {
//             toast.error(error.response.data.error || "Failed to remove item from cart");
//         }
//     },
//     updateQuantity: async(productId, quantity) => {
//         if(quantity === 0) {
//             //want to remove the item
//             get().removeFromCart(productId);
//         }
//         //if not then update the quantity
//         await axios.put(`/cart/${productId}`, { quantity });
//         set((previousState) => ({
//             cart: previousState.cart.map((p) => p._id === productId ? { ...p, quantity } : p),
//         }));
//         get().calculateTotal();
//     }, 
//     //[1]an utility function for calculating the total!!!
//     calculateTotal: () => {
//         const { cart, coupon } = get();
//         const subtotal = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
//         let total = subtotal;

//         if (coupon) {
//             const discount = subtotal * (coupon.discountPercentage / 100);
//             total = subtotal - discount;
//         }
//         //update the subtotal and total;
//         set({ subtotal, total });

//     },
// }));