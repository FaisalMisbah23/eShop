import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, getAllProductsShop } from '../../redux/actions/product';
import { Link } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import Loader from "../Layout/Loader"
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import {toast} from 'react-toastify';

const AllProducts = () => {
    const { isLoading, products } = useSelector((state) => state.products);
    const { seller } = useSelector((state) => state.seller);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProductsShop(seller._id))
    }, [])

    const handleDelete = (id) => {
        dispatch(deleteProduct(id)).then(()=>{
            toast.success("Product deleted successfully!");
            dispatch(getAllProductsShop(seller._id));
        })
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
                const id = params.row.id;
                return (
                    <>
                        <Link to={`/product/${id}`}>
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

    products &&
        products.forEach((item) => {
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

export default AllProducts;