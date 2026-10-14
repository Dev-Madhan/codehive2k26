import nodemailer, { type Transporter } from "nodemailer";
import * as fs from "fs";
import * as path from "path";
import { ValidatedRecipient } from "./validator";
import { renderAgentVibeHtmlEmail, renderAgentVibePlainTextEmail, EMAIL_SUBJECT } from "./renderer";

export type { ValidatedRecipient };

export interface MailerConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export interface SendResult {
  recipientEmail: string;
  teamName: string;
  status: "ACCEPTED" | "FAILED" | "SKIPPED_DUPLICATE" | "DRY_RUN_PASSED";
  messageId?: string;
  error?: string;
  attempts: number;
  timestamp: string;
}

export interface CampaignState {
  campaignName: string;
  startedAt: string;
  completedAt?: string;
  isDryRun: boolean;
  totalRecipients: number;
  acceptedCount: number;
  failedCount: number;
  skippedCount: number;
  results: Record<string, SendResult>;
}

export class AgentVibeMailerService {
  private transporter: Transporter | null = null;
  private config: MailerConfig;
  private logDir: string;
  private stateFilePath: string;
  private campaignState: CampaignState;

  constructor(config: MailerConfig, logDir?: string) {
    this.config = config;
    this.logDir = logDir || path.join(__dirname, "..", "logs");
    this.stateFilePath = path.join(this.logDir, "campaign_state.json");

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    this.campaignState = this.loadState();
  }

  private loadState(): CampaignState {
    if (fs.existsSync(this.stateFilePath)) {
      try {
        const raw = fs.readFileSync(this.stateFilePath, "utf-8");
        return JSON.parse(raw);
      } catch (err) {
        console.warn("⚠️ Warning: Failed to parse existing state file, starting fresh.");
      }
    }

    return {
      campaignName: "AGENT_VIBE_PRELIMINARY_ANNOUNCEMENT",
      startedAt: new Date().toISOString(),
      isDryRun: true,
      totalRecipients: 0,
      acceptedCount: 0,
      failedCount: 0,
      skippedCount: 0,
      results: {},
    };
  }

  private saveState(): void {
    fs.writeFileSync(this.stateFilePath, JSON.stringify(this.campaignState, null, 2), "utf-8");
  }

