import { useTheme } from "../../context/ThemeProvider";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "./ArticleCard";
import { AlertCircle, RefreshCcw, ArrowLeft, Tag } from "lucide-react";
import { useState, useEffect, type JSX } from "react";
import { axiosPublic } from "../../hooks/axiosPublic";
import { useParams, Link } from "react-router";

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

interface ApiResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: Article[];
  message?: string;
}

const ArticlesByCategory = () => {
  const { theme } = useTheme();
  const { category } = useParams<{ category: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // TanStack Query with category filter
  const {
    data: articlesResponse,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<ApiResponse>({
    queryKey: ["articles", category, currentPage, itemsPerPage],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get<ApiResponse>("/api/articles", {
          params: {
            category: category,
            page: currentPage,
            limit: itemsPerPage,
          },
        });

        if (!data || !data.success) {
          throw new Error(data?.message || "Failed to fetch articles");
        }

        return data;
      } catch (err) {
        console.error("Error fetching articles:", err);
        throw err;
      }
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Safe article array
  const safeArticles: Article[] = Array.isArray(articlesResponse?.data)
    ? articlesResponse.data
    : [];

  // Get total count and pages from backend response
  const totalArticles = articlesResponse?.total || 0;
  const totalPages = articlesResponse?.totalPages || 0;

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Pagination handlers
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageClick = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Render page numbers
  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;

    const pageNumbers: JSX.Element[] = [];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // First page
    pageNumbers.push(
      <PageButton
        key={1}
        pageNumber={1}
        isActive={currentPage === 1}
        onClick={handlePageClick}
        theme={theme}
      />
    );

    // Start ellipsis
    if (startPage > 2) {
      pageNumbers.push(
        <span
          key="start-dots"
          className={`mx-1 px-2 rubik-regular ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          ...
        </span>
      );
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PageButton
          key={i}
          pageNumber={i}
          isActive={currentPage === i}
          onClick={handlePageClick}
          theme={theme}
        />
      );
    }

    // End ellipsis
    if (endPage < totalPages - 1) {
      pageNumbers.push(
        <span
          key="end-dots"
          className={`mx-1 px-2 rubik-regular ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          ...
        </span>
      );
    }

    // Last page
    if (totalPages > 1) {
      pageNumbers.push(
        <PageButton
          key={totalPages}
          pageNumber={totalPages}
          isActive={currentPage === totalPages}
          onClick={handlePageClick}
          theme={theme}
        />
      );
    }

    return pageNumbers;
  };

  // Get error message
  const getErrorMessage = (): string => {
    if (!error) return "An unknown error occurred";
    if (error instanceof Error) return error.message;
    return "Something went wrong";
  };

  // Format category name
  const formatCategoryName = (cat: string): string => {
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0C0D12]" : "bg-[#E9EBED]"
      }`}
    >
      <div className="pt-32 px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/articles/category"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm rubik-bold transition-all duration-300 ${
              theme === "dark"
                ? "bg-[#171B1F] text-gray-300 hover:bg-[#1E2328] border border-gray-800"
                : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </motion.div>

        {/* Header Section */}
        <div className="mb-12 flex justify-between items-center">
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
              <Tag
                className={`w-8 h-8 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl rubik-bold transition-colors duration-300 ${
                theme === "dark" ? "text-[#F8F9FA] " : "text-[#0C0D12]"
              }`}
            >
              {category ? formatCategoryName(category) : "Category"}
            </h1>
          </motion.div>

          {/* Article Count Badge */}
          {!isLoading && !isError && totalArticles > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm rubik-regular  ${
                  theme === "dark"
                    ? " text-[#F8F9FA] bg-[#171B1F] shadow-xl"
                    : "text-[#0C0D12] bg-blue-100 border border-blue-300"
                }`}
              >
                {totalArticles} article found
              </span>
            </motion.div>
          )}
        </div>

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
              article loading failed
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

        {/* Articles Grid */}
        {!isLoading && !isError && safeArticles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeArticles.map((article, index) => {
                if (!article || !article._id) {
                  console.warn("Skipping invalid article:", article);
                  return null;
                }

                return (
                  <ArticleCard
                    key={article._id}
                    article={article}
                    index={index}
                    theme={theme}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center flex-col sm:flex-row mt-12 space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`px-6 py-2.5 rounded-lg rubik-bold transition-all duration-300 ${
                    currentPage === 1
                      ? theme === "dark"
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : theme === "dark"
                      ? "bg-[#171B1F] text-gray-300 hover:bg-[#1E2328] border border-gray-800"
                      : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-2">{renderPageNumbers()}</div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-6 py-2.5 rounded-lg rubik-bold transition-all duration-300 ${
                    currentPage === totalPages
                      ? theme === "dark"
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : theme === "dark"
                      ? "bg-[#171B1F] text-gray-300 hover:bg-[#1E2328] border border-gray-800"
                      : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !isError && safeArticles.length === 0 && (
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
              no article found
            </h3>
            <p
              className={`text-sm rubik-regular mb-6 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {category
                ? `${formatCategoryName(category)} no article found`
                : "no article found"}
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/articles/categories"
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg rubik-bold transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-[#171B1F] text-gray-300 hover:bg-[#1E2328] border border-gray-800"
                    : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                সব ক্যাটাগরি
              </Link>
              <button
                onClick={() => refetch()}
                disabled={isRefetching}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg rubik-bold transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                }`}
              >
                <RefreshCcw
                  className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
                />
                রিফ্রেশ করুন
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArticlesByCategory;

// Page Button Component
interface PageButtonProps {
  pageNumber: number;
  isActive: boolean;
  onClick: (pageNumber: number) => void;
  theme: string;
}

const PageButton = ({
  pageNumber,
  isActive,
  onClick,
  theme,
}: PageButtonProps) => {
  const safePageNumber =
    typeof pageNumber === "number" && !isNaN(pageNumber) ? pageNumber : 1;

  return (
    <motion.button
      whileHover={{ scale: isActive ? 1.05 : 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(safePageNumber)}
      disabled={isActive}
      className={`px-4 py-2 rounded-lg rubik-bold transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg scale-105 cursor-default"
          : theme === "dark"
          ? "bg-[#171B1F] text-gray-300 hover:bg-[#1E2328] border border-gray-800"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
      }`}
    >
      {safePageNumber}
    </motion.button>
  );
};
