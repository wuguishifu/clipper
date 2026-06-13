'use client';

import { open } from '@tauri-apps/plugin-dialog';

import { Button } from '@clipper/ui-web';

import { useAppSelector } from '../../../store/hooks';
import { ClipJobCard } from '../../modules/clips/clip-job-card';
import { useClipProcessor } from '../../modules/clips/use-clip-processor';

export default function ClipsPage() {
  const jobs = useAppSelector((state) => state.clips.jobs);
  const { processFile, confirmClip, retryAnalysis } = useClipProcessor();

  async function handleAddClips() {
    const selected = await open({
      multiple: true,
      filters: [
        { name: 'Video', extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm'] },
      ],
    });
    if (!selected) return;
    const paths = Array.isArray(selected) ? selected : [selected];
    for (const p of paths) {
      await processFile(p);
    }
  }

  return (
    <main className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clip Trimmer</h1>
        <Button onClick={handleAddClips}>Add clips</Button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No clips yet. Click &ldquo;Add clips&rdquo; to get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {jobs.map((job) => (
            <ClipJobCard
              key={job.id}
              job={job}
              onConfirm={(start, end) => confirmClip(job.id, job.inputPath, start, end)}
              onRetry={() => retryAnalysis(job.id, job.inputPath)}
              onReveal={() => {
                if (job.outputPath) alert(job.outputPath);
              }}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
