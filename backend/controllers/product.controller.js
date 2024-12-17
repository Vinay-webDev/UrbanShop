import Product from '../models/product.model.js';
import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';


export const getAllProducts = async(req, res) => {
    try {

        const products = await Product.find({});
        res.json({ products });


    } catch(error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const getFeaturedProducts = async(req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }
        featuredProducts = await Product.get({isFeatured:true}).lean();
        if (!featuredProducts) {
            return res.status(404).json({message: "Featured products not found!"});
        }
        await redis.set("featured_products", JSON.stringify(featuredProducts));

        res.json(featuredProducts);

    } catch(error) {
        console.log("Error in getFeaturedProducts", error.message);
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const createProduct = async(req, res) => {
    try {
        const { name, description, price, image, category } = req.body;
        let cloudinaryResponse = null;
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder:"products"});
        }
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })
        res.json(product);

    } catch(error) {
        console.log("Error in createProduct controller", error.message );
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const deleteProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({message: "Product not found!"});
        }
        if (product.image) {
            const publicId = product.image.split('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("deleted image from cloudinary!");
            } catch(error) {
                console.log("error deleting image from cloudinary", error.message);
            }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.json({message: "Product deleted successfully!"});
    } catch(error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const getRecommendedProducts = async(req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: {size:6}
            },
            {
                $project: {
                    _id:1,
                    name:1,
                    description:1,
                    price:1,
                    image:1,
                    category:1
                }
            }
        ])
        res.json({ products });
    } catch(error) {
        console.log("Error in getRecommendedProducts", error.message);
        res.status(500).json({Error: "Server error", error: error.message});
    }
}

export const getProductsByCategory = async(req, res) => {
    try {
        const {category} = req.params;
        const products = await Product.find({category});
        res.json({ products });
    } catch(error) {
        console.log("Error in getProductsByCategory controller", error.message);
        res.status(500).json({message:"Server in ", error: error.message});
    }
}

export const toggleFeaturedProducts = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            res.status(404).json({message: "Product not found"});
        }
    }catch(error) {
        console.log("Error in toggleFeaturedProducts controller", error.message);
        res.status(500).json({Error: "Server error", message: error.message});
    }
}

const updateFeaturedProductsCache = async() => {
    try {
        const featuredProduct = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProduct));
    } catch(error) {
        console.log("Error in update cache function");
    }
}