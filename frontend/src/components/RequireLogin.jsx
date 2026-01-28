import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export default function RequireLogin({ children, role }) {
  const { loggedIn, user } = useSelector((state) => state.login);

  return loggedIn
    ? (role === undefined || role === user.role)
      ? children
      : <div>You need to be a/an {role} to perform this action!</div>
    : (<div>
      <p>Please Log In First</p>
      <button onClick={() => { location.href = '/login'; }}>Login Page</button>
    </div>);
}

RequireLogin.propTypes = {
  children: PropTypes.node,
  role: PropTypes.string,
};