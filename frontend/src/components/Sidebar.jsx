import {
  LayoutDashboard,
  FileText,
  Upload,
  GitCompare,
  LogOut,
  Sparkles,
  Search,
  MessageSquare,
  Settings,
  HelpCircle,
  X,
  User,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLayout } from "../context/LayoutContext";

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const { closeSidebar, sidebarOpen } = useLayout();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Papers",
      path: "/papers",
      icon: FileText,
    },
    {
      name: "Upload Paper",
      path: "/upload",
      icon: Upload,
    },
    {
      name: "Compare Papers",
      path: "/compare",
      icon: GitCompare,
    },
  ];

  const getPaperIdFromUrl = () => {
    const match = location.pathname.match(/\/papers\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const currentPaperId = getPaperIdFromUrl();

  const contextualAiItems = currentPaperId
    ? [
        {
          name: "AI Summary",
          path: `/papers/${currentPaperId}/summary`,
          icon: Sparkles,
        },
        {
          name: "Research Gap",
          path: `/papers/${currentPaperId}/research-gap`,
          icon: Search,
        },
        {
          name: "AI Research Assistant",
          path: `/papers/${currentPaperId}/chat`,
          icon: MessageSquare,
        },
      ]
    : [];

  const systemItems = [
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
    {
      name: "Help & Support",
      path: "/help",
      icon: HelpCircle,
    },
  ];

  const handleLogout = () => {
    logout();
    closeSidebar();
  };

  const handleNavClick = () => {
    closeSidebar();
  };

  const userName = user?.fullName || "Researcher";

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay open"
          onClick={closeSidebar}
        />
      )}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-glow" />

        <button
          className="sidebar-close"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        <div className="logo">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="logo-text">
            <h2>SciNova AI</h2>
            <span>Research Intelligence</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="section-label">MAIN</div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {contextualAiItems.length > 0 && (
            <div className="nav-section">
              <div className="section-label">AI TOOLS</div>
              {contextualAiItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `nav-item contextual-item ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          )}

          <div className="nav-section">
            <div className="section-label">SYSTEM</div>
            {systemItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-divider" />

        <div className="user-card">
          <div className="user-info">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <div className="user-details">
              <div className="user-name">{userName}</div>
              <div className="user-role">Researcher</div>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;