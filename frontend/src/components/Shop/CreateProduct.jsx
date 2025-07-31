import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, getAllProductsShop } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      dispatch(getAllProductsShop(seller._id));
      setImages([]);
      setName("");
      setDescription("");
      setCategory("");
      setTags("");
      setOriginalPrice("");
      setDiscountPrice("");
      setStock("");
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        shopId: seller._id,
        images,
      })
    );
  };

  return (
    <div className="w-full overflow-y-scroll h-[90vh] p-8">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-[#4F8CFF] mb-2">Create Product</h3>
        <p className="text-gray-600">Add a new product to your shop</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your product name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              cols="30"
              required
              rows="6"
              type="text"
              name="description"
              value={description}
              className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors resize-none"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your product description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Choose a category</option>
              {categoriesData &&
                categoriesData.map((i) => (
                  <option value={i.title} key={i.title}>
                    {i.title}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={tags}
              className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter your product tags..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price
              </label>
              <input
                type="number"
                name="price"
                value={originalPrice}
                className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Enter original price..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={discountPrice}
                className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Enter discount price..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={stock}
              className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter product stock..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name=""
              id="upload"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />
            <div className="w-full flex items-center flex-wrap gap-4">
              <label htmlFor="upload" className="cursor-pointer">
                <div className="w-32 h-32 border-2 border-dashed border-[#A0C1FF] rounded-lg flex items-center justify-center hover:border-[#4F8CFF] transition-colors">
                  <AiOutlinePlusCircle size={30} className="text-[#4F8CFF]" />
                </div>
              </label>
              {images &&
                images.map((i, index) => (
                  <img
                    src={i}
                    key={index}
                    alt=""
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow transition-colors duration-200"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
