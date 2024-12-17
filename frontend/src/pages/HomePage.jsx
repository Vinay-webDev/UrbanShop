import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem.jsx";
import { useProductStore } from "../stores/useProductStore.js";
import FeaturedProducts from "../components/FeaturedProducts.jsx";


const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans5.jpg" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirt2.jpg" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes7.jpg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.jpg" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets8.jpg" },
	{ href: "/suits", name: "Suits", imageUrl: "/suit.jpg" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags2.jpg" },
	{ href: "/watch", name: "watch", imageUrl: "/watch2.jpg" },
	{ href: "/shirts", name: "shirts", imageUrl: "/shirts.jpg" },
];

const HomePage = () => {

	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	},[fetchFeaturedProducts]);

  return (
    <div className='relative min-h-screen text-black overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-serif font-medium text-gray-500 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-2xl text-gray-400 font-medium font-serif mb-12'>
						Shop Fresh. Shop Urban.
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>
				{/*///////////////////////////////////////// */}
				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
			{/*//////////////////////////////////////////////////////////////////////////////////////////////*/}
			{/*<div className='relative z-10 max-w-7xl mt-5 mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-serif font-medium text-gray-500 mb-4'>
					Explore All Products
				</h1>
				<p className='text-center text-xl text-gray-400 mb-12'>
					Discover the latest trends in eco-friendly fashion
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					<ProductCard/>
				</div>
			</div>*/}
	</div>
  )
}

export default HomePage