import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: null,
    bankAccountNumber: null,
    bankHolderName: "",
    bankAddress: "",
  });

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawMethod = {
      bankName: bankInfo.bankName,
      bankCountry: bankInfo.bankCountry,
      bankSwiftCode: bankInfo.bankSwiftCode,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankHolderName: bankInfo.bankHolderName,
      bankAddress: bankInfo.bankAddress,
    };

    setPaymentMethod(false);

    await axios
      .put(
        `${server}/shop/update-payment-methods`,
        {
          withdrawMethod,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw method added successfully!");
        dispatch(loadSeller());
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankSwiftCode: null,
          bankAccountNumber: null,
          bankHolderName: "",
          bankAddress: "",
        });
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Withdraw method deleted successfully!");
        dispatch(loadSeller());
      });
  };

  const error = () => {
    toast.error("You not have enough balance to withdraw!");
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
      toast.error("You can't withdraw this amount!");
    } else {
      const amount = withdrawAmount;
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success("Withdraw money request is successful!");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  };

  const availableBalance = seller?.availableBalance.toFixed(2);

  return (
    <div className="w-full overflow-y-scroll h-[90vh] p-8">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-[#4F8CFF] mb-2">Withdraw Money</h3>
        <p className="text-gray-600">Manage your earnings and withdrawal methods</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <h5 className="text-2xl font-bold text-[#4F8CFF] mb-4">
            Available Balance: ${availableBalance}
          </h5>
          <button
            className="px-8 py-3 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow transition-colors duration-200"
            onClick={() => (availableBalance < 50 ? error() : setOpen(true))}
          >
            Withdraw Money
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#4F8CFF]">
                  {paymentMethod ? "Add Withdraw Method" : "Withdraw Money"}
                </h3>
                <button
                  onClick={() => setOpen(false) || setPaymentMethod(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RxCross1 size={24} className="text-gray-500" />
                </button>
              </div>

              {paymentMethod ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      placeholder="Enter your Bank name!"
                      className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank Country!"
                      className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Swift Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                      placeholder="Enter your Bank Swift Code!"
                      className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank account number!"
                      className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      placeholder="Enter your bank Holder name!"
                      className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      placeholder="Enter your bank address!"
                      className="w-full px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow transition-colors duration-200"
                  >
                    Add Withdraw Method
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Available Withdraw Methods:
                  </h3>

                  {seller && seller?.withdrawMethod ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h5 className="font-medium">
                              Account Number:{" "}
                              {"*".repeat(
                                seller?.withdrawMethod.bankAccountNumber.length - 3
                              ) +
                                seller?.withdrawMethod.bankAccountNumber.slice(-3)}
                            </h5>
                            <h5 className="text-gray-600">
                              Bank: {seller?.withdrawMethod.bankName}
                            </h5>
                          </div>
                          <button
                            onClick={() => deleteHandler()}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <AiOutlineDelete size={20} className="text-red-500" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">
                          Available Balance: ${availableBalance}
                        </h4>
                        <div className="flex gap-4">
                          <input
                            type="number"
                            placeholder="Amount..."
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="flex-1 px-4 py-3 border border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] transition-colors"
                          />
                          <button
                            className="px-6 py-3 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow transition-colors duration-200"
                            onClick={withdrawHandler}
                          >
                            Withdraw
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <p className="text-gray-600">
                        No Withdraw Methods available!
                      </p>
                      <button
                        className="px-6 py-3 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow transition-colors duration-200"
                        onClick={() => setPaymentMethod(true)}
                      >
                        Add Withdraw Method
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
