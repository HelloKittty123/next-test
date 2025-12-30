import { PrivateRoute } from "@components";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
