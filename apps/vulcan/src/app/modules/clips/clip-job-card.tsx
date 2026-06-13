'use client';

import { Button, Spinner } from '@clipper/ui-web';

import { ClipJob } from './clips.slice';

type Props = {
  job: ClipJob;
  onConfirm: (startSeconds: number, endSeconds: number) => void;
  onRetry: () => void;
  onReveal: () => void;
};

const STATUS_LABELS: Partial<Record<ClipJob['status'], string>> = {
  pending: 'Queued',
  extracting_audio: 'Extracting audio…',
  transcribing: 'Transcribing…',
  analyzing: 'Analyzing with AI…',
  trimming: 'Trimming clip…',
};

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1);
  return `${m}:${sec.padStart(4, '0')}`;
}

export function ClipJobCard({ job, onConfirm, onRetry, onReveal }: Props) {
  const filename = job.inputPath.replace(/^.*[\\/]/, '');
  const spinnerStatus = STATUS_LABELS[job.status];

  return (
    <li className="rounded-lg border p-4 flex flex-col gap-3">
      <p className="text-sm font-medium truncate" title={job.inputPath}>
        {filename}
      </p>

      {spinnerStatus && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="h-4 w-4" />
          <span>{spinnerStatus}</span>
        </div>
      )}

      {job.status === 'ready' && job.clipResult?.found === true && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">{job.clipResult.clipTitle}</p>
            <p className="text-xs text-muted-foreground">{job.clipResult.reasoning}</p>
            <p className="text-xs">
              {formatSeconds(job.clipResult.startSeconds)} &ndash;{' '}
              {formatSeconds(job.clipResult.endSeconds)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() =>
                onConfirm(
                  (job.clipResult as Extract<NonNullable<ClipJob['clipResult']>, { found: true }>)
                    .startSeconds,
                  (job.clipResult as Extract<NonNullable<ClipJob['clipResult']>, { found: true }>)
                    .endSeconds,
                )
              }
            >
              Confirm
            </Button>
            <Button size="sm" variant="outline" onClick={onRetry}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {job.status === 'ready' && job.clipResult?.found === false && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            No highlight found: {job.clipResult.reasoning}
          </p>
          <Button size="sm" variant="outline" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}

      {job.status === 'done' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-600">Done</span>
          {job.outputPath && (
            <button
              className="text-xs text-muted-foreground underline underline-offset-2"
              onClick={onReveal}
            >
              {job.outputPath.replace(/^.*[\\/]/, '')}
            </button>
          )}
        </div>
      )}

      {job.status === 'failed' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-red-600">
            Failed{job.error ? `: ${job.error}` : ''}
          </p>
          <Button size="sm" variant="outline" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </li>
  );
}
