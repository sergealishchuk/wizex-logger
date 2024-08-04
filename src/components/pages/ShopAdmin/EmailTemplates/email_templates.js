import { useState, useLayoutEffect } from "react";
import { useRouter } from 'next/router';
import cn from 'classnames';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button } from "@mui/material";
import { DragableList } from "~/components/UI";
import { adminService } from '~/http/services';
import { useTranslation } from 'next-i18next';
import AddEditEmailTemplateDialog from "./addEditEmailTemplateDialog";
import { ADD_MODE, EDIT_MODE, DIALOG_ACTIONS } from "~/constants";
import {
  _,
  pushResponseMessages,
  Observer,
  confirmDialog,
} from '~/utils';

import { BlockEntitiesStyled, ItemStyled } from "./email_templates.styled";
import { FlexContainer } from "~/components/StyledComponents";
import EmailTemplateViewDrawer from "./emailTemplateViewDrawer";

export default (props) => {
  const [active, setActive] = useState(-1);
  const [data, setData] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState(false);
  const [openAddEditEmailTemplateDialog, setOpenAddEditEmailTemplateDialog] = useState(false);
  const [addEditMode, setAddEditMode] = useState();
  const [templateId, setTemplateId] = useState();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [openViewWithEditButton, setOpenViewWithEditButton] = useState(false);
  const [activeItem, setActiveItem] = useState({});

  const { t } = useTranslation(['sidebar', 'buttons', 'email_templates']);
  const router = useRouter();

  const arrangeEmailTemplatesRequest = async (values) => {
    const arrangeEmailTemplatesResult = await adminService.arrangeEmailTemplates(values);
    pushResponseMessages(arrangeEmailTemplatesResult);
  };

  const getEmailTemplatesRequest = async (syncScroll = false) => {
    Observer.send('SpinnerShow', true);
    const requestResult = await adminService.getEmailTemplates();
    Observer.send('SpinnerShow', false);
    const { result } = requestResult;
    let adjustData = _.orderBy(result, 'index').map(item => ({ ...item, id: item.id }));

    setData(adjustData);
    setDisabledButtons(adjustData.length === 0);

    return {
      records: adjustData,
    }
  };

  const deleteEmailTemplateRequest = async () => {
    Observer.send('SpinnerShow', true);
    const activeIndex = _.findIndex(data, item => item.id === active);
    const deleteEmailTemplateResult = await adminService.deleteEmailTemplate({
      id: active,
    });

    const { SUCCESS_CODE } = deleteEmailTemplateResult;
    if (SUCCESS_CODE === "SUCCESS_REMOVE_EMAIL_TEMPLATE") {
      const { records } = await getEmailTemplatesRequest();
      const nextActive = records[activeIndex] ? records[activeIndex] : records[activeIndex - 1];
      if (nextActive) {
        setActive(nextActive.id);
      }
    }
    pushResponseMessages(deleteEmailTemplateResult);
    Observer.send('SpinnerShow', false);
  };

  useLayoutEffect(() => {
    const initData = async () => {
      const res = await getEmailTemplatesRequest(true);
      if (active < 0 && res?.records?.length > 0) {
        setActive(res.records[0].id);
      }
    };
    initData();
  }, []);

  const handleOnChange = async (result) => {
    const nextData = [];
    const ids = _.map(result, item => {
      nextData.push(item.data);
      return item.data.id;
    });
    await arrangeEmailTemplatesRequest({
      values: ids,
    });
  };

  const handleOnClickItem = (item) => {
    setActive(item.id);
  };

  const getItem = (item) => {
    return (
      <ItemStyled
        className={cn("item-wrapper", { active: active === item.id }, `item-${item.id}`)}
        style={{ padding: '9px 8px' }}
        onClick={() => handleOnClickItem(item)}
        onDoubleClick={handleViewEmailTemplate}
      >
        <div style={{ fontWeight: 'bold' }}>{item.name} </div>
        <div style={{ fontWeight: 'normal', fontSize: '12px' }}><span style={{ fontWeight: 'bold' }}>{t('template_subject', { ns: 'email_templates' })}:</span> {item.subject} </div>
        <div style={{ fontWeight: 'normal', fontSize: '12px' }}><span style={{ fontWeight: 'bold' }}>{t('template_body', { ns: 'email_templates' })}:</span> {item.body} </div>
        {item.params.length > 2 &&
          <div style={{ fontWeight: 'normal', fontSize: '9px' }}><span style={{ fontWeight: 'bold' }}>{t('template_params', { ns: 'email_templates' })}:</span> {item.params} </div>
        }
      </ItemStyled>
    )
  }

  const handleAddEmailTemplate = (event) => {
    event.target.blur();
    setAddEditMode(ADD_MODE);
    setOpenAddEditEmailTemplateDialog(true);
  };

  const handleEditEmailTemplate = (event) => {
    event.target.blur();
    setTemplateId(active > 0 ? active : -1);
    setAddEditMode(EDIT_MODE);
    setOpenAddEditEmailTemplateDialog(true);
  };

  const handleDeleteEmailTemplate = async (event) => {
    event.target.blur();
    const confirm = await confirmDialog({
      text: t('confirm_remove_email_template', { ns: 'email_templates' }),
    });
    if (confirm === DIALOG_ACTIONS.CONFIRM) {
      deleteEmailTemplateRequest();
    }
  };

  const handleSubmittedDialog = async (values) => {
    const { activeId } = values;
    await getEmailTemplatesRequest();
    setActive(activeId);
  };

  const handleCloseDialog = () => {
    setOpenAddEditEmailTemplateDialog(false);
  };

  const handleCloseViewDrawer = () => {
    setOpenViewDrawer(false);
  };

  const handleViewEmailTemplate = (event) => {
    if (event) {
      event.target.blur();
    }
    const activeItem = _.find(data, item => item.id === active);
    if (activeItem) {
      setActiveItem(activeItem);
    }
    setOpenViewWithEditButton(true);
    setOpenViewDrawer(true);
  };

  const handleOpenView = async (event) => {
    if (event) {
      event.target.blur();
    }
    const { records } = await getEmailTemplatesRequest(true);
    const activeItem = _.find(records, item => item.id === active);
    if (activeItem) {
      setActiveItem(activeItem);
    }
    setOpenViewWithEditButton(false);
    setOpenViewDrawer(true);
  };

  const handleCloseViewAndOpenEdit = () => {
    setOpenViewDrawer(false);
    setTemplateId(active > 0 ? active : -1);
    setAddEditMode(EDIT_MODE);
    setOpenAddEditEmailTemplateDialog(true);
  };

  return (
    <>
      <BlockEntitiesStyled>
        <div className="buttons-wrapper" style={{ borderBottom: '1px #efefef solid', zIndex: 1, position: 'sticky', padding: '2px 8px', top: '54px', backgroundColor: 'white' }}>
          <FlexContainer column style={{ width: '100%' }}>
            <div style={{ width: '100%', marginTop: '12px' }}>
              <Button
                disabled={disabledButtons}
                size="small"
                variant="outlined"
                startIcon={<DeleteForeverIcon />}
                onClick={handleDeleteEmailTemplate}
              >
                {t('remove', { ns: 'buttons' })}
              </Button>
              <Button
                disabled={disabledButtons}
                size="small"
                variant="outlined" startIcon={<BorderColorIcon />}
                onClick={handleEditEmailTemplate}
              >
                {t('edit', { ns: 'buttons' })}
              </Button>
              <Button
                disabled={disabledButtons}
                size="small"
                variant="outlined" startIcon={<VisibilityIcon />}
                onClick={handleViewEmailTemplate}
              >
                {t('view', { ns: 'buttons' })}
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddEmailTemplate}
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
      </BlockEntitiesStyled>

      <AddEditEmailTemplateDialog
        openDialog={openAddEditEmailTemplateDialog}
        onCloseDialog={handleCloseDialog}
        onSubmited={handleSubmittedDialog}
        mode={addEditMode}
        currentId={templateId}
        onOpenView={handleOpenView}
      />

      <EmailTemplateViewDrawer
        open={openViewDrawer}
        onClose={handleCloseViewDrawer}
        item={activeItem}
        openViewWithEditButton={openViewWithEditButton}
        onCloseAndOpenEdit={handleCloseViewAndOpenEdit}
      />
    </>
  )
};
