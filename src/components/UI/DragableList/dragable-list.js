import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import cn from 'classnames';
import StrictModeDroppable from "~/components/StrictModeDroppable";
import { _ } from '~/utils';
import { DraggableListStyled } from "./dragable-list.styled";

const grid = 2;

const getItemStyle = (isDragging, draggableStyle, selected) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 0,
  margin: `0 0 0px 0`,
  cursor: 'default',
  borderRadius: '5px',
  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
  padding: grid,
  borderRadius: '5px',
  width: '100%',
});

const DragableList = ((props) => {
  const { data, getItem = _.noop, onDraggingStart = _.noop, onChange = _.noop, isDragDisabled = false } = props;
  const [items, setItems] = useState(data || []);
  const [dragStart, setDragStart] = useState(false);
  const [draggableItemId, setDraggableItemId] = useState();

  useEffect(() => {
    const nextList = _.map(data, (item, index) => ({
      id: `item-${index}`,
      data: item,
    }));
    setItems(nextList);
  }, [data]);

  const onDragEnd = (dragged) => {
    const { source, destination } = dragged;

    if (destination) {
      const adjustItems = [...items];
      const [removed] = adjustItems.splice(source.index, 1);
      adjustItems.splice(destination.index, 0, removed);
      setItems([...adjustItems]);
      onChange(adjustItems);
    }
    setDragStart(false);
  };

  const onDragStart = (dragged, a) => {
    const { draggableId } = dragged;
    const element = _.find(items, item => item.id === draggableId);
    if (element) {
      onDraggingStart(element.data);
    }
    setDragStart(true);
    setDraggableItemId(draggableId);
  };

  return (
    <DraggableListStyled>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <StrictModeDroppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={isDragDisabled}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        item.selected
                      )}
                    >
                      <div
                        className={cn("list-item", { "drag": dragStart && draggableItemId === item.id })}
                      >{getItem(item.data)}</div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </DraggableListStyled>
  );
});

export default DragableList;
