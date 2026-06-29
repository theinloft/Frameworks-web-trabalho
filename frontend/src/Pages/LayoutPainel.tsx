import { Outlet } from "react-router-dom";
import NavbarPainel from "../components/NavBarPainel/NavBarPainel";

export default function LayoutPainel() {
  return (
    <>
      <NavbarPainel />
      <Outlet />
    </>
  );
}
