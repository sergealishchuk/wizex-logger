import { useEffect, useState } from "react";
import { useTranslation } from 'next-i18next';
import { BottomDrawer } from "~/components/UI";
import { MailOutlineOutlined } from "@mui/icons-material";
import { adminService } from '~/http/services';
import { BottomDrawerWrapper, TopPanelStyled } from './email_templates.styled';
import { pushResponseMessages } from '~/utils';
import { FlexContainer } from "~/components/StyledComponents";

export default (props) => {
  const { open, onClose, item = {}, openViewWithEditButton, onCloseAndOpenEdit } = props;
  const { name = '', body = '', subject = '', params = '{}' } = item;
  const [templateName, setTemplateName] = useState(name);
  const [templateBody, setTemplateBody] = useState('');
  const [paramsObject, setParamsObject] = useState({});

  const { t } = useTranslation(['sidebar', 'buttons', 'email_templates']);

  const compileEmailTemplateRequest = async (values) => {
    const compileEmailTemplateResult = await adminService.compileEmailTemplate(values);
    pushResponseMessages(compileEmailTemplateResult);
    if (compileEmailTemplateResult.ok) {
      const { htmlEmailBody, sentme } = compileEmailTemplateResult.result;
      setTemplateBody(htmlEmailBody);
    }
  };

  useEffect(() => {
    if (open) {
      let paramsObject = {};
      try {
        paramsObject = JSON.parse(params);
        setParamsObject(paramsObject);
        compileEmailTemplateRequest({
          body,
          subject,
          params: paramsObject,
        });

      } catch (e) {
        console.log('error tranform params');
      }
    } else {
      setTemplateBody('');
      setTemplateName('');
    }
  }, [open]);

  const handleSendMe = () => {
    compileEmailTemplateRequest({
      body,
      subject,
      params: paramsObject,
      sendme: true,
    });
  };

  const handleEdit = () => {
    onCloseAndOpenEdit();
  };

  return (
    <BottomDrawer
      open={open}
      onClose={onClose}
      icon={<MailOutlineOutlined style={{ color: '#868686' }} />}
      title={t('view_ email', { ns: 'email_templates' })}
    >
      <>
        <TopPanelStyled>
          <FlexContainer jc="space-between">
            <span style={{ marginLeft: '-16px' }}>{name}</span>
            <div>
              {openViewWithEditButton &&
                <span className="link" style={{ marginRight: '32px' }} onClick={handleEdit}>Edit</span>
              }
              <span className="link" onClick={handleSendMe}>{t('send_me', { ns: 'email_templates' })}</span>
            </div>
          </FlexContainer>
        </TopPanelStyled>
        <div style={{ marginBottom: '8px', marginTop: '4px', borderBottom: '1px #ededed solid', backgroundColor: '#eee', paddingLeft: '16px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{t('template_subject', { ns: 'email_templates' })}:</span>
          {subject}
        </div>
        <BottomDrawerWrapper>
          <div
            dangerouslySetInnerHTML={{ __html: templateBody }}
          />
        </BottomDrawerWrapper>
      </>
    </BottomDrawer>
  )
};