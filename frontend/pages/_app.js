import "../styles/globals.css";
import "../components/Navbar.css";
import Navbar from "../components/Navbar";

/* ✅ SAFE ADD — toastify only */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />

      {/* ✅ SAFE ADD — global toast */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </>
  );
}