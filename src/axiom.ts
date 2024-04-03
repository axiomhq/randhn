'use server-only';
import { Axiom } from '@axiomhq/js';
import { env } from './env';

export const axiom = new Axiom({
  token: env.AXIOM_TOKEN,
  orgId: env.AXIOM_ORG_ID,
});
