import { useState, useEffect } from 'react';
import DynamicEditor from '../ckeditor/dynamicEditor';
import { useField } from 'formik';
import { _ } from '~/utils';

const CKEditorForm = ({ name, id = 'editor', onInit = _.noop, ...otherProps }) => {
  const [inited, setInited] = useState();
  const [editorLoaded, setEditorLoaded] = useState();
  const [field, meta, { setValue }] = useField(name);
  const [dataChanged, setDataChanged] = useState(false);
  const { onChange: fieldOnChange, value, ...restFields } = field;

  useEffect(() => {
    if (!inited && editorLoaded && !dataChanged) {
      if (value.length > 0) {
        window.CKEDITOR.instances[id].setData(value, () => {
          let value1 = value.replace(/\r\n/g, '\n');
          if (!/\n$/.test(value)) {
            value1 = value1 + '\n';
          }
          window.CKEDITOR.instances[id].setData(value1);
          window.CKEDITOR.instances[id].updateElement();
          window.CKEDITOR.instances[id].resetDirty();
        });
        setInited(true);
      }
    }
  }, [editorLoaded, value]);

  const handleEditorLoaded = () => {
    window.CKEDITOR.instances[id].on('change', (event) => {
      const data = event.editor.getData();
      setValue(data);
      setDataChanged(true);
    });
    setEditorLoaded(true);
  };

  const configTextField = {
    fullWidth: true,
    variant: 'outlined',
    ...restFields,
    ...otherProps
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  };

  return (
    <>
      <div id={id} />
      <DynamicEditor id={id} onLoaded={handleEditorLoaded} />
    </>
  )
}

export default CKEditorForm;
