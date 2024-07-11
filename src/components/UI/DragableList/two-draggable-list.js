import ReactDOM from 'react-dom';
import { useState, useLayoutEffect } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import cn from 'classnames';
import StrictModeDroppable from "~/components/StrictModeDroppable";
import { _ } from '~/utils';
import { TopPathStyled } from "./dragable-list.styled";
import { SettingsInputComponent } from "@mui/icons-material";

const grid = 2;

const getListNameByDroppableId = id => id.slice(id.search(/_/) + 1);

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[getListNameByDroppableId(droppableSource.droppableId)] = sourceClone;
  result[getListNameByDroppableId(droppableDestination.droppableId)] = destClone;

  return result;
};

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
  height: '100%',
  backgroundColor: isDraggingOver ? '#f9f9f9' : 'white'
});

const TwoDragableList = ((props) => {
  const { activeIndex, topComponent = [], topPath = [], datas, getItem = _.noop, onDraggingStart = _.noop, onChange = _.noop, onSelectPanel = _.noop, isDragDisabled = false } = props;
  const [items, setItems] = useState({});
  const [dragStart, setDragStart] = useState(false);
  const [draggableItemId, setDraggableItemId] = useState();

  useLayoutEffect(() => {
    const lists = {};
    let counterItem = 0;
    _.each(datas, (list, index) => {
      lists[`list_${index}`] = _.map(list, (item, index) => {
        return ({
          id: `item-${++counterItem}`,
          data: item,
        })
      })
    });

    setItems(lists);
  }, [datas]);

  const getList = (list) => items[getListNameByDroppableId(list)];

  const onDragEnd = (dragged) => {
    const { source, destination } = dragged;

    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const adjustItems = getList(source.droppableId); //[...items];
      const [removed] = adjustItems.splice(source.index, 1);
      adjustItems.splice(destination.index, 0, removed);
      const updateList = { [`${source.droppableId.slice(source.droppableId.search(/_/) + 1)}`]: adjustItems };
      const nextItems = {
        ...items,
        ...updateList,
      }
      setItems(nextItems);
      onChange(updateList, {
        ...dragged,
        draggedItem: Object.values(nextItems).flat().filter(item => item.id === dragged.draggableId)
      });
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );
      const nextItems = {
        ...items,
        ...result,
      }

      setItems(nextItems);
      onChange(nextItems, {
        ...dragged,
        draggedItem: Object.values(nextItems).flat().filter(item => item.id === dragged.draggableId)
      });
    }
  };

  const onDragStart = (dragged) => {
    const { draggableId } = dragged;
    const element = _.find(items, item => item.id === draggableId);
    if (element) {
      onDraggingStart(element.data);
    }
    setDragStart(true);
    setDraggableItemId(draggableId);
  };

  const handleClickPanel = (event, panelId) => {
    if (event.target.classList.contains('draggable-container')) {
      try {
        const panelIndex = Number(panelId.split('_')[1]);
        onSelectPanel(panelIndex);
      } catch (e) { };
    }
  }

  let counter = 0;

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      {
        _.map(items, (list, index) => {
          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '50%', padding: '0px', margin: '0px', border: '1px #d8d8d8 solid' }}>
              <div style={{ backgroundColor: 'white', position: 'sticky', top: 0, padding: '1px', borderBottom: '1px gray solid' }}>
                <TopPathStyled style={{backgroundColor: activeIndex === counter ? '#ededed' : '#f5f5f5'}}>
                  <span>{topPath[counter]}</span>
                </TopPathStyled>
              </div>
              <div>
                {topComponent[counter++]}
              </div>
              <StrictModeDroppable droppableId={`droppable_${index}`}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    className="draggable-container"
                    onClick={(event) => handleClickPanel(event, index)}
                  >
                    {list.map((item, index) => (
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
                            >{getItem(item.data, counter)}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </div>
          )
        })
      }
    </DragDropContext>
  );
});

export default TwoDragableList;
