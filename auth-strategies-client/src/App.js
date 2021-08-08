import React, { useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a href="http://localhost:5000/auth/google">Sign in with Google</a>
        <br />
        <button
          onClick={async () => {
            const result = await axios.get("http://localhost:5001/greetme", {
              withCredentials: true,
            });
            setName(result.data.fullName);
          }}
        >
          Greet me please
        </button>
        {name && <span>{`Hi, ${name}`}</span>}
      </header>
    </div>
  );
}

export default App;
