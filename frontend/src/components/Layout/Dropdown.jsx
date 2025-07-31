import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/styles';

const Dropdown = ({ setDropdown, categoriesData }) => {
    const navigate = useNavigate();

    const handleSubmit = (i) => {
        navigate(`/products?category=${i.title}`);
        setDropdown(false);
        window.location.reload();
    }
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 z-50 max-h-72 overflow-y-auto">
            {categoriesData && categoriesData.map((i, index) => (<div
                key={index}
                onClick={() => handleSubmit(i)}
                className={`${styles.normalFlex}`}
            ><img src={i.image_Url} alt=""
                className="select-none object-contain ml-[10px] w-[25px] h-[25px]"
                />
                <h3 className="cursor-pointer m-3 select-none">{i.title}</h3>
            </div>
            ))}
        </div >
    )
}

export default Dropdown