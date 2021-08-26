import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useAuth from '../../../hooks/useAuth';
import api from '../../../api';
import { useSnackbar } from 'notistack'
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

const Header = ({ className, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

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
                console.log("log", e.target.files[0]);
                fileReader.readAsText(e.target.files[0]);
                fileReader.onload = async (event) => {
                  var file = event.target.result;
                  var json = JSON.parse(file);
                  console.log("log", file);
                  console.log("log", json.designs);
                  await user.firebaseUser.getIdToken().then((idToken) => {
                    api.setToken(idToken);
                  });
                  await api.postJob(json);
                  enqueueSnackbar('Job Created', {
                    variant: 'success'
                  });
                };
             }}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                color='secondary'
                component="span"
                startIcon={<UploadIcon/>}
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
