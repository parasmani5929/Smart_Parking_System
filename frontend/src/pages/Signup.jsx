import { useFormik } from "formik";
import { TextField, Button } from "@mui/material";
import { signupApi } from "../common/axiosClient";
import { useDispatch } from 'react-redux';
import { displayNotification } from "../redux/notificationSlice";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      try {
        await signupApi(values);
        dispatch(displayNotification({ message: "Login successful", type: "success" }));
        navigate("/login");
      } catch (err) {
        dispatch(displayNotification({ message: String(err), type: "error" }));
      }
    },
  });
  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={formik.handleSubmit}>
        <TextField id="name" name="name" label="Name" type="text" required style={{ marginBlock: 5 }}
          onChange={formik.handleChange} value={formik.values.name}
        />
        <br />
        <TextField id="email" name="email" label="Email" type="email" required style={{ marginBlock: 5 }}
          onChange={formik.handleChange} value={formik.values.email}
        />
        <br />
        <TextField id="password" name="password" label="Password" type="password" required style={{ marginBlock: 5 }}
          onChange={formik.handleChange} value={formik.values.password}
        />
        <br />
        <TextField id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password" required style={{ marginBlock: 5 }}
          onChange={formik.handleChange} value={formik.values.confirmPassword}
        />
        <br />
        <Button type="submit" variant="contained" style={{ marginBlock: 5 }}
          disabled={formik.values.password !== formik.values.confirmPassword}
        >Signup</Button>
      </form>
    </div>
  );
}
