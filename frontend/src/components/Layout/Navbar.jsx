import React from 'react'
import { Link } from 'react-router-dom'
import { navItems } from '../../static/data'
import styles from '../../styles/styles'

const Navbar = ({ active, mobile }) => {
    return (
        <nav className={mobile ? "flex flex-col gap-2 mt-2" : "flex flex-wrap items-center gap-2"}>
            {
                navItems && navItems.map((i, index) => (
                    <Link
                        key={index}
                        to={i.url}
                        className={
                            `${active === index + 1
                                ? "text-[#4F8CFF] font-bold"
                                : "text-[#222] hover:text-[#4F8CFF]"}
                            ${mobile ? "py-3 px-4 rounded-lg text-lg" : "px-4 py-2 rounded-lg text-base"} transition-colors`
                        }
                    >
                        {i.title}
                    </Link>
                ))
            }
        </nav>
    )
}

export default Navbar