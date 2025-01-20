import React, { useEffect } from 'react'
import ShopCreate from "../components/Shop/ShopCreate"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ShopCreatePage = () => {
  const { isSeller, seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/shop/${seller._id}`);
    }
  }, [])

  return (
    <div><ShopCreate /></div>
  )
}

export default ShopCreatePage