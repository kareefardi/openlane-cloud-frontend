import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Field, FieldArray, Formik, getIn} from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  SvgIcon,
  makeStyles, Tabs, Tab, Table, TableBody, TableRow, TableCell, Link
} from '@material-ui/core';
import {
  PlusCircle as PlusCircleIcon,
  X as XIcon,
} from 'react-feather';

import QuillEditor from 'src/components/QuillEditor';
import FilesDropzone from 'src/components/FilesDropzone';
import TabPanel from '@material-ui/lab/TabPanel';
import TabContext from '@material-ui/lab/TabContext';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useAuth from '../../../hooks/useAuth';
import api from '../../../api';

const pdkVariants = [
  {
    id: 'sky130_fd_sc_hd',
    name: 'sky130_fd_sc_hd'
  },
  {
    id: 'sky130_fd_sc_hs',
    name: 'sky130_fd_sc_hs'
  },
  {
    id: 'sky130_fd_sc_ms',
    name: 'sky130_fd_sc_ms'
  },
  {
    id: 'sky130_fd_sc_ls',
    name: 'sky130_fd_sc_ls'
  },
  {
    id: 'sky130_fd_sc_hdll',
    name: 'sky130_fd_sc_hdll'
  }
];

const types = [
  {
    id: 'normal',
    name: 'Regular'
  },
  {
    id: 'exploratory',
    name: 'Exploratory'
  }
];

const tabs = [
  {
    value: 'fields',
    label: 'Input Fields'
  },
  {
    value: 'upload',
    label: 'Upload File (WIP)',
    disabled: true
  }
];

const regressionScriptFields = [
  {
    id: 'GLB_RT_ADJUSTMENT',
    name: 'GLB_RT_ADJUSTMENT'
  },
  {
    id: 'FP_CORE_UTIL',
    name: 'FP_CORE_UTIL'
  },
  {
    id: 'PL_TARGET_DENSITY',
    name: 'PL_TARGET_DENSITY'
  },
  {
    id: 'SYNTH_STRATEGY',
    name: 'SYNTH_STRATEGY'
  },
  {
    id: 'FP_PDN_VPITCH',
    name: 'FP_PDN_VPITCH'
  },
  {
    id: 'FP_PDN_HPITCH',
    name: 'FP_PDN_HPITCH'
  },
  {
    id: 'FP_ASPECT_RATIO',
    name: 'FP_ASPECT_RATIO'
  },
  {
    id: 'SYNTH_MAX_FANOUT',
    name: 'SYNTH_MAX_FANOUT'
  }
];

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    '& .ql-editor': {
      height: 400
    }
  }
}));

