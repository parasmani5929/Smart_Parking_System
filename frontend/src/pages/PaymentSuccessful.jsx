import React from "react";
import { useDispatch } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import { confirmSuccessfulPaymentApi } from "../common/axiosClient";

export default function PaymentSuccessful() {
  const sessionId = new URLSearchParams(window.location.search).get('sessionId');
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!sessionId) return;
    confirmSuccessfulPaymentApi(sessionId).then((response) => {
      dispatch(displayNotification({ message: response.message, type: "success" }));
    }
    ).catch((error) => {
      dispatch(displayNotification({ message: error, type: "error" }));
    });
  }, [sessionId, dispatch]);

  if (!sessionId) return (
    <div>
      <h3>Payment Failed</h3>
    </div>
  );

  return (
    <div>
      <h3>Payment Successful</h3>
    </div>
  );
}