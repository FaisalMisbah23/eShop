import React, { useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllSellers } from "../redux/actions/seller";

const AdminDashboardSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const columns = [
    { field: 'id', headerName: 'Seller ID', minWidth: 150, flex: 0.7 },
    { field: 'name', headerName: 'Name', minWidth: 130, flex: 0.7 },
    { field: 'email', headerName: 'Email', minWidth: 180, flex: 1 },
    { field: 'shopName', headerName: 'Shop Name', minWidth: 130, flex: 0.7 },
    { field: 'joinedAt', headerName: 'Joined At', minWidth: 130, flex: 0.7 },
  ];

  const rows = sellers && sellers.map((seller) => ({
    id: seller._id,
    name: seller.name,
    email: seller.email,
    shopName: seller.shopName,
    joinedAt: seller.createdAt.slice(0, 10),
  }));

  return (
    <>
      <AdminHeader />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-16 pb-8">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">All Sellers</h1>
          <p className="text-lg text-white/90">Manage and review all sellers on eShopZone</p>
        </div>
      </div>
      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
          <div className="hidden md:block w-[80px] md:w-[260px]">
            <AdminSideBar active={3} />
          </div>
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <DataGrid
                rows={rows || []}
                columns={columns}
                pageSize={10}
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
    </>
  );
};

export default AdminDashboardSellers;
