import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ClipResult } from '@clipper/contracts-saturn';

export type ClipJobStatus =
  | 'pending'
  | 'extracting_audio'
  | 'transcribing'
  | 'analyzing'
  | 'ready'
  | 'trimming'
  | 'done'
  | 'failed';

export type ClipJob = {
  id: string;
  inputPath: string;
  status: ClipJobStatus;
  outputPath?: string;
  error?: string;
  clipResult?: ClipResult;
  createdAt: number;
};

type ClipsState = {
  jobs: ClipJob[];
};

const initialState: ClipsState = {
  jobs: [],
};

export const clipsSlice = createSlice({
  name: 'clips',
  initialState,
  reducers: {
    addJob: (state, action: PayloadAction<{ id: string; inputPath: string }>) => {
      state.jobs.unshift({
        id: action.payload.id,
        inputPath: action.payload.inputPath,
        status: 'pending',
        createdAt: Date.now(),
      });
    },
    updateJobStatus: (
      state,
      action: PayloadAction<{ id: string; status: ClipJobStatus; error?: string }>,
    ) => {
      const job = state.jobs.find((j) => j.id === action.payload.id);
      if (!job) return;
      job.status = action.payload.status;
      if (action.payload.error !== undefined) job.error = action.payload.error;
    },
    setJobResult: (
      state,
      action: PayloadAction<{ id: string; clipResult: ClipResult }>,
    ) => {
      const job = state.jobs.find((j) => j.id === action.payload.id);
      if (!job) return;
      job.status = 'ready';
      job.clipResult = action.payload.clipResult;
    },
    setJobDone: (
      state,
      action: PayloadAction<{ id: string; outputPath: string }>,
    ) => {
      const job = state.jobs.find((j) => j.id === action.payload.id);
      if (!job) return;
      job.status = 'done';
      job.outputPath = action.payload.outputPath;
    },
  },
});

export const {
  name: clipsSliceName,
  actions: clipsActions,
  reducer: clipsReducer,
} = clipsSlice;
