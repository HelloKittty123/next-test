import { PrivateRoute } from "@components";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <PrivateRoute role="user">{children}</PrivateRoute>;
}
