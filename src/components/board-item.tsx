import React, {useState} from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";


// Define types for board item element properties
type BoardItemProps = {
  index: number;
  item: any;
  onkey: (event:React.KeyboardEvent<HTMLInputElement>)=>void;
};

// Define types for board item element style properties
// This is necessary for TypeScript to accept the 'isDragging' prop.
type BoardItemStylesProps = {
  isDragging: boolean;
};

// Create style for board item element
const BoardItemEl = styled.div<BoardItemStylesProps>`
  padding: 8px;
  margin-top:10px;
  margin-bottom:15px;
  background-color:  ${(props) => props.isDragging ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.4)'};r
  border-radius: 4px;
  transition: background-color 0.25s ease-out;

  & + & {
    margin-top: 4px;
  }
`;

const EditInput = styled.input`
  border:none;
  background-color:transparent;
  color: #fff;
  height:30px;
  font-size:14px;
  fontWeight:bold;
  width:50%;

`;

// Create and export the BoardItem component
export const BoardItem = (props: BoardItemProps) => {
  const[content, setContent] = useState(props.item.content);
  return (
    <Draggable draggableId={props.item.id} index={props.index}>
      {(provided, snapshot) => (
        <BoardItemEl
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <EditInput
            id = {props.item.id}
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
            }}
            onKeyUp={props.onkey}
           
          />
        </BoardItemEl>
      )}
    </Draggable>
  );
};
