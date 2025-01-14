import React from "react"
import styles from "../../../styles/styles"
import { Link } from "react-router-dom"

const Hero = () => {
    return (
        <div className={`relative min-h-[70vh] 800px:min-h-[100vh] w-full bg-no-repeat ${styles.normalFlex}`}
            style={{ backgroundImage: "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)" }}
        >
            <div className={` ${styles.section} w-[90%] 800px:w-[60%]`}>
                <h1 className="text-[35px] leading-[1.2] 800px:text-[60px] font-[600] text-[#3d3a3a] capitalize">
                    Best Collection for <br />Home Decorations
                </h1>
                <p className="pt-5 text-[16px] font-[400] font-[Poppins] text-[#000000ba]">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,
                    assumenda? Quisquam itaque <br /> exercitationem labore vel, dolore
                    quidem asperiores, laudantium temporibus soluta optio consequatur{" "}
                    <br /> aliquam deserunt officia. Dolorum saepe nulla provident.
                </p>
                <Link to="/products" className="inline-block">
                    <div className={`${styles.button} mt-5`}>
                        <span className="text-[#fff] font-[Poppins] text-[18px]">
                            Shop Now
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Hero