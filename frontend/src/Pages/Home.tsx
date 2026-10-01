import { useEffect } from "react";
import { useLocation } from 'react-router-dom'; 
import About from "../components/about/about";
import Carroussel from "../components/Carroussel/Carroussel";
import Service from "../components/services/service";

function Home() {

const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string };
    
    if (state?.scrollTo) {
      const id = state.scrollTo;
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  return (
    <>
      <Carroussel />
      <About />
      <Service />
      <div id="tutoriais"> </div>
    </>
  );
}

export default Home;
