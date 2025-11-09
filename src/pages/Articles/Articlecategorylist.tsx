import { useTheme } from "../../context/ThemeProvider";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  AlertCircle,
  RefreshCcw,
  ArrowRight,
  Layers,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { axiosPublic } from "../../hooks/axiosPublic";
import { Link } from "react-router";

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

interface CategoryData {
  name: string;
  count: number;
  articles: Article[];
  icon: string;
  color: string;
  bg: string;
  border: string;
  text: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  total: number;
  data: Article[];
  message?: string;
}

const ArticleCategoryList = () => {
  const { theme } = useTheme();

  // Fetch articles using TanStack Query
  const {
    data: articlesResponse,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<ApiResponse>({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data } = await axiosPublic.get<ApiResponse>("/api/articles");

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch articles");
      }

      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const safeArticles: Article[] = Array.isArray(articlesResponse?.data)
    ? articlesResponse.data
    : [];

  // Process categories with article counts
  const categories = useMemo((): CategoryData[] => {
    const categoryMap = new Map<string, Article[]>();

    // Group articles by category
    safeArticles.forEach((article) => {
      const categoryName = article.category;
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, []);
      }
      categoryMap.get(categoryName)?.push(article);
    });

    // Define color schemes for categories
    const colorSchemes = [
      {
        gradient: "from-blue-500 to-cyan-500",
        bg: theme === "dark" ? "bg-blue-500/10" : "bg-blue-50",
        border: theme === "dark" ? "border-blue-500/20" : "border-blue-200",
        text: theme === "dark" ? "text-blue-400" : "text-blue-600",
        icon: "💻",
      },
      {
        gradient: "from-purple-500 to-pink-500",
        bg: theme === "dark" ? "bg-purple-500/10" : "bg-purple-50",
        border: theme === "dark" ? "border-purple-500/20" : "border-purple-200",
        text: theme === "dark" ? "text-purple-400" : "text-purple-600",
        icon: "🎨",
      },
      {
        gradient: "from-emerald-500 to-teal-500",
        bg: theme === "dark" ? "bg-emerald-500/10" : "bg-emerald-50",
        border:
          theme === "dark" ? "border-emerald-500/20" : "border-emerald-200",
        text: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
        icon: "🚀",
      },
      {
        gradient: "from-orange-500 to-red-500",
        bg: theme === "dark" ? "bg-orange-500/10" : "bg-orange-50",
        border: theme === "dark" ? "border-orange-500/20" : "border-orange-200",
        text: theme === "dark" ? "text-orange-400" : "text-orange-600",
        icon: "🔥",
      },
      {
        gradient: "from-indigo-500 to-blue-500",
        bg: theme === "dark" ? "bg-indigo-500/10" : "bg-indigo-50",
        border: theme === "dark" ? "border-indigo-500/20" : "border-indigo-200",
        text: theme === "dark" ? "text-indigo-400" : "text-indigo-600",
        icon: "⚡",
      },
      {
        gradient: "from-pink-500 to-rose-500",
        bg: theme === "dark" ? "bg-pink-500/10" : "bg-pink-50",
        border: theme === "dark" ? "border-pink-500/20" : "border-pink-200",
        text: theme === "dark" ? "text-pink-400" : "text-pink-600",
        icon: "✨",
      },
    ];

    // Convert to array and add metadata
    return Array.from(categoryMap.entries())
      .map(([name, articleList], index) => {
        const colorScheme = colorSchemes[index % colorSchemes.length];
        return {
          name,
          count: articleList.length,
          articles: articleList,
          icon: colorScheme.icon,
          color: colorScheme.gradient,
          bg: colorScheme.bg,
          border: colorScheme.border,
          text: colorScheme.text,
        };
      })
      .sort((a, b) => b.count - a.count); // Sort by article count (descending)
  }, [safeArticles, theme]);

  // Get total article count
  const totalArticles = safeArticles.length;

  // Get error message
  const getErrorMessage = (): string => {
    if (!error) return "An unknown error occurred";

    if (error instanceof Error) {
      return error.message;
    }

    return "Something went wrong";
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0C0D12]" : "bg-[#E9EBED]"
      }`}
    >
      <div className="pt-32 px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div
              className={`p-3 rounded-xl ${
                theme === "dark"
                  ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                  : "bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-300"
              }`}
            >
              <Layers
                className={`w-8 h-8 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <h1
              className={`text-3xl md:text-5xl rubik-bold transition-colors duration-300 ${
                theme === "dark" ? "text-[#F8F9FA]" : "text-[#0C0D12]"
              }`}
            >
              Article Category
            </h1>
          </motion.div>

          {/* Stats Badge */}
          {!isLoading && !isError && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3 mt-4"
            >
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm rubik-bold ${
                  theme === "dark"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                }`}
              >
                <Layers className="w-4 h-4" />
                {categories.length} Category
              </span>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm rubik-bold ${
                  theme === "dark"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-blue-50 text-blue-600 border border-blue-200"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Total {totalArticles} Category
              </span>
            </motion.div>
          )}
        </div>

        {/* Loading State */}
        {(isLoading || isRefetching) && !isError && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2
              className={`w-12 h-12 animate-spin mb-4 ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <p
              className={`text-lg rubik-regular ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {isRefetching
                ? "Category is updating..."
                : "Category is loading..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center py-20 px-4 rounded-2xl max-w-2xl mx-auto ${
              theme === "dark"
                ? "bg-red-500/10 border border-red-500/20"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <AlertCircle
              className={`w-16 h-16 mb-4 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            />
            <h3
              className={`text-xl rubik-bold mb-2 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              Category loading failed
            </h3>
            <p
              className={`text-sm rubik-regular mb-6 text-center max-w-md ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {getErrorMessage()}
            </p>
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg rubik-bold transition-all duration-300 ${
                isRefetching
                  ? theme === "dark"
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-[#171B1F] text-gray-300 hover:bg-[#1E2328] border border-gray-800"
                  : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <RefreshCcw
                className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
              />
              {isRefetching ? "trying..." : "try again"}
            </button>
          </motion.div>
        )}

        {/* Category Cards Grid */}
        {!isLoading && !isError && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.name}
                category={category}
                index={index}
                theme={theme}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-20 px-4 rounded-2xl ${
              theme === "dark"
                ? "bg-[#171B1F] border border-gray-800"
                : "bg-white border border-gray-200"
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <AlertCircle
                className={`w-8 h-8 ${
                  theme === "dark" ? "text-gray-600" : "text-gray-400"
                }`}
              />
            </div>
            <h3
              className={`text-xl rubik-bold mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              No Category Found
            </h3>
            <p
              className={`text-sm rubik-regular mb-6 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Category will added soon.
            </p>
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg rubik-bold transition-all duration-300 mx-auto ${
                theme === "dark"
                  ? "bg-[#171B1F] text-gray-300 hover:bg-[#1E2328] border border-gray-800"
                  : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <RefreshCcw
                className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArticleCategoryList;

// Category Card Component
interface CategoryCardProps {
  category: CategoryData;
  index: number;
  theme: string;
}

const CategoryCard = ({ category, index, theme }: CategoryCardProps) => {
  const formatCategoryName = (cat: string): string => {
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link
        to={`/articles/category/${category.name.toLowerCase()}`}
        className="block h-full"
      >
        {/* Card Container */}
        <div
          className={`relative h-full rounded-2xl overflow-hidden transition-all duration-300 ${
            theme === "dark"
              ? "bg-[#171B1F] hover:bg-[#1E2328]"
              : "bg-white hover:bg-gray-50"
          } border ${
            theme === "dark"
              ? "border-gray-800 hover:border-gray-700"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br ${category.color}/5`}
          />

          {/* Icon Badge - Top Right */}
          <motion.div
            className={`absolute top-4 right-4 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm z-10 ${category.bg} border ${category.border}`}
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl">{category.icon}</span>
          </motion.div>

          {/* Card Content */}
          <div className="relative p-6 flex flex-col h-full min-h-[200px]">
            {/* Category Name */}
            <h3
              className={`text-2xl md:text-3xl rubik-bold mb-3 pr-16 transition-colors duration-300 group-hover:${
                category.text
              } ${theme === "dark" ? "text-[#F8F9FA]" : "text-[#0C0D12]"}`}
            >
              {formatCategoryName(category.name)}
            </h3>

            {/* Article Count */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm rubik-bold ${category.bg} ${category.text} border ${category.border}`}
              >
                {category.count} article
              </span>
            </div>

            {/* Recent Articles Preview */}
            <div className="flex-grow mb-4">
              <p
                className={`text-sm rubik-regular mb-2 ${
                  theme === "dark" ? "text-gray-500" : "text-gray-600"
                }`}
              >
                Latest Articles:
              </p>
              <div className="space-y-1.5">
                {category.articles.slice(0, 3).map((article) => (
                  <div
                    key={article._id}
                    className={`flex items-center gap-2 text-sm rubik-regular truncate ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span className="text-xs">•</span>
                    <span className="truncate">{article.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* View All Button */}
            <motion.div
              className={`flex items-center justify-between pt-4 border-t ${
                theme === "dark" ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <span
                className={`text-sm rubik-bold ${category.text} flex items-center gap-2`}
              >
                see more
                <motion.div
                  className="inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </span>

              {/* Popular Badge (for top category) */}
              {index === 0 && (
                <span
                  className={`text-xs rubik-bold px-2 py-1 rounded-full ${
                    theme === "dark"
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      : "bg-yellow-50 text-yellow-600 border border-yellow-200"
                  }`}
                >
                  🔥 popular
                </span>
              )}
            </motion.div>
          </div>

          {/* Bottom Accent Line */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`}
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            style={{ originX: 0 }}
          />
        </div>

        {/* Glow Effect */}
        <div
          className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10 bg-gradient-to-r ${category.color}/20`}
        />
      </Link>
    </motion.div>
  );
};
