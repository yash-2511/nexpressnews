import Navbar from "./Navbar";
import Footer from "./Footer";
import NotificationPrompt from "./NotificationPrompt";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-brandGray dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 pb-10 pt-4">{children}</main>
      <Footer />
      <NotificationPrompt />
    </div>
  );
}
