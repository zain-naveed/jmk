import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import Toast from "shared/components/toast";
import AuthRoute from "shared/routes/authRoutes";
import { initSocket } from "shared/services/socketService";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./App.css";

function App() {
  useEffect(() => {
    initSocket();
  }, []);
  return (
    <div className="App">
      <AuthRoute />
      <Toast />
    </div>
  );
}

export default App;
