import * as React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import Modal from "@material-ui/core/Modal";
import AddTask from "./AddTask";

// Import BoardItem component
import { BoardItem } from "./board-item";

// Define types for board column element properties
type BoardColumnProps = {
  index: number;
  key: string;
  column: any;
  items: any;
  droppable: boolean;
  onkey: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  AddonKey:(event: React.KeyboardEvent<HTMLInputElement>,) => void;
  bgColor: string;
};

// Define types for board column content style properties
// This is necessary for TypeScript to accept the 'isDraggingOver' prop.
type BoardColumnContentStylesProps = {
  isDraggingOver?: boolean;
  isDragging?: boolean;
};

// Create styles for BoardColumnWrapper element
const BoardColumnWrapper = styled.div<BoardColumnContentStylesProps>`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.2);
  & + & {
    margin-left: 20px;
  }
`;
const AddButton = styled.button`
  outline:none;
  border: none;
  background-color: transparent;
  font-size: 30px;
  cursor: pointer;
  &:hover{
    border: null;
    color:white;
  }
`;
// Create styles for BoardColumnTitle element
const BoardColumnTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  height: 50px;
  line-height: 50px;
  color: #fff;
  
`;

// Create styles for BoardColumnContent element
const BoardColumnContent = styled.div<BoardColumnContentStylesProps>`
  margin: 5%;
  border-radius: 4px;
  min-height: 20px;
`;

// Create and export the BoardColumn component
export const BoardColumn: React.FC<BoardColumnProps> = (props) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Draggable draggableId={props.column.id} index={props.index}>
      {(provided1, snapshot1) => (
        <BoardColumnWrapper
          {...provided1.draggableProps}
          {...provided1.dragHandleProps}
          ref={provided1.innerRef}
          isDragging={snapshot1.isDragging}
        >
          <BoardColumnTitle style={{ backgroundColor: props.bgColor }}>
            {props.column.title}
            <AddButton onClick={handleOpen}> + </AddButton>
          </BoardColumnTitle>
          <Modal open={open} onClose={handleClose}>
            <AddTask title= {props.column.id} onkeyup={props.AddonKey} />
          </Modal>
          <Droppable
            droppableId={props.column.id}
            direction="vertical"
            isDropDisabled={props.droppable}
          >
            {(provided, snapshot) => (
              <BoardColumnContent
                {...provided.droppableProps}
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {props.items.map((item: any, index: number) => (
                  <BoardItem
                    key={item.id}
                    item={item}
                    index={index}
                    onkey={props.onkey}
                  />
                ))}
                {provided.placeholder}
              </BoardColumnContent>
            )}
          </Droppable>
        </BoardColumnWrapper>
      )}
    </Draggable>
  );
};
