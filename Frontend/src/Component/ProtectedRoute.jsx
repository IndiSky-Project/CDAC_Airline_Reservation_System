// import React, { useEffect } from 'react';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// export default function ProtectedRoute({ children, requiredRole }) {
//   const token = sessionStorage.getItem('token');
//   const storedRole = sessionStorage.getItem('role');
//   const navigate = useNavigate();

//   const normalizeRole = (role) => role?.replace('ROLE_', '').toUpperCase();

  
//   if (!token) {
//     return <Navigate to={requiredRole === 'ADMIN' ? '/admin/login' : '/user/login'} replace />;
//   }else{
//     useEffect(() => {
//       try {
//         const payloadBase64 = token.split('.')[1];
//         const payload = JSON.parse(atob(payloadBase64));
//         const actualRole = normalizeRole(payload.Role || storedRole);
  
        
//         if (actualRole !== requiredRole) {
//           sessionStorage.removeItem('token');
//           navigate(actualRole === 'ADMIN' ? '/admin/login' : '/user/login', { replace: true });
//         }
//       } catch (e) {
//         sessionStorage.removeItem('token');
//         navigate(requiredRole === 'ADMIN' ? '/admin/login' : '/user/login', { replace: true });
//       }
//     }, [token, storedRole, requiredRole, navigate]);

//   }


//   return children;
// }



import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole }) {

  const token = sessionStorage.getItem("token");

  const normalizeRole = (role) => role?.replace("ROLE_", "").toUpperCase();

  // No token -> Login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode JWT
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));

    console.log("JWT Payload:", payload);

    // Get role from JWT
    const actualRole = normalizeRole(payload.role || payload.Role);

    // Wrong role
    if (actualRole !== requiredRole) {
      sessionStorage.clear();
      return <Navigate to="/login" replace />;
    }

    return children;

  } catch (error) {
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }
}
