import { useState, useEffect, useRef } from "react";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useLayout } from "../context/LayoutContext";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/papers": "My Research Papers",
  "/upload": "Upload Research Paper",
  "/compare": "Compare Papers",
  "/papers": "My Research Papers",
  "/settings": "Settings",
  "/help": "Help & Support",
};

const getPageTitle = (pathname) => {
  if (pathname.startsWith("/papers/")) {
    if (pathname.includes("/summary"))
      return "AI Summary";
    if (pathname.includes("/research-gap"))
      return "Research Gap";
    if (pathname.includes("/chat"))
      return "AI Research Assistant";
    return "Paper Details";
  }
  return PAGE_TITLES[pathname] || "Dashboard";
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useLayout();

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const dropdownRef = useRef(null);

  const name =
    user?.fullName ||
    user?.name ||
    "Researcher";

  const firstLetter = name
    .charAt(0)
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const currentTitle = getPageTitle(
    window.location.pathname
  );

  const navigateTo = (path) => {
    setDropdownOpen(false);
    window.location.href = path;
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <div className="page-title">
          <h1>{currentTitle}</h1>
        </div>
      </div>

      <div className="navbar-right">
        {/*
        <button className="navbar-icon-button">
          <Search size={20} />
        </button>
        */}

        <div
          className="profile-dropdown"
          ref={dropdownRef}
        >
          <button
            className="profile-button"
            onClick={() =>
              setDropdownOpen(
                (prev) => !prev
              )
            }
            aria-expanded={dropdownOpen}
          >
            <div className="avatar">
              {firstLetter}
            </div>
            <span className="profile-name">
              {name}
            </span>
            <ChevronDown
              size={16}
              className={`chevron ${dropdownOpen ? "open" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-avatar">
                  {firstLetter}
                </div>
                <div className="dropdown-user-info">
                  <strong>
                    {name}
                  </strong>
                  <span>
                    Researcher
                  </span>
                </div>
              </div>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item"
                onClick={() =>
                  setDropdownOpen(
                    false
                  )
                }
              >
                <User size={16} />
                <span>
                  Profile
                </span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => navigateTo("/settings")}
              >
                <Settings
                  size={16}
                />
                <span>
                  Settings
                </span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => navigateTo("/help")}
              >
                <HelpCircle
                  size={16}
                />
                <span>
                  Help & Support
                </span>
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item logout"
                onClick={
                  handleLogout
                }
              >
                <LogOut
                  size={16}
                />
                <span>
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;