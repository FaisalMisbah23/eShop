import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import { toast } from 'react-toastify'

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [wait, setWait] = useState(true);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/user/activation`, {
            activation_token,
          })
          .then((res) => {
            setWait(false);
            setError(false);
          })
          .catch((err) => {
            setWait(false);
            setError(true);
            toast.error(err.response.data.message);
          });

      };
      sendRequest();
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {wait ? <p>Please wait, processing your request...</p> : (
        error ? (
          <p> Your token is expired!</p>
        ) : (
          <p>Your account has been created successfully!</p>
        )
      )}
    </div >
  );
};

export default ActivationPage;