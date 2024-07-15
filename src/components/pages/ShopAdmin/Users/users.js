import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { Grid } from '@mui/material';
import { Formik, Form } from 'formik';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Fade from '@mui/material/Fade';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Tooltip from '@mui/material/Tooltip';
import Link from "~/components/Link";
import IconButton from '@mui/material/IconButton';
import { pushResponseMessages, getLocalDate, _ } from '~/utils';
import { userService } from '~/http/services';
import { FlexContainer } from '~/components/StyledComponents';
import { GridRowStyled, TextFieldStyled } from './users.styled';
import User from '~/components/User';
import { ROLES } from '~/constants';
import RegisterDialog from "~/components/Header/Sidebar/auth/registerDialog";
import { SmallButton } from '~/components/StyledComponents';

const setFilterParametersChange = _.debounce((params, cb = _.noop) => {
  cb(params);
}, 500);

export default function UsersPage() {
  const [usersList, setUsersList] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [disableReset, setDisableReset] = useState(false);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [initialValues, setInitialValues] = useState({
    id: '',
    email: '',
  });
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);

  const { t } = useTranslation([
    'sidebar',
    'buttons',
    'admin_main',
    'errors',
    'successes',
    'infos',
    'warnings',
  ]);

  const refFormik = useRef(null);

  const getUserList = async (params = {}) => {

    const { id, email } = params;
    const parameters = {};
    if (id && id.trim().length > 0) {
      parameters.id = id;
    }
    if (email && email.trim().length > 0) {
      parameters.email = email;
    }
    const result = await userService.getUsers(parameters);
    pushResponseMessages(result);

    if (result.ok) {
      const { usersList } = result.data;
      setUsersList(usersList);
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    const userInfo = User.read();
    let access = false;
    if (!_.isEmpty(userInfo)) {
      const { roles } = userInfo;
      access = roles.includes(ROLES.ADMIN);
    }
    if (access) {
      getUserList();
    }
  }, []);

  useEffect(() => {
    setFilterParametersChange({
      id: userId,
      email: userEmail
    },
      (params = {}) => {
        getUserList(params);
      });
  }, [userId, userEmail]);

  const handleFormChange = (values) => {
    const { id, email } = values;

    setUserId(id);
    setUserEmail(email);
  };

  const hanldeResetFilter = () => {
    const { setFieldValue } = refFormik.current;
    setFieldValue('id', '');
    setFieldValue('email', '');
    getUserList();
  };

  const handleCloseRegisterDialog = () => {
    setOpenRegisterDialog(false);
  };

  const handleAddUser = () => {
    console.log('add user');
    setOpenRegisterDialog(true);
  }

  return (
    <div style={{ fontSize: '12px', visibility: dataLoaded ? 'visible' : 'hidden' }}>
      <Fade in={dataLoaded} timeout={200}>
        <div>
          <div style={{ textAlign: 'center', fontSize: '20px', borderBottom: '2px #ceceed solid', padding: '8px', marginBottom: '16px' }}>
            {t('users_page.title', { ns: 'admin_main' })}
          </div>
          <Formik
            initialValues={initialValues}
            innerRef={refFormik}
            enableReinitialize
            validateOnBlur={false}
          >
            {(props) => {
              const { setFieldValue, dirty, values } = props;
              handleFormChange(values)
              return (
                <Form>
                  <div style={{ padding: '0 0 8px 24px', marginBottom: '1px' }}>
                    <FlexContainer jc="space-between">
                      <FlexContainer jc="flex-start">
                        <span>{t('users_page.filter', { ns: 'admin_main' })}:</span>
                        <TextFieldStyled
                          style={{ width: '64px', margin: '0 16px' }}
                          name="id"
                          label={t('users_page.id', { ns: 'admin_main' })}
                          type="text"
                        />
                        <TextFieldStyled
                          name="email"
                          label={t('users_page.email', { ns: 'admin_main' })}
                          type="text"
                        />
                        <IconButton disabled={disableReset} style={{ marginLeft: '8px' }}>
                          <Tooltip title={t('users_page.reset_the_filter', { ns: 'admin_main' })}>
                            <span>
                              <RestartAltIcon onClick={hanldeResetFilter} style={{ fontSize: '15px', cursor: 'pointer' }} />
                            </span>
                          </Tooltip>
                        </IconButton>
                      </FlexContainer>
                      <SmallButton btn="blue" onClick={handleAddUser}>Add User</SmallButton>
                    </FlexContainer>
                  </div>
                </Form>
              )
            }}
          </Formik>

          <Grid container style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ddd', padding: '4px 0', marginBottom: '8px' }}>
            <Grid item xs={1} md={1} style={{ textAlign: 'center' }}>
              {t('users_page.id', { ns: 'admin_main' })}
            </Grid>
            <Grid item xs={4} md={2} style={{ textAlign: 'left' }}>
              {t('users_page.user_name', { ns: 'admin_main' })}
            </Grid>
            <Grid item xs={4} md={2} style={{ textAlign: 'left' }}>
              {t('users_page.email', { ns: 'admin_main' })}
            </Grid>
            <Grid item xs={3} md={2} style={{ textAlign: 'center' }}>
              {t('users_page.date', { ns: 'admin_main' })}
            </Grid>
            <Grid item xs={3} md={1} style={{ textAlign: 'center' }}>
              {t('users_page.status', { ns: 'admin_main' })}
            </Grid>
            <Grid item xs={6} md={2} style={{ textAlign: 'center' }}>
              {t('users_page.roles', { ns: 'admin_main' })}
            </Grid>
            <Grid item xs={2} md={1} style={{ textAlign: 'center' }}>
              {t('users_page.country', { ns: 'admin_main' })}
            </Grid>
            <Grid item xs={1} md={1} style={{ textAlign: 'center' }}>
            </Grid>
          </Grid>
          {
            usersList.length > 0 ? _.map(usersList, user => {
              return (
                <GridRowStyled container>
                  <Grid item xs={1} md={1} style={{ textAlign: 'center' }}>
                    {`${user.id}`}
                  </Grid>
                  <Grid item xs={4} md={2} style={{ textAlign: 'left' }}>
                    {`${user.firstname} ${user.lastname}`}
                  </Grid>
                  <Grid item xs={4} md={2} style={{ textAlign: 'left' }}>
                    {`${user.email}`}
                  </Grid>
                  <Grid item xs={3} md={2} style={{ textAlign: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', fontSize: '9px' }}>{getLocalDate(user.createdAt)}</span>
                  </Grid>
                  <Grid item xs={3} md={1} style={{ textAlign: 'center', color: user.locked ? 'red' : '#777' }}>
                    {user.locked ? 'Locked' : 'Active'}
                  </Grid>
                  <Grid item xs={6} md={2} style={{ textAlign: 'center' }}>
                    <div style={{ whiteSpace: 'nowrap' }}>
                      {
                        _.map(user.roles, role => {
                          return (<span> {role} </span>)
                        })
                      }
                    </div>
                  </Grid>
                  <Grid item xs={2} md={1} style={{ textAlign: 'center' }}>
                    {user.country}
                  </Grid>
                  <Grid item xs={1} md={1} style={{ textAlign: 'center' }}>
                    <Tooltip title={t('edit', { ns: 'buttons' })}>
                      <Link href={`/admin/users/${user.id}`}>
                        <BorderColorIcon
                          className="icon edit"
                          style={{ color: '#9e713a' }}
                        //onClick={() => handleEditUser(user)}
                        />
                      </Link>
                    </Tooltip>
                  </Grid>
                </GridRowStyled>
              )
            })
              : (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  {
                    usersList.length === 0 ? t('users_page.no_matches_found', { ns: 'admin_main' }) : null
                  }
                </div>
              )
          }
        </div>
      </Fade >
      <RegisterDialog
        openDialog={openRegisterDialog}
        //withParams={offerAuthParams}
        onClose={handleCloseRegisterDialog}
        onCloseAndOpenAuthDialog={() => { }}
      />
    </div>
  );
};
