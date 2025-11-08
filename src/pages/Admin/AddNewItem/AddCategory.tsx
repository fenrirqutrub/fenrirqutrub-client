import { useForm, type SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { MdCategory } from "react-icons/md";
import { FiCheck } from "react-icons/fi";
import { useState } from "react";

import toast from "react-hot-toast";
import { axiosPublic } from "../../../hooks/axiosPublic";

interface CategoryFormData {
  categoryName: string;
}

const AddCategory = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>();

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosPublic.post(
        "http://localhost:5000/api/categories",
        {
          categoryName: data.categoryName,
        }
      );

      if (response.data.success) {
        toast.success(`Category "${data.categoryName}" added successfully!`);
        reset();
      }
    } catch (error: any) {
      console.error("Error adding category:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add category";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <MdCategory className="text-3xl text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Add Category
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Create a new category for your articles
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 md:p-8"
        >
          <div className="space-y-6">
            {/* Category Name Input */}
            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="categoryName"
                disabled={isLoading}
                {...register("categoryName", {
                  required: "Category name is required",
                  minLength: {
                    value: 3,
                    message: "Category name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Category name must not exceed 50 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9\s-]+$/,
                    message:
                      "Category name can only contain letters, numbers, spaces, and hyphens",
                  },
                })}
                placeholder="e.g., Web Development, Programming, Design"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 
                rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                dark:bg-slate-800 dark:text-white outline-none transition-all
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.categoryName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500 flex items-center gap-1"
                >
                  <span>⚠</span> {errors.categoryName.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium 
                py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none 
                focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center 
                justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiCheck className="text-xl" />
                    Add Category
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => reset()}
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="px-6 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 
                dark:hover:bg-slate-600 text-gray-800 dark:text-white font-medium 
                py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 
                disabled:cursor-not-allowed"
              >
                Reset
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default AddCategory;
