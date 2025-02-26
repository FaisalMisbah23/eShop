import React, { useEffect } from 'react'
import ShopCreate from "../components/Shop/ShopCreate"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ShopCreatePage = () => {
  const { isSeller, isLoading } = useSelector((state) => state.seller);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSeller === true) {
      navigate("/dashboard");
    }
  }, [isLoading, isSeller])


  return (
    <div><ShopCreate /></div>
  )
}

export default ShopCreatePage