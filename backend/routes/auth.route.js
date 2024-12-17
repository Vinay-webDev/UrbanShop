import express from 'express';

import { 
            signup, 
            login, 
            logout, 
            refreshAccessToken, 
            getProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/product.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refreshaccesstoken', refreshAccessToken);
router.get('/profile', protectRoute, getProfile);

export default router;