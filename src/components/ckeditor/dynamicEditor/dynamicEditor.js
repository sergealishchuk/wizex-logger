import { useEffect, useState } from 'react';
import Script from 'next/script';


// var data = CKEDITOR.instances.editor.getData();
// CKEDITOR.instances.editor.setData(data);

// CKEDITOR.instances.editor.on('change',function(event){
//  console.log("test",event.editor.getData());
// });

const initSample = function (id, onLoaded) {
  var wysiwygareaAvailable = isWysiwygareaAvailable();

  return function () {
    var editorElement = CKEDITOR.document.getById(id);

    // Depending on the wysiwygarea plugin availability initialize classic or inline editor.
    if (wysiwygareaAvailable) {
      CKEDITOR.replace(id);
    } else {
      editorElement.setAttribute('contenteditable', 'true');
      CKEDITOR.inline(id);
    }
    onLoaded(id);
  };

  function isWysiwygareaAvailable() {
    // If in development mode, then the wysiwygarea must be available.
    // Split REV into two strings so builder does not replace it :D.
    if (CKEDITOR.revision == ('%RE' + 'V%')) {
      return true;
    }

    return !!CKEDITOR.plugins.get('wysiwygarea');
  }
};

export default function DynamicEditor(props) {
  const { id = 'editor', onLoaded} = props;

  useEffect(() => {
    if (window.CKEDITOR) {
      initSample(id, onLoaded)();
    }
  }, []);

  if (typeof(window) === 'undefined') {
    return null;      
  }

  return (
    <>
      <Script
        id="ckEditor"
        src="https://storage.alioks.com/img/aoks2/scripts/ckeditor.js"
        onError={(err) => {
          console.error('Error', err)
        }}
        onLoad={() => {
          // Function to perform after loading the script
          if (CKEDITOR.env.ie && CKEDITOR.env.version < 9)
            CKEDITOR.tools.enableHtml5Elements(document);

          // The trick to keep the editor in the sample quite small
          // unless user specified own height.
          CKEDITOR.config.height = 150;
          CKEDITOR.config.width = 'auto';
          CKEDITOR.config.allowedContent = true; // Allow only for vip users
          initSample(id, onLoaded)();
        }}
      />
    </>
  );
};
