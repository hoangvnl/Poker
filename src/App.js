import { useState } from "react";
import TextField from "@mui/material/TextField";
import "./App.css";
import Poker from "./components/poker/poker.tsx";
import { Button } from "@mui/material";
const App = () => {
  const [members, setMember] = useState([]);
  const [value, setValue] = useState("");
  const handleOnChange = (event) => {
    setValue(event.target.value);
  };

  const handleGo = () => {
    if (value) {
      const temp = value.split("\n");
      const result = [];
      temp.forEach((e) => {
        if (e) result.push(e);
      });
      setMember(result);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {members.length > 0 ? (
          <Poker members={members} />
        ) : (
          <>
            <h5>Thành viên</h5>
            <TextField
              multiline
              value={value}
              onChange={handleOnChange}
              sx={{ textarea: { color: "white" } }}
            />
            <Button onClick={handleGo}>Go</Button>
          </>
        )}
      </header>
    </div>
  );
};

export default App;
