import { useTheme } from "../../context/ThemeProvider";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "./ArticleCard";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { useState, useEffect, type JSX } from "react";
import { axiosPublic } from "../../hooks/axiosPublic";

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

const Articles = () => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // TanStack Query with axiosPublic and advanced error handling
  const {
    data: articlesResponse,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["articles", currentPage, itemsPerPage],
    queryFn: async () => {
      try {
        const { data } = await axiosPublic.get("/api/articles", {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });

        // Validate response data
        if (!data || !data.success) {
          throw new Error(data?.message || "Failed to fetch articles");
        }

        return data;
      } catch (err) {
        console.error("Error fetching articles:", err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Safe article array with type guard
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

  // Pagination handlers with validation
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

  // Render page numbers with safe calculations
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

  // Get error message with type safety
  const getErrorMessage = (): string => {
    if (!error) return "An unknown error occurred";

    if (error instanceof Error) {
      return error.message;
    }

    return "Something went wrong";
  };

  // Calculate display range
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalArticles);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0C0D12]" : "bg-[#E9EBED]"
      }`}
    >
      <div className="pt-32 px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl md:text-5xl lg:text-6xl rubik-bold mb-4 transition-colors duration-300 ${
              theme === "dark" ? "text-[#F8F9FA]" : "text-[#0C0D12]"
            }`}
          >
            Articles
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-lg md:text-xl rubik-regular ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Thoughts, tutorials, and insights on web development
          </motion.p>
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
              {isRefetching ? "Refreshing articles..." : "Loading articles..."}
            </p>
          </div>
        )}

        {/* Error State with Retry */}
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
              Failed to Load Articles
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
              {isRefetching ? "Retrying..." : "Try Again"}
            </button>
          </motion.div>
        )}

        {/* Articles Grid - Only render when we have valid data */}
        {!isLoading && !isError && safeArticles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeArticles.map((article, index) => {
                // Additional safety check for each article
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
                {/* Previous Button */}
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

                {/* Page Numbers */}
                <div className="flex gap-2">{renderPageNumbers()}</div>

                {/* Next Button */}
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

            {/* Results Info */}
            {totalArticles > 0 && (
              <div className="mt-8 text-center">
                <p
                  className={`text-sm rubik-regular ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Showing {startIndex}-{endIndex} of {totalArticles} articles
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty State - When data loads successfully but array is empty */}
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
              No Articles Found
            </h3>
            <p
              className={`text-sm rubik-regular mb-6 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              There are no articles available at the moment. Check back later!
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

export default Articles;

// Page Button Component with proper TypeScript types
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
  // Validate pageNumber
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
