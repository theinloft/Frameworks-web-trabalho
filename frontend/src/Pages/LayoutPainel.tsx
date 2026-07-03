import { Navigate, Outlet } from 'react-router-dom';
import NavbarPainel from '../components/NavBarPainel/NavBarPainel';

export default function LayoutPainel() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <NavbarPainel />
      <Outlet />
    </>
  );
}
