import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Formik, FieldArray, Form } from 'formik';
import Grid from '@mui/material/Grid';
import TextField from '~/components/formik/TextField';
import { ArticleSelector } from '.';
import { useField } from 'formik';
import { useTranslation } from 'next-i18next';
import { _ } from '~/utils';
import { EDIT_MODE } from '~/constants';
import { useRouter } from 'next/router';
import guiConfig from "~/gui-config";

const { imagesUrl } = guiConfig;

/*
  Strucutre:
  {
    title: '',
    description: '',
    keywords: [],
    images: [[path, test],[..,..]],
  }  
*/

const SeoForm = (props) => {
  const {
    name,
    entitiesList,
    mode,
    originalSeoValue,
    images = [],
    imagePathes,
    componentsInitialized = true,
  } = props;

  const [field, meta, { setValue, ...rest }] = useField(name);
  const [entitiesField, setEntitiesField] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [seoImagesList, setSeoImagesList] = useState();
  const [mainImagesListLoaded, setMainImagesListLoaded] = useState(false);
  const [values, setValues] = useState({});

  const { t } = useTranslation(['buttons', 'attributes']);
  const { locale } = useRouter();

  const refFormik = useRef(null);

  useEffect(() => {
    if (componentsInitialized) {
      setMainImagesListLoaded(true);
    }
  }, [componentsInitialized]);

  useLayoutEffect(() => {
    let parsedValue = {};
    if (mode === EDIT_MODE) {
      try {
        parsedValue = JSON.parse(originalSeoValue);
      } catch (e) { };
    }

    const adjustSeoList = _.map(entitiesList, entity => {
      return ({
        name: entity.name,
        label: entity[`label_${locale}`],
        value: parsedValue[entity.name] || entity.defaultValue,
        type: entity.type,
      })
    });

    const { resetForm } = refFormik.current;
    resetForm();
    setEntitiesField(adjustSeoList);

    const adjustValue = {};
    _.each(adjustSeoList, item => {
      adjustValue[item.name] = item.value;
    });

    if (adjustValue.images) {
      setSeoImagesList(adjustValue.images);
    }
    setInitialValues(adjustValue);
  }, [entitiesList]);

  useEffect(() => {
    let images = [];
    if (values.images) {
      if (values && _.isArray(values.images)) {
        images = _.map(values.images, item => [item[0], item[1]]);
      }
    }
    setValue(JSON.stringify({
      ...values,
      images: initialValues.images ? images : undefined,
    }));
  }, [values]);


  useEffect(() => {
    const { images: seoImages } = values;
    if (seoImages && mainImagesListLoaded) {
      if (seoImages.length !== images.length) {
        _.each(seoImages, item => {
          if (!_.find(images, img => img.path === item[0])) {
            _.remove(values.images, el => el[0] === item[0]);
          }
        })
      }
    }
  }, [images]);

  return (
    <div>
      <Formik
        innerRef={refFormik}
        initialValues={
          initialValues
        }
        validateOnBlur={false}
        enableReinitialize
      >
        {(props) => {
          const { values } = props;
          setValues(values);
          return (
            <Form>
              <Grid container>
                {
                  _.map(entitiesField, (entity, index) => (
                    <Grid key={entity.name} item xs={12} style={{ marginBottom: entitiesField.length - 1 > index ? '16px' : '0px' }}>
                      {
                        entity.type === 'TextArea' && (
                          <TextField
                            name={entity.name}
                            label={entity.label}
                            type="text"
                            multiline
                            minRows={1}
                            InputLabelProps={{ shrink: true }}
                          />
                        )
                      }
                      {
                        entity.type === 'ArrayOfObject' && (
                          <div>
                            <div style={{ padding: '4px 4px', marginBottom: '8px', borderBottom: '1px #c9c9c9 solid', fontSize: '14px' }}>{entity.label}</div>
                            <FieldArray name={entity.name}>
                              <div>
                                {
                                  _.map(values[entity.name], (img, index) => {
                                    return (
                                      <div>
                                        <Grid container>
                                          <Grid xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img src={`${imagesUrl}${img[0]}`} width="40" height="40" />
                                          </Grid>
                                          <Grid xs={10} style={{ margin: '8px 0' }}>
                                            <TextField
                                              name={`images.${index}.1`}
                                              label={'ALT'}
                                              type="text"
                                              multiline
                                              minRows={1}
                                              InputLabelProps={{ shrink: true }}
                                            />
                                          </Grid>
                                        </Grid>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            </FieldArray>
                          </div>
                        )
                      }
                      {
                        entity.type === 'Article' && (
                          <div>
                            <ArticleSelector
                              name="article"
                              label="Article"
                            />
                          </div>
                        )
                      }
                    </Grid>))
                }
              </Grid>
            </Form>
          )
        }}
      </Formik>
    </div>
  );
}

export default SeoForm;
