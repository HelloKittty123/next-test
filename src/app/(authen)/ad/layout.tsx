import { PrivateRoute } from "@components";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <PrivateRoute role="admin">{children}</PrivateRoute>;
}
