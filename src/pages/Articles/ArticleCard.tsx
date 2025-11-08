import { Timer, ExternalLink, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
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

interface ArticleCardProps {
  article: Article;
  index: number;
  theme: string;
}

const ArticleCard = ({ article, index, theme }: ArticleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Calculate read time based on description and code length
  const calculateReadTime = (): string => {
    const wordsPerMinute = 200;
    const words =
      article.description.split(" ").length + article.code.split(" ").length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link
        to={`/articles/detail/${article.slug}`}
        state={{ article, articleId: article._id }}
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
          {/* Gradient Overlay on Hover */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
              theme === "dark"
                ? "bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"
                : "bg-gradient-to-br from-blue-500/3 via-purple-500/3 to-pink-500/3"
            }`}
          />

          {/* Avatar Image - Top Right Corner */}
          <motion.div
            className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm z-10 overflow-hidden ${
              theme === "dark"
                ? "bg-white/10 border border-white/20"
                : "bg-black/5 border border-gray-200"
            }`}
          >
            {!imageError ? (
              <motion.img
                src={article.avatar}
                alt={article.category}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                animate={
                  isHovered
                    ? {
                        rotate: [0, -15, 15, -15, 15, 0],
                        scale: [1, 1.1, 1, 1.1, 1],
                      }
                    : { rotate: 0, scale: 1 }
                }
                transition={{
                  duration: 0.6,
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: 0.2,
                  ease: "easeInOut",
                }}
              />
            ) : (
              <div
                className={`w-6 h-6 rounded-full ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                }`}
              />
            )}
          </motion.div>

          {/* Card Content */}
          <div className="relative p-6 flex flex-col h-full">
            {/* Category Badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs rubik-bold ${
                  theme === "dark"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-blue-50 text-blue-600 border border-blue-200"
                }`}
              >
                {article.category}
              </span>
            </div>

            {/* Article Title */}
            <h3
              className={`text-xl md:text-2xl rubik-bold mb-3 transition-colors duration-300 group-hover:text-blue-500 line-clamp-3 ${
                theme === "dark" ? "text-[#F8F9FA]" : "text-[#0C0D12]"
              }`}
            >
              {article.title}
            </h3>

            {/* Article Description */}
            <p
              className={`text-sm md:text-base rubik-regular mb-6 flex-grow line-clamp-3 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {article.description}
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mb-4">
              {/* Views */}
              <div
                className={`flex items-center gap-1.5 text-xs rubik-regular ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{article.views}</span>
              </div>

              {/* Likes */}
              <div
                className={`flex items-center gap-1.5 text-xs rubik-regular ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>{article.likes}</span>
              </div>
            </div>

            {/* Card Footer */}
            <div
              className={`flex items-center justify-between pt-4 border-t ${
                theme === "dark" ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Read Time */}
                <div
                  className={`flex items-center gap-1.5 text-xs md:text-sm rubik-regular ${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  <Timer className="w-4 h-4" />
                  <span>{calculateReadTime()}</span>
                </div>

                {/* Publication Date */}
                <span
                  className={`text-xs md:text-sm rubik-regular ${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {formatDate(article.createdAt)}
                </span>
              </div>

              {/* Read More Button */}
              <motion.div
                className={`flex items-center gap-1 text-sm rubik-bold ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
                whileHover={{ x: 4 }}
              >
                <span className="hidden sm:inline">Read</span>
                <ExternalLink className="w-4 h-4" />
              </motion.div>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            style={{ originX: 0 }}
          />
        </div>

        {/* Glow Effect on Hover */}
        <div
          className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10 ${
            theme === "dark"
              ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
              : "bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
          }`}
        />
      </Link>
    </motion.article>
  );
};

export default ArticleCard;
