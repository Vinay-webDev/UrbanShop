import Product from '../models/product.model.js';

export const getCartProducts = async (req, res) => {
	try {
		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find((item) => item.id === productId);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push(productId);
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;
		const existingItem = user.cartItems.find((item) => item.id === productId);

		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
















































/////////////////////////////////////////////////////////////////////////
// //{4} getCartProducts
// //🪲🪲🪲🪲 my code 👇
// export const getCartProducts = async (req, res) => {
// 	try {
// 		const products = await Product.find({ _id: { $in: req.user.cartItems } });

// 		// add quantity for each product
// 		const cartItems = products.map((product) => {
// 			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
// 			return { ...product.toJSON(), quantity: item.quantity };
// 		});

// 		res.json(cartItems);
// 	} catch (error) {
// 		console.log("Error in getCartProducts controller", error.message);
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };
// /*
// export const getCartProducts = async(req, res) => {
//     try{
//         //[1]this is kinda new thing and bit difficult and confusing!
//         const products = await Product.find({ _id: { $in: req.user.cartItems }});
//         //products is an array (list of all product's ids in cartItems);
//         //[2] add quantity for each products
//         const cartItems = products.map((product) => {
//             const item = req.user.cartItems.find((item) => item.id === product.id); // this will get only the id field 
//             return { ...product.toJSON(), quantity: item.quantity }; // let's get the quantity field on top of it
//         });

//         res.json(cartItems);
//     } catch(error) {
//         console.log("Error in getCartProduct controller", error.message);
//         res.status(500).json({Error:"Server error", message: error.message});
//     }
// }*/
// //{1} addToCart
// export const addToCart = async(req, res) => {
//     try {
//         //[1] let's destruture the product's id from req.body so the user will have a product that we need to add to a cart
//         // remember in the user model in cartItems array we are saving just the product's Id not the entire product fields like name, description, price, image here as well!
//         const { productId } = req.body;
//         //[2] let's grab the user. we can do it here because this is a protected route remember in protected route we had set req.user = user; so now we can able to get user from req.user object!!!!!
//         const user = req.user;
//         //[3] now search if the product is already exists in user's cart!!!!??
//         const existingItem = await user.cartItems.find((item) => item.product === productId);
//         //[4] this is edge case
//         if (existingItem) {
//             //[5] if existing is true we just want to increment it's quantity by one!!
//             //🪲🪲🪲🪲🪲 user.cartItems.quantity += 1;
//             existingItem.quantity += 1;
//         } else {
//             //[6] if not then we need to push new product to user's cartItem array!!
//             user.cartItems.push(productId);
//             //we only pushing productId not all product's fields as mentioned above!
//         }
//         //[7] now we need to save all changes to the database 
//         await user.save(); //mongoose method to save it to database!
//         res.json(user.cartItems);
//     } catch(error) {
//         console.log("Error in addToCart controller", error.message);
//         res.status(500).json({Error: "Server error", message: error.message});
//     }
// }
// //{2} removeAllFromCart
// export const removeAllFromCart = async (req, res) => {
// 	try {
// 		const { productId } = req.body;
// 		const user = req.user;
// 		if (!productId) {
// 			user.cartItems = [];
// 		} else {
// 			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
// 		}
// 		await user.save();
// 		res.json(user.cartItems);
// 	} catch (error) {
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };
// /*
// 🪲🪲🪲👇😭
// export const removeAllFromCart = async(req, res) => {
//     try {
//         //[1] destructure the productId from req.body
//         const { productId } = req.body;
//         // console.log("req.body = ",req.body);
//         // console.log("productId = ",productId);
//         const user = req.user;
//         //[2] check to see if there is productId or not
//         // console.log(user.cartItems.product.id);
//         if (!productId) {
//             //[3] if there is no productId we would just return the cartItems as it is!
//             user.cartItems = [];
//         } else {
//             //[4] if there is productId we need to get the products except the productId i,e.. coming from req.body
//             user.cartItems = user.cartItems.filter((p) => p._id !== productId);
//         }
//         await user.save();
//         res.json(user.cartItems);
//     } catch(error) {
//         console.log("Error in removeAllFromCart controller", error.message);
//         res.status(500).json({Error: "Server error", message: error.message});
//     }
// }
// */
// //{3} updateQuantity
// export const updateQuantity = async (req, res) => {
// 	try {
// 		const { id: productId } = req.params;
// 		const { quantity } = req.body;
// 		const user = req.user;
// 		const existingItem = user.cartItems.find((item) => item.id === productId);

// 		if (existingItem) {
// 			if (quantity === 0) {
// 				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
// 				await user.save();
// 				return res.json(user.cartItems);
// 			}

// 			existingItem.quantity = quantity;
// 			await user.save();
// 			res.json(user.cartItems);
// 		} else {
// 			res.status(404).json({ message: "Product not found" });
// 		}
// 	} catch (error) {
// 		console.log("Error in updateQuantity controller", error.message);
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// };
// /*
// //🪲🪲🪲🪲👇🥹🫡
// export const updateQuantity = async(req, res) => {
//     try {
//         //[1] destructure id as productId (for our convenience) from req.params
//         const { id:productId } = req.params;
//         //[2] destructure the quantity from req.body
//         const { quantity } = req.body;
//         const user = req.user;
//         //[3] let's check to see if there any existingItems with the requested id
//         const existingItem = user.cartItems.find(p => p.id === productId);
//         //[4] check to see if there is existingItem
//         if (existingItem) {
//             //[5] also if the quantity is zero (this is the edge case where user will make quantity zero so we need to remove that zero'd quantity product from the user's cartItems array) 
//             if (quantity === 0) {
//                 // like this is a different way operation or way to delete or remove the product from cartItems array! so user can either directly hit delete button or they keep hitting the - minus button until it's zero. so when it's zero we want to remove the product's id from cartItems
//                 user.cartItems = user.cartItems.filter(p => p.id !== productId);
//                 await user.save();
//                 return res.json(user.cartItems);
//             }
//             //[6] else we just wanna update the quantity 
//             existingItem.quantity = quantity;
//             await user.save();
//             res.json(user.cartItems);
//         } else {
//             res.status(404).json({message: "Product not found!"});
//         }
        
//     } catch(error) {
//         console.log("Error in updateQuantity controller", error.message);
//         res.status(500).json({Error: "Server error", message: error.message});
//     }
// }
// */
// ////////////////////////////////////////////////////////////////////////
























/*
export const getCartProducts = async (req, res) => {
	try {
		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		// add quantity for each product
		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};*/


//🪲🪲🪲🪲👇

/*
export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item._id !== productId);
		}
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
*/












