import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import headerLogo from "../img/header-logo.svg";
import "../style/appLayout.css";

export default function AppLayout() {
  const { user, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="navbar">
        <div className="navbar-title">
          <h1>Movie Reviews App</h1>
        </div>
        <nav className="navbar-menu">
          <ul>
            <li>
            <img src={headerLogo} alt="logo" />

            </li>
            <li>
              <Link to="/app">Home</Link>
            </li>     
            <li>
              <Link to="/app/profile">Profile</Link>
            </li>
            <li>
              <Link to="/app/movies">Movie Reviews</Link>
            </li>
            <li>
              <Link to="/app/AuthDebugger">Auth Debugger</Link>
            </li>
            <li>
              <button
                className="exit-button"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                LogOut
              </button>
            </li>
          </ul>
        </nav>
        <div className="welcome-message">Welcome 👋 {user.nickname}</div>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
