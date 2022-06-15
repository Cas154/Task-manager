import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Dashboard from "./Dashboard";
import TaskManager from "./TaskManager";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<TaskManager />} />
          <Route exact path="/Register" element={<Register />} />
          <Route exact path="/Reset" element={<Reset />} />
          <Route exact path="/Dashboard" element={<Dashboard />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
