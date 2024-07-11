import styled from "@emotion/styled";

export const LoadingMessage = styled('div')`
  /* opacity: 0;
  transition: opacity 100ms; */
  /* &.loading { */
    //opacity: 1;
    margin: auto;
    display: inline-block;
    padding: 1px 9px;
    border-radius: 7px;
    background-color: #ffebc0;
    position: absolute;
    top: 1px;
    font-size: 10px;
    transform: translate(-50%, 4px);
    margin-left: 50%;
    color: #271c1c;
    z-index: 99999999;
  /* } */
`;

export const LinerLoader = styled('div')`
  &.show {
    animation-duration: 1s;
    animation-name: move-horizontal;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    opacity: 0.5;

  }
  opacity: 0;
  transition: opacity 100ms;
  top: 1px;
  position: relative;
  z-index: 10000000;
  height: 3px;
  min-height: 3px;
  background: rgb(255,166,0);
  background: radial-gradient(circle, rgba(255,166,0,0.742734593837535) 31%, rgba(121,80,9,0.6446953781512605) 51%, rgba(11,123,232,0.1741071428571429) 97%);
  @keyframes move-horizontal {
  from {
    transform: translateX(-60%);
  }
  to {
    transform: translateX(80%);
  }
}

`;