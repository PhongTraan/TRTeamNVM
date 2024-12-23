import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/Auth/LoginPage";
import Home from "./components/Home/Home";
import { RegisterPage } from "./components/Auth/RegisterPage";
import TaskAll from "./components/Home/Task/TaskAll";

function App() {
  return (
    <>
      <div>
        {
          /* <LoginPage /> */

          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="/taskTeam" element={<TaskAll />} />
            </Route>

            {/* <Route index element={<RecentActivity />} /> */}
            {/* <Route path="project/:id" element={<Project />} /> */}
            {/* </Route> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        }
      </div>
    </>
  );
}

export default App;
