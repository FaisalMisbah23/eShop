import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createEvent, getAllEventsShop } from "../../redux/actions/event";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.event);
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    setEndDate(null);
    document.getElementById("end-date").min = minEndDate
      .toISOString()
      .slice(0, 10);
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : "";

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Event created successfully!");
      dispatch(getAllEventsShop(seller._id));
      setImages([]);
      setName("");
      setDescription("");
      setCategory("");
      setTags("");
      setOriginalPrice("");
      setDiscountPrice("");
      setStock("");
      setStartDate("");
      setEndDate("");
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    let files = Array.from(e.target.files);
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

    const data = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      images,
      shopId: seller._id,
      start_date: startDate?.toISOString(),
      finish_date: endDate?.toISOString(),
    };
    dispatch(createEvent(data));
  };

  return (
    <div className="w-full overflow-y-scroll h-[90vh] p-8">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-[#4F8CFF] mb-2">Create Event</h3>
        <p className="text-gray-600">Add a new event to your shop</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your event name..."
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
              placeholder="Enter your event description..."
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
              placeholder="Enter your event tags..."
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
              Event Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={stock}
              className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter event stock..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start-date"
                id="start-date"
                value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                onChange={handleStartDateChange}
                min={today}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="end-date"
                id="end-date"
                value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                onChange={handleEndDateChange}
                min={minEndDate}
                required
              />
            </div>
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
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
