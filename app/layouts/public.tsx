import { Outlet, Link } from "react-router";

export default function PublicLayout() {
  return (
    <>
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-bold text-gray-900">
              nvoi
            </Link>
            <Link
              to="/oauth/github"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Login with GitHub
            </Link>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
