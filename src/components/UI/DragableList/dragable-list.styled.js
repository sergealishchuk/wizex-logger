import styled from "@emotion/styled";

export const DraggableListStyled = styled('div')`
  display: flex;
  .list-item {
    cursor: default;
    background-color: #fbfbfb;
    &:hover {
      .item-wrapper {
        background-color: #f5f5f5;
      }
    }
    .item-wrapper {
      padding: 2px 6px;
      border-radius: 5px;
      transition: 50ms;
      &.active {
        background-color: #88aed2;
      }
    }
    &.drag {
      .item-wrapper {
        background-color: #e2e3e5;
        &.active {
          background-color: #88aed2;
        }
      }
    }
  }
`;

export const TopPathStyled = styled('div')`
  background-color: rgb(238, 238, 238);
  font-weight: bold;
  padding: 0px 6px;
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
`;