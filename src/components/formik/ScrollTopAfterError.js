import { useEffect } from 'react'
import { useFormikContext } from 'formik'


export const ScrollToFieldError = ({
  scrollBehavior = { /*top: 0,*/ behavior: 'smooth', block: 'center' },
}) => {
  const { submitCount, isValid } = useFormikContext();
    useEffect(() => {
      window.scrollTo(scrollBehavior);
  }, [submitCount]);

  return null;
}

export default ScrollToFieldError;