const JobCreateForm = ({ className, ...rest }) => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState('fields');
  const { user } = useAuth();

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  return (
    <Formik
      initialValues={{
        designs: [
          {
            designName: '',
            repoURL: '',
            pdkVariant: pdkVariants[0].id
          }
        ],
        type: types[0].id,
        notificationsEnabled: true,
        regressionScript: {
          GLB_RT_ADJUSTMENT: '',
          FP_CORE_UTIL: '',
          PL_TARGET_DENSITY: '',
          SYNTH_STRATEGY: '',
          FP_PDN_VPITCH: '',
          FP_PDN_HPITCH: '',
          FP_ASPECT_RATIO: '',
          SYNTH_MAX_FANOUT: '',
          extra: ''
        },
        files: [],
        submit: null
      }}
      validationSchema={Yup.object().shape({
        designs: Yup.array().of(
          Yup.object().shape({
            designName: Yup.string().required("Design Name is required"),
            repoURL: Yup.string().required("Repo url is required"),
            pdkVariant: Yup.string().max(255).required(),
          })
        ),
        type: Yup.string().max(255).required(),
        notificationsEnabled: Yup.bool().required(),
        files: Yup.array(),
        regressionScript: Yup.object().shape({
          GLB_RT_ADJUSTMENT: Yup.string(),
          FP_CORE_UTIL: Yup.string(),
          PL_TARGET_DENSITY: Yup.string(),
          SYNTH_STRATEGY: Yup.string(),
          FP_PDN_VPITCH: Yup.string(),
          FP_PDN_HPITCH: Yup.string(),
          FP_ASPECT_RATIO: Yup.string(),
          SYNTH_MAX_FANOUT: Yup.string(),
          extra: Yup.string()
        })
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          /*
          await user.firebaseUser.getIdToken().then((idToken) => {
            api.setToken(idToken);
          });
          await api.postJob(values);
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Job Created', {
            variant: 'success'
          });
          history.push('/app/management/jobs');
          */
         alert(JSON.stringify(values,null,2))
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          touched,
          values

      }) => (
        <form
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              lg={8}
            >
              <Card>
                <CardHeader title="Job Options"/>
                <Divider/>
                <CardContent>
                  <FieldArray name="designs">
                    {({ remove, push}) => (
                      <div>
                        {values.designs.length > 0 && values.designs.map((design, index) => {
                          const designName = `designs[${index}].designName`;
                          const touchedDesignName = getIn(touched, designName);
                          const errorDesignName = getIn(errors, designName);

                          const repoURL = `designs[${index}].repoURL`;
                          const touchedRepoURL = getIn(touched, repoURL);
                          const errorRepoURL = getIn(errors, repoURL);

                          const pdkVariant = `designs[${index}].pdkVariant`;
                          return (
                            <div style={{paddingBottom : 10}} key={index}>
                              <Grid
                                container
                                alignItems="center"
                                spacing={1}
                              >
                                <Grid
                                  item
                                  xs={4}
                                >
                                  <TextField
                                    fullWidth
                                    label="Design Name"
                                    name={designName}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={design.designName}
                                    variant="outlined"
                                    required
                                    helperText={
                                      touchedDesignName && errorDesignName
                                    }
                                    error={Boolean(touchedDesignName && errorDesignName)}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={5}
                                >
                                  <TextField
                                    fullWidth
                                    label="Repo URL"
                                    name={repoURL}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={design.repoURL}
                                    variant="outlined"
                                    required
                                    helperText={
                                      touchedRepoURL && errorRepoURL
                                    }
                                    error={Boolean(touchedRepoURL && errorRepoURL)}
                                  />
                                </Grid>
                                <Grid 
                                  item
                                  xs={2}
                                >
                                  <TextField
                                    fullWidth
                                    label="PDK Variant"
                                    name={pdkVariant}
                                    onChange={handleChange}
                                    select
                                    SelectProps={{ native: true }}
                                    value={design.pdkVariant}
                                    variant="outlined"
                                  >
                                    {pdkVariants.map((pdkVariant) => (
                                      <option
                                        key={pdkVariant.id}
                                        value={pdkVariant.id}
                                      >
                                        {pdkVariant.name}
                                      </option>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid
                                  item
                                  xs={1}
                                >
                                  <Button
                                    color="secondary"
                                    variant="contained"
                                    size="small"
                                    onClick={() => remove(index)}
                                  >
                                    <SvgIcon fontSize="small">
                                      <XIcon/>
                                    </SvgIcon>
                                    Remove
                                  </Button>
                                </Grid>
                              </Grid>
                            </div>
                              );
                        })}
                        <Button
                          color="secondary"
                          variant="contained"
                          className={classes.action}
                          onClick={() => push({ designName: '', repoURL: '', pdkVariant: pdkVariants[0].id})}
                          startIcon={
                            <SvgIcon fontSize="small">
                              <PlusCircleIcon />
                            </SvgIcon>
                          }
                        >
                          Add design
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                  {/*
                    <Grid
                      container
                      spacing={3}
                      xs="auto"
                    >
                      <Grid
                        item
                        xs={4}
                      >
                        <TextField
                          fullWidth
                          error={Boolean(touched.designName && errors.designName)}
                          helperText={touched.designName && errors.designName}
                          label="Design Name"
                          name="designName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.designName}
                          variant="outlined"
                          required
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          error={Boolean(touched.repoURL && errors.repoURL)}
                          fullWidth
                          helperText={touched.repoURL && errors.repoURL
                            ? errors.repoURL
                            : 'Repo must be publicly accessible'}
                          label="Repo URL"
                          name="repoURL"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.repoURL}
                          variant="outlined"
                          required
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="PDK Variant"
                          name="pdkVariant"
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={values.pdkVariant}
                          variant="outlined"
                        >
                          {pdkVariants.map((pdkVariant) => (
                            <option
                              key={pdkVariant.id}
                              value={pdkVariant.id}
                            >
                              {pdkVariant.name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                    <Box mt={2}
                      display="flex"
                      flexDirection="row-reverse"
                    >
                      <Button
                        color="secondary"
                        variant="contained"
                        className={classes.action}
                        startIcon={
                          <SvgIcon fontSize="small">
                            <PlusCircleIcon />
                          </SvgIcon>
                        }
                    >
                      Add design
                    </Button>
                  </Box>
      */}
                 <Box
                    mt={3}
                    mb={1}
                  >
                    <TextField
                      fullWidth
                      label="Type"
                      name="type"
                      onChange={handleChange}
                      select
                      SelectProps={{ native: true }}
                      value={values.type}
                      variant="outlined"
                    >
                      {types.map((type) => (
                        <option
                          key={type.id}
                          value={type.id}
                        >
                          {type.name}
                        </option>
                      ))}
                    </TextField>
                  </Box>
               </CardContent>
              </Card>
              {values.type === 'exploratory' && <Box
                mt={3}
                mb={1}
              >
                <Card>
                  <CardHeader title="Exploratory Job Options"/>
                  <Divider/>
                  <CardContent>
                    <TabContext value={currentTab}>
                      <Tabs
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        textColor="secondary"
                        value={currentTab}
                        variant="scrollable"
                      >
                        {tabs.map((tab) => (
                          <Tab
                            key={tab.value}
                            value={tab.value}
                            label={tab.label}
                            disabled={tab.disabled}
                          />
                        ))}
                      </Tabs>
                      <Divider/>
                      <TabPanel value="fields">
                        {regressionScriptFields.map((field, index) => (
                          <Box key={index} mt={2}>
                            <TextField
                              error={Boolean(errors.regressionScript && touched.regressionScript[field.id] && errors.regressionScript[field.id])}
                              fullWidth
                              helperText={errors.regressionScript && touched.regressionScript[field.id] && errors.regressionScript[field.id]}
                              label={field.name}
                              name={`regressionScript.${field.id}`}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.regressionScript[field.id]}
                              variant="outlined"
                            />
                          </Box>
                        ))}
                        <Box mt={2}>
                          <TextField
                            error={Boolean(errors.regressionScript && touched.regressionScript.extra && errors.regressionScript.extra)}
                            fullWidth
                            helperText={errors.regressionScript && touched.regressionScript.extra && errors.regressionScript.extra}
                            label="Extra"
                            name="regressionScript.extra"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.regressionScript.extra}
                            variant="outlined"
                            multiline
                            rows={6}
                            rowsMax={20}
                          />
                        </Box>
                      </TabPanel>
                      <TabPanel value="upload">
                        <Box mt={2}>
                          <FilesDropzone/>
                        </Box>
                      </TabPanel>
                    </TabContext>
                    <Divider/>
                    <Box p={2}>
                      <Box
                        p={2}
                        borderRadius="borderRadius"
                        bgcolor="background.dark"
                      >
                        <Typography
                          variant="h6"
                          color="textPrimary"
                        >
                          Need Help?
                        </Typography>
                        <Link
                          variant="subtitle1"
                          color="secondary"
                          target="_blank"
                          rel="noreferrer"
                          href="https://github.com/efabless/openlane/blob/master/regression_results/README.md"
                        >
                          More information about regression scripts
                        </Link>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>}
            </Grid>
            <Grid
              item
              xs={12}
              lg={4}
            >
           </Grid>
          </Grid>
          <>
            <pre style={{ textAlign: "left" }}>
              <strong>Values</strong>
              <br />
              {JSON.stringify(values, null, 2)}
            </pre>
            <pre style={{ textAlign: "left" }}>
              <strong>Errors</strong>
              <br />
              {JSON.stringify(errors, null, 2)}
            </pre>
          </>
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="secondary"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              Create job
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

JobCreateForm.propTypes = {
  className: PropTypes.string
};

export default JobCreateForm;
