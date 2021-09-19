import React, { useState } from "react";
import styled from "styled-components";

interface AddTaskProps {
  onkeyup: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  title: string;
}

const MessageWrapper = styled.div`
  position: absolute;
  top: 40%;
  left: 40%;
  background-color: #fff;
  width: 20%;
`;
const AddInput = styled.input`
  height: 30px;
  fontsize: 16px;
`;

export default function AddTask(prop: AddTaskProps) {
  const [content, setContent] = useState("");
  return (
    <MessageWrapper>
      <div style={{ margin: "10%" }}>
        <h2 id="add-content"> {prop.title} </h2>
        <AddInput
          id="add-content"
          value={content}
          placeholder="Add Content Here"
          onChange={(event) => {
            setContent(event.target.value);
          }}
          onKeyUp={prop.onkeyup}
        />
      </div>
    </MessageWrapper>
  );
}
