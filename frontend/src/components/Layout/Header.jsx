import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import { 
  AiOutlineHeart, 
  AiOutlineSearch, 
  AiOutlineShoppingCart, 
  AiOutlineMenu, 
  AiOutlineClose, 
} from "react-icons/ai"; 
import { IoIosArrowForward } from "react-icons/io"; 
import { CgProfile } from "react-icons/cg"; 
import { RxCross2 } from "react-icons/rx"; 
import { addToCart, removeFromCart } from "../../redux/actions/cart"; 
import { removeFromWishlist } from "../../redux/actions/wishlist"; 
import { toast } from "react-toastify";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { allProducts } = useSelector((state) => state.products); 
  const { cart } = useSelector((state) => state.cart); 
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch(); 
 
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [openCart, setOpenCart] = useState(false); 
  const [openWishlist, setOpenWishlist] = useState(false); 
  const [mobileMenu, setMobileMenu] = useState(false); 
 
  const navLinks = [ 
    { name: "Home", path: "/", id: 1 }, 
    { name: "Best Selling", path: "/best-selling", id: 2 }, 
    { name: "Products", path: "/products", id: 3 }, 
    { name: "Events", path: "/events", id: 4 }, 
    { name: "FAQ", path: "/faq", id: 5 }, 
  ]; 

  useEffect(() => {
    const handleScroll = () => { 
      if (window.scrollY > 70) {
        setActive(true);
      } else {
        setActive(false);
      }
    }; 
 
    window.addEventListener("scroll", handleScroll); 
    return () => window.removeEventListener("scroll", handleScroll); 
  }, []);

  const handleSearchChange = (e) => { 
    const term = e.target.value;
    setSearchTerm(term);

    if (term === "") { 
      setSearchData(null);
    } else {
      const filteredProducts = 
        allProducts && 
        allProducts.filter((product) => 
          product.name.toLowerCase().includes(term.toLowerCase()) 
        ); 
      setSearchData(filteredProducts); 
    } 
  }; 
 
  const handleRemoveFromCart = (data) => { 
    dispatch(removeFromCart(data)); 
    toast.success("Item removed from cart!"); 
  }; 
 
  const handleRemoveFromWishlist = (data) => { 
    dispatch(removeFromWishlist(data)); 
    toast.success("Item removed from wishlist!"); 
  }; 

  const handleAddToCart = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addToCart(newData));
    toast.success("Item added to cart successfully!");
  };
 
  const calculateTotal = () => { 
    return cart.reduce((total, item) => total + (item.discountPrice * item.qty), 0); 
  };

  return (
    <>
      {/* Main Header */} 
      <header className={`${active ? "fixed top-0 left-0 w-full z-50 shadow-lg" : ""} bg-white transition-all duration-300`}> 
        <div className="max-w-7xl mx-auto px-4"> 
          <div className="flex items-center justify-between h-16"> 
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2"> 
              <img  
                src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"  
                alt="logo"  
                className="w-10 h-10 rounded-full bg-white p-1 shadow"  
              /> 
              <span className="text-2xl font-bold font-sans text-[#4F8CFF]">eShopZone</span> 
              </Link>

            {/* Search Bar - Desktop */} 
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative"> 
                <input
                  type="text"
                  placeholder="Search Product..."
                onChange={handleSearchChange} 
                  value={searchTerm}
                className="w-full px-4 py-2 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent shadow" 
              /> 
              <AiOutlineSearch 
                size={20} 
                className="absolute right-3 top-2.5 text-[#4F8CFF] cursor-pointer" 
                />
                {searchData && searchData.length !== 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-[#A0C1FF] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1"> 
                  {searchData.map((i, index) => ( 
                    <Link to={`/product/${i._id}`} key={index}> 
                      <div className="flex items-center p-3 hover:bg-gray-50 rounded"> 
                        <img 
                          src={i.images[0]?.url} 
                          alt="" 
                          className="w-10 h-10 rounded object-cover mr-3" 
                        /> 
                        <span className="text-[#222]">{i.name}</span> 
                          </div>
                        </Link>
                  ))} 
                  </div>
                )}
            </div>

            {/* Desktop Navigation */} 
            <nav className="hidden lg:flex items-center space-x-6"> 
              {navLinks.map(link => ( 
                <Link 
                  key={link.id} 
                  to={link.path} 
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${ 
                    activeHeading === link.id  
                      ? "bg-[#4F8CFF] text-white shadow"  
                      : "text-[#222] hover:bg-[#F5F8FF] hover:text-[#4F8CFF]" 
                  }`} 
                > 
                  {link.name} 
              </Link>
              ))} 
            </nav> 
 
            {/* Desktop Icons */} 
            <div className="hidden lg:flex items-center space-x-4">
              {/* Admin Button */} 
              {user?.role === "Admin" && (
                <Link to="/admin/dashboard" className="px-4 py-2 bg-[#4F8CFF] text-white font-semibold rounded-lg hover:bg-[#2563eb] transition-colors duration-200 shadow"> 
                  Admin
                </Link>
              )}
 
              {/* Seller Button */} 
              <Link to={isSeller ? "/dashboard" : "/shop-create"} className="px-4 py-2 bg-gradient-to-r from-[#A0C1FF] to-[#4F8CFF] text-white font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#4F8CFF] transition-all duration-200 shadow"> 
                {isSeller ? "Dashboard" : "Become Seller"} 
                </Link>
 
              {/* Wishlist */} 
              <div className="relative cursor-pointer" onClick={() => setOpenWishlist(true)}> 
                <AiOutlineHeart size={24} className="text-[#4F8CFF] hover:text-[#2563eb] transition-colors" /> 
                {wishlist && wishlist.length > 0 && ( 
                  <span className="absolute -top-2 -right-2 bg-[#FFB800] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"> 
                    {wishlist.length} 
                  </span> 
              )}
            </div>

              {/* Cart */}
              <div className="relative cursor-pointer" onClick={() => setOpenCart(true)}>
                <AiOutlineShoppingCart size={24} className="text-[#4F8CFF] hover:text-[#2563eb] transition-colors" /> 
                {cart && cart.length > 0 && ( 
                  <span className="absolute -top-2 -right-2 bg-[#FFB800] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"> 
                    {cart.length} 
                </span>
                )} 
              </div>

              {/* Profile */}
                {isAuthenticated ? (
                <Link to="/profile"> 
                  <img 
                    src={user?.avatar?.url || "https://via.placeholder.com/32x32"} 
                    alt="avatar" 
                    className="w-8 h-8 rounded-full border-2 border-[#4F8CFF] shadow" 
                  /> 
                          </Link>
                ) : (
                  <Link to="/login">
                  <CgProfile size={24} className="text-[#4F8CFF] hover:text-[#2563eb] transition-colors" /> 
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-[#F5F8FF] transition-colors" 
              onClick={() => setMobileMenu(true)} 
            > 
              <AiOutlineMenu size={24} className="text-[#4F8CFF]" /> 
            </button> 
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && ( 
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"> 
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl"> 
              <div className="flex items-center justify-between p-4 border-b border-[#A0C1FF]"> 
                <span className="text-lg font-semibold text-[#4F8CFF]">Menu</span> 
                <button 
                  onClick={() => setMobileMenu(false)} 
                  className="p-2 rounded-lg hover:bg-[#F5F8FF] transition-colors" 
                > 
                  <AiOutlineClose size={24} className="text-[#4F8CFF]" /> 
                </button> 
              </div>

              <div className="p-4 space-y-4"> 
                {/* Mobile Search */} 
                <div className="relative"> 
                  <input
                    type="text"
                    placeholder="Search Product..."
                    onChange={handleSearchChange} 
                    value={searchTerm}
                    className="w-full px-4 py-2 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent shadow" 
                  /> 
                  <AiOutlineSearch 
                    size={20} 
                    className="absolute right-3 top-2.5 text-[#4F8CFF]" 
                  /> 
                </div>

                {/* Mobile Navigation */} 
                <div className="space-y-2"> 
                  {navLinks.map(link => ( 
                    <Link 
                      key={link.id} 
                      to={link.path} 
                      className={`block px-3 py-2 rounded-lg font-medium transition-colors ${ 
                        activeHeading === link.id  
                          ? "bg-[#4F8CFF] text-white shadow"  
                          : "text-[#222] hover:bg-[#F5F8FF]" 
                      }`} 
                      onClick={() => setMobileMenu(false)} 
                    > 
                      {link.name} 
                  </Link>
                  ))} 
                </div>

                {/* Mobile Admin/Seller Buttons */} 
                <div className="space-y-2 pt-4 border-t border-[#A0C1FF]"> 
                  {user?.role === "Admin" && (
                    <Link  
                      to="/admin/dashboard"  
                      className="block px-4 py-2 bg-[#4F8CFF] text-white font-semibold rounded-lg hover:bg-[#2563eb] transition-colors duration-200 shadow" 
                      onClick={() => setMobileMenu(false)} 
                    > 
                      Admin
                    </Link>
                  )}
                  <Link  
                    to={isSeller ? "/dashboard" : "/shop-create"}  
                    className="block px-4 py-2 bg-gradient-to-r from-[#A0C1FF] to-[#4F8CFF] text-white font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#4F8CFF] transition-all duration-200 shadow" 
                    onClick={() => setMobileMenu(false)} 
                  > 
                    {isSeller ? "Dashboard" : "Become Seller"} 
                    </Link>
                </div>

                {/* Mobile Icons */}
                <div className="flex items-center justify-center space-x-6 pt-4 border-t border-[#A0C1FF]"> 
                  <div className="relative cursor-pointer" onClick={() => { setOpenWishlist(true); setMobileMenu(false); }}> 
                    <AiOutlineHeart size={24} className="text-[#4F8CFF]" /> 
                    {wishlist && wishlist.length > 0 && ( 
                      <span className="absolute -top-2 -right-2 bg-[#FFB800] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"> 
                        {wishlist.length} 
                    </span>
                    )} 
                  </div>
                  <div className="relative cursor-pointer" onClick={() => { setOpenCart(true); setMobileMenu(false); }}> 
                    <AiOutlineShoppingCart size={24} className="text-[#4F8CFF]" /> 
                    {cart && cart.length > 0 && ( 
                      <span className="absolute -top-2 -right-2 bg-[#FFB800] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"> 
                        {cart.length} 
                    </span>
                    )} 
                  </div>
                  {isAuthenticated ? (
                    <Link to="/profile" onClick={() => setMobileMenu(false)}> 
                      <img 
                        src={user?.avatar?.url || "https://via.placeholder.com/32x32"} 
                        alt="avatar" 
                        className="w-8 h-8 rounded-full border-2 border-[#4F8CFF] shadow" 
                      /> 
                    </Link>
                  ) : (
                    <Link to="/login" onClick={() => setMobileMenu(false)}> 
                      <CgProfile size={24} className="text-[#4F8CFF]" /> 
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header> 

        {/* Cart Popup */}
        {openCart && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end"> 
            <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col">
            <div className="bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] text-white p-4 flex items-center justify-between"> 
              <h2 className="text-xl font-semibold">Shopping Cart ({cart?.length})</h2> 
                <button onClick={() => setOpenCart(false)} className="text-white hover:text-gray-200">
                  <RxCross2 size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {cart && cart.length > 0 ? (
                <> 
                  {cart.map((item, index) => ( 
                    <CartItem  
                      key={index}  
                      item={item}  
                      onRemove={handleRemoveFromCart}
                      onQuantityChange={(newQty) => {
                        const updatedItem = { ...item, qty: newQty };
                        dispatch(addToCart(updatedItem));
                      }}
                    /> 
                  ))} 
                  <div className="mt-4 pt-4 border-t border-gray-200"> 
                    <div className="flex justify-between items-center text-lg font-semibold"> 
                      <span>Total:</span> 
                      <span className="text-[#4F8CFF]">US${calculateTotal().toFixed(2)}</span> 
                    </div> 
                  </div> 
                </> 
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <AiOutlineShoppingCart size={60} className="mb-4" />
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <p className="text-sm">Add some products to get started</p>
                  </div>
                )}
              </div>
              {cart && cart.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                <Link to="/checkout" onClick={() => setOpenCart(false)}> 
                  <button className="w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow"> 
                    Checkout (US${calculateTotal().toFixed(2)}) 
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wishlist Popup */}
        {openWishlist && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end"> 
            <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col">
            <div className="bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] text-white p-4 flex items-center justify-between"> 
              <h2 className="text-xl font-semibold">Wishlist ({wishlist?.length})</h2> 
                <button onClick={() => setOpenWishlist(false)} className="text-white hover:text-gray-200">
                  <RxCross2 size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {wishlist && wishlist.length > 0 ? (
                wishlist.map((item, index) => ( 
                  <WishlistItem  
                    key={index}  
                    item={item}  
                    onRemove={handleRemoveFromWishlist}
                    onAddToCart={handleAddToCart}
                  /> 
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <AiOutlineHeart size={60} className="mb-4" /> 
                    <p className="text-lg font-medium">Your wishlist is empty</p>
                    <p className="text-sm">Add some products to your wishlist</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </>
  );
};

const CartItem = ({ item, onRemove, onQuantityChange }) => { 
  const price = item?.discountPrice || item?.price || 0; 
  const qty = item?.qty || 1; 
  const totalPrice = price * qty; 

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      onQuantityChange(qty + 1);
    } else if (type === "decrement" && qty > 1) {
      onQuantityChange(qty - 1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <img  
          src={item?.images?.[0]?.url || "https://via.placeholder.com/64x64?text=No+Image"}  
          alt=""  
          className="w-16 h-16 object-cover rounded-lg"  
        /> 
        <div>
          <h3 className="font-medium text-gray-900">{item?.name || "Product"}</h3> 
          <div className="flex items-center space-x-2 mt-1">
            <button 
              onClick={() => handleQuantityChange("decrement")}
              className="w-6 h-6 rounded-full bg-gradient-to-r from-red-400 to-red-600 text-white flex items-center justify-center text-sm"
            >
              -
            </button>
            <span className="text-sm font-medium">{qty}</span>
            <button 
              onClick={() => handleQuantityChange("increment")}
              className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white flex items-center justify-center text-sm"
            >
              +
            </button>
          </div>
          <p className="text-[#4F8CFF] font-semibold">US${totalPrice.toFixed(2)}</p> 
        </div>
      </div>
      <button
        onClick={() => onRemove(item)} 
        className="text-red-500 hover:text-red-700 transition-colors duration-200"
      >
        <RxCross2 size={20} />
      </button>
    </div>
  );
};

const WishlistItem = ({ item, onRemove, onAddToCart }) => { 
  return (
    <div className="p-4 border-b border-gray-200"> 
      <div className="flex items-center space-x-4 mb-3"> 
        <img  
          src={item?.images?.[0]?.url || "https://via.placeholder.com/64x64?text=No+Image"}  
          alt=""  
          className="w-16 h-16 object-cover rounded-lg"  
        /> 
        <div className="flex-1"> 
          <h3 className="font-medium text-gray-900">{item?.name || "Product"}</h3> 
          <p className="text-[#4F8CFF] font-semibold">US${(item?.discountPrice || item?.price || 0).toFixed(2)}</p> 
        </div>
        <button 
          onClick={() => onRemove(item)} 
          className="text-red-500 hover:text-red-700 transition-colors duration-200" 
        > 
          <RxCross2 size={20} /> 
        </button> 
      </div>
      <button
        onClick={() => onAddToCart(item)}
        className="w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Header;