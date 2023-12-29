import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Components/Login";
import Register from "./Components/Register";

function App() {
  const [hasAccount, setHasAccount] = useState(true);
  const toggleHasAccount = async () => {
    setHasAccount((current) => !current);
  };

  return (
    <div className="App">
      {hasAccount ? (
        <Login toggleHasAccount={toggleHasAccount} />
      ) : (
        <Register toggleHasAccount={toggleHasAccount} />
      )}
    </div>
  );
}

export default App;
