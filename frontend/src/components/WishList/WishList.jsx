import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { backend_url } from "../../server";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWishlist }) => {
    const { wishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);

    const dispatch = useDispatch();

    const removeFromWishlistHandler = (data) => {
        dispatch(removeFromWishlist(data))
    }

    const addToCartHandler = (data) => {
        const isItemExist = cart.find((i) => i._id === data._id);
        if (isItemExist) {
          toast.error("Item already in cart!")
        } else {
          if (data.stock < 1) {
            toast.error("Product stock limited!")
          } else {
            const cartData = { ...data, qty: 1 };
            dispatch(addToCart(cartData));
            toast.success("item added to cart successfully!")
          }
        }
      }

    return (
        <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
            <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between shadow-sm">
                {wishlist && wishlist.length === 0 ? (
                    <div className="w-full h-screen flex items-center justify-center">
                        <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
                            <RxCross1 size={25} className="cursor-pointer"
                                onClick={() => setOpenWishlist(false)} />
                        </div>
                        <h5>Wishlist is empty!</h5>
                    </div>
                ) : (
                    <div>
                        <div className="flex w-full justify-end pt-5 pr-5">
                            <RxCross1
                                size={25}
                                className="cursor-pointer"
                                onClick={() => setOpenWishlist(false)}
                            />
                        </div>
                        {/* Item length */}
                        <div className={`${styles.normalFlex} p-4`}>
                            <AiOutlineHeart size={25} />
                            <h5 className="pl-2 text-[20px] font-[500]">{wishlist && wishlist.length} items</h5>
                        </div>

                        {/* wishlist Single Items */}
                        <br />
                        <div className="w-full border-t">
                            {wishlist &&
                                wishlist.map((i, index) => <WishlistSingle key={index} data={i} removeFromWishlistHandler={removeFromWishlistHandler} addToCartHandler={addToCartHandler} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const WishlistSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
    const [value, setValue] = useState(1);
    const totalPrice = data.discountPrice * value;

    return (
        <div className="border-b p-4">
            <div className="w-full flex items-center">
                <RxCross1 className="cursor-pointer" onClick={() => removeFromWishlistHandler(data)} />
                <img src={`${backend_url}${data.images[0]}`} alt=""
                    className="w-[130px] h-[130px] ml-2 mr-2 rounded-[5px]"
                />

                <div className="pl-[5px]">
                    <h1>{data.name}</h1>
                    <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
                        US${totalPrice}
                    </h4>
                </div>
                <div>
                    <BsCartPlus size={20} className="cursor-pointer" tile="Add to cart" onClick={() => addToCartHandler(data)} />
                </div>
            </div>
        </div>
    );
};

export default Wishlist;