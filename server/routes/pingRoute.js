import { Router } from 'express';
const router = Router();

/**
 * Lightweight health‑check endpoint.
 * 204 No Content avoids oversize HTML that Render
 * may serve during a cold start, so cron‑job.org
 * never hits its 64 KB body limit.
 */
router.get('/ping', (req, res) => {
  res.sendStatus(204);   // <-- Empty body, just headers
});

export default router;
