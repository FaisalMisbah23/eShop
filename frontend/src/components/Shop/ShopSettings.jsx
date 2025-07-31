import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Shop info updated successfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full overflow-y-scroll h-[90vh] p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#4F8CFF] mb-2">Shop Settings</h1>
        <p className="text-gray-600">Manage your shop information and preferences</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={avatar ? avatar : `${seller.avatar?.url}`}
              alt=""
              className="w-[150px] h-[150px] rounded-full cursor-pointer border-4 border-[#4F8CFF] shadow-lg"
            />
            <div className="w-[40px] h-[40px] bg-[#4F8CFF] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[10px] shadow-lg hover:bg-[#2563eb] transition-colors duration-200">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image" className="cursor-pointer">
                <AiOutlineCamera className="text-white" />
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Click the camera icon to update your shop avatar</p>
        </div>

        {/* Shop Info Form */}
        <form onSubmit={updateHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name <span className="text-red-500">*</span>
              </label>
            <input
                type="text"
                placeholder="Enter shop name"
              value={name}
              onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
              required
            />
          </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Description
            </label>
            <textarea
              placeholder="Enter your shop description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent resize-none"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter shop address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code <span className="text-red-500">*</span>
              </label>
            <input
                type="text"
                placeholder="Enter zip code"
                value={zipCode}
                onChange={(e) => setZipcode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
              required
            />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
            >
              Update Shop Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
