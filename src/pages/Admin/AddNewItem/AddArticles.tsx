import { useForm, type SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";

import toast from "react-hot-toast";
import { axiosPublic } from "../../../hooks/axiosPublic";

interface ArticleFormData {
  category: string;
  avatar: FileList;
  img: FileList;
  title: string;
  description: string;
  code: string;
}

interface Category {
  _id: string;
  categoryName: string;
  slug: string;
  articleCount: number;
}

const AddArticles = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<ArticleFormData>();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axiosPublic.get("/api/categories");

        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Validate image dimensions
  const validateImageDimensions = (
    file: File,
    type: "avatar" | "img"
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const { width, height } = img;
        const aspectRatio = width / height;

        if (type === "avatar") {
          // Avatar: Accept only vertical/portrait (height > width)
          // Aspect ratio < 1 means height is greater than width
          if (aspectRatio < 1) {
            resolve(true);
          } else {
            toast.error(
              "Avatar must be vertical/portrait orientation (height > width)"
            );
            resolve(false);
          }
        } else {
          // Image: Accept only horizontal (width > height)
          // Aspect ratio > 1 means width is greater than height
          if (aspectRatio > 1) {
            resolve(true);
          } else {
            toast.error(
              "Image must be horizontal/landscape orientation (width > height)"
            );
            resolve(false);
          }
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        toast.error("Failed to load image");
        resolve(false);
      };

      img.src = objectUrl;
    });
  };

  // Handle avatar preview with validation
  const handleAvatarChange = async (files: FileList | null) => {
    if (files && files[0]) {
      const isValid = await validateImageDimensions(files[0], "avatar");

      if (!isValid) {
        setError("avatar", {
          type: "manual",
          message: "Avatar must be vertical/portrait shape",
        });
        // Reset the file input
        const input = document.getElementById("avatar") as HTMLInputElement;
        if (input) input.value = "";
        return;
      }

      clearErrors("avatar");
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Handle image preview with validation
  const handleImgChange = async (files: FileList | null) => {
    if (files && files[0]) {
      const isValid = await validateImageDimensions(files[0], "img");

      if (!isValid) {
        setError("img", {
          type: "manual",
          message: "Image must be horizontal/landscape shape",
        });
        // Reset the file input
        const input = document.getElementById("img") as HTMLInputElement;
        if (input) input.value = "";
        return;
      }

      clearErrors("img");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Remove avatar
  const removeAvatar = () => {
    setAvatarPreview(null);
    clearErrors("avatar");
    const input = document.getElementById("avatar") as HTMLInputElement;
    if (input) input.value = "";
  };

  // Remove image
  const removeImg = () => {
    setImgPreview(null);
    clearErrors("img");
    const input = document.getElementById("img") as HTMLInputElement;
    if (input) input.value = "";
  };

  const onSubmit: SubmitHandler<ArticleFormData> = async (data) => {
    try {
      setIsSubmitting(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("category", data.category);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("code", data.code);

      if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }
      if (data.img && data.img[0]) {
        formData.append("img", data.img[0]);
      }

      // API call using axiosPublic
      const response = await axiosPublic.post("/api/articles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Reset form after successful submission
        reset();
        setAvatarPreview(null);
        setImgPreview(null);
        toast.success(response.data.message || "Article added successfully!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof Error) {
        console.error("Error response:", error);
      }
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to add article";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Add New Article
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the details below to create a new article
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 md:p-8"
        >
          <div className="space-y-6">
            {/* Category and Title Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  {...register("category", {
                    required: "Category is required",
                  })}
                  disabled={loadingCategories || isSubmitting}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 
                  rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                  dark:bg-slate-800 dark:text-white outline-none transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  disabled={isSubmitting}
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters",
                    },
                  })}
                  placeholder="Enter article title"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 
                  rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                  dark:bg-slate-800 dark:text-white outline-none transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                disabled={isSubmitting}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 20,
                    message: "Description must be at least 20 characters",
                  },
                })}
                rows={4}
                placeholder="Enter article description"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 
                rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                dark:bg-slate-800 dark:text-white outline-none transition-all resize-none
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Code */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Code <span className="text-red-500">*</span>
              </label>
              <textarea
                id="code"
                disabled={isSubmitting}
                {...register("code", {
                  required: "Code is required",
                })}
                rows={6}
                placeholder="Enter your code here"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 
                rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                dark:bg-slate-800 dark:text-white outline-none transition-all resize-none font-mono text-sm
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* File Uploads Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar (Vertical/Portrait){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {!avatarPreview ? (
                    <label
                      htmlFor="avatar"
                      className={`flex flex-col items-center justify-center w-full h-40 
                      border-2 border-dashed border-gray-300 dark:border-slate-700 
                      rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 
                      transition-all ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FiUpload className="text-4xl text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload avatar
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Vertical/Portrait shape only
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG (MAX. 2MB)
                      </p>
                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        disabled={isSubmitting}
                        {...register("avatar", {
                          required: "Avatar is required",
                          onChange: (e) => handleAvatarChange(e.target.files),
                        })}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-emerald-500">
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeAvatar}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white 
                        rounded-full hover:bg-red-600 transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiX className="text-lg" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.avatar && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.avatar.message}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image (Horizontal/Landscape){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {!imgPreview ? (
                    <label
                      htmlFor="img"
                      className={`flex flex-col items-center justify-center w-full h-40 
                      border-2 border-dashed border-gray-300 dark:border-slate-700 
                      rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 
                      transition-all ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FiUpload className="text-4xl text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Horizontal/Landscape shape only
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG (MAX. 5MB)
                      </p>
                      <input
                        type="file"
                        id="img"
                        accept="image/*"
                        disabled={isSubmitting}
                        {...register("img", {
                          required: "Image is required",
                          onChange: (e) => handleImgChange(e.target.files),
                        })}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-emerald-500">
                      <img
                        src={imgPreview}
                        alt="Image preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImg}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white 
                        rounded-full hover:bg-red-600 transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiX className="text-lg" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.img && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.img.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium 
                py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none 
                focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding Article..." : "Add Article"}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  reset();
                  setAvatarPreview(null);
                  setImgPreview(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 
                dark:hover:bg-slate-600 text-gray-800 dark:text-white font-medium 
                py-3 px-6 rounded-lg transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Form
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArticles;
