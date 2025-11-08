import { PiShoppingBagLight } from "react-icons/pi";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { MdArticle } from "react-icons/md";
import { useState, type JSX } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  id: string;
  name: string;
  path: string;
  icon: JSX.Element;
}

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      name: "Dashboard",
      path: "/dashboard",
      icon: <PiShoppingBagLight className="text-xl" />,
    },

    {
      id: "category",
      name: "Manage Category",
      path: "/managecategory",
      icon: <MdArticle className="text-xl" />,
    },
    {
      id: "articles",
      name: "Manage Articles",
      path: "/managearticles",
      icon: <MdArticle className="text-xl" />,
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-slate-900 p-2 rounded-md shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IoClose className="text-2xl text-gray-800 dark:text-[#abc2d3]" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiMenuAlt3 className="text-2xl text-gray-800 dark:text-[#abc2d3]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop always visible, Mobile with animation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-slate-900 shadow-lg rounded-r-md lg:rounded-md z-40 w-64 lg:w-72 p-6 overflow-y-auto transition-transform duration-300 ease-in-out lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Admin Panel
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link key={item.id} to={item.path} onClick={closeSidebar}>
                <motion.div
                  whileHover={!active ? { x: 4 } : undefined}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-between w-full p-3 rounded-md cursor-pointer transition-all duration-200 relative
                    ${
                      active
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-600"
                        : "hover:bg-gray-50 dark:hover:bg-slate-800/50"
                    }`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <motion.div
                      animate={{
                        scale: active ? 1.1 : 1,
                      }}
                      className={
                        active
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-600 dark:text-[#abc2d3] group-hover:text-gray-800 dark:group-hover:text-white"
                      }
                    >
                      {item.icon}
                    </motion.div>
                    <p
                      className={`text-base transition-colors ${
                        active
                          ? "font-medium text-emerald-700 dark:text-emerald-300"
                          : "font-normal text-gray-700 dark:text-[#abc2d3]"
                      }`}
                    >
                      {item.name}
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Need help?
            </p>
            <Link
              to="/"
              className="text-sm font-medium text-emerald-700 dark:text-emerald-300"
            >
              Go Home
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
