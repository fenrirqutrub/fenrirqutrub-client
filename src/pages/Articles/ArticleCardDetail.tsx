import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useNavigate, Link, useLocation, useParams } from "react-router";
import { useTheme } from "../../context/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  Timer,
  UserRound,
  Calendar,
  Eye,
  Share2,
  Tag,
  Code,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Copy,
  Check,
  Terminal,
  FileCode,
  Maximize2,
  Minimize2,
  X,
  CircleDot,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPublic } from "../../hooks/axiosPublic";
import copy from "copy-to-clipboard";

// ────────────────────────────────
// Interfaces
// ────────────────────────────────

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
  likedBy?: string[];
  createdAt: string;
  updatedAt: string;
}

interface CodeBlock {
  code: string;
  language: string;
  filename: string;
  title?: string;
}

interface Comment {
  _id: string;
  user: string;
  text: string;
  likes: number;
  time: string;
  createdAt?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

interface LikeStatusResponse {
  isLiked: boolean;
  likeCount: number;
  articleId: string;
}

// ────────────────────────────────
// Utility: Get User ID
// ────────────────────────────────

const getUserId = (): string => {
  let userId = localStorage.getItem("userId");

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);
  }

  return userId;
};

// ────────────────────────────────
// Utility: Parse Code Blocks
// ────────────────────────────────

const parseCodeBlocks = (codeString: string): CodeBlock[] => {
  if (!codeString) return [];

  // Split by lines and detect code blocks
  const lines = codeString.split("\n");
  const blocks: CodeBlock[] = [];
  let currentBlock: string[] = [];
  let currentLanguage = "javascript";
  let currentFilename = "_> zsh";
  let currentTitle = "";

  lines.forEach((line, index) => {
    // Check for language/filename markers (e.g., // @filename: app.js)
    const filenameMatch = line.match(/\/\/\s*@filename:\s*(.+)/i);
    const languageMatch = line.match(/\/\/\s*@language:\s*(.+)/i);
    const titleMatch = line.match(/\/\/\s*@title:\s*(.+)/i);

    if (filenameMatch) {
      currentFilename = filenameMatch[1].trim();
      return;
    }

    if (languageMatch) {
      currentLanguage = languageMatch[1].trim();
      return;
    }

    if (titleMatch) {
      currentTitle = titleMatch[1].trim();
      return;
    }

    // Detect natural breaks (empty lines or comments suggesting new section)
    if (
      line.trim() === "" &&
      currentBlock.length > 0 &&
      index < lines.length - 1
    ) {
      // Check if next non-empty line is a comment
      let nextLineIndex = index + 1;
      while (
        nextLineIndex < lines.length &&
        lines[nextLineIndex].trim() === ""
      ) {
        nextLineIndex++;
      }

      if (
        nextLineIndex < lines.length &&
        (lines[nextLineIndex].trim().startsWith("//") ||
          lines[nextLineIndex].trim().startsWith("/*"))
      ) {
        blocks.push({
          code: currentBlock.join("\n"),
          language: currentLanguage,
          filename: currentFilename,
          title: currentTitle,
        });
        currentBlock = [];
        currentTitle = "";
        return;
      }
    }

    currentBlock.push(line);
  });

  // Push remaining block
  if (currentBlock.length > 0) {
    blocks.push({
      code: currentBlock.join("\n"),
      language: currentLanguage,
      filename: currentFilename,
      title: currentTitle,
    });
  }

  return blocks.length > 0
    ? blocks
    : [{ code: codeString, language: "javascript", filename: "code.js" }];
};

// ────────────────────────────────
// Code Terminal Component
// ────────────────────────────────

// ────────────────────────────────
// Code Terminal Component
// ────────────────────────────────

