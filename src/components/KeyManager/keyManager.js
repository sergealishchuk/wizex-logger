import { useEffect } from "react";
import { isBrowser } from "~/utils";
import { Observer } from "~/utils";

export default (props) => {
  useEffect(() => {
    const handlerKeyDown = (event) => {
      const { altKey, ctrlKey, shiftKey, keyCode } = event;
      const ESC = !(altKey && ctrlKey && shiftKey) && keyCode === 27;
      if (altKey || ESC) {
        Observer.send('onDocumentKeyDown', ESC ? 'ESC' : `ALT_${keyCode}`);
      } else if (ctrlKey) {
        console.log('ctrl + ', keyCode)
      }
    };

    document.addEventListener("keydown", handlerKeyDown, false);

    return () => {
      document.removeEventListener("keydown", handlerKeyDown);
    }
  }, []);

  return null;
};
