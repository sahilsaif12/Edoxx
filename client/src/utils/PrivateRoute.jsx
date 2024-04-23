import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import AppContext from "../context/AppContext";
import Loader from "./Loader.jsx"
const PrivateRoute = ({ Component }) => {

  const {server}=useContext(AppContext)
  const [validToken, setvalidToken] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    async function validateTokens() {
      try {
        let accessToken=Cookies.get('access-Token');
        let refreshToken=Cookies.get('refresh-Token');
        console.log(refreshToken);
        const res = await axios.get(`${server}/api/v1/users/userVerify`,
        {
          headers: {
              'Authorization': `Bearer ${accessToken}`,
              'RefreshToken':refreshToken
            }
        },
        )
        const success=res.data.success
        const data =res.data.data
        if (success) {
            Cookies.set('access-Token',data.accessToken);
            Cookies.set('refresh-Token',data.refreshToken);
            setvalidToken(true)
            // navigate("/")
        }
      } catch (error) {
          setvalidToken(false)
          navigate("/signUp")
          console.log(error);
        // const data =error?.response?.data
        // console.log(data?.message);
      }
    }
    validateTokens();

  }, [])

  return (
    validToken ? <Component /> : <Loader />
  )

  // : <Navigate to="/" />;
};
export default PrivateRoute;