const CodeTerminal = ({
  block,
  index,
  theme,
}: {
  block: CodeBlock;
  index: number;
  theme: string;
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleCopyCode = () => {
    const success = copy(block.code, {
      debug: false,
      message: "Press #{key} to copy",
    });

    if (success) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`mb-6 font-mono ${
        isMaximized ? "fixed inset-4 z-50 overflow-auto" : ""
      }`}
    >
      <div
        className={`rounded-lg overflow-hidden ${
          theme === "dark" ? "bg-black" : "bg-gray-900"
        }`}
      >
        {/* Terminal Header */}
        <div className="flex justify-between items-center p-4 pb-2">
          {/* Traffic Lights */}
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="w-3 h-3 rounded-full bg-red-500"
            />
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="w-3 h-3 rounded-full bg-yellow-500"
            />
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-3 h-3 rounded-full bg-green-500"
            />
          </div>

          {/* Terminal Title and Copy Button */}
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-400">{block.filename || "bash"}</p>

            {/* Copy Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyCode}
              className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold transition-all duration-300 ${
                copiedCode
                  ? "bg-green-500/20 text-green-400"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <AnimatePresence mode="wait">
                {copiedCode ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span>{copiedCode ? "Copied!" : "Copy"}</span>
            </motion.button>
          </div>
        </div>

        {/* Code Content */}
        <div className="px-4 pb-4">
          <SyntaxHighlighter
            language={block.language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: 0,
              background: "transparent",
              fontSize: "0.875rem",
              lineHeight: "1.5",
            }}
            showLineNumbers
            wrapLines={true}
            wrapLongLines={true}
            lineNumberStyle={{
              minWidth: "3em",
              paddingRight: "1em",
              color: "#4b5563",
              userSelect: "none",
            }}
          >
            {block.code}
          </SyntaxHighlighter>
        </div>
      </div>
    </motion.div>
  );
};

// ────────────────────────────────
// Component
// ────────────────────────────────

