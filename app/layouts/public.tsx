import { Outlet, Link } from "react-router";
import { Button } from "~/components";

export default function PublicLayout() {
  return (
    <>
      <nav >
        <div >
          <div >
            <Link to="/" >
              nvoi
            </Link>
            <Button size="md" asChild>
              <Link to="/oauth/github">Login with GitHub</Link>
            </Button>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
