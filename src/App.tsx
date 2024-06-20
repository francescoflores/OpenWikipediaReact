import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import Homepage from "./pages/Homepage";
import Article from "./pages/Article";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./contexts/AuthContext.tsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<Navbar />}>
            <Route index element={<Homepage />} />
            <Route path="article/:title" element={<Article />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Signup />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
