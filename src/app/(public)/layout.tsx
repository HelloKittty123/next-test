import { PublicRoute } from "@components";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicRoute>{children}</PublicRoute>;
}

export default PublicLayout;
