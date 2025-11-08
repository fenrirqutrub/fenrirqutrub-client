import { motion } from "framer-motion";

import type {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";
import type { ProjectCardProps } from "./Project";

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const imageUrl = project.image.startsWith("http")
    ? project.image
    : `/works/${project.image.split("/").pop()}`;

  return (
    <motion.div
      onClick={onClick}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="group relative"
    >
      <div
        className={`"absolute inset-0 bg-[#0a0a0a] rounded-xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" `}
      />
      <motion.div
        whileHover={{ y: -5 }}
        className="relative bg-[#0a0a0a] backdrop-blur-sm rounded overflow-hidden hover:border-[#0a0a0a] transition-colors"
      >
        <div className="relative overflow-hidden aspect-video">
          <img
            src={imageUrl}
            alt={project.title}
            width={800}
            height={600}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center gap-4 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => e.stopPropagation()}
            ></motion.a>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
            ></motion.button>
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => e.stopPropagation()}
            ></motion.a>
          </motion.div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 font-b">
            {project.title}
          </h3>
          <p className="text-gray-400 mb-4 line-clamp-2 font">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies
              .slice(0, 3)
              .map(
                (
                  tech:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<
                        unknown,
                        string | JSXElementConstructor<unknown>
                      >
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<unknown>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined,
                  index: Key | null | undefined
                ) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-black text-white/80 text-sm box-shadow font"
                  >
                    {tech}
                  </span>
                )
              )}
            {project.technologies.length > 3 && (
              <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-400 text-sm">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;
