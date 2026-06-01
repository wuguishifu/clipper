import resend from '@convex-dev/resend/convex.config.js';
import { defineApp } from 'convex/server';

const app: ReturnType<typeof defineApp> = defineApp();

app.use(resend);

export default app;
