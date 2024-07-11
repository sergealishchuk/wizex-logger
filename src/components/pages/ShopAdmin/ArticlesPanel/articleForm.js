import React, { useState, useEffect, useMemo, useRef } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Fade from '@mui/material/Fade';
import DescriptionIcon from '@mui/icons-material/Description';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { adminService } from '~/http/services';
import TextField from '~/components/formik/TextField';
import Link from '~/components/Link';
import { _, getLocalDate, confirmDialog } from '~/utils';
import ScrollTopAfterError from '~/components/formik/ScrollTopAfterError';
import { useSnackbar } from 'notistack';
import { EDIT_MODE, ADD_MODE, DIALOG_ACTIONS } from '~/constants';
import CKEditorForm from '~/components/formik/CKEditorForm';
import SubmitController from '~/components/formik/SubmitController';
import { ErrorMessages } from '~/components/ErrorMessages';
import { ButtonSectionStyled } from '~/components/StyledComponents';
import CollapseBlock from '~/components/CollapseBlock';
import store from '~/utils/store';
import { UI_VARIABLES } from '~/constants';
import { useTranslation } from 'next-i18next';
import { pushResponseMessages } from '~/utils';
import { FlexContainer } from '~/components/StyledComponents';

import { TagsAutocomplete } from './components';

import { StyledStatus, IconAddStyled, IconEditStyled, StatusEditBlock } from './article.styled';

const { DESCRIPTION_COLLAPSE } = UI_VARIABLES;

const ArticleForm = (props) => {
  const { mode, data } = props;
  let articleId;
  if (mode === EDIT_MODE) {
    articleId = _.get(data, 'articleId');
  }
  const [errors, setErrors] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [componentsInitialized, setComponentsInitialized] = useState(false);
  const [openDescription, setOpenDescription] = useState(true);
  const [formChanged, setFormChanged] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [articleRecord, setArticleRecord] = useState();
  const [status, setStatus] = useState();
  const [hasBeenEdited, setHasBeenEdited] = useState();

  const { t } = useTranslation(['articles', 'buttons']);

  const router = useRouter();
  const { locale } = router;

  const refFormik = useRef(null);

  const validationSchema = yup.object().shape({
    articleTitle: yup
      .string(t('enter_article_tilte', { ns: 'articles' }))
      .required(t('article_titile_is_required', { ns: 'articles' }))
      .min(2, t('title_length_too_less', { ns: 'articles' }))
      .max(255, t('title_length_too_long', { ns: 'articles' }))
  });

  const [initialValues, setInitialValues] = useState({
    articleTitle: '',
    tags: [],
    description: '',
  });

  const getArticle = async ({ articleId }) => {
    const articleRequest = await adminService.getArticle({ articleId });
    if (articleRequest.ok) {
      const articleRecord = articleRequest.data;
      setArticleRecord(articleRecord);
      setStatus(articleRecord.bodyEdited === null ? 1 : 0);
      await getArticleTagsRequest();
      return {
        article: articleRecord,
      }
    }
  };

  const addArticleRequest = async (values) => {
    const addArticleResult = await adminService.addArticle({
      ...values,
    });
    pushResponseMessages(addArticleResult);
    return addArticleResult;
  };

  const updateArticleRequest = async (values) => {
    const udpateArticleResult = await adminService.updateArticle({
      ...values,
      articleId,
    });
    pushResponseMessages(udpateArticleResult);
    return udpateArticleResult;
  };

  const getArticleTagsRequest = async () => {
    const articlesTagsResult = await adminService.getArticlesTags();
    pushResponseMessages(articlesTagsResult);
    if (articlesTagsResult.ok) {
      const { tags } = articlesTagsResult;
      setTagsList(tags);
      return tags;
    }
  };

  const initializeArticleForm = async () => {

    const tagsList = await getArticleTagsRequest();

    if (mode === EDIT_MODE) {
      const { article } = await getArticle({ articleId });

      const hasBeenEdited = Boolean(article.bodyEdited !== null);
      setHasBeenEdited(hasBeenEdited);

      const currentBody = article[hasBeenEdited ? 'bodyEdited' : 'body'];

      const tranformedDescription = currentBody.replace(/\r\n/g, '\n').trim();
      let initialData = {
        articleTitle: article[hasBeenEdited ? 'titleEdited' : 'title'],
        description: tranformedDescription ? tranformedDescription + '\n' : '',
        tags: article[hasBeenEdited ? 'tagsEdited' : 'tags'],
      }
      setInitialValues(initialData);
      setSelectedTags(tagsList.filter(item => article[hasBeenEdited ? 'tagsEdited' : 'tags'].includes(item.id)));
    }
  };

  useEffect(() => {
    initializeArticleForm();
  }, []);

  const onSubmit = (values, propsForm) => {
    const { setSubmitting, resetForm } = propsForm;
    const saveArticle = async () => {
      const { description } = values;
      const body = !/\n$/.test(description) ? description + '\n' : description;

      if (mode === ADD_MODE) {
        const addArticleResult = await addArticleRequest({
          ...values,
          description: body,
        });
        if (addArticleResult.ok) {
          const { newArticle: { id: articleId } } = addArticleResult.result;
          resetForm();
          router.push(`/admin/articles_panel/view/${articleId}/?type=original`);
        }
      } else if (mode === EDIT_MODE) {
        const updateArticleResult = await updateArticleRequest({
          ...values,
          description: body
        });
        if (updateArticleResult.ok) {
          resetForm();
          router.push(`/admin/articles_panel/view/${articleId}/?type=edited`);
        }
      }
    }
    saveArticle();
  };

  const handleExpandActionDescription = (expandId, expand) => {
    const nextState = !expand;
    setOpenDescription(nextState);
    store.set(DESCRIPTION_COLLAPSE, nextState);
  };

  const handleFormChanged = (value) => {
    setFormChanged(value);
  };

  const handleTagsChange = (tags, setFieldValue) => {
    setFieldValue('tags', tags.map(item => item.id));
    setSelectedTags(tags);
  }
  return (
    <div style={{ marginTop: '26px', visibility: componentsInitialized ? 'visible' : 'visible'/*'hidden'*/ }}>
      <Fade in={true} timeout={100}>
        <div style={{ width: '100%' }}>
          <div>
            <ErrorMessages errors={errors} />
            <Formik
              innerRef={refFormik}
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
              enableReinitialize
              validateOnBlur={false}
            >
              {(props) => {
                const { errors, touched, setFieldValue, dirty, values } = props;
                return (
                  <Form>
                    <ScrollTopAfterError errors={props.errors} />
                    <Grid container spacing={{ xs: 2, md: 3 }} style={{ padding: 0 }}>
                      <Grid item xs={12} style={{ paddingTop: '13px' }}>
                        <Grid container spacing={{ xs: 4 }}>
                          <Grid item xs={12}
                            style={{
                              zIndex: 2,
                              backgroundColor: 'white',
                              top: '56px',
                              position: 'sticky',
                              paddingTop: '8px',
                              marginBottom: '16px',
                              boxShadow: '1px 2px 4px -1px rgba(143,143,143,0.75)'
                            }}>
                            <ButtonSectionStyled>
                              {
                                mode === EDIT_MODE
                                  ? <IconEditStyled />
                                  : <IconAddStyled />
                              }
                              <div style={{ marginLeft: 'auto', dispaly: 'flex', alignItems: 'center', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>
                                <div>
                                  {mode === EDIT_MODE && (
                                    <Link disabled={formChanged} href={`/admin/articles_panel/view/${articleId}/?type=${hasBeenEdited ? 'edited' : 'original'}`}>
                                      <Button
                                        variant="outlined"
                                        color="success"
                                        style={{ padding: '5px 15px', fontSize: '10px', minWidth: '100px', margin: '0 5px', whiteSpace: 'nowrap' }}
                                        disabled={formChanged}
                                      >
                                        {t('view_draft', { ns: 'buttons' })}
                                      </Button>
                                    </Link>
                                  )}

                                  <Button
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    color="success"
                                    style={{ padding: '5px 15px', color: 'white', minWidth: '110px', margin: '0 5px', fontSize: '10px' }}
                                    type="submit"
                                    disabled={!formChanged}
                                  >
                                    {t('save_article', { ns: 'buttons' })}
                                  </Button>
                                </div>
                              </div>
                            </ButtonSectionStyled>
                            {mode === EDIT_MODE && (
                              <FlexContainer jc="space-between">
                                <StatusEditBlock>
                                  {
                                    articleRecord && articleRecord.editedAd &&
                                    <div>Changed {getLocalDate(articleRecord.editedAt)}</div>
                                  }
                                </StatusEditBlock>
                                <StyledStatus style={{ color: status === 0 ? 'red' : 'green' }}>
                                  {
                                    status === 0 ? t('draft', { ns: 'articles' }) : t('published', { ns: 'articles' })
                                  }
                                </StyledStatus>
                              </FlexContainer>
                            )}
                          </Grid>
                          <Grid item xs={12} style={{ marginTop: '-24px' }}>
                            <TextField
                              name="articleTitle"
                              label={t('article_title', { ns: 'articles' })}
                              type="text"
                              multiline
                              minRows={1}
                              InputLabelProps={{ shrink: true }}
                              placeholder={t('input_article_title', { ns: 'articles' })}
                            />
                          </Grid>
                          <Grid item xs={12} style={{ paddingTop: 0 }}>
                            <TagsAutocomplete tagsList={tagsList} initTags={selectedTags} onChange={(tags) => handleTagsChange(tags, setFieldValue)} />
                          </Grid>
                          <Grid item xs={12} md={6} style={{ padding: 0 }}></Grid>
                          <Grid item xs={12}>
                            <CollapseBlock
                              title={t('article_content', { ns: 'articles' })}
                              expand={openDescription}
                              icon={<DescriptionIcon />}
                              expandAction={handleExpandActionDescription}
                            >
                              <CKEditorForm
                                id="article_editor"
                                name="description"
                              // TODO: Commented because reinit works not correctly
                              // There is a big problem - CKEDITOR changes data every time...
                              // Needs more deep investigate
                              // onInit={handleOnInitEditor}
                              />
                            </CollapseBlock>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <SubmitController name="ArticleForm" onFormChanged={handleFormChanged} />
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default ArticleForm;
