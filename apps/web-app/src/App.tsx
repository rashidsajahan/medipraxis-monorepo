import { useState } from "react";
import { createApiClient } from "../../../packages/api-client/src";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  // Initialize the API client - Sample code
  const api = createApiClient(import.meta.env.VITE_API_URL);

  const testApiCall = async () => {
    try {
      const res = await (api as any).api.tasks.$get();
      const data = await res.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("API Call Error:", error);
    }
  };

  const testCreateTaskApiCall = async () => {
    try {
      const res = await (api as any).api.tasks.$post({
        json: {
          task_title: "Make the log notes on the diabetic patient",
          task_type_id: "24f21ec7-bf59-4c35-9c54-36cb24afafbe",
          client_id: "24f21ec7-bf59-4c35-9c54-36cb24afafb3",
          user_id: "2a3c19b8-d352-4b30-a2ac-1cdf993d3102",
          start_date: "2025-12-20T06:46:42.023",
          end_date: "2025-12-25T05:32:21.756",
          note: "Patient needs to monitor blood sugar levels daily.",
          set_alarm: false,
          task_status_id: "24f21ec7-bf59-4c35-9c54-36cb24afafba",
        },
      });
      const data = await res.json();
      console.log("Create Task API Response:", data);
    } catch (error) {
      console.error("Create Task API Call Error:", error);
    }
  };

  return (
    <>
      <button onClick={testApiCall}>Get Tasks API Call Test</button>
      <button onClick={testCreateTaskApiCall}>Create Task API Call Test</button>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
