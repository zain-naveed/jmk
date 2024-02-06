import { useEffect } from "react";

interface LayoutProps {
  path: string;
  title: string;
  Component: any;
}

function Layout({ title, Component }: Partial<LayoutProps>) {
  useEffect(() => {
    document.title = title + " | JMK";
  });

  return (
    <>
      <Component />
    </>
  );
}

export default Layout;
