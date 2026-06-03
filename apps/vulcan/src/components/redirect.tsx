import { redirect } from 'next/navigation';

export function Redirect({ path }: { path: string }) {
  return redirect(path);
}
