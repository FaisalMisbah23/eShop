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
        // window.location.reload();
    }

    const columns = [
        {
            field: "id",
            headerName: "Product Id",
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
                <div className="w-full mx-8 pt-1 mt-10 bg-white">
                    <DataGrid
                        rows={row}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        autoHeight
                    />
                </div>
            )}
        </>
    );
};

export default AllEvents;