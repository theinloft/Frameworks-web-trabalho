import { Outlet } from "react-router-dom";
import Menu from "../components/Menu/Menu";
import Footer from "../components/Footer/footer";

export default function Layout() {
  return (
    <>
      <Menu />
      <Outlet />
      <Footer />
    </>
  );
}