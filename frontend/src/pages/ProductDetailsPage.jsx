import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Footer from '../components/Layout/Footer'
import Header from '../components/Layout/Header'
import ProductDetails from "../components/products/ProductDetails";
import SuggestedProduct from "../components/products/SuggestedProducts";
import { useSelector } from 'react-redux';

const ProductDetailsPage = () => {
    const { allProducts } = useSelector((state) => state.products);

    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const data = allProducts && allProducts.find((i) => i._id === id);
        setData(data);
    }, [data,allProducts,id]);

    return (
        <div>
            <Header />
            <ProductDetails data={data} />
            {data && <SuggestedProduct data={data} />}
            <Footer />
        </div>
    )
}

export default ProductDetailsPage