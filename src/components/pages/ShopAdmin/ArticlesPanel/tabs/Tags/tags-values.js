import { useState, useLayoutEffect } from "react";
import { useRouter } from 'next/router';
import cn from 'classnames';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button } from "@mui/material";
import { DragableList } from "~/components/UI";
import { adminService } from '~/http/services';
import { useTranslation } from 'next-i18next';
import AddEditValuesDialog from "./addEditTagDialog";
import { ADD_MODE, EDIT_MODE, DIALOG_ACTIONS } from "~/constants";
import { _, pushResponseMessages, Observer, confirmDialog, translateByCode } from '~/utils';

import { TagsStyled, ItemStyled } from "./tags-values.styled";
import { FlexContainer } from "~/components/StyledComponents";

export default (props) => {
  const [active, setActive] = useState();
  const [data, setData] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState(false);
  const [openAddEditTagDialog, setOpenAddEditTagDialog] = useState(false);
  const [addEditMode, setAddEditMode] = useState();

  const { t } = useTranslation(['sidebar', 'buttons', 'articles']);
  const router = useRouter();

  const checkArticleTagRequest = async (values) => {
    const tagResult = await adminService.checkArticleTag(values);
    pushResponseMessages(tagResult);
    if (tagResult.ok) {
      const { tagsCounter } = tagResult;
      return { tagsCounter };
    }
  };

  const arrangeTagsValuesRequest = async (values) => {
    const arrangeValuesResult = await adminService.arrangeArticleTagsValues(values);
    pushResponseMessages(arrangeValuesResult);
  };

  const getArticleTagsRequest = async (setFirstAsActive = false) => {
    Observer.send('SpinnerShow', true);
    const articlesTagsResult = await adminService.getArticlesTags();
    pushResponseMessages(articlesTagsResult);
    Observer.send('SpinnerShow', false);
    if (articlesTagsResult.ok) {
      const { tags } = articlesTagsResult;

      setData(tags);
      setDisabledButtons(tags.length === 0);
      if (setFirstAsActive && tags.length > 0) {
        setActive(tags[0].id);
        window.scrollTo({ top: 0 });
      }

      return tags;
    }
  };

  const deleteArticleTagValueRequest = async () => {
    Observer.send('SpinnerShow', true);
    const activeIndex = _.findIndex(data, item => item.id === active);
    const deleteTagValueResult = await adminService.deleteArticleTagValue({
      valueId: active,
    });

    const { SUCCESS_CODE } = deleteTagValueResult;
    if (SUCCESS_CODE === "SUCCESS_REMOVE_TAG_VALUE") {
      const nextData = await getArticleTagsRequest();
      if (nextData.length > 0) {
        const nextActive = nextData[activeIndex] ? nextData[activeIndex] : nextData[activeIndex - 1];
        if (nextActive) {
          setActive(nextActive.id);
        }
      }
    }
    pushResponseMessages(deleteTagValueResult);
    Observer.send('SpinnerShow', false);
  };

  useLayoutEffect(() => {
    getArticleTagsRequest(true);
  }, []);

  const handleOnChange = (result) => {
    const values = _.map(result, item => item.data.id);
    arrangeTagsValuesRequest({
      values,
    })
  };

  const handleOnClickItem = (item) => {
    setActive(item.id);
  };

  const getItem = (item) => {
    return (
      <ItemStyled
        className={cn("item-wrapper", { active: active === item.id }, `item-${item.id}`)}
        onClick={() => handleOnClickItem(item)}
        onDoubleClick={handleEditTag}
      >
        <div style={{ fontWeight: 'bold' }}>[{item.id}] {item.name}</div>
      </ItemStyled>
    )
  };

  const handleAddTag = (event) => {
    event.target.blur();
    setAddEditMode(ADD_MODE);
    setOpenAddEditTagDialog(true);
  };

  const handleEditTag = (event) => {
    event.target.blur();
    setAddEditMode(EDIT_MODE);
    setOpenAddEditTagDialog(true);
  };

  const handleDeleteTag = async (event) => {
    event.target.blur();
    const confirm = await confirmDialog({
      text: t('confirm_remove_article_tags', { ns: 'articles' }),
    });
    if (confirm === DIALOG_ACTIONS.CONFIRM) {
      const checker = await checkArticleTagRequest({ valueId: active });
      const { tagsCounter } = checker;
      if (tagsCounter > 0) {
        const message = translateByCode(
          'CONFIRM_REMOVE_TAG_VALUE',
          {
            ns: 'warnings', params: {
              count: tagsCounter,
            }
          }
        );
        const doubleConfirm = await confirmDialog({
          text: message,
        });
        if (doubleConfirm === DIALOG_ACTIONS.CONFIRM) {
          deleteArticleTagValueRequest();
        }
      } else {
        deleteArticleTagValueRequest();
      }
    }
  };

  const handleSubmittedAddEditValueDialog = async (values) => {
    const { activeId } = values;
    await getArticleTagsRequest();
    setActive(activeId);
  };

  const handleCloseAddEditTagDialog = () => {
    setOpenAddEditTagDialog(false);
  };

  return (
    <>
      <TagsStyled>
        <div className="buttons-wrapper" style={{ borderBottom: '1px #efefef solid', zIndex: 1, position: 'sticky', padding: '2px 8px', top: '53px', backgroundColor: 'white', marginBottom: '10px' }}>
          <FlexContainer column ai="flex-start" style={{ width: '100%' }}>

            <div style={{ width: '100%', marginTop: '12px' }}>
              <Button
                disabled={disabledButtons}
                size="small"
                variant="outlined"
                startIcon={<DeleteForeverIcon />}
                onClick={handleDeleteTag}
              >
                {t('remove', { ns: 'buttons' })}
              </Button>
              <Button
                disabled={disabledButtons}
                size="small"
                variant="outlined" startIcon={<BorderColorIcon />}
                onClick={handleEditTag}
              >
                {t('edit', { ns: 'buttons' })}
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddTag}
              >
                {t('add', { ns: 'buttons' })}
              </Button>
            </div>
          </FlexContainer>
        </div>
        <div className="scroll-list-container" >
          <DragableList
            onChange={handleOnChange}
            data={data}
            getItem={getItem}
            isDragDisabled={false}
          />
        </div>
      </TagsStyled>

      <AddEditValuesDialog
        openDialog={openAddEditTagDialog}
        onCloseDialog={handleCloseAddEditTagDialog}
        onSubmited={handleSubmittedAddEditValueDialog}
        mode={addEditMode}
        currentValueId={active}
      />
    </>
  )
};
