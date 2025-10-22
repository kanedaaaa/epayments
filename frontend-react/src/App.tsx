import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Signup from "./pages/signup";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="grow flex items-center justify-center bg-background">
        <Login />
      </main>
    </div>
  );
}
