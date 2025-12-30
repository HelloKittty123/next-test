import styles from "./public-layout.module.scss";

function PublicLayout({ children }: { children?: React.ReactNode }) {
  return <div className={styles?.["public-layout-wrap"]}>{children}</div>;
}

export default PublicLayout;
