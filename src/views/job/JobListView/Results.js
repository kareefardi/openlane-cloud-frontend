import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles, TextField, InputAdornment, Link
} from '@material-ui/core';
import {
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon
} from 'react-feather';
import FilterListIcon from '@material-ui/icons/FilterList';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LaunchIcon from '@material-ui/icons/Launch';
import GenericMoreButton from 'src/components/GenericMoreButton';
import BulkOperations from './BulkOperations';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import getSinceTime from 'src/utils/getSince';
import TableContainer from '@material-ui/core/TableContainer';
import JobMoreButton from './JobMoreButton';
import { getStatusLabel, getTypeLabel } from 'src/constants/jobConstants';
import { applySort, applyPagination } from 'src/utils/sortingAndPagination';

export const jobFields = [
  {
    id: 'jobId', numeric: false, disablePadding: false, label: 'Job Id', jsx: (job) => {
      return <Link
        variant="subtitle1"
        color="secondary"
        to={`jobs/${job.id}/details`}
        component={RouterLink}
      >
        {job.id}
      </Link>;
    }
  },
  { id: 'designName', numeric: false, disablePadding: false, label: 'Design Name' },
  {
    id: 'type', numeric: false, disablePadding: false, label: 'Type', jsx: (job) => {
      return getTypeLabel(job.type);
    }
  },
  {
    id: 'status', numeric: false, disablePadding: false, label: 'Status', jsx: (job) => {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="left"
        >
          <Box flexShrink={1}>{getStatusLabel(job.status)}</Box>
          <Box display="flex" alignItems="center" flexShrink={1}>
            <AccessTimeIcon fontSize="small"/>
            <Box ml={1}>
              <Typography variant="overline" color="textSecondary">{getSinceTime(job.updatedAt)}</Typography>
            </Box>
          </Box>
        </Box>);
    }
  },
  {
    id: 'repoURL',
    numeric: false,
    disablePadding: false,
    label: 'Repo URL',
    link: true,
    linkLabel: 'Design Repository'
  },
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'Submission Time', timestamp: true },
  { id: 'completedAt', numeric: false, disablePadding: false, label: 'Completion Time', timestamp: true },
  {
    id: 'overflow', numeric: false, disablePadding: false, label: '', jsx: (job) => {
      return (<JobMoreButton job={job}/>);
    }
  }
];

const sortOptions = [
  {
    value: 'updatedAt|desc',
    label: 'Last update (newest first)'
  },
  {
    value: 'updatedAt|asc',
    label: 'Last update (oldest first)'
  }
];

const useStyles = makeStyles(() => ({
  root: {},
  queryField: {
    width: 500
  }
}));

const Results = ({ className, jobs, ...rest }) => {
  const classes = useStyles();
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [query, setQuery] = useState('');


  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    event.persist();
    setSort(event.target.value);
  };

  const handleRequestSort = (event, property) => {
    const [orderBy, order] = sort.split('|');
    const isAsc = orderBy === property && order === 'asc';
    setSort(`${property}|${isAsc ? 'desc' : 'asc'}`);
  };

  const handleSelectAllJobs = (event) => {
    setSelectedJobs(event.target.checked
      ? jobs.map((order) => order.id)
      : []);
  };

  const handleSelectOneOrder = (event, orderId) => {
    if (!selectedJobs.includes(orderId)) {
      setSelectedJobs((prevSelected) => [...prevSelected, orderId]);
    } else {
      setSelectedJobs((prevSelected) => prevSelected.filter((id) => id !== orderId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const sortedJobs = applySort(jobs, sort);
  const [orderBy, order] = sort.split('|');
  const paginatedJobs = applyPagination(sortedJobs, page, limit);
  const enableBulkOperations = selectedJobs.length > 0;
  const selectedSomeJobs = selectedJobs.length > 0 && selectedJobs.length < jobs.length;
  const selectedAllJobs = selectedJobs.length === jobs.length;

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Typography
        color="textSecondary"
        gutterBottom
        variant="body2"
      >
        {jobs.length}
        {' '}
        Records found. Page
        {' '}
        {page + 1}
        {' '}
        of
        {' '}
        {Math.ceil(jobs.length / limit)}
      </Typography>
      <Card>
        <CardHeader
          title="Jobs"
        />
        <Divider/>
        <Box
          p={2}
          minHeight={56}
          display="flex"
          alignItems="center"
        >
          <TextField
            className={classes.queryField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon
                    fontSize="small"
                    color="action"
                  >
                    <FilterListIcon/>
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder="Filter jobs i.e jobId:8"
            value={query}
            variant="outlined"
          />
          <Box flexGrow={1}/>
          <TextField
            label="Sort By"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option, optionIndex) => (
              <option
                key={optionIndex}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>
        <Divider/>
        <PerfectScrollbar>
          <TableContainer>
            <Table
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllJobs}
                      indeterminate={selectedSomeJobs}
                      onChange={handleSelectAllJobs}
                    />
                  </TableCell>
                  {jobFields.map((headCell, fieldIndex) => (
                    <TableCell
                      key={fieldIndex}
                      align={headCell.numeric ? 'right' : 'left'}
                      padding={headCell.disablePadding ? 'none' : 'default'}
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={(e) => handleRequestSort(e, headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedJobs.map((job, paginatedJobIndex) => {
                  const isJobSelected = selectedJobs.includes(job.id);

                  return (
                    <TableRow
                      key={paginatedJobIndex}
                      selected={selectedJobs.indexOf(job.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isJobSelected}
                          onChange={(event) => handleSelectOneOrder(event, job.id)}
                          value={isJobSelected}
                        />
                      </TableCell>
                      {jobFields.map((cell, fieldIndex) => (
                        <TableCell key={fieldIndex}>
                          {cell.jsx ? cell.jsx(job) :
                            cell.timestamp ?
                              <Typography variant="body2" color="textSecondary">
                                {job[cell.id] ? moment(job[cell.id]).format('DD MMM YYYY | hh:mm') : 'N/A'}
                              </Typography>
                              :
                              cell.link ?
                                <Link
                                  variant="subtitle1"
                                  color="secondary"
                                  target="_blank"
                                  rel="noreferrer"
                                  href={job[cell.id]}
                                >
                                  <Box display="flex" alignItems="center">
                                    <Box mr={1}>{cell.linkLabel}</Box>
                                    <LaunchIcon fontSize="small"/>
                                  </Box>
                                </Link>
                                : job[cell.id]}
                        </TableCell>
                      ))}
                      {/*{numeral(job.totalAmount).format(`${job.currency}0,0.00`)}*/}
                      {/*<IconButton*/}
                      {/*  component={RouterLink}*/}
                      {/*  to="/app/management/jobs/1"*/}
                      {/*>*/}
                      {/*  <SvgIcon fontSize="small">*/}
                      {/*    <ArrowRightIcon/>*/}
                      {/*  </SvgIcon>*/}
                      {/*</IconButton>*/}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={jobs.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <BulkOperations
        open={enableBulkOperations}
        selected={selectedJobs}
      />
    </div>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  jobs: PropTypes.array.isRequired
};

Results.defaultProps = {
  jobs: []
};

export default Results;
