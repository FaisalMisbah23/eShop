import React, { useState } from "react"
import styles from "../../styles/styles"
import { Link } from "react-router-dom"
import { categoriesData, productData } from "../../static/data";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { BiMenuAltLeft } from "react-icons/bi";
import Dropdown from "./Dropdown"
import Navbar from "./Navbar"
import { useSelector } from "react-redux";
import { backend_url } from "../../server";

const Header = ({ activeHeading }) => {
    const { isAuthenticated } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState(null);
    const [active, setActive] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const user = isAuthenticated ? isAuthenticated : undefined;

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const filteredProducts = productData.filter((product) =>
            product.name.toLowerCase().includes(term.toLowerCase())
        );
        setSearchData(filteredProducts);
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 70) {
            setActive(true);
        } else {
            setActive(false);
        }
    })
    return (
        <>
            <div className={`${styles.section}`}>
                <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
                    <div>
                        <Link to={"/"}>
                            <img src="https://shopo.quomodothemes.website/assets/images/logo.svg" alt="logo" />
                        </Link>
                    </div>
                    {/* search box */}
                    <div className="w-[50%] relative">
                        <input type="text"
                            placeholder="Search Product..."
                            onChange={handleSearchChange}
                            value={searchTerm}
                            className="h-[40px] px-2 w-full border-[#3957db] border-[2px] rounded-md"
                        />
                        <AiOutlineSearch size={30} className="absolute right-3 top-1.5 cursor-pointer" />
                        {searchData && searchData.length !== 0 ? (
                            <div className="absolute min-h-[30vh] bg-slate-50 z-[9] rounded-sm-2 p-4">
                                {searchData && searchData.map((i, index) => {
                                    const d = i.name;

                                    const Product_name = d.replace(/\s+/g, "-");
                                    return (
                                        <Link to={`/product/${Product_name}`}>
                                            <div className="w-full flex items-start-py-3">
                                                <img src={i.image_Url[0].url}
                                                    alt="image"
                                                    className="w-[40px] h-[40px] mr-[10px]" />
                                                <h1>{i.name}</h1>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        ) : null}
                    </div>

                    <div className={`${styles.button}`}>
                        <Link to={"/seller"}>
                            <h1 className="text-[#fff] flex items-center">Become Seller <IoIosArrowForward className="ml-1" />
                            </h1>
                        </Link>
                    </div>
                </div>
            </div>


            <div className={`${active === true ? "shadow-sm fixed top-0 left-0 z-10" : null} transition hidden 800px:flex items-center justify-between w-full h-[70px] bg-[#3321c8]`}>
                <div className={`${styles.section} relative ${styles.normalFlex} justify-between`}>
                    {/* categories */}
                    <div>
                        <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block"
                            onClick={() => setDropdown(!dropdown)}>
                            <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
                            <button className="h-[100%] w-full flex justify-center items-center pl-10 font-sans text-lg bg-white font-[500] rounded-t-md select-none">
                                All Categories
                            </button>
                            <IoIosArrowDown
                                size={30}
                                className="absolute right-4 top-2 cursor-pointer"
                            />
                            {dropdown ? (
                                <Dropdown
                                    setDropdown={setDropdown}
                                    categoriesData={categoriesData}
                                />
                            ) : null}
                        </div>
                    </div>
                    {/* navitems */}
                    <div className={`${styles.normalFlex}`}>
                        <Navbar active={activeHeading} />
                    </div>
                    <div className="flex">
                        <div className={`${styles.normalFlex}`}>
                            <div className="relative cursor-pointer mr-[15px]">
                                <AiOutlineHeart size={30}
                                    color="rgb(255 255 255 / 83%" />
                                <span
                                    className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center"
                                >0</span>
                            </div>
                        </div><div className={`${styles.normalFlex}`}>
                            <div className="relative cursor-pointer mr-[15px]">
                                <AiOutlineShoppingCart size={30}
                                    color="rgb(255 255 255 / 83%" />
                                <span
                                    className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center"
                                >1</span>
                            </div>
                        </div>

                        <div className={`${styles.normalFlex}`}>
                            <div className="relative cursor-pointer mr-[15px]">
                                {user ? (
                                    <Link to={"/profile"}>
                                        <img src={`${backend_url}/uploads/${user.avatar}`} alt="avatar" className="w-[35px] h-[35px] rounded-full" />
                                    </Link>
                                ) : (
                                    <Link to={"/login"}>
                                        <CgProfile size={30} color="rgb(255 255 255 / 83%" />
                                    </Link>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div >
        </>
    )
}

export default Header