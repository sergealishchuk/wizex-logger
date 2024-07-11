import { _ } from '~/utils';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Dropzone from "react-dropzone";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import ImgHelper from '~/utils/img_helper';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'next-i18next';

/* EXAMPLES
let = myBase64image;

const file = [File Object];
let reader = new FileReader();
reader.onloadend = () => {
  // set to someplace reader.result
  console.log('reader.resulst as 64base:', reader.result);
  myBase64image = reader.result;
}
reader.readAsDataURL(file);

---------
// Size of image:
const getImgSize =  (imageSrc, cb) => {
  const img = new Image();
  img.src = imageSrc;
  img.onload = ({target}) => {
    let width = target.width;
    let height = target.height;
    console.log('w h = ', width, height);
    cb({width, height});
  };
};
*/

const UploadFiles = forwardRef((props, ref) => {
  const { onChange = _.noop, options } = props;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(['file_upload', 'buttons']);

  useImperativeHandle(ref, () => ({
    clearAll() {
      setSelectedFiles([]);
    }
  }));

  useEffect(() => {
    onChange(selectedFiles);
  }, [selectedFiles]);

  const optFile = async (file) => {
    /**
     * options: {
     *  maxWidth,
     *  maxHeight,
     * }
     */
    const blob = await ImgHelper.opt(file, options);
    return ({
      name: file.name,
      originalSize: file.size,
      size: blob.size,
      blob,
      thumb: URL.createObjectURL(blob),
    });
  };

  const onDrop = (appendFiles) => {
    const files = _.filter(appendFiles, (file) => /^image\//.test(file.type));
    if (appendFiles.length > files.length) {
      enqueueSnackbar(t('only_images', { ns: "file_upload" }), { variant: 'info' });
    };

    const transform = (files) => {
      const result = _.map(files, (file) => {
        const blobSection = optFile(file);
        return blobSection;
      });
      return result;
    };

    const getFilesList = async () => {
      Observer.send('SpinnerShow', true);
      const filesList = transform(files);
      const arrFiles = [...selectedFiles];
      for (let i = 0; i < filesList.length; ++i) {
        arrFiles.push(await filesList[i]);
      };
      Observer.send('SpinnerShow', false);
      const uniqImgs = _.uniqBy(arrFiles, (img) => {
        return `${img.name} ${img.size} ${img.originalSize} ${img.blob.type}`;
      });

      if (uniqImgs.length < arrFiles.length) {
        enqueueSnackbar(t('duplicate_found', { ns: 'file_upload' }), { variant: 'info' });
      }
      setSelectedFiles(uniqImgs);
    };

    getFilesList();
  };

  const handleRemoveAllUploaded = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedFiles([]);
  };

  const handleRemoveUploadedImg = (event, index) => {
    event.preventDefault();
    event.stopPropagation();
    const nextList = [...selectedFiles];
    nextList.splice(index, 1);
    setSelectedFiles(nextList);
  }

  return (
    <div>
      <Dropzone onDrop={onDrop} preventDropOnDocument={false}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              {selectedFiles && selectedFiles.length > 0 ? (
                <>
                  <div className="selected-file" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {selectedFiles && selectedFiles.map((file, index) => {
                      return (
                        <div key={`${file.name}${index}`} className="unselect" style={{ display: 'flex', flexDirection: 'column', margin: '10px', alignItems: 'center' }}>
                          <img src={`${file.thumb}`} width="60" height="60" />
                          <Button variant="outlined"
                            color="error"
                            style={{ marginTop: '6px', padding: 0, color: 'red', width: '50px', textTransform: 'capitalize', fontSize: '9px' }}
                            onClick={(event) => handleRemoveUploadedImg(event, index)}>
                            {t('remove', { ns: 'buttons' })}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                  {selectedFiles.length > 1 && (
                    <div style={{ textAlign: 'center', marginTop: '20px', height: '40px' }}>
                      <Fade in={selectedFiles.length > 1} timeout={1000}>
                        <Button variant="outlined"
                          color="error"
                          style={{ marginTop: '6px', padding: 0, color: 'red', height: '30px', width: '50px', textTransform: 'capitalize', fontSize: '9px' }}
                          onClick={handleRemoveAllUploaded}>
                          {t('remove_all', { ns: 'buttons' })}
                        </Button>
                      </Fade>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CloudUploadIcon style={{ fontSize: '20px', color: '#c6c6cf' }} />
                  <span className="unselect">{t('drag_and_drop', { ns: 'file_upload' })}</span>
                </div>
              )}
              <div style={{
                marginBottom: '-6px',
                padding: '3px 0',

              }}><span style={{
                borderRadius: '5px',
                backgroundColor: '#008200',
                color: 'white',
                fontSize: '13px',
                maxWidth: '70px',
                padding: '2px 10px'
              }}>{t('select_file', { ns: 'file_upload' })}</span></div>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
});

export default UploadFiles;
