import React, { useEffect, useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import {
  deleteUserAddress,
  updateUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import { loadUser } from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { RxCross1 } from "react-icons/rx";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { TbAddressBook } from "react-icons/tb";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState();
  const [avatar, setAvatar] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation({ name, email, phoneNumber, password }));
  };

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            dispatch(loadUser());
            toast.success("avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="w-full">
      {/* profile */}
      {active === 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
          <div className="flex justify-center w-full mb-8">
            <div className="relative">
              <img
                src={`${user?.avatar?.url}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-[#4F8CFF] shadow-lg"
                alt=""
              />
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer absolute bottom-2 right-2 shadow-md border-2 border-[#4F8CFF]">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                />
                <label htmlFor="image" className="cursor-pointer">
                  <AiOutlineCamera className="text-[#4F8CFF]" />
                </label>
              </div>
            </div>
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#4F8CFF] transition-all duration-200 shadow-lg"
                type="submit"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Track order */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/*  user Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
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
            <Link to={`/user/order/${params.id}`}>
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
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
      <div className="overflow-x-auto">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
          className="border-0"
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e5e7eb',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e5e7eb',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        />
      </div>
    </div>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      // cellClassName: (params) => {
      //   return params.getValue(params.id, "status") === "Delivered"
      //     ? "greenColor"
      //     : "redColor";
      // },
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
            <Link to={`/user/order/${params.id}`}>
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

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Orders</h2>
      <div className="overflow-x-auto">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
          className="border-0"
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e5e7eb',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e5e7eb',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        />
      </div>
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      // cellClassName: (params) => {
      //   return params.getValue(params.id, "status") === "Delivered"
      //     ? "greenColor"
      //     : "redColor";
      // },
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
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
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
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Orders</h2>
      <div className="overflow-x-auto">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
          className="border-0"
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e5e7eb',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e5e7eb',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        />
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Change Password</h2>
      <div className="max-w-md mx-auto">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full px-8 py-3 bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#4F8CFF] transition-all duration-200 shadow-lg"
            type="submit"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const { user } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");

  const dispatch = useDispatch();

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updateUserAddress(
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType
        )
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {open && (
        <div className="fixed w-full h-screen bg-black bg-opacity-50 top-0 left-0 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <div className="w-full flex justify-end p-4">
              <RxCross1
                size={24}
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setOpen(false)}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6 px-4">
              Add New Address
            </h2>
            <div className="w-full px-4 pb-6">
              <form aria-required onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    >
                    <option value="">Choose your country</option>
                      {Country &&
                        Country.getAllCountries().map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    >
                    <option value="">Choose your city</option>
                      {State &&
                        State.getStatesOfCountry(country).map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                    <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                    <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                    <select
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    >
                    <option value="">Choose your Address Type</option>
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                        <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                <button
                  className="w-full px-8 py-3 bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#4F8CFF] transition-all duration-200 shadow-lg"
                      type="submit"
                >
                  Add Address
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex w-full items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
        <button
          className="px-6 py-3 bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#4F8CFF] transition-all duration-200 shadow-lg"
          onClick={() => setOpen(true)}
        >
          Add New
        </button>
      </div>
      
      <div className="space-y-4">
      {user &&
        user.addresses.map((item, index) => (
          <div
              className="w-full bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
            key={index}
          >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="inline-block px-3 py-1 bg-[#4F8CFF] text-white text-xs font-semibold rounded-full">
                      {item.addressType}
                    </span>
            </div>
                  <p className="text-gray-700 mb-1">
                {item.address1} {item.address2}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user && user.phoneNumber}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item)}
                  className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <AiOutlineDelete size={20} />
                </button>
            </div>
            </div>
          ))}

        {user && user.addresses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <TbAddressBook size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-gray-500">Add your first address to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;

