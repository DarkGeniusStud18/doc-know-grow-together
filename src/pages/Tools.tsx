
import React from 'react';
import { Navigate } from 'react-router-dom';

const Tools = () => {
  // Redirect to the main tools hub
  return <Navigate to="/tools" replace />;
};

export default Tools;
