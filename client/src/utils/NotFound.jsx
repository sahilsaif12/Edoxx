import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate=useNavigate()
    useEffect(() => {
        console.log("here");
      navigate('/')
    }, [])
    
  return(
    <div></div>
  );
}

export default NotFound;
