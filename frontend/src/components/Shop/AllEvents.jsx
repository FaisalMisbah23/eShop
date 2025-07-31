import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllEventsShop, deleteEvent } from '../../redux/actions/event';
import { Link } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { Button } from '@mui/material';
import Loader from "../Layout/Loader"
import { DataGrid } from '@mui/x-data-grid'
import { toast } from "react-toastify";

const AllEvents = () => {
    const { isLoading, allEvents } = useSelector((state) => state.event);
    const { seller } = useSelector((state) => state.seller);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllEventsShop(seller._id))
    }, [])

    const handleDelete = (id) => {
        dispatch(deleteEvent(id)).then(() => {
            toast.success("Event deleted successfully!");
            dispatch(getAllEventsShop(seller._id));
        }).catch((err) => {
            toast.error(err);
        })
    }

    const columns = [
        {
            field: "id",
            headerName: "Event Id",
            minWidth: 150,
            flex: 0.7
        },
        {
            field: "name",
            headerName: "Name",
            minWidth: 180,
            flex: 1.4,
        },
        {
            field: "price",
            headerName: "Price",
            minWidth: 100,
            flex: 0.6,
        },
        {
            field: "stock",
            headerName: "Stock",
            type: "number",
            minWidth: 80,
            flex: 0.5,
        },
        {
            field: "sold",
            headerName: "Sold out",
            type: "number",
            minWidth: 130,
            flex: 0.6,
        },
        {
            field: "Preview",
            flex: 0.8,
            minWidth: 100,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                const d = params.row.name;
                const event_name = d.replace(/\s+/g, "-");
                return (
                    <>
                        <Link to={`/event/${event_name}`}>
                            <Button>
                                <AiOutlineEye size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
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

    allEvents &&
        allEvents.forEach((item) => {
            row.push({
                id: item._id,
                name: item.name,
                price: "US$ " + item.discountPrice,
                stock: item.stock,
                sold: item.sold_out,
            });
        });

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full overflow-y-scroll h-[90vh] p-4 sm:p-6 lg:p-8">
                    <div className="mb-6 sm:mb-8">
                        <h3 className="text-2xl sm:text-3xl font-bold text-[#4F8CFF] mb-2">All Events</h3>
                        <p className="text-sm sm:text-base text-gray-600">Manage and track all your shop events</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                        <div className="overflow-x-auto">
                            <div className="min-w-[800px]">
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

export default AllEvents;