const ArticleCardDetail = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const articleFromState = location.state?.article as Article | undefined;

  // ────────────────────────────────
  // State Management
  // ────────────────────────────────
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const userId = getUserId();

  // ────────────────────────────────
  // Fetch Article
  // ────────────────────────────────

  const {
    data: articleData,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery<ApiResponse<Article>>({
    queryKey: ["article", slug],
    queryFn: async () => {
      if (articleFromState) return { success: true, data: articleFromState };
      const { data } = await axiosPublic.get<ApiResponse<Article>>(
        `/api/articles/slug/${slug}`
      );
      if (!data.success)
        throw new Error(data.message || "Failed to fetch article");
      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const article = articleFromState || articleData?.data;

  // ────────────────────────────────
  // Track View (POST)
  // ────────────────────────────────

  const trackViewMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const { data } = await axiosPublic.post(
        `/api/articles/${articleId}/view`
      );
      return data;
    },
  });

  // Track view once when article loads
  useEffect(() => {
    if (article?._id && !hasTrackedView) {
      trackViewMutation.mutate(article._id);
      setHasTrackedView(true);
    }
  }, [article?._id, hasTrackedView]);

  // ────────────────────────────────
  // Fetch Like Status
  // ────────────────────────────────

  const { data: likeStatusData } = useQuery<ApiResponse<LikeStatusResponse>>({
    queryKey: ["likeStatus", article?._id, userId],
    queryFn: async () => {
      if (!article?._id) throw new Error("Article ID required");
      const { data } = await axiosPublic.get<ApiResponse<LikeStatusResponse>>(
        `/api/articles/${article._id}/like-status`,
        { params: { userId } }
      );
      if (!data.success)
        throw new Error(data.message || "Failed to fetch like status");
      return data;
    },
    enabled: !!article?._id,
  });

  // ────────────────────────────────
  // Fetch Comments
  // ────────────────────────────────

  const { data: commentsData, isLoading: commentsLoading } = useQuery<
    ApiResponse<Comment[]>
  >({
    queryKey: ["comments", article?._id],
    queryFn: async () => {
      if (!article?._id) throw new Error("Article ID is required for comments");
      const { data } = await axiosPublic.get<ApiResponse<Comment[]>>(
        `/api/articles/${article._id}/comments`
      );
      if (!data.success)
        throw new Error(data.message || "Failed to fetch comments");
      return data;
    },
    enabled: !!article?._id,
  });

  const comments: Comment[] = commentsData?.data || [];

  // ────────────────────────────────
  // Initialize Like State
  // ────────────────────────────────

  useEffect(() => {
    if (likeStatusData?.data) {
      setIsLiked(likeStatusData.data.isLiked);
      setLikeCount(likeStatusData.data.likeCount);
    }
  }, [likeStatusData]);

  // ────────────────────────────────
  // Like/Unlike Mutation
  // ────────────────────────────────

  const toggleLikeMutation = useMutation({
    mutationFn: async ({ action }: { action: "like" | "unlike" }) => {
      if (!article?._id) throw new Error("Article ID is required");

      const { data } = await axiosPublic.post(
        `/api/articles/${article._id}/${action}`,
        { userId }
      );

      if (!data.success) {
        throw new Error(data.message || `Failed to ${action} article`);
      }

      return data.data;
    },

    onMutate: async ({ action }) => {
      await queryClient.cancelQueries({ queryKey: ["article", slug] });
      await queryClient.cancelQueries({
        queryKey: ["likeStatus", article?._id, userId],
      });

      const previousData = { likeCount, isLiked };

      if (action === "like") {
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      } else {
        setLikeCount((prev) => Math.max(0, prev - 1));
        setIsLiked(false);
      }

      setError("");

      return { previousData };
    },

    onError: (err: any, variables, context) => {
      if (context?.previousData) {
        setLikeCount(context.previousData.likeCount);
        setIsLiked(context.previousData.isLiked);
      }

      setError(
        err.message ||
          `Failed to ${variables.action} article. Please try again.`
      );

      setTimeout(() => setError(""), 5000);
    },

    onSuccess: (updatedArticle) => {
      setLikeCount(updatedArticle.likes);

      queryClient.setQueryData(["article", slug], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: updatedArticle,
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["article", slug] });
      queryClient.invalidateQueries({
        queryKey: ["likeStatus", article?._id, userId],
      });
    },
  });

  // ────────────────────────────────
  // Comment Mutations
  // ────────────────────────────────

  const postCommentMutation = useMutation({
    mutationFn: async (newComment: { user: string; text: string }) => {
      if (!article?._id) throw new Error("Article ID required");
      const { data } = await axiosPublic.post<ApiResponse<Comment>>(
        `/api/articles/${article._id}/comments`,
        newComment
      );
      if (!data.success)
        throw new Error(data.message || "Failed to post comment");
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", article?._id] });
      setCommentText("");
    },
    onError: (err) => {
      console.error("Error posting comment:", err);
      setError("Failed to post comment. Please try again.");
      setTimeout(() => setError(""), 5000);
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { data } = await axiosPublic.post(
        `/api/comments/${commentId}/like`
      );
      if (!data.success)
        throw new Error(data.message || "Failed to like comment");
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", article?._id] });
    },
    onError: (err) => console.error("Error liking comment:", err),
  });

  // ────────────────────────────────
  // Event Handlers
  // ────────────────────────────────

  const handleLikeToggle = () => {
    if (toggleLikeMutation.isPending) return;
    const action = isLiked ? "unlike" : "like";
    toggleLikeMutation.mutate({ action });
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      postCommentMutation.mutate({ user: "Guest User", text: commentText });
    }
  };

  const handleLikeComment = (commentId: string) => {
    likeCommentMutation.mutate(commentId);
  };

  const handleShare = async () => {
    if (!article) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
      await axiosPublic.post(`/api/articles/${article._id}/share`);
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  // ────────────────────────────────
  // Utility Functions
  // ────────────────────────────────

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const calculateReadTime = (): string => {
    if (!article?.description) return "0 min read";
    const words =
      article.description.split(" ").length +
      (article.code?.split(" ").length || 0);
    return `${Math.ceil(words / 200)} min read`;
  };

  // Parse code blocks
  const codeBlocks = article?.code ? parseCodeBlocks(article.code) : [];

  // ────────────────────────────────
  // Loading State
  // ────────────────────────────────

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-[#0C0D12]" : "bg-[#E9EBED]"
        }`}
      >
        <div className="flex flex-col items-center">
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
            Loading Article...
          </p>
        </div>
      </div>
    );
  }

  // ────────────────────────────────
  // Error State
  // ────────────────────────────────

  if (isError || !article) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-[#0C0D12]" : "bg-[#E9EBED]"
        }`}
      >
        <div className="text-center px-4">
          <AlertCircle
            className={`w-16 h-16 mx-auto mb-4 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
          />
          <h3
            className={`text-xl rubik-bold mb-2 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            Article Not Found
          </h3>
          <p
            className={`text-sm rubik-regular mb-6 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {fetchError?.message ||
              "The article you are looking for does not exist."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg rubik-bold transition-all duration-300 ${
                theme === "dark"
                  ? "bg-[#171B1F] text-gray-300 hover:bg-[#1E2328] border border-gray-800"
                  : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <Link
              to="/articles"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg rubik-bold transition-all duration-300 ${
                theme === "dark"
                  ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              See All Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────
  // Main UI
  // ────────────────────────────────

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0C0D12]" : "bg-[#E9EBED]"
      }`}
    >
      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 mx-4 sm:mx-6 lg:mx-8 p-4 rounded-lg flex items-center gap-3 shadow-lg max-w-md ${
              theme === "dark"
                ? "bg-red-900/90 border border-red-500/50 text-red-100"
                : "bg-red-50 border border-red-300 text-red-800"
            }`}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm rubik-regular flex-1">{error}</span>
            <button
              onClick={() => setError("")}
              className="text-sm rubik-bold hover:opacity-75 transition-opacity"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 mt-20"
        >
          <img
            src={article.img}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 ${
              theme === "dark"
                ? "bg-gradient-to-b from-transparent via-[#0C0D12]/50 to-[#0C0D12]"
                : "bg-gradient-to-b from-transparent via-white/50 to-[#E9EBED]"
            }`}
          />
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-24 left-4 sm:left-6 lg:left-8 z-10"
        >
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm rubik-bold transition-all duration-300 backdrop-blur-md ${
              theme === "dark"
                ? "bg-black/30 text-white hover:bg-black/50 border border-white/20"
                : "bg-white/30 text-gray-900 hover:bg-white/50 border border-gray-200/50"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            go back
          </button>
        </motion.div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-3"
            >
              <Link
                to={`/articles/category/${article.category.toLowerCase()}`}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs rubik-bold backdrop-blur-md transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-blue-500/30 text-blue-300 border border-blue-400/30 hover:bg-blue-500/50"
                    : "bg-blue-500/30 text-blue-900 border border-blue-400/50 hover:bg-blue-500/50"
                }`}
              >
                <Tag className="w-3 h-3" />
                {article.category}
              </Link>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-3xl md:text-4xl rubik-bold mb-4 drop-shadow-lg ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {article.title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 py-16">
        {/* Author Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl p-6 mb-8 border backdrop-blur-sm ${
            theme === "dark"
              ? "bg-[#171B1F]/80 border-gray-800"
              : "bg-white/80 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Author Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-blue-500 ring-offset-transparent">
                  <img
                    src={article.avatar}
                    alt="Author"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ring-2 ${
                    theme === "dark" ? "ring-[#171B1F]" : "ring-white"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              </div>

              {/* Author Details */}
              <div>
                <h3
                  className={`text-lg rubik-bold mb-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Fenrir Qutrub
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`flex items-center gap-1.5 text-sm rubik-regular ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span
                      className={`rubik-bold ${
                        theme === "dark" ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {formatDate(article.createdAt)}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end justify-end gap-2">
              {/* Like Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLikeToggle}
                disabled={toggleLikeMutation.isPending}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm rubik-bold transition-all duration-300 ${
                  isLiked
                    ? theme === "dark"
                      ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                      : "bg-red-50 text-red-600 border border-red-300 hover:bg-red-100"
                    : theme === "dark"
                    ? "bg-[#0C0D12] text-gray-300 border border-gray-800 hover:bg-gray-800 hover:border-gray-700"
                    : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <motion.div
                  animate={{
                    scale: isLiked ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    className={`w-4 h-4 transition-all duration-200 ${
                      isLiked
                        ? "fill-red-500 stroke-red-500"
                        : "stroke-current fill-none"
                    }`}
                    strokeWidth={2}
                  />
                </motion.div>
                <span className="font-semibold">{likeCount}</span>
                {toggleLikeMutation.isPending && (
                  <Loader2 className="w-3 h-3 animate-spin ml-1" />
                )}
              </motion.button>

              {/* Share Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm rubik-bold transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-[#0C0D12] text-gray-300 hover:bg-gray-800 border border-gray-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                <Share2 className={`w-4 h-4`} strokeWidth={2} />
                <span className="hidden sm:inline">Share</span>
              </motion.button>
            </div>
          </div>

          {/* Meta Information */}
          <div
            className={`flex items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t flex-wrap ${
              theme === "dark" ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <span
              className={`flex items-center gap-1.5 text-sm rubik-regular ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Timer className="w-4 h-4" />
              {calculateReadTime()}
            </span>
            <span
              className={`flex items-center gap-1.5 text-sm rubik-regular ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Eye className="w-4 h-4" />
              {article.views} views
            </span>
            <span
              className={`flex items-center gap-1.5 text-sm rubik-regular ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              {comments.length} comments
            </span>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl p-6 sm:p-8 md:p-12 mb-8 border ${
            theme === "dark"
              ? "bg-[#171B1F] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Article Description */}
          <div className="mb-8">
            <p
              className={`text-lg md:text-xl rubik-regular leading-relaxed text-justify ${
                theme === "dark"
                  ? "text-gray-300 border-blue-500"
                  : "text-gray-700 border-blue-600"
              }`}
            >
              {article.description}
            </p>
          </div>

          {/* Code Terminals Section */}
          {codeBlocks.length > 0 && (
            <div className="space-y-6">
              {codeBlocks.map((block, index) => (
                <CodeTerminal
                  key={index}
                  block={block}
                  index={index}
                  theme={theme}
                />
              ))}
            </div>
          )}
        </motion.article>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`rounded-2xl p-6 sm:p-8 border ${
            theme === "dark"
              ? "bg-[#171B1F] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-xl sm:text-2xl rubik-bold mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            comments ({comments.length})
          </h3>

          {/* Comment Input */}
          <div className="mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
                <UserRound className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="what's your opinion..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit();
                    }
                  }}
                  rows={3}
                  disabled={postCommentMutation.isPending}
                  className={`w-full px-4 py-3 rounded-xl text-sm rubik-regular outline-none resize-none transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-[#0C0D12] text-white placeholder-gray-500 border border-gray-800 focus:border-blue-500"
                      : "bg-gray-50 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-blue-500"
                  }`}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleCommentSubmit}
                    disabled={
                      !commentText.trim() || postCommentMutation.isPending
                    }
                    className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm rubik-bold transition-all duration-300 disabled:cursor-not-allowed ${
                      theme === "dark"
                        ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
                    }`}
                  >
                    {postCommentMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {postCommentMutation.isPending ? "posting..." : "comment"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2
                  className={`w-6 h-6 animate-spin ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
            ) : comments.length === 0 ? (
              <div
                className={`text-center py-12 rounded-xl ${
                  theme === "dark" ? "bg-[#0C0D12]" : "bg-gray-50"
                }`}
              >
                <MessageCircle
                  className={`w-12 h-12 mx-auto mb-3 ${
                    theme === "dark" ? "text-gray-700" : "text-gray-400"
                  }`}
                />
                <p
                  className={`text-sm rubik-regular ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  no comments yet. be the first to share your thoughts!
                </p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex-shrink-0 flex items-center justify-center">
                    <UserRound className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-sm rubik-bold ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {comment.user}
                      </span>
                      <span
                        className={`text-xs rubik-regular ${
                          theme === "dark" ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {comment.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm rubik-regular mb-3 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {comment.text}
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        disabled={likeCommentMutation.isPending}
                        className={`flex items-center gap-1 text-xs rubik-bold transition-colors ${
                          theme === "dark"
                            ? "text-gray-400 hover:text-red-400"
                            : "text-gray-600 hover:text-red-600"
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" />
                        {comment.likes > 0 && <span>{comment.likes}</span>}
                      </button>
                      <button
                        className={`text-xs rubik-bold transition-colors ${
                          theme === "dark"
                            ? "text-gray-400 hover:text-blue-400"
                            : "text-gray-600 hover:text-blue-600"
                        }`}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleCardDetail;
