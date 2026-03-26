import { Outlet } from "react-router";
import Header from "../layout/header";
import MainContent from "../layout/main";
import Footer from "../layout/footer";

export default function Layout() {
  return (
    <>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
    </>
  )
}