import { motion } from "framer-motion";

const Dashboard = () => {
  const stats = [
    { title: "Total Projects", value: "24", color: "emerald" },
    { title: "Articles", value: "156", color: "blue" },
    { title: "Active Users", value: "1,234", color: "purple" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-800">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8 mt-12 lg:mt-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening today.
            </p>
          </motion.div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {stat.title}
                </h3>
                <p className={`text-3xl font-bold text-${stat.color}-600`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
