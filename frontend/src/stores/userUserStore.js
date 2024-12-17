import { create } from 'zustand';
import axios from '../lib/axios.js';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,
    
    signup: async({name, email, password, confirmPassword}) => {
        set({loading: true});

        if (password !== confirmPassword) {
            set({loading: false});
            return toast.error("Passwords do not match!");
        }
        
        try {
            const res = await axios.post("/auth/signup", {name, email, password});
            set({ user: res.data, loading: false });
        } catch(error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occured");
        }
    },
    
    login: async(email, password) => {
        set({ loading: true });
        try{
            const res = await axios.post("/auth/login", {email, password});
            set({ user: res.data, loading: false});
        } catch(error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occured");
        }
    },
    
    checkAuth: async() => {
        set({ checkingAuth: true });
        try {
            const res  = await axios.get("/auth/profile");
            set({ user: res.data, checkingAuth: false });
        } catch(error) {
            set({ checkingAuth: false, user: null });
        }
    },
    
    logout: async() => {
        try {
            await axios.post("/auth/logout");
            set({ user: null });
        }catch(error){
            toast.error(error.response?.data?.message || "An error occured during logout");
        }
    },
    
    refreshToken: async () => {
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const res = await axios.post("/auth/refreshaccesstoken");
			set({ checkingAuth: false });
			return res.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}))

let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);