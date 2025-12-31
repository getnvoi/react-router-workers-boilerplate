import { Outlet, Link } from "react-router";

export default function SystemLayout() {
  return (
    <>
      <nav >
        <div >
          <div >
            <Link to="/system" >
              nvoi <span >System</span>
            </Link>
            <div >
              <Link to="/system" >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
