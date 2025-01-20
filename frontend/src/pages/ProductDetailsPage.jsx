import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { productData } from "../static/data";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/products/ProductDetails"
import SuggestedProducts from "../components/products/SuggestedProducts.jsx"
import Header from "../components/Layout/Header";

const ProductDetailsPage = () => {
    const [data, setData] = useState(null);
    const { name } = useParams();
    const productName = name.replace(/-/g, " ");

    useEffect(() => {
        const data = productData.find((i) => i.name === productName);
        setData(data);
    }, [])
    return (
        <div>
            <Header />
            <ProductDetails data={data} />
            {data && <SuggestedProducts data={data} />}
            <Footer />
        </div>
    )
}

export default ProductDetailsPage