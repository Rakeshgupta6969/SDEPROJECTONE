import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="ml-64 flex-1 min-h-screen bg-gray-100 p-8">
        {children}
      </main>
    </div>
  );
}