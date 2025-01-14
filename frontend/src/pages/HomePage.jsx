import React from "react"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer.jsx"
import Hero from "../components/Route/Hero/Hero"
import Categories from "../components/Route/Categories/Categories"
import BestDeals from "../components/Route/BestDeals/BestDeals"
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct"
import Events from "../components/Route/Events/Events"
import Sponsored from "../components/Route/Sponsored"

const HomePage = () => {
    return (
        <>
            <Header activeHeading={1} />
            <Hero />
            <Categories />
            <BestDeals />
            <Events />
            <FeaturedProduct />
            <Sponsored />
            <Footer />
        </>
    )
}

export default HomePage