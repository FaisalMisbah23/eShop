import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { getAllOrdersOfShop } from "../../redux/actions/order";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

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
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full overflow-y-scroll h-[90vh] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#4F8CFF] mb-2">All Orders</h3>
            <p className="text-sm sm:text-base text-gray-600">Manage and track all your shop orders</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
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
        </div>
      )}
    </>
  );
};

export default AllOrders;
