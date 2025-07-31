import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const [deliveredOrder, setDeliveredOrder] = useState(orders && orders);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));

    const orderData =
      orders && orders.filter((item) => item.status === "Delivered");
    setDeliveredOrder(orderData);
  }, [dispatch]);

  const availableBalance = seller.availableBalance.toFixed(2) || 0;

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="w-full overflow-y-scroll h-[90vh] p-8">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-[#4F8CFF] mb-2">Dashboard Overview</h3>
        <p className="text-gray-600">Welcome back! Here's what's happening with your shop.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#4F8CFF]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <AiOutlineMoneyCollect size={24} className="text-[#4F8CFF] mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Account Balance</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">(with 10% service charge)</p>
              <h5 className="text-2xl font-bold text-[#4F8CFF]">${availableBalance}</h5>
            </div>
          </div>
          <Link to="/dashboard-withdraw-money" className="inline-block mt-4 text-[#4F8CFF] font-medium hover:underline">
            Withdraw Money →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <MdBorderClear size={24} className="text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">All Orders</h3>
              </div>
              <h5 className="text-2xl font-bold text-green-500">{orders && orders.length}</h5>
            </div>
          </div>
          <Link to="/dashboard-orders" className="inline-block mt-4 text-green-500 font-medium hover:underline">
            View Orders →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <AiOutlineMoneyCollect size={24} className="text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">All Products</h3>
              </div>
              <h5 className="text-2xl font-bold text-purple-500">{products && products.length}</h5>
            </div>
          </div>
          <Link to="/dashboard-products" className="inline-block mt-4 text-purple-500 font-medium hover:underline">
            View Products →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-[#4F8CFF] mb-4">Latest Orders</h3>
        <div className="w-full min-h-[45vh]">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#F5F8FF",
                color: "#4F8CFF",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "#ffffff",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#F5F8FF",
                borderTop: "1px solid #e0e0e0",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
