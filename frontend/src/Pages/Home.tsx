import About from "../components/about/about";
import Carroussel from "../components/Carroussel/Carroussel";
import Service from "../components/services/service";

function Home() {
  return (
    <>
      <Carroussel />
      <About />
      <Service />
    </>
  );
}

export default Home;
