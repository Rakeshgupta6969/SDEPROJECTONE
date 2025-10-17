import { FaHome, FaChartPie, FaUserCog, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const navItems = [
    { name: "Dashboard", icon: <FaHome />, action: () => (window.location.href = "/dashboard") },
    { name: "Reports", icon: <FaChartPie />, action: () => alert("Coming soon: Reports Section") },
    { name: "Settings", icon: <FaUserCog />, action: () => alert("Coming soon: Settings") },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col justify-between shadow-lg">
      {/* Logo */}
      <div>
        <div className="p-6 border-b border-blue-500">
          <h2 className="text-2xl font-bold tracking-wide">💰 PFM</h2>
        </div>

        {/* Nav links */}
        <nav className="mt-6 space-y-2 px-4">
          {navItems.map((item) => (
            <div
              key={item.name}
              onClick={item.action}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-500 cursor-pointer transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition text-black font-semibold py-2 rounded-md"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}
