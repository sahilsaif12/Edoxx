import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import AppContext from "../context/AppContext";

const SignUpPrivateRoute = ({ Component }) => {

  const {server}=useContext(AppContext)
  const [validToken, setvalidToken] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
    async function validateTokens() {
      try {
        let accessToken=Cookies.get('access-Token');
        let refreshToken=Cookies.get('refresh-Token');
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
            navigate("/")
            setvalidToken(true)
        }else{
            console.log(data);
            setvalidToken(false)
        }
        
      } catch (error) {
        const data =error?.response?.data
        setvalidToken(false)
        console.log(data?.message);
      }
    }
    validateTokens();

  }, [])

  return !validToken && <Component />

  // : <Navigate to="/" />;
};
export default SignUpPrivateRoute;
