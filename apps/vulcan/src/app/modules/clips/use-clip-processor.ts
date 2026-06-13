'use client';

import { downloadDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/core';

import { saturnClient } from '../../../services/saturn/saturn-api';
import { useAppDispatch } from '../../../store/hooks';
import { clipsActions } from './clips.slice';

export function useClipProcessor() {
  const dispatch = useAppDispatch();

  async function processFile(inputPath: string): Promise<void> {
    const id = crypto.randomUUID();
    dispatch(clipsActions.addJob({ id, inputPath }));

    try {
      dispatch(clipsActions.updateJobStatus({ id, status: 'extracting_audio' }));
      const audioPath: string = await invoke('extract_audio', { inputPath });

      dispatch(clipsActions.updateJobStatus({ id, status: 'transcribing' }));
      const transcript: string = await invoke('transcribe_audio', { audioPath });

      dispatch(clipsActions.updateJobStatus({ id, status: 'analyzing' }));
      const result = await saturnClient.v1.analysis.analyzeTranscript({
        body: { transcript },
      });

      if (result.status !== 200) throw new Error(`Saturn returned ${result.status}`);

      dispatch(clipsActions.setJobResult({ id, clipResult: result.body }));
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      dispatch(clipsActions.updateJobStatus({ id, status: 'failed', error }));
    }
  }

  async function confirmClip(
    id: string,
    inputPath: string,
    startSeconds: number,
    endSeconds: number,
  ): Promise<void> {
    dispatch(clipsActions.updateJobStatus({ id, status: 'trimming' }));
    try {
      const ext = inputPath.match(/(\.[^.]+)$/)?.[1] ?? '.mp4';
      const base = inputPath.replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, '');
      const outputPath = `${await downloadDir()}/${base}_clip${ext}`;

      await invoke('trim_clip', { inputPath, startSeconds, endSeconds, outputPath });
      dispatch(clipsActions.setJobDone({ id, outputPath }));
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      dispatch(clipsActions.updateJobStatus({ id, status: 'failed', error }));
    }
  }

  async function retryAnalysis(id: string, inputPath: string): Promise<void> {
    try {
      dispatch(clipsActions.updateJobStatus({ id, status: 'analyzing' }));

      // Reuse the WAV written next to the source file by the first pass
      const audioPath = inputPath.replace(/\.[^.]+$/, '.wav');
      const transcript: string = await invoke('transcribe_audio', { audioPath });

      const result = await saturnClient.v1.analysis.analyzeTranscript({
        body: { transcript },
      });
      if (result.status !== 200) throw new Error(`Saturn returned ${result.status}`);

      dispatch(clipsActions.setJobResult({ id, clipResult: result.body }));
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      dispatch(clipsActions.updateJobStatus({ id, status: 'failed', error }));
    }
  }

  return { processFile, confirmClip, retryAnalysis };
}
