import React, { useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, []);

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
      <AdminHeader />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-16 pb-8">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-center sm:text-left">All Orders</h1>
          <p className="text-base sm:text-lg text-white/90 text-center sm:text-left">Manage and review all orders placed on eShopZone</p>
        </div>
      </div>
      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block w-[260px] flex-shrink-0">
              <AdminSideBar active={2} />
            </div>
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <DataGrid
                      rows={row}
                      columns={columns}
                      pageSize={8}
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
        </div>
      </div>
    </>
  );
};

export default AdminDashboardOrders;
