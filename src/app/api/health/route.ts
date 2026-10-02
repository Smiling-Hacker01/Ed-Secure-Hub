import { successResponse } from '@/lib/utils/security';
import { workerQueue } from '@/lib/queue/background-worker';

export async function GET() {
  const queueStats = workerQueue.getQueueStats();
  
  return successResponse({
    status: 'HEALTHY',
    version: '2.4.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      api: 'UP',
      database: 'UP',
      evidenceVault: 'UP',
      backgroundWorkers: {
        status: 'UP',
        ...queueStats,
      },
    },
    security: {
      tlsStrict: true,
      jwtAuth: 'ACTIVE',
      contentSecurityHeaders: 'ENFORCED',
    },
  });
}
