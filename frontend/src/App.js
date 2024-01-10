import FormSubmissionPage from "./Components/FormSubmissionPage"
import LoginPage from "./Components/LoginPage"
import RegistrationPage from "./Components/RegistrationPage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/signup" element={<RegistrationPage/>}/>
          <Route path="/home" element={<FormSubmissionPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
