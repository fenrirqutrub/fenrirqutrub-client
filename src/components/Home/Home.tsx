import { Suspense } from "react";
import Hero from "../Hero/Hero";
import Projects from "../Projects/Projects";
import Services from "../Services/Services";
import Skills from "../Skills/Skills";
import PageLoader from "../ui/PagLoader";

const Home = () => {
  return (
    <div className="">
      <Suspense fallback={<PageLoader />}>
        <Hero />
        <Services />
        <Skills />
        <Projects />
      </Suspense>
    </div>
  );
};

export default Home;
