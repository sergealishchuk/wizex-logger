import React, { useState, useEffect } from "react";
import cn from "classnames";
import Fade from '@mui/material/Fade';
import { LinerLoader, LoadingMessage } from "./liner-spiner.styled";

/**
 * Spinner component
 * @param  {object} props React props object
 */
export default (props) => {
  const { show } = props;
  const [clickOnShadow, setClickOnShadow] = useState(false);

  //const show = true;

  useEffect(() => {
    setClickOnShadow(false);
  }, [show]);

  const handlerClickOnShadow = () => {
    setClickOnShadow(true);
  };

  return (
    <>
      <div onClick={handlerClickOnShadow} className={cn("spinner-container", { loading: clickOnShadow })} style={{ display: show ? 'block' : 'none' }}>
        <LinerLoader className={cn({ show })} />
      </div>
      <Fade in={clickOnShadow} timeout={500}>
        <LoadingMessage className={cn({ loading: clickOnShadow })}>
          Loading... Please wait!
        </LoadingMessage>
      </Fade>
    </>
  )
};
