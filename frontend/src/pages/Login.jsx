import { useFormik } from "formik";
import { TextField, Button } from "@mui/material";
import { loginApi } from "../common/axiosClient";
import { cacheWithExpiry } from "../common/helpers";
import { useDispatch } from 'react-redux';
import { displayNotification } from "../redux/notificationSlice";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/loginSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await loginApi(values);
        dispatch(displayNotification({ message: "Login successful", type: "success" }));
        dispatch(login(response.user));
        cacheWithExpiry("jwt", response.token, 1000 * 60 * 60 * 1);
        navigate("/parkingAreas");
      } catch (err) {
        dispatch(displayNotification({ message: String(err), type: "error" }));
      }
    },
  });
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={formik.handleSubmit}>
        <TextField id="email" name="email" label="Email" type="email" required style={{ marginBlock: 5 }}
          onChange={formik.handleChange} value={formik.values.email}
        />
        <br />
        <TextField id="password" name="password" label="Password" type="password" required style={{ marginBlock: 5 }}
          onChange={formik.handleChange} value={formik.values.password}
        />
        <br />
        <Button type="submit" variant="contained" style={{marginBlock: 5}}>Login</Button>
      </form>
    </div>
  );
}
