import React from 'react';
import Joi from 'joi'
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useAuth from '../../../hooks/useAuth';
import api from '../../../api';
import { useSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  PlusCircle as PlusCircleIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  }
}));


function mergeJson(a, b) {
  var c = {}
  for (var key in a) {
    c[key] = a[key]
  }
  for (var key in b) {
    c[key] = b[key]
  }
  return c
}


const Header = ({ className, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const base_json = {
    type: "normal",
    notificationsEnabled: true,
    regressionScript: {
      "GLB_RT_ADJUSTMENT": "",
      "FP_CORE_UTIL": "",
      "PL_TARGET_DENSITY": "",
      "SYNTH_STRATEGY": "",
      "FP_PDN_VPITCH": "",
      "FP_PDN_HPITCH": "",
      "FP_ASPECT_RATIO": "",
      "SYNTH_MAX_FANOUT": "",
      "extra": ""
    },
    "files": [],
    "submit": null
  };

  const file_schema = Joi.object({
    designs: Joi.array().required().items(Joi.object({
      designName: Joi.string().required(),
      pdkVariant: Joi.string().required(),
      config: Joi.string().required(),
      repoURL: Joi.string().required(),
    }))
  })

  return (
    <Grid
      container
      spacing={3}
      justify="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid item>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            variant="body1"
            color="inherit"
            to="/app"
            component={RouterLink}
          >
            Dashboard
          </Link>
          <Link
            variant="body1"
            color="inherit"
            to="/app/management"
            component={RouterLink}
          >
            Management
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Jobs
          </Typography>
        </Breadcrumbs>
        <Box p={2}>
          <Typography
            variant="h3"
            color="textPrimary"
          >
            All Job Submissions
          </Typography>
        </Box>
      </Grid>
      <Grid item>

        <Grid
          container
          spacing={2}
        >
          <Grid item>
            <input
              className={classes.input}
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              accept='.json'
              onChange={(e) => {
                const fileReader = new FileReader();
                fileReader.readAsText(e.target.files[0]);
                fileReader.onload = async (event) => {
                  var file = event.target.result;
                  try {
                    var designs_json = JSON.parse(file);
                    const validated_json = await file_schema.validateAsync(designs_json)
                    var full_json = mergeJson(validated_json, base_json)
                    await user.firebaseUser.getIdToken().then((idToken) => {
                      api.setToken(idToken);
                    });
                    await api.postJob(full_json);
                    enqueueSnackbar('Job Created', {
                      variant: 'success'
                    });
                    history.push('/app/management/jobs');

                  } catch (e) {
                    enqueueSnackbar('Failed to create job: ' + e, {
                      variant: 'error'
                    });
                    console.log(e);
                  }
                };
              }}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                color='secondary'
                component="span"
                startIcon={<UploadIcon />}
              >
                Upload
              </Button>
            </label>
          </Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              className={classes.action}
              component={RouterLink}
              to="/app/management/jobs/create"
              startIcon={
                <SvgIcon fontSize="small">
                  <PlusCircleIcon />
                </SvgIcon>
              }
            >
              New Job
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
