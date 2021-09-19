import * as React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { initialBoardData } from "../data/board-initial-data";
import { BoardColumn } from "./board-column";

// set of color for column title
const bgColor = ["#FB7D44", "#2A92BF", "#F4CE46", "#00B961"];

// Board Element
const BoardEl = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const IntroWrapper = styled.div`
  text-align: center;
  color: #fff;
  margin-top: 5%;
  margin-bottom: 5%;
`;

export class Board extends React.Component {
  state = {
    data: initialBoardData, // dataset
    ColumnDroppable: false, // when dragging tasks, columns are not droppable
    itemDroppable: false, // when dragging column, tasks are not droppable
  };

  // Handle edit content of tasks
  editContent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // get edited item
      let target = event.target as HTMLInputElement;
      let itemId = target.id;
      let itemContent = target.value;
      // updated content of item
      const newState = {
        ...this.state.data,
        items: {
          ...this.state.data.items,
          [itemId]: { id: itemId, content: itemContent },
        },
      };
      this.setState({ data: newState });
      // press enter, lose focus
      (event.target as HTMLInputElement).blur();
    }
  };

  // Handle adding new Tasks
  addNewTask = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const itemContent = (event.target as HTMLInputElement).value;
      // Do nothing if no typing in textField
      if (itemContent === "") return;
      // auto generate item_id
      let itemIndex = Object.keys(this.state.data.items).length + 1;
      let itemId: string = "item-" + itemIndex;
      // get column_id that needed to add task
      let colName = document.getElementById("add-content");
      if (colName !== null && colName.innerHTML !== undefined) {
        let columnId = colName.innerText;
        // update column itemsIds list
        const columnAdd = (this.state.data.columns as any)[columnId];
        const newItemsIds = Array.from(columnAdd.itemsIds);
        newItemsIds.push(itemId);
        // update column
        const newColumnAdd = {
          ...columnAdd,
          itemsIds: newItemsIds,
        };
        //update data
        const newState = {
          ...this.state.data,
          items: {
            ...this.state.data.items,
            [itemId]: { id: itemId, content: itemContent },
          },
          columns: {
            ...this.state.data.columns,
            [columnId]: newColumnAdd,
          },
        };
        this.setState({ data: newState });
      }
    }

    // put the new added item into column-4 by default
  };

  // handgle dragging tasks and dragging columns
  onDragStart = (result: any) => {
    // get current dragging element id
    const { draggableId } = result;
    // when dragging tasks, disable column dragging
    if (draggableId.includes("item")) {
      this.setState({ ColumnDroppable: true });
      this.setState({ itemDroppable: false });
    }
    // when dragging columns, disable item dragging
    if (draggableId.includes("column")) {
      this.setState({ itemDroppable: true });
      this.setState({ ColumnDroppable: false });
    }
  };

  // Handle drag & drop
  onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;
    // Do nothing if tasks is dropped outside the list
    if (!destination) return;
    // check if columns dragging tasks - invalid
    if (
      source.droppableId === "columns-dragging" &&
      destination.droppableId !== "columns-dragging"
    )
      return;
    // check if tasks dragging columns - invalid
    if (
      source.droppableId !== "columns-dragging" &&
      destination.droppableId === "columns-dragging"
    )
      return;

    // handle drag & drop between columns
    if (draggableId.includes("column")) {
      const newcolumnsOrder = this.state.data.columnsOrder;
      // change columns order
      let temp = newcolumnsOrder[source.index];
      newcolumnsOrder[source.index] = newcolumnsOrder[destination.index];
      newcolumnsOrder[destination.index] = temp;
      // change bgColor order
      let tmp = bgColor[source.index];
      bgColor[source.index] = bgColor[destination.index];
      bgColor[destination.index] = tmp;
      // update data
      const newState = {
        ...this.state.data,
        columnsOrder: newcolumnsOrder,
      };
      this.setState({ data: newState });
    }

    // handle drag & drop between tasks
    if (draggableId.includes("item")) {
      // Do nothing if the item is dropped into the same place
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      // Find column from which the item was dragged from
      const columnStart = (this.state.data.columns as any)[source.droppableId];

      // Find column in which the item was dropped
      const columnFinish = (this.state.data.columns as any)[
        destination.droppableId
      ];

      // Moving items in the same list
      if (columnStart === columnFinish) {
        // Get all item ids in currently active list
        const newItemsIds = Array.from(columnStart.itemsIds);

        // Remove the id of dragged item from its original position
        newItemsIds.splice(source.index, 1);

        // Insert the id of dragged item to the new position
        newItemsIds.splice(destination.index, 0, draggableId);

        // Create new, updated, object with data for columns
        const newColumnStart = {
          ...columnStart,
          itemsIds: newItemsIds,
        };

        // Create new board state with updated data for columns
        const newState = {
          ...this.state.data,
          columns: {
            ...this.state.data.columns,
            [newColumnStart.id]: newColumnStart,
          },
        };

        // Update the board state with new data
        this.setState({ data: newState });
      } else {
        // Moving items from one list to another
        // Get all item ids in source list
        const newStartItemsIds = Array.from(columnStart.itemsIds);

        // Remove the id of dragged item from its original position
        newStartItemsIds.splice(source.index, 1);

        // Create new, updated, object with data for source column
        const newColumnStart = {
          ...columnStart,
          itemsIds: newStartItemsIds,
        };

        // Get all item ids in destination list
        const newFinishItemsIds = Array.from(columnFinish.itemsIds);

        // Insert the id of dragged item to the new position in destination list
        newFinishItemsIds.splice(destination.index, 0, draggableId);

        // Create new, updated, object with data for destination column
        const newColumnFinish = {
          ...columnFinish,
          itemsIds: newFinishItemsIds,
        };

        // Create new board state with updated data for both, source and destination columns
        const newState = {
          ...this.state.data,
          columns: {
            ...this.state.data.columns,
            [newColumnStart.id]: newColumnStart,
            [newColumnFinish.id]: newColumnFinish,
          },
        };

        // Update the board state with new data
        this.setState({ data: newState });
      }
    }
  };
  render() {
    return (
      <div>
        <IntroWrapper>
          <h1> Welcome to Vicky's Coding Test </h1>
          <h3> Completed at 19/09/2021 </h3>
        </IntroWrapper>
        <DragDropContext
          onDragEnd={this.onDragEnd}
          onDragStart={this.onDragStart}
        >
          <Droppable
            droppableId="columns-dragging"
            direction="horizontal"
            isDropDisabled={this.state.ColumnDroppable}
          >
            {(provided) => (
              <BoardEl {...provided.droppableProps} ref={provided.innerRef}>
                {this.state.data.columnsOrder.map((columnId, index) => {
                  // Get id of the current column
                  const column = (this.state.data.columns as any)[columnId];

                  // Get item belonging to the current column
                  const items = column.itemsIds.map(
                    (itemId: string) => (this.state.data.items as any)[itemId]
                  );

                  // Render the BoardColumn component
                  return (
                    <BoardColumn
                      bgColor={bgColor[index]}
                      index={index}
                      key={column.id}
                      column={column}
                      items={items}
                      onkey={this.editContent}
                      AddonKey={this.addNewTask}
                      droppable={this.state.itemDroppable}
                    />
                  );
                })}
                {provided.placeholder}
              </BoardEl>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}
