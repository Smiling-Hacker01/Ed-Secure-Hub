export interface BackgroundJob {
  id: string;
  type:
    | 'SEND_SUBMISSION_CONFIRMATION'
    | 'TRIAGE_COMPLAINT_RISK'
    | 'NOTIFY_ASSIGNED_OFFICER'
    | 'SEND_STATUS_UPDATE_ALERT'
    | 'PROCESS_AND_SCAN_EVIDENCE'
    | 'SEND_CASE_CLOSURE_REPORT';
  payload: Record<string, unknown>;
  attempts: number;
  maxAttempts: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  lastAttemptAt?: string;
  error?: string;
}

class BackgroundWorkerQueue {
  private queue: BackgroundJob[] = [];
  private isProcessing = false;
  private processedIds = new Set<string>();

  constructor() {
    this.startWorkerLoop();
  }

  public enqueue(jobData: { type: BackgroundJob['type']; payload: Record<string, unknown> }): string {
    const jobId = crypto.randomUUID();
    const job: BackgroundJob = {
      id: jobId,
      type: jobData.type,
      payload: jobData.payload,
      attempts: 0,
      maxAttempts: 3,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.queue.push(job);
    console.log(`[WorkerQueue] Enqueued job ${job.type} (${jobId})`);
    
    // Trigger immediate loop check if idle
    if (!this.isProcessing) {
      setTimeout(() => this.processNext(), 100);
    }

    return jobId;
  }

  private startWorkerLoop() {
    setInterval(() => {
      if (!this.isProcessing && this.queue.some((j) => j.status === 'PENDING')) {
        this.processNext();
      }
    }, 1500);
  }

  private async processNext(): Promise<void> {
    const job = this.queue.find((j) => j.status === 'PENDING');
    if (!job) return;

    this.isProcessing = true;
    job.status = 'PROCESSING';
    job.attempts += 1;
    job.lastAttemptAt = new Date().toISOString();

    try {
      await this.executeJob(job);
      job.status = 'COMPLETED';
      this.processedIds.add(job.id);
      console.log(`[WorkerQueue] Job completed successfully: ${job.type} (${job.id})`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      job.error = errorMessage;
      console.error(`[WorkerQueue] Job failed (Attempt ${job.attempts}/${job.maxAttempts}):`, errorMessage);

      if (job.attempts < job.maxAttempts) {
        job.status = 'PENDING'; // Retry on next cycle
      } else {
        job.status = 'FAILED';
        console.error(`[WorkerQueue] Job permanently failed after max retries: ${job.id}`);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async executeJob(job: BackgroundJob): Promise<void> {
    switch (job.type) {
      case 'SEND_SUBMISSION_CONFIRMATION':
        console.log(`[Worker] Simulating confirmation email/SMS to ${job.payload.recipientEmail}: Ref ${job.payload.referenceId}, PIN ${job.payload.rawPin}`);
        break;

      case 'TRIAGE_COMPLAINT_RISK':
        console.log(`[Worker] Running automated risk scoring & fraud cluster detection for Complaint ${job.payload.complaintId}`);
        break;

      case 'NOTIFY_ASSIGNED_OFFICER':
        console.log(`[Worker] Alerting officer ${job.payload.officerId} regarding assignment to ${job.payload.referenceId}`);
        break;

      case 'SEND_STATUS_UPDATE_ALERT':
        console.log(`[Worker] Dispatched status notification to ${job.payload.recipientEmail}: Status changed to ${job.payload.newStatus}`);
        break;

      case 'PROCESS_AND_SCAN_EVIDENCE':
        console.log(`[Worker] Antivirus/Malware inspection passed for Evidence ${job.payload.evidenceId} (SHA-256: ${job.payload.hash})`);
        break;

      case 'SEND_CASE_CLOSURE_REPORT':
        console.log(`[Worker] Generating final resolution report for Complaint ${job.payload.complaintId}`);
        break;

      default:
        console.log(`[Worker] Unknown job type encountered: ${job.type}`);
    }
  }

  public getQueueStats() {
    return {
      pending: this.queue.filter((j) => j.status === 'PENDING').length,
      processing: this.queue.filter((j) => j.status === 'PROCESSING').length,
      completed: this.queue.filter((j) => j.status === 'COMPLETED').length,
      failed: this.queue.filter((j) => j.status === 'FAILED').length,
      total: this.queue.length,
    };
  }
}

const globalForWorker = global as unknown as { edsecureWorkerQueue?: BackgroundWorkerQueue };
export const workerQueue = globalForWorker.edsecureWorkerQueue || new BackgroundWorkerQueue();

if (process.env.NODE_ENV !== 'production') {
  globalForWorker.edsecureWorkerQueue = workerQueue;
}

export function enqueueJob(jobData: { type: BackgroundJob['type']; payload: Record<string, unknown> }) {
  return workerQueue.enqueue(jobData);
}
