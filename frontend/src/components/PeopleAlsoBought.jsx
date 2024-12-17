import { useEffect, useState } from 'react';
import ProductCard from './ProductCard.jsx';
import axios from '../lib/axios.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import toast from "react-hot-toast";



const PeopleAlsoBought = () => {

  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
			try {
				const res = await axios.get("/product/recommendations");
        //🪲🪲 setRecommendations(res.data)
				setRecommendations(res.data.products);
        //🪲🪲 console.log(res.data.products);
			} catch (error) {
				toast.error(error.response.data.message || "An error occurred while fetching recommendations");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecommendations();
  },[])

  if (isLoading) return <LoadingSpinner/>;

  return (
    <div className='mt-8' >
      <h3 className='text-5xl font-medium font-serif text-gray-500'>
        People Also Bought
      </h3>
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {recommendations.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
      </div>
    </div>
  )
}

export default PeopleAlsoBought