import React from "react";
import "./App.css";
import {Container} from "semantic-ui-react";
import ToDoList from "./To-Do-List.js";

function App() {
  return (
    <div>
      <Container>
        <ToDoList/>
      </Container>
    </div>
  );
}

export default App;