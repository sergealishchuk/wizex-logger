import { useState, useLayoutEffect, useEffect } from 'react';
import { useRouter } from 'next/router';

import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

import { adminService, goodsService } from '~/http/services';
import { confirmDialog, pushResponseMessages, getLocalDate, _ } from '~/utils';
import { FlexContainer, IconViewStyled } from '~/components/StyledComponents';
import { ButtonSectionStyled } from './article.styled';
import { useTranslation } from 'next-i18next';
import { DIALOG_ACTIONS } from '~/constants';
import { ArticleBody } from './components';

const EDIT_VERSION = 'edited';
const ACTUAL_VERSION = 'original';

const ARTICLE_REMOVE_OPERATION_TYPE = {
  DELETE: 'delete',
  REFUSE_CHANGES: 'refuse_changes',
};

const ArticleView = (props) => {
  const { articleId, type } = props.data;
  const [openConfirmRemoveProductAlert, setOpenConfirmRemoveProductAlert] = useState(false);
  const [status, setStatus] = useState();
  const [articleRecord, setArticleRecord] = useState();
  const [hasBeenEdited, setHasBeenEdited] = useState();
  const [showEdited, setShowEdited] = useState();
  const [data, setData] = useState({});
  const [tagsList, setTagsList] = useState();
  const [tagsListMap, setTagsMapList] = useState();
  const [viewMode, setViewMode] = useState('edited');
  const [published, setPublished] = useState();
  const [versionType, setVerisonType] = useState(type);

  const { t } = useTranslation(['buttons', 'articles']);

  const router = useRouter();

  useEffect(() => {
    setVerisonType(type);
  }, [type]);

  const getArticleTagsRequest = async () => {
    const articlesTagsResult = await adminService.getArticlesTags();
    pushResponseMessages(articlesTagsResult);
    if (articlesTagsResult.ok) {
      const { tags, tagsMap } = articlesTagsResult;
      setTagsList(tags);
      setTagsMapList(tagsMap);

      return tags;
    }
  };

  const getArticle = async ({ articleId }) => {
    const articleRequest = await adminService.getArticle({ articleId });
    if (articleRequest.ok) {
      await getArticleTagsRequest();
      const articleRecord = articleRequest.data;
      setArticleRecord(articleRecord);
      setStatus(articleRecord.active ? 1 : 0);
      const hasBeenEdited = articleRecord.bodyEdited !== null && articleRecord.editedAt !== null;
      setHasBeenEdited(hasBeenEdited);
      setPublished(articleRecord.published);
      setTimeout(() => {
        setShowEdited(hasBeenEdited);
      }, 0);
    }
  };

  useLayoutEffect(() => {
    if (articleRecord && !_.isEmpty(articleRecord)) {
      if (versionType === EDIT_VERSION) {
        setData({
          articleTitle: articleRecord.titleEdited,
          body: articleRecord.bodyEdited,
          tags: articleRecord.tagsEdited,
        });
      } else if (versionType === ACTUAL_VERSION) {
        setData({
          articleTitle: articleRecord.title,
          body: articleRecord.body,
          tags: articleRecord.tags,
        });
      }
    }
  }, [versionType, articleRecord]);

  useEffect(() => {
    getArticle({ articleId });
  }, []);

  const handlePublish = () => {

    const publishArticle = async () => {
      let result = await adminService.publishArticle({
        articleId,
        publish: !published
      });
      if (result && result.error) {
        const { error: { errors } } = result;
        pushResponseMessages(result);
      } else {
        if (result.ok) {
          router.push(`/admin/articles_panel/?tags=${articleRecord.tags.join(',')}&sort=updatedAtDesc`);
        }
      }
    };
    publishArticle();
  };

  const handleDeleteRefuseChangeForArticle = async (event, opType) => {
    event.preventDefault();

    let confirmed = false;
    const confirm = await confirmDialog({
      text: t(
        opType === ARTICLE_REMOVE_OPERATION_TYPE.REFUSE_CHANGES
          ? 'confirm_refuse_article_changes'
          : 'confirm_remove_article',
        { ns: 'articles' }
      ),
    });
    if (confirm === DIALOG_ACTIONS.CONFIRM) {
      confirmed = true;
    }

    if (confirmed) {
      if (opType === ARTICLE_REMOVE_OPERATION_TYPE.REFUSE_CHANGES) {
        const refuseArticleChangesResult = await adminService.refuseArticleChanges({
          articleId,
        });
        pushResponseMessages(refuseArticleChangesResult);
        if (refuseArticleChangesResult.ok) {
          router.push(`/admin/articles_panel/view/${articleId}/?type=${ACTUAL_VERSION}`);
        }
      } else if (opType === ARTICLE_REMOVE_OPERATION_TYPE.DELETE) {
        const deleteArticleResult = await adminService.deleteArticle({
          articleId,
        });
        pushResponseMessages(deleteArticleResult);
        if (deleteArticleResult.ok) {
          router.push(`/admin/articles_panel/?tags=${articleRecord.tags.join(',')}&sort=updatedAtDesc`);
        }
      }
    }
  };

  const handleEditProduct = async () => {
    router.push(`/admin/articles_panel/edit/${articleId}`);
  };

  const handleToggleVersion = () => {
    if (hasBeenEdited) {
      router.push(`/admin/articles_panel/view/${articleId}/?type=${versionType === EDIT_VERSION ? ACTUAL_VERSION : EDIT_VERSION}`);
    }
  };

  const handleMakeArticleActual = async () => {
    let confirmed = false;
    const confirm = await confirmDialog({
      text: t(
        'confirm_make_actual',
        { ns: 'articles' }
      ),
    });
    if (confirm === DIALOG_ACTIONS.CONFIRM) {
      confirmed = true;
    }
    if (confirmed) {
      const makeArticleActualResult = await adminService.makeArticleActual({
        articleId,
      });
      pushResponseMessages(makeArticleActualResult);
      if (makeArticleActualResult.ok) {
        setHasBeenEdited(false);
        await getArticle({ articleId });
        router.push(`/admin/articles_panel/view/${articleId}/?type=${ACTUAL_VERSION}`);
      }
    }
  };

  return (
    !_.isEmpty(articleRecord) && <div style={{ position: 'relative' }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 6, sm: 6, md: 12 }}
        style={{
          position: 'sticky',
          top: '54px',
          zIndex: 12,
          backgroundColor: 'white',
          marginTop: 0,
        }}
      >
        <Grid item xs={12}
          style={{
            zIndex: 6,
            backgroundColor: 'white',
            top: '56px',
            position: 'sticky',
            paddingTop: 0,
            marginTop: 0,
            marginBottom: '16px',
            boxShadow: '1px 2px 4px -1px rgba(143,143,143,0.75)'
          }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <FlexContainer jc="space-between">
              <Tooltip disableHoverListener={!hasBeenEdited} title={t('click_to_switch_version', { ns: 'articles' })}>
                <FlexContainer jc="space-between" onClick={handleToggleVersion} className="unselect" style={{ cursor: hasBeenEdited ? 'pointer' : 'default', marginTop: '4px' }}>
                  <IconViewStyled style={{ color: versionType === EDIT_VERSION ? 'brown' : '#333' }} />
                  <div style={{ fontWeight: 'bold', marginLeft: '8px', color: versionType === EDIT_VERSION ? 'brown' : '#333' }}>{versionType === EDIT_VERSION ? 'Edit' : 'Actual'} Version</div>
                  {
                    hasBeenEdited && <ArrowDropDownIcon style={{ marginLeft: '0px', fontSize: '22px', color: versionType === EDIT_VERSION ? 'brown' : '#333' }} />
                  }
                </FlexContainer>
              </Tooltip>
              <div></div>
              {versionType === ACTUAL_VERSION &&
                (
                  <div style={{
                    color: !published ? 'red' : 'green',
                    textAlign: 'right',
                    marginRight: '12px',
                  }}>
                    {
                      !published ? t('not_published', { ns: 'articles' }) : t('published', { ns: 'articles' })
                    }
                  </div>
                )
              }
            </FlexContainer>
            <ButtonSectionStyled>
              {status === 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  style={{ color: 'black', backgroundColor: '#ffeded', borderColor: '#f1b3b3', fontSize: '10px', marginRight: '10px' }}
                  onClick={
                    (event) => handleDeleteRefuseChangeForArticle(
                      event,
                      versionType === EDIT_VERSION ? ARTICLE_REMOVE_OPERATION_TYPE.REFUSE_CHANGES : ARTICLE_REMOVE_OPERATION_TYPE.DELETE
                    )
                  }
                >
                  {t(versionType === EDIT_VERSION ? 'refuse_chagnes' : 'delete', { ns: 'buttons' })}
                </Button>
              )}

              <Button
                variant="outlined"
                color="error"
                style={{ color: '#aa6c78', borderColor: '#f1b3b3', fontSize: '10px', marginRight: '10px' }}
                onClick={handleEditProduct}
              >
                {t(versionType === EDIT_VERSION ? 'continue_edit' : 'edit', { ns: 'buttons' })}
              </Button>
              {versionType === ACTUAL_VERSION
                ? (
                  <Button
                    variant="outlined"
                    style={{ fontSize: '10px', color: published ? 'brown' : 'green', borderColor: 'green' }}
                    onClick={handlePublish}
                  >
                    {
                      published
                        ? t('off_publish', { ns: 'buttons' })
                        : t('publish', { ns: 'buttons' })
                    }
                  </Button>
                )
                : (
                  <Button
                    variant="outlined"
                    style={{ fontSize: '10px', color: 'green', borderColor: 'green' }}
                    onClick={handleMakeArticleActual}
                  >
                    {t('make_actual', { ns: 'buttons' })}
                  </Button>
                )
              }
            </ButtonSectionStyled>
          </div>
          {/* <FlexContainer style={{ fontSize: '9px' }}> */}
          {
            articleRecord && articleRecord.createdAt && <div style={{ padding: '0 8px', fontSize: '9px', display: 'flex', justifyContent: 'flex-end' }}>
              <div>
                <span>Created {getLocalDate(articleRecord.createdAt)}</span>
              </div>
              {
                hasBeenEdited && <div>
                  <span style={{ marginLeft: '3px' }}>Changed {getLocalDate(articleRecord.editedAt)}</span>
                </div>
              }
            </div>
          }
          {/* </FlexContainer> */}
        </Grid>
      </Grid>
      <ArticleBody
        data={data}
        tagsListMap={tagsListMap}
        tagsArr={data.tags}
      />
    </div>
  );
};

export default ArticleView;
