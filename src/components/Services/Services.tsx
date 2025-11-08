import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Marquee from "react-fast-marquee";
import { useTheme } from "../../context/ThemeProvider";
import axios from "axios";

// Define TypeScript interface for review data
interface Review {
  img: string;
  name: string;
  username: string;
  body: string;
}

// ReviewCard component with typed props
const ReviewCard: React.FC<Review> = ({ img, name, username, body }) => {
  const { theme } = useTheme();
  return (
    <figure
      className={`relative w-72 md:w-80 h-40 md:h-48 mx-4 cursor-pointer overflow-hidden rounded-xl p-6 my-5 ${
        theme == "dark"
          ? "bg-[#0D0F14]  border border-gray-800"
          : "bg-[#E9EBED] text-[#0D0F14]   border border-gray-400"
      } `}
    >
      <div className="flex flex-row items-center gap-3 -mt-3">
        <img
          src={img}
          alt={`${name}'s profile picture`}
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <figcaption
            className={`text-xs md:text-sm font-medium ${
              theme == "dark" ? "bg-[#0D0F14]" : "bg-[#E9EBED] text-[#0D0F14]"
            }`}
          >
            {name}
          </figcaption>
          <p
            className={`text-xs font-medium ${
              theme == "dark" ? "bg-[#0D0F14]" : "s text-[#0D0F14]"
            } `}
          >
            {username}
          </p>
        </div>
      </div>
      <blockquote className="mt-2 text-xs leading-relaxed">{body}</blockquote>
    </figure>
  );
};

// Services component
const Services: React.FC = () => {
  const { theme } = useTheme();
  const {
    data: reviews = [],
    isLoading,
    error,
  } = useQuery<Review[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await axios.get("/services.json");
      return data.services ?? data;
    },
  });

  if (isLoading) {
    return (
      <div
        className={`"flex h-[500px] items-center justify-center ${
          theme === "dark"
            ? "text-[#E3E3E4] bg-[#14171C]"
            : "bg-[#E3E3E4] text-[#14171C]"
        } `}
      >
        <div className="text-white">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[500px] items-center justify-center bg-black">
        <div className="text-red-500">Error loading services</div>
      </div>
    );
  }

  // Split reviews into two rows
  const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

  return (
    <div>
      <section
        className={`relative flex h-[500px] w-full flex-col items-center justify-center gap-8 overflow-hidden ${
          theme == "dark" ? "bg-[#0C0D12]" : "bg-[#E9EBED]"
        } min-h-fit`}
      >
        <Marquee direction="left" speed={40}>
          <div className="flex">
            {Array.isArray(firstRow) &&
              firstRow.map((review) => (
                <Link
                  key={review.username}
                  to={`/reviews/${review.username}`}
                  className="no-underline"
                >
                  <ReviewCard {...review} />
                </Link>
              ))}
          </div>
        </Marquee>
        <Marquee direction="right" speed={40}>
          <div className="flex">
            {Array.isArray(secondRow) &&
              secondRow.map((review) => (
                <Link
                  key={review.username}
                  to={`/reviews/${review.username}`}
                  className="no-underline"
                >
                  <ReviewCard {...review} />
                </Link>
              ))}
          </div>
        </Marquee>
      </section>
    </div>
  );
};

export default Services;
