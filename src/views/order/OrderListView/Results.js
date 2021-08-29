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
  makeStyles, TextField, InputAdornment
} from '@material-ui/core';
import {
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon
} from 'react-feather';
import FilterListIcon from '@material-ui/icons/FilterList';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Label from 'src/components/Label';
import GenericMoreButton from 'src/components/GenericMoreButton';
import BulkOperations from './BulkOperations';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import getSinceTime from 'src/utils/getSince';
import TableContainer from '@material-ui/core/TableContainer';
import JobMoreButton from './JobMoreButton';

const sortOptions = [
  {
    value: 'updatedAt|desc',
    label: 'Last update (newest first)'
  },
  {
    value: 'updatedAt|asc',
    label: 'Last update (oldest first)'
  },
  {
    value: 'orders|desc',
    label: 'Total orders (high to low)'
  },
  {
    value: 'orders|asc',
    label: 'Total orders (low to high)'
  }
];

const jobFields = [
  { id: 'jobId', numeric: false, disablePadding: true, label: 'Job Id' },
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
  { id: 'repoURL', numeric: false, disablePadding: false, label: 'Repo URL', link: true },
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'Submission Time', timestamp: true },
  { id: 'completedAt', numeric: false, disablePadding: false, label: 'Completion Time', timestamp: true },
  {
    id: 'overflow', numeric: false, disablePadding: false, label: '', jsx: (job) => {
      return (<JobMoreButton job={job}/>);
    }
  }
];

const getTypeLabel = (jobType) => {
  const map = {
    normal: {
      text: 'Regular',
      color: 'primary'
    },
    exploratory: {
      text: 'Exploratory',
      color: 'secondary'
    }
  };

  const { text, color } = map[jobType];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
};

const getStatusLabel = (jobStatus) => {
  const map = {
    submitted: {
      text: 'Submitted',
      color: 'primary'
    },
    scheduled: {
      text: 'Scheduled',
      color: 'secondary'
    },
    archiving: {
      text: 'Archiving',
      color: 'archiving'
    },
    running: {
      text: 'Running',
      color: 'error'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    },
    stopped: {
      text: 'Stopped',
      color: 'warning'
    },
    stopping: {
      text: 'Stopping',
      color: 'warning'
    },
    failed: {
      text: 'Failed',
      color: 'error'
    },
    published: {
      text: 'Published',
      color: 'secondary'
    }
  };

  const { text, color } = map[jobStatus];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
};

const applyPagination = (jobs, page, limit) => {
  return jobs.slice(page * limit, page * limit + limit);
};

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const applySort = (customers, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = customers.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};

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
          action={<GenericMoreButton/>}
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
            fullwidth
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
            {sortOptions.map((option) => (
              <option
                key={option.value}
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
                  {jobFields.map((headCell) => (
                    <TableCell
                      key={headCell.id}
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
                {paginatedJobs.map((job) => {
                  const isJobSelected = selectedJobs.includes(job.id);

                  return (
                    <TableRow
                      key={job.id}
                      selected={selectedJobs.indexOf(job.id) !== -1}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isJobSelected}
                          onChange={(event) => handleSelectOneOrder(event, job.id)}
                          value={isJobSelected}
                        />
                      </TableCell>
                      {jobFields.map((cell, i) => (
                        <TableCell key={i}>
                          {cell.jsx ? cell.jsx(job) :
                            cell.timestamp ?
                              <Typography variant="body2" color="textSecondary">
                                {job[cell.id] ? moment(job[cell.id]).format('DD MMM YYYY | hh:mm') : 'N/A'}
                              </Typography>
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
