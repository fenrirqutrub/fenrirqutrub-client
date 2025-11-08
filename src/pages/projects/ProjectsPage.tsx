import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";
import type { Project } from "../../components/Projects/Project";
import ProjectModal from "../../components/Projects/ProjectModal";
// ✅ Import JSON directly
import projectsData from "../../../public/project.json";

// Reusable Project Card for Grid View
const GridProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl overflow-hidden border shadow-lg transition-all ${
        theme === "dark"
          ? "bg-[#0C0D12] text-[#E9EBED] border border-[#30363D] "
          : "bg-[#E9EBED] text-[#0C0D12] border border-gray-300 "
      }`}
    >
      {/* Image */}
      <div className="relative w-full h-56 overflow-hidden bg-[#0D1117]">
        <img
          src={project.image || project.thumbnail}
          alt={project.title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-xl font-bold line-clamp-1">{project.title}</h3>
        <p className="text-sm text-gray-400 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        {project.technologies && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-full ${
                  theme === "dark"
                    ? "bg-red-200 text-red-600 border border-red-300"
                    : "bg-blue-200 text-blue-400 border border-blue-300"
                }`}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-1 text-xs rounded-full bg-[#30363D] text-gray-400">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* View Details Button */}
        <button
          className={`w-full mt-4 py-2 rounded transition-all ${
            theme === "dark"
              ? "bg-[#E9EBED] text-[#0C0D12] hover:bg-[#d1d3d5]"
              : "bg-[#0C0D12] text-[#E9EBED] hover:bg-[#1a1d23]"
          } text-sm font-medium`}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

const ProjectsPage = () => {
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ✅ Use imported data directly - no HTTP request needed
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      // Simulate async to maintain query structure
      return new Promise<Project[]>((resolve) => {
        setTimeout(() => resolve(projectsData as Project[]), 0);
      });
    },
  });

  // Filter projects based on search and category
  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesSearch;
  });

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil((filteredProjects?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects?.slice(startIndex, endIndex);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-[#0C0D12]" : "bg-[#E9EBED]"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className={theme === "dark" ? "text-[#E9EBED]" : "text-[#0C0D12]"}>
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-[#0C0D12]" : "bg-[#E9EBED]"
        }`}
      >
        <p className="text-red-500">Error: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <section
      className={`min-h-screen py-20 px-4 md:px-8 lg:px-16 ${
        theme === "dark"
          ? "bg-[#0C0D12] text-[#E9EBED]"
          : "bg-[#E9EBED] text-[#0C0D12]"
      }`}
    >
      {/* Modal */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl rubik-bold mb-4">ALL PROJECTS</h1>
          <p className="text-lg text-gray-400">
            Explore my collection of {projects?.length || 0} projects
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search projects by name, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all ${
                theme === "dark"
                  ? "bg-[#161B22] border-[#30363D] text-[#E9EBED] focus:border-red-500"
                  : "bg-white border-gray-300 text-[#0C0D12] focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-gray-400">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredProjects?.length || 0)} of{" "}
            {filteredProjects?.length || 0} project
            {filteredProjects?.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Projects Grid */}
        {currentProjects && currentProjects.length > 0 ? (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {currentProjects.map((project) => (
                  <GridProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex justify-center items-center gap-2"
              >
                {/* Previous Button */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-110"
                  } ${
                    theme === "dark"
                      ? "bg-[#161B22] text-[#E9EBED] hover:bg-[#1f2937]"
                      : "bg-white text-[#0C0D12] hover:bg-gray-200"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      // Show ellipsis
                      const showEllipsisBefore =
                        page === currentPage - 2 && currentPage > 3;
                      const showEllipsisAfter =
                        page === currentPage + 2 &&
                        currentPage < totalPages - 2;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <span key={page} className="px-3 py-2 text-gray-400">
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? theme === "dark"
                                ? "bg-red-500 text-white"
                                : "bg-blue-500 text-white"
                              : theme === "dark"
                              ? "bg-[#161B22] text-[#E9EBED] hover:bg-[#1f2937]"
                              : "bg-white text-[#0C0D12] hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-110"
                  } ${
                    theme === "dark"
                      ? "bg-[#161B22] text-[#E9EBED] hover:bg-[#1f2937]"
                      : "bg-white text-[#0C0D12] hover:bg-gray-200"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-gray-400 font-medium">
              No projects found
            </p>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectsPage;
