import React, { useState } from "react";
import {
  BookOpen,
  Brain,
  Code,
  Cog,
  Home,
  Play,
  User,
  Bell,
  Search,
  Menu,
  X,
  ArrowBigLeft,
  ArrowLeftCircle,
  LogOut,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn || isLoggedIn !== "true") {
      console.warn("🔐 Not logged in, redirecting to login...");
      navigate("/signin");
    }
  }, [navigate]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const pathname = location.pathname;

  // Match routes to tab IDs
  const pathToTab = (path) => {
    if (path.startsWith("/dashboard/quiz")) return "quiz";
    if (path.startsWith("/dashboard/hr")) return "hr";
    if (path.startsWith("/dashboard/programming")) return "programming";
    if (path.startsWith("/dashboard/technical")) return "technical";
    if (path.startsWith("/dashboard/vedio")) return "vedio";
    return "dashboard";
  };

  const activeTab = pathToTab(pathname);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", to: "/dashboard" },
    { id: "quiz", icon: BookOpen, label: "Quiz", to: "/dashboard/quiz" },
    { id: "hr", icon: User, label: "HR", to: "/dashboard/hr" },
    { id: "programming", icon: Code, label: "Programming", to: "/dashboard/programming" },
    { id: "technical", icon: Cog, label: "Technical", to: "/dashboard/technical" },
    { id: "vedio", icon: Play, label: "Video Manager", to: "/dashboard/vedio" }, // ✅ New Menu Item
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } h-screen fixed top-0 left-0 bg-white shadow-xl z-10 transition-all duration-300 ease-in-out`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CarrierNest
                </h1>
                <p className="text-sm text-gray-600 mt-1">Teacher Portal</p>
              </div>
            )}
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {sidebarOpen ? <ArrowLeftCircle size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {/* Sidebar Navigation */}
        <nav className={`mt-6 flex-1 flex flex-col justify-between ${sidebarOpen ? "px-4" : "px-2"}`}>
          <div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  to={item.to}
                  key={item.id}
                  className={`w-full flex items-center mb-2 rounded-lg transition-all duration-200 group relative ${
                    sidebarOpen ? "px-4 py-3" : "px-2 py-3 justify-center"
                  } ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={!sidebarOpen ? item.label : ""}>
                  <Icon size={20} className={sidebarOpen ? "mr-3" : ""} />
                  {sidebarOpen && <span>{item.label}</span>}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
          <button
            onClick={() => {
              sessionStorage.clear();
              navigate("/signin");
            }}
            className={`w-full flex items-center mb-2 rounded-lg transition-all duration-200 group relative ${
              sidebarOpen ? "px-4 py-3" : "px-2 py-3 justify-center"
            } text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
            title={!sidebarOpen ? "Logout" : ""}
            style={{ marginTop: "auto" }}>
            <LogOut size={20} className={sidebarOpen ? "mr-3" : ""} />
            {sidebarOpen && <span>LogOut</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                Logout
              </div>
            )}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`${sidebarOpen ? "ml-64" : "ml-16"} flex-1 flex flex-col transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {activeTab === "dashboard" ? "Dashboard" : activeTab}
              </h2>
              <p className="text-sm text-gray-600">Welcome back, Professor! Here's what's happening today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <Bell size={20} />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">T</span>
              </div>
            </div>
          </div>
        </header>

        {/* Routed Content */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
