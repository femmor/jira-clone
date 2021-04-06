import React, { useState } from 'react'
import styled from 'styled-components'
import dataset from './dataset'
import Column from './components/Column'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

const App = () => {
  const [data, setData] = useState(dataset)

  // onDragEnd Method
  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result

    // Return if no destination
    if (!destination) {return}

    // If Source and Destination is the same
    if (destination.droppableId === source.droppableId && destination.index === source.index) {return}

    // If Dragging Columns - Horizontally
    if (type === 'column') {
      // Make a copy of the columns
      const newColumnOrder = Array.from(data.columnOrder)
      // Remove the column from it's original position using splice
      newColumnOrder.splice(source.index, 1)
      // Replace the column to it’s new position, again using splice.
      newColumnOrder.splice(destination.index, 0, draggableId)

      // Replace this new order in our state.
      const newState = {
        ...data,
        columnOrder: newColumnOrder
      }

      setData(newState)
      return;
    }

    // If dragging tasks
    // Initialize a start and finish point for our task
    const start = data.columns[source.droppableId]
    const finish = data.columns[destination.droppableId]

    // If dropped inside the same column
    if(start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      }

      const newState = {
        ...data,
        columns: {
            ...data.columns,
            [newColumn.id]: newColumn
          }
      }
      setData(newState)
      return;
    }

    //If dropped in a different column
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
        ...start,
        taskIds: startTaskIds
    }
    
    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
        ...finish,
        taskIds: finishTaskIds
    }

    const newState = {
        ...data,
        columns: {
            ...data.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
        }
    }

    setData(newState)

  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='all-columns' direction='horizontal' type='column'>
        {(provided) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {data.columnOrder.map((id, index) => {
              const column = data.columns[id]
              const tasks = column.taskIds.map(taskId => data.tasks[taskId])

              return (
                <Column key={column.id} column={column} tasks={tasks} index={index}>

                </Column>
              )
            })}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const Container = styled.div`
  display: flex;
`

export default App;
