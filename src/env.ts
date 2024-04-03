import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    AXIOM_TOKEN: z.string().min(8),
    AXIOM_ORG_ID: z.string().min(8),
  },
  client: {},
  runtimeEnv: {
    AXIOM_TOKEN: process.env.AXIOM_TOKEN,
    AXIOM_ORG_ID: process.env.AXIOM_ORG_ID,
  },
});
