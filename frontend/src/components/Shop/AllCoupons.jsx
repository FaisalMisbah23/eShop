import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCoupons = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [minAmount, setMinAmount] = useState(null);
    const [maxAmount, setMaxAmount] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [value, setValue] = useState(null);
    const { seller } = useSelector((state) => state.seller);
    const { products } = useSelector((state) => state.products);

    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        axios
            .get(`${server}/coupon/get-coupon/${seller._id}`, {
                withCredentials: true,
            })
            .then((res) => {
                setIsLoading(false);
                setCoupons(res.data.couponCodes);
            })
            .catch((error) => {
                setIsLoading(false);
            });
    }, [dispatch]);

    const handleDelete = async (id) => {
        axios.delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true }).then((res) => {
            toast.success("Coupon code deleted successfully!")
        })
        setCoupons(coupons.filter(coupon => coupon._id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios
            .post(
                `${server}/coupon/create-coupon-code`,
                {
                    name,
                    minAmount,
                    maxAmount,
                    selectedProducts,
                    value,
                    shopId: seller._id,
                },
                { withCredentials: true }
            )
            .then((res) => {
                toast.success("Coupon code created successfully!");
                setOpen(false);
                window.location.reload();
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const columns = [
        { field: "id", headerName: "Id", minWidth: 150, flex: 0.7 },
        {
            field: "name",
            headerName: "Coupon Code",
            minWidth: 180,
            flex: 1.4,
        },
        {
            field: "price",
            headerName: "Value",
            minWidth: 100,
            flex: 0.6,
        },
        {
            field: "Delete",
            flex: 0.8,
            minWidth: 120,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={() => handleDelete(params.id)}>
                            <AiOutlineDelete size={20} />
                        </Button>
                    </>
                );
            },
        },
    ];

    const row = [];

    coupons &&
        coupons.forEach((item) => {
            row.push({
                id: item._id,
                name: item.name,
                price: item.value + " %",
                sold: 10,
            });
        });

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full overflow-y-scroll h-[90vh] p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-[#4F8CFF] mb-2">Discount Codes</h1>
                        <p className="text-gray-600">Manage your coupon codes and promotional offers</p>
                    </div>
                    
                    <div className="w-full flex justify-end mb-6">
                        <button
                            className="px-6 py-3 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
                            onClick={() => setOpen(true)}
                        >
                            Create Coupon Code
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                    <DataGrid
                        rows={row}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        autoHeight
                            sx={{
                                '& .MuiDataGrid-root': {
                                    border: 'none',
                                },
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid #f0f0f0',
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#4F8CFF',
                                    color: 'white',
                                    borderBottom: 'none',
                                    '& .MuiDataGrid-columnHeader': {
                                        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                                    },
                                },
                                '& .MuiDataGrid-virtualScroller': {
                                    backgroundColor: '#ffffff',
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    borderTop: '1px solid #f0f0f0',
                                    backgroundColor: '#f8f9fa',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: '#F5F8FF',
                                },
                            }}
                        />
                    </div>
                    
                    {open && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="w-full flex justify-between items-center p-6 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-[#4F8CFF]">Create Coupon Code</h2>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                    >
                                        <RxCross1 size={24} className="text-gray-500" />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Coupon Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={name}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your coupon code name..."
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Discount Percentage <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="value"
                                            value={value}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
                                            onChange={(e) => setValue(e.target.value)}
                                            placeholder="Enter discount percentage..."
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Minimum Amount
                                            </label>
                                        <input
                                            type="number"
                                                name="minAmount"
                                            value={minAmount}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
                                            onChange={(e) => setMinAmount(e.target.value)}
                                                placeholder="Enter minimum amount..."
                                        />
                                    </div>
                                        
                                    <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Maximum Amount
                                            </label>
                                        <input
                                            type="number"
                                                name="maxAmount"
                                            value={maxAmount}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
                                            onChange={(e) => setMaxAmount(e.target.value)}
                                                placeholder="Enter maximum amount..."
                                        />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Selected Product
                                        </label>
                                        <select
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
                                            value={selectedProducts || ""}
                                            onChange={(e) => setSelectedProducts(e.target.value)}
                                        >
                                            <option value="">Choose a selected product</option>
                                            {products &&
                                                products.map((i) => (
                                                    <option value={i.name} key={i.name}>
                                                        {i.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow transition-colors duration-200"
                                        >
                                            Create Coupon
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AllCoupons;
