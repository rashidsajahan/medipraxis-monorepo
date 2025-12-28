import { useState } from "react";
import "./App.css";
import "./components/forms/form.css";
import { FormDemo } from "./pages/FormDemo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <FormDemo />
    </div>
  );
}

export default App;
