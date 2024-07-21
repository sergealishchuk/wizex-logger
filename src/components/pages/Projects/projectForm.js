import { useState, useEffect } from 'react';
import Link from "next/link";
import { Formik, Form } from 'formik';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';
import { projectsService } from '~/http/services';
import { useRouter } from 'next/router';
import TextField from '~/components/formik/TextField';
import { FlexContainer } from '~/components/StyledComponents';
import { ADD_MODE, EDIT_MODE, ROLES, DIALOG_ACTIONS } from '~/constants';
import { getLocalDate, confirmDialog, pushResponseMessages } from '~/utils';
import { Button } from '@mui/material';
import SubmitController from '~/components/formik/SubmitController';
import { useTranslation } from 'next-i18next';
import guiConfig from "~/gui-config";
import User from '~/components/User';

const { apiUrl } = guiConfig;

const ProjectForm = (props) => {
  const { mode, data = {} } = props;
  const { project: projectInput = {} } = data;

  const [adminRole, setAdminRole] = useState(false);
  const [project, setProject] = useState(projectInput);
  const [formChanged, setFormChanged] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    publicLink: "",
    apiKey: "",
    script: "",
  });

  const { t } = useTranslation(['projects', 'sidebar']);

  const router = useRouter();

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(2, t('At least 2 characters', { ns: 'projects' }))
      .required(t('This field is required', { ns: 'projects' })),
    description: yup
      .string()
      .min(3, t('At least 3 characters', { ns: 'projects' }))
      .required(t('This field is required', { ns: 'projects' })),
    publicLink: yup
      .string()
      .min(3, t('At least 3 characters', { ns: 'projects' }))
      .required(t('This field is required', { ns: 'projects' })),
  });

  useEffect(() => {
    if (User.isLog()) {
      const { roles } = User.read();
      if (Array.isArray(roles) && roles.includes(ROLES.ADMIN)) {
        setAdminRole(true);
      }
    }
  }, []);

  useEffect(() => {
    if (mode === EDIT_MODE) {
      const {
        name = "",
        description = "",
        publicLink = "",
        apiKey = "",
      } = project;
      const script = `<script async src="${apiUrl}/wxmanager?key=${apiKey}" />`
      setInitialValues({
        name,
        description,
        publicLink,
        apiKey,
        script
      });
    }
  }, [project]);

  useEffect(() => {
    if (mode === EDIT_MODE) {
      setProject(projectInput);
    }
  }, [projectInput]);

  const handleGenerateNewKey = async () => {

    const confirm = await confirmDialog({
      text: 'Are you sure you want to generate a new key? Please remember to make changes to your code after generation!',
    });
    if (confirm === DIALOG_ACTIONS.CONFIRM) {
      const generateKeyRequest = await projectsService.generateApiKeyForProject({
        projectId: project.id,
      });
      router.push(`/projects/edit/${project.id}`);
    }
  };

  const onSubmit = async (values) => {
    if (mode === ADD_MODE) {
      const addProjectRequest = await projectsService.addProject(values);
      pushResponseMessages(addProjectRequest);
      if (addProjectRequest.ok) {
        router.push('/projects');
      }
    } else if (mode === EDIT_MODE) {
      const updateProjectRequest = await projectsService.updateProject({
        projectId: project.id,
        ...values,
      });
      pushResponseMessages(updateProjectRequest);
      if (updateProjectRequest.ok) {
        router.push('/projects');
      }
    }
  };

  const handleDeleteProject = async () => {
    const confirm = await confirmDialog({
      text: `Delete project "${project.name}"?`,
    });
    if (confirm === DIALOG_ACTIONS.CONFIRM) {
      const deleteProjectRequest = await projectsService.deleteProject({
        projectId: project.id,
      });
      pushResponseMessages(deleteProjectRequest);
      if (deleteProjectRequest) {
        router.push('/projects');
      }
    }
  }

  const handleFormChanged = (value) => {
    setFormChanged(value);
  };
  return (
    <div style={{ fontSize: '14px' }}>
      <div style={{ marginBottom: '28px', borderBottom: '2px #ededed solid' }}>
        {
          mode === EDIT_MODE ? (
            <FlexContainer jc="space-between" ai="flex-start">
              <div>Edit Project: 
                <Link href={`/projects/actions/${project.id}`}>
                <span style={{marginLeft: '8px'}}><b>{project.name}</b></span>
                </Link>
              </div>
              <div>
                <div suppressHydrationWarning>Created: <span style={{whiteSpace: 'nowrap'}}>{getLocalDate(project.dateCreate)}</span></div>
                <div>By: {project.ownerName}</div>
              </div>
            </FlexContainer>
          )
            : mode === ADD_MODE && (
              <div>Add New Project</div>
            )
        }
      </div>
      <div style={{ maxWidth: '550px' }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          validateOnBlur={false}
          enableReinitialize
        >
          {(props) => {
            const { values } = props;
            return (
              <Form>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      label="Project Name"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ readOnly: !adminRole }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="description"
                      label="Description"
                      type="text"
                      multiline
                      minRows={2}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ readOnly: !adminRole }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="publicLink"
                      label="Public Link"
                      type="text"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ readOnly: !adminRole }}
                    />
                  </Grid>

                  {
                    mode === EDIT_MODE ? <Grid item xs={12}>
                      <TextField
                        name="apiKey"
                        label="apiKey"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ readOnly: true }}
                      />
                    </Grid> : null
                  }

                  {
                    mode === EDIT_MODE ? <Grid item xs={12}>
                      <TextField
                        name="script"
                        label="Embedding Script"
                        type="text"
                        multiline
                        minRows={3}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ readOnly: true }}
                      />
                    </Grid> : null
                  }

                  <Grid item xs={12} style={{ marginTop: '16px', borderTop: '1px #ededed solid' }}>
                    <FlexContainer jc="space-between">
                      {
                        adminRole
                          ? <div>
                            <Button disabled={!formChanged} type="submit" style={{ marginLeft: '16px', marginBottom: '48px', padding: '2px 12px', fontSize: '12px' }} variant="contained">Save</Button>
                            {mode === EDIT_MODE ? <Button onClick={handleDeleteProject} style={{ backgroundColor: '#801313', marginLeft: '16px', marginBottom: '48px', padding: '2px 12px', fontSize: '12px' }} variant="contained">Remove</Button> : null}
                          </div>
                          : <span></span>
                      }
                      {
                        mode === EDIT_MODE
                          ? <Button onClick={handleGenerateNewKey} type="button" style={{ marginLeft: '16px', marginBottom: '48px', padding: '2px 12px', fontSize: '12px' }} variant="contained" color="success">Generate new Key</Button>
                          : <span></span>
                      }
                    </FlexContainer>

                  </Grid>
                </Grid>

                <SubmitController name="ProjectAddEditForm" onFormChanged={handleFormChanged} />
              </Form>
            )
          }}
        </Formik>
      </div >
    </div>
  )
};

export default ProjectForm;
