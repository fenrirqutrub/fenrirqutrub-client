import { Suspense, useEffect } from "react";
import Hero from "../Hero/Hero";
import Projects from "../Projects/Projects";
import Services from "../Services/Services";
import Skills from "../Skills/Skills";
import PageLoader from "../ui/PagLoader";
import UpDown from "../ui/UpDown";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="">
      <Suspense fallback={<PageLoader />}>
        <Hero />
        <Services />
        <Skills />
        <Projects />
      </Suspense>
      <div className="fixed bottom-5 right-5">
        <UpDown />
      </div>
    </div>
  );
};

export default Home;
