import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios.js';

export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    
    setProducts: (products) => set({products}),

    createProduct: async(productData) => {
        set({loading: true});
        try {
            const res = await axios.post("/product", productData);
            set((previousState) => ({
                products: [...previousState.products, res.data],
                loading: false,
            }))

        } catch(error) {
            toast.error(error.response.data.error);
            set({loading: false});
        }
    },

    fetchAllProducts: async() => {
        set({ loading: true });
        try {
            const res = await axios.get("/product");
            set({ products: res.data.products, loading: false });
        } catch(error) {
            set({ error: "Failed to fetch products", loading: false});
            toast.error(error.response.data.error || "Failed to fetch product");
        }
    },
    
    fetchProductsByCategory: async(category) => {
        set({ loading: true });
        try {
            const res = await axios.get(`/product/category/${category}`);
            set({ products: res.data.products, loading: false });
        } catch(error) {
            set({ error: "Failed to fetch products", loading: false });
            toast.error(error.response.data.error || "Failed to fetch products");
        }
    },

    deleteProduct: async(productId) => {
        set({ loading: true });
        try {
            await axios.delete(`/product/${productId}`);
            set((previousProducts) => ({
                products: previousProducts.products.filter((product) => product._id !== productId),
                loading: false,
            }));
        } catch(error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to delete product");
        }
    },
    
    toggleFeaturedProduct: async(productId) => {
        set({ loading: true });
        try {
            const res = await axios.patch(`/product/${productId}`);
            if (res.data && typeof res.data.isFeatured !== 'undefined') {
                set((state) => ({
                    products: state.products.map((product) =>
                        product._id === productId
                            ? { ...product, isFeatured: res.data.isFeatured }
                            : product
                    ),
                    loading: false,
                }));
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.error || "Failed to update product");
        }
    },

    fetchFeaturedProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/product/featured");
            set({ products: response.data, loading: false });
        } catch(error) {
            set({ error: "Failed to fetch products", loading: false });
            console.log("Error fetchting featured products:", error);
        }
    },

}))