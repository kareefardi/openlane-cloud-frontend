import { Box, Typography } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import getSinceTime from 'src/utils/getSince';
import JobMoreButton from 'src/views/job/JobListView/JobMoreButton';
import Label from 'src/components/Label';
import React from 'react';

export const getTypeLabel = (jobType) => {
  const map = {
    normal: {
      text: 'Regular',
      color: 'normal'
    },
    exploratory: {
      text: 'Exploratory',
      color: 'exploratory'
    }
  };

  const { text, color } = map[jobType];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
};

export const getStatusLabel = (jobStatus) => {
  const map = {
    submitted: {
      text: 'Submitted',
      color: 'primary'
    },
    cloning: {
      text: 'Cloning',
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
      color: 'running'
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
    'running-synthesis': {
      text: 'Synthesis',
      color: 'synthesis'
    },
    'running-floorplan': {
      text: 'Floorplan',
      color: 'floorplan'
    },
    'running-placement': {
      text: 'Placement',
      color: 'placement'
    },
    'running-cts': {
      text: 'CTS',
      color: 'cts'
    },
    'running-routing': {
      text: 'Routing',
      color: 'routing'
    },
    'running-lvs': {
      text: 'LVS',
      color: 'lvs'
    },
    'running-magic': {
      text: 'Magic',
      color: 'magic'
    }
  };

  const { text, color } = map[jobStatus];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
};

export const reportSections = [
  {
    sectionName: 'Overview',
    fields: [
      { id: 'STD_CELL_LIBRARY', label: 'Pdk variant' },
      { id: 'flow_status', label: 'Flow status' },
      { id: 'total_runtime', label: 'Total Runtime' },
      { id: 'Peak_Memory_Usage_MB', label: 'Peak Memory Usage', unit: true, unitLabel: 'Mb' },
      { id: 'cell_count', label: 'Cell Count' },
      { id: 'CellPer_mm^2', label: 'Area Per Cell', unit: true, unitLabel: 'mm^2' },
      { id: 'DIEAREA_mm^2', label: 'Die Area', unit: true, unitLabel: 'mm^2' },
      { id: '(Cell/mm^2)/Core_Util', label: 'Area Per Cell/Core Util' },
      { id: 'OpenDP_Util', label: 'OpenDP Util' }
    ]
  },
  {
    sectionName: 'Regression Variables',
    fields: [
      { id: 'GLB_RT_ADJUSTMENT', label: 'GLB_RT_ADJUSTMENT' },
      { id: 'PL_TARGET_DENSITY', label: 'PL_TARGET_DENSITY' },
      { id: 'FP_CORE_UTIL', label: 'FP_CORE_UTIL' },
      { id: 'FP_ASPECT_RATIO', label: 'FP_ASPECT_RATIO' },
      { id: 'FP_PDN_VPITCH', label: 'FP_PDN_VPITCH' },
      { id: 'FP_PDN_HPITCH', label: 'FP_PDN_HPITCH' },
      { id: 'SYNTH_MAX_FANOUT', label: 'SYNTH_MAX_FANOUT' },
      { id: 'SYNTH_STRATEGY', label: 'SYNTH_STRATEGY' },
      { id: 'CELL_PAD', label: 'CELL_PAD' }
    ]
  },
  {
    sectionName: 'Violations',
    fields: [
      { id: 'tritonRoute_violations', label: 'TritonRoute' },
      { id: 'Short_violations', label: 'Short' },
      { id: 'MetSpc_violations', label: 'MetSpc' },
      { id: 'OffGrid_violations', label: 'OffGrid' },
      { id: 'MinHole_violations', label: 'MinHole' },
      { id: 'Magic_violations', label: 'Magic' },
      { id: 'antenna_violations', label: 'Antenna' },
      { id: 'Other_violations', label: 'Other' }
    ]
  },
  {
    sectionName: 'Design Metrics',
    fields: [
      { id: 'wires_count', label: 'Wire Count' },
      { id: 'wire_length', label: 'Wire Length' },
      { id: 'wire_bits', label: 'Wire Bits' },
      { id: 'vias', label: 'Vias' },
      { id: 'wns', label: 'WNS' },
      { id: 'HPWL', label: 'HPWL' },
      { id: 'public_wires_count', label: 'Public Wires Count' },
      { id: 'public_wire_bits', label: 'Puble Wire Bits' },
      { id: 'memories_count', label: 'Memory Count' },
      { id: 'memory_bits', label: 'Memory Bits' },
      { id: 'processes_count', label: 'Processes Count' },
      { id: 'cells_pre_abc', label: 'Cells Pre abc' }
    ]
  },
  {
    sectionName: 'Logic Gates',
    fields: [
      { id: 'AND', label: 'AND' },
      { id: 'DFF', label: 'DFF' },
      { id: 'NAND', label: 'NAND' },
      { id: 'NOR', label: 'NOR' },
      { id: 'OR', label: 'OR' },
      { id: 'XOR', label: 'XOR' },
      { id: 'XNOR', label: 'XNOR' },
      { id: 'MUX', label: 'MUX' }
    ]
  },
  {
    sectionName: 'Other',
    fields: [
      { id: 'inputs', label: 'Inputs' },
      { id: 'outputs', label: 'Outputs' },
      { id: 'level', label: 'Level' },
      { id: 'EndCaps', label: 'EndCaps' },
      { id: 'TapCells', label: 'TapCells' },
      { id: 'Diodes', label: 'Diodes' },
      { id: 'Total_Physical_Cells', label: 'Total Physical Cells' },
      { id: 'CLOCK_PERIOD', label: 'Clock Period' }
    ]
  }
];

