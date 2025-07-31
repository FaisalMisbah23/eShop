import React, { useEffect } from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { getAllSellers } from "../../redux/actions/seller";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, []);

  const adminEarning =
    adminOrders &&
    adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);

  const adminBalance = adminEarning?.toFixed(2);

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
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: item?.totalPrice + " $",
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-0 md:p-4 overflow-y-scroll min-h-[80vh]">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
            {/* Total Earning */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-start">
              <div className="flex items-center mb-2">
                <AiOutlineMoneyCollect size={28} className="sm:w-8 sm:h-8 text-[#4F8CFF] mr-2" />
                <span className="text-base sm:text-lg font-semibold text-gray-700">Total Earning</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#4F8CFF]">${adminBalance}</div>
            </div>
            {/* All Sellers */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-start">
              <div className="flex items-center mb-2">
                <MdBorderClear size={28} className="sm:w-8 sm:h-8 text-[#A0C1FF] mr-2" />
                <span className="text-base sm:text-lg font-semibold text-gray-700">All Sellers</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#A0C1FF]">{sellers && sellers.length}</div>
              <Link to="/admin-sellers" className="mt-3 text-[#4F8CFF] hover:underline font-medium text-sm sm:text-base">View Sellers</Link>
            </div>
            {/* All Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-start sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-2">
                <AiOutlineMoneyCollect size={28} className="sm:w-8 sm:h-8 text-[#F59E0B] mr-2" />
                <span className="text-base sm:text-lg font-semibold text-gray-700">All Orders</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#F59E0B]">{adminOrders && adminOrders.length}</div>
              <Link to="/admin-orders" className="mt-3 text-[#4F8CFF] hover:underline font-medium text-sm sm:text-base">View Orders</Link>
            </div>
          </div>

          {/* Latest Orders Table */}
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Latest Orders</h3>
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={4}
              disableSelectionOnClick
              autoHeight
                    sx={{
                      border: 0,
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: 15,
                      borderRadius: 2,
                      '& .MuiDataGrid-columnHeaders': {
                        background: '#F5F8FF',
                        color: '#4F8CFF',
                        fontWeight: 700,
                        fontSize: 16,
                      },
                      '& .MuiDataGrid-row': {
                        background: 'white',
                      },
                      '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #F0F4F8',
                      },
                      '& .MuiDataGrid-footerContainer': {
                        background: '#F5F8FF',
                      },
                      '& .MuiDataGrid-selectedRowCount': {
                        visibility: 'hidden',
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;