  public initTransporter(): void {
    if (this.transporter) return;

    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.port === 465,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });
  }

  public async verifyConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      this.initTransporter();
      if (!this.transporter) throw new Error("Transporter not initialized");
      await this.transporter.verify();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || String(err) };
    }
  }

  /**
   * Send single test email
   */
  public async sendTestEmail(targetEmail: string, sampleRecipient: ValidatedRecipient): Promise<SendResult> {
    this.initTransporter();
    const html = renderAgentVibeHtmlEmail({ recipient: sampleRecipient });
    const text = renderAgentVibePlainTextEmail({ recipient: sampleRecipient });

    const subject = `[TEST] ${EMAIL_SUBJECT}`;
    console.log(`🚀 Dispatching single TEST email to: ${targetEmail}...`);

    try {
      if (!this.transporter) throw new Error("Transporter not initialized");

      const info = await this.transporter.sendMail({
        from: this.config.from,
        to: targetEmail,
        subject,
        html,
        text,
      });

      console.log(`✅ Test email successfully accepted! MessageId: ${info.messageId}`);
      return {
        recipientEmail: targetEmail,
        teamName: sampleRecipient.teamName,
        status: "ACCEPTED",
        messageId: info.messageId,
        attempts: 1,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      console.error(`❌ Test send failed:`, err);
      return {
        recipientEmail: targetEmail,
        teamName: sampleRecipient.teamName,
        status: "FAILED",
        error: err.message || String(err),
        attempts: 1,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Execute or simulate campaign with idempotency, duplicate prevention, and retries
   */
  public async runCampaign(
    recipients: ValidatedRecipient[],
    isDryRun: boolean = true,
    delayMs: number = 300
  ): Promise<CampaignState> {
    this.campaignState.isDryRun = isDryRun;
    this.campaignState.totalRecipients = recipients.length;
    this.campaignState.startedAt = new Date().toISOString();
    this.campaignState.acceptedCount = 0;
    this.campaignState.failedCount = 0;
    this.campaignState.skippedCount = 0;

    if (!isDryRun) {
      this.initTransporter();
    }

    console.log(`\n======================================================`);
    console.log(`  CAMPAIGN EXECUTION: ${isDryRun ? "DRY-RUN MODE (SIMULATION)" : "LIVE DISPATCH"}`);
    console.log(`  Total Recipients: ${recipients.length} team leaders`);
    console.log(`======================================================\n`);

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const email = recipient.leaderEmail;
      const progressPrefix = `[${(i + 1).toString().padStart(2, "0")}/${recipients.length}]`;

      // 1. Idempotency Check: Was this recipient already successfully sent?
      const existing = this.campaignState.results[email];
      if (existing && existing.status === "ACCEPTED" && !isDryRun) {
        console.log(`${progressPrefix} ⏩ SKIPPING ${email} (${recipient.teamName}) — Already accepted in prior execution.`);
        this.campaignState.skippedCount++;
        continue;
      }

      // 2. Render templates
      const html = renderAgentVibeHtmlEmail({ recipient });
      const text = renderAgentVibePlainTextEmail({ recipient });

      if (isDryRun) {
        // DRY RUN: Simulate send
        console.log(`${progressPrefix} 🔍 DRY-RUN VALIDATED: "${recipient.teamName}" -> <${email}> [Slot: ${recipient.assignedSlotId || "UNASSIGNED"}]`);
        this.campaignState.results[email] = {
          recipientEmail: email,
          teamName: recipient.teamName,
          status: "DRY_RUN_PASSED",
          attempts: 1,
          timestamp: new Date().toISOString(),
        };
        this.campaignState.acceptedCount++;
        await new Promise((r) => setTimeout(r, 20)); // tiny yield
        continue;
      }

      // 3. LIVE SEND WITH RETRIES
      let attempts = 0;
      let sentSuccess = false;
      let lastError = "";
      let messageId = "";
      const maxRetries = 3;

      while (attempts < maxRetries && !sentSuccess) {
        attempts++;
        try {
          if (!this.transporter) throw new Error("Transporter not initialized");

          console.log(`${progressPrefix} ✉️ Dispatching to ${email} (${recipient.teamName}) [Attempt ${attempts}/${maxRetries}]...`);

          const info = await this.transporter.sendMail({
            from: this.config.from,
            to: email,
            subject: EMAIL_SUBJECT,
            html,
            text,
          });

          sentSuccess = true;
          messageId = info.messageId;
          console.log(`${progressPrefix} ✅ ACCEPTED: ${email} — MessageId: ${messageId}`);
        } catch (err: any) {
          lastError = err.message || String(err);
          console.warn(`${progressPrefix} ⚠️ Attempt ${attempts} failed for ${email}: ${lastError}`);
          if (attempts < maxRetries) {
            const backoffMs = attempts * 1500;
            console.log(`   ⏳ Backing off for ${backoffMs}ms before retry...`);
            await new Promise((r) => setTimeout(r, backoffMs));
          }
        }
      }

      if (sentSuccess) {
        this.campaignState.acceptedCount++;
        this.campaignState.results[email] = {
          recipientEmail: email,
          teamName: recipient.teamName,
          status: "ACCEPTED",
          messageId,
          attempts,
          timestamp: new Date().toISOString(),
        };
      } else {
        this.campaignState.failedCount++;
        this.campaignState.results[email] = {
          recipientEmail: email,
          teamName: recipient.teamName,
          status: "FAILED",
          error: lastError,
          attempts,
          timestamp: new Date().toISOString(),
        };
      }

      this.saveState();

      // Delay between sends to maintain healthy delivery cadence
      if (delayMs > 0 && i < recipients.length - 1) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }

    this.campaignState.completedAt = new Date().toISOString();
    this.saveState();

    return this.campaignState;
  }
}
