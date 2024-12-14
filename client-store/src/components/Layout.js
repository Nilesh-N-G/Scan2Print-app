// components/Layout.js
import React from 'react';
import Header from './Header';  // Import the Header component
import { Outlet } from 'react-router-dom';  // This is where child components will render

const Layout = ({ userInfo,notifications }) => {
  return (
    <div>
      <Header userInfo={userInfo} notifications={notifications} />  {/* Always render the header */}
      <main>
        <Outlet />  {/* The page content will be rendered here */}
      </main>
    </div>
  );
};

export default Layout;
