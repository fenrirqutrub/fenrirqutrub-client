import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

// react icons
import { MdDeleteOutline } from "react-icons/md";
import { axiosPublic } from "../../../hooks/axiosPublic";
import { Link } from "react-router";

// TypeScript interfaces
interface Article {
  _id: string;
  title: string;
  category: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Article[];
  total?: number;
  message?: string;
}

const ManageArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [loadingArticles, setLoadingArticles] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch articles on component mount and when page changes
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const { data } = await axiosPublic.get<ApiResponse>("/api/articles", {
          params: {
            page: currentPage,
            limit: pageSize,
          },
        });

        if (data.success) {
          setArticles(data.data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast.error("Failed to load articles");
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [currentPage, pageSize]);

  // Handle delete
  const handleDelete = async (articleId: string, articleTitle: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert "${articleTitle}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(articleId);
        const response = await axiosPublic.delete<ApiResponse>(
          `/api/articles/${articleId}`
        );

        if (response.data.success) {
          setArticles(articles.filter((article) => article._id !== articleId));
          toast.success("Article deleted successfully!");

          Swal.fire({
            title: "Deleted!",
            text: "Article has been deleted.",
            icon: "success",
          });
        }
      } catch (error) {
        console.error("Error deleting article:", error);
        const errorMessage =
          error && typeof error === "object" && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : undefined;

        toast.error(errorMessage || "Failed to delete article");

        Swal.fire({
          title: "Error!",
          text: "Failed to delete article",
          icon: "error",
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Handle search
  const filteredData = articles.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-4">
              Manage Articles
            </h2>
            <input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:max-w-md dark:bg-slate-900 dark:border-slate-700 dark:text-[#abc2d3] dark:placeholder:text-slate-500 py-2.5 px-4 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900"
            />
          </div>
          {/* Right Section: Button */}
          <div className="flex-shrink-0">
            <Link to="/addarticles">
              <button className="w-full sm:w-auto px-6 py-3 text-lg font-semibold text-white bg-emerald-600 rounded-lg shadow-md hover:bg-emerald-700 transition-all duration-200 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
                + Add Article
              </button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loadingArticles ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-lg border dark:border-slate-700 border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold dark:text-[#abc2d3] text-gray-700">
                      Serial No.
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold dark:text-[#abc2d3] text-gray-700">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold dark:text-[#abc2d3] text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold dark:text-[#abc2d3] text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold dark:text-[#abc2d3] text-gray-700">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {paginatedData.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm dark:text-[#abc2d3] text-gray-900">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium dark:text-[#abc2d3] text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm dark:text-[#abc2d3] text-gray-600">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-sm dark:text-[#abc2d3] text-gray-600">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          disabled={deletingId === item._id}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MdDeleteOutline className="text-lg" />
                          {deletingId === item._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!paginatedData?.length && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No articles found!
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {paginatedData.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        #{(currentPage - 1) * pageSize + index + 1}
                      </div>
                      <h3 className="font-semibold text-lg dark:text-[#abc2d3] text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Category:
                      </span>
                      <span className="font-medium dark:text-[#abc2d3]">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Date:
                      </span>
                      <span className="font-medium dark:text-[#abc2d3]">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    disabled={deletingId === item._id}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdDeleteOutline className="text-lg" />
                    {deletingId === item._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))}

              {!paginatedData?.length && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No articles found!
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <div className="text-sm dark:text-[#abc2d3] text-gray-600">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
                  {filteredData.length} results
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#abc2d3] bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            pageNum === currentPage
                              ? "bg-emerald-600 text-white"
                              : "text-gray-700 dark:text-[#abc2d3] bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#abc2d3] bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageArticles;
