import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { axiosPublic } from "../../hooks/axiosPublic";
import {
  Loader2,
  FileText,
  FolderOpen,
  TrendingUp,
  Eye,
  Heart,
  BarChart3,
} from "lucide-react";

// Types & Interfaces
interface Article {
  _id: string;
  category: string;
  avatar: string;
  img: string;
  title: string;
  description: string;
  code: string;
  slug: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  categoryName: string;
  slug: string;
  articleCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  category: string;
  technologies: string[];
  github?: string;
  demo?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  count: number;
  total?: number;
  data: T[];
  message?: string;
}

interface DashboardStats {
  totalArticles: number;
  totalCategories: number;
  totalProjects: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  recentArticles: number;
  popularCategory: string;
}

interface StatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

const Dashboard = () => {
  // Fetch all data in parallel
  const { data: articlesData, isLoading: articlesLoading } = useQuery<
    ApiResponse<Article>
  >({
    queryKey: ["dashboard-articles"],
    queryFn: async () => {
      const { data } = await axiosPublic.get<ApiResponse<Article>>(
        "/api/articles"
      );
      return data;
    },
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery<
    ApiResponse<Category>
  >({
    queryKey: ["dashboard-categories"],
    queryFn: async () => {
      const { data } = await axiosPublic.get<ApiResponse<Category>>(
        "/api/categories"
      );
      return data;
    },
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery<
    ApiResponse<Project>
  >({
    queryKey: ["dashboard-projects"],
    queryFn: async () => {
      const { data } = await axiosPublic.get<ApiResponse<Project>>(
        "/api/projects"
      );
      return data;
    },
  });

  // Calculate statistics
  const calculateStats = (): DashboardStats => {
    const articles = articlesData?.data || [];
    const categories = categoriesData?.data || [];
    const projects = projectsData?.data || [];

    // Total views and likes
    const totalViews = articles.reduce(
      (sum: number, article: Article) => sum + (article.views || 0),
      0
    );
    const totalLikes = articles.reduce(
      (sum: number, article: Article) => sum + (article.likes || 0),
      0
    );

    // Recent articles (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentArticles = articles.filter(
      (article: Article) => new Date(article.createdAt) > sevenDaysAgo
    ).length;

    // Most popular category
    const categoryCount: Record<string, number> = {};
    articles.forEach((article: Article) => {
      categoryCount[article.category] =
        (categoryCount[article.category] || 0) + 1;
    });
    const popularCategory =
      Object.keys(categoryCount).length > 0
        ? Object.keys(categoryCount).reduce((a, b) =>
            categoryCount[a] > categoryCount[b] ? a : b
          )
        : "N/A";

    return {
      totalArticles: articles.length,
      totalCategories: categories.length,
      totalProjects: projects.length,
      totalViews,
      totalLikes,
      totalComments: 0, // Add if you have comments data
      recentArticles,
      popularCategory,
    };
  };

  const stats = calculateStats();
  const isLoading = articlesLoading || categoriesLoading || projectsLoading;

  const statCards: StatCard[] = [
    {
      title: "Total Articles",
      value: stats.totalArticles,
      icon: FileText,
      color: "blue",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Total Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "purple",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: BarChart3,
      color: "emerald",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "orange",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
      borderColor: "border-orange-500/20",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: "pink",
      bgColor: "bg-pink-500/10",
      iconColor: "text-pink-600 dark:text-pink-400",
      borderColor: "border-pink-500/20",
    },
    {
      title: "Recent Articles",
      value: stats.recentArticles,
      subtitle: "Last 7 days",
      icon: TrendingUp,
      color: "cyan",
      bgColor: "bg-cyan-500/10",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      borderColor: "border-cyan-500/20",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-800">
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading dashboard...
              </span>
            </div>
          )}

          {/* Dashboard Content */}
          {!isLoading && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className={`bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border ${stat.borderColor} hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}
                        >
                          <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </h3>
                      <p
                        className={`text-3xl font-bold ${stat.iconColor} mb-1`}
                      >
                        {stat.value}
                      </p>
                      {stat.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {stat.subtitle}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Additional Info Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Category */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Most Popular Category
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.popularCategory}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Category with most articles
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Engagement Overview
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Avg. Views per Article
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {stats.totalArticles > 0
                          ? Math.round(stats.totalViews / stats.totalArticles)
                          : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Avg. Likes per Article
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {stats.totalArticles > 0
                          ? Math.round(stats.totalLikes / stats.totalArticles)
                          : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Articles per Category
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {stats.totalCategories > 0
                          ? Math.round(
                              stats.totalArticles / stats.totalCategories
                            )
                          : 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
