import { ValidatedRecipient } from "./validator";

export interface EmailRenderOptions {
  recipient: ValidatedRecipient;
  eventDate?: string;
  supportContact?: string;
}

export const EMAIL_SUBJECT = "Action Required: Agent Vibe AI Quiz – Preliminary Round Instructions for Team Leaders";

/**
 * Generate high-contrast, client-safe HTML email template for Agent Vibe Preliminary Round
 */
export function renderAgentVibeHtmlEmail(options: EmailRenderOptions): string {
  const { recipient, eventDate = "Official Preliminary Round" } = options;
  const leaderFirstName = recipient.leaderName.split(" ")[0] || recipient.leaderName;
  const slotDisplay = recipient.assignedSlotId && recipient.assignedSlotId !== "UNASSIGNED" 
    ? recipient.assignedSlotId 
    : "To be announced immediately before round commencement";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Agent Vibe – AI Agent Quiz Preliminary Round Guidelines</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a, h1, h2, h3 { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #050505;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #E5E5E5;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    a {
      color: #38BDF8;
      text-decoration: underline;
    }
    a[x-apple-data-detectors],
    .no-link-style a {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    u + #body a {
      color: inherit !important;
      text-decoration: none !important;
    }
    @media only screen and (max-width: 620px) {
      .email-wrapper {
        width: 100% !important;
        padding: 10px !important;
      }
      .content-container {
        padding: 24px 16px !important;
      }
      .stat-cell {
        display: block !important;
        width: 100% !important;
        margin-bottom: 12px !important;
      }
    }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #050505; color: #E5E5E5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050505; padding: 24px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" class="email-wrapper" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; background-color: #0D0D0D; border: 1px solid #262626; border-collapse: collapse;">
          
          <!-- Top Neon Accent Header Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #FFFFFF 0%, #38BDF8 50%, #818CF8 100%); background-color: #FFFFFF; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td align="center" style="padding: 32px 24px 20px 24px; border-bottom: 1px solid #262626; text-align: center; background-color: #0D0D0D;">
              <!-- Verification Pill Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 14px auto;">
                <tr>
                  <td style="background-color: #171717; border: 1px solid #404040; padding: 5px 14px; border-radius: 4px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #38BDF8; text-transform: uppercase; letter-spacing: 1.5px;">
                      &#9679; OFFICIAL COMPETITION DISPATCH // PRELIMINARY ROUND
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Main Brand Title -->
              <h1 style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: 1px; text-transform: uppercase;">
                AGENT VIBE
              </h1>
              <p style="margin: 0 0 10px 0; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 700; color: #A3A3A3; letter-spacing: 2px; text-transform: uppercase;">
                AI AGENT QUIZ &bull; CODEHIVE 2K26
              </p>
              <p style="margin: 0; font-size: 12px; color: #737373;">
                National Level Technical Symposium &amp; AI Challenge
              </p>
            </td>
          </tr>

          <!-- Team Leader Allocation Card -->
          <tr>
            <td style="padding: 20px 24px 0 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #141414; border: 1px solid #333333; border-left: 4px solid #38BDF8;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td valign="top" style="font-size: 12px; color: #A3A3A3; line-height: 1.5;">
                          <div><span style="font-family: 'Courier New', monospace; text-transform: uppercase; color: #737373; font-size: 10px; font-weight: 700;">AUTHORIZED RECIPIENT:</span></div>
                          <div style="font-size: 15px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">${recipient.leaderName}</div>
                          <div style="font-size: 12px; color: #A3A3A3; margin-top: 2px;">Team Leader &bull; <strong style="color: #FFFFFF;">${recipient.teamName}</strong></div>
                        </td>
                        <td align="right" valign="middle" style="text-align: right;">
                          <span style="display: inline-block; background-color: #1E293B; border: 1px solid #38BDF8; color: #38BDF8; font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 3px;">
                            ${recipient.registrationNumber ? recipient.registrationNumber : "APPROVED LEADER"}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td class="content-container" style="padding: 24px 24px 28px 24px;">

              <!-- Greeting -->
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #FFFFFF; font-weight: 600;">
                Dear ${leaderFirstName},
              </p>

              <!-- Announcement Intro -->
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #D4D4D4; line-height: 1.65;">
                Welcome to <strong style="color: #FFFFFF;">Codehive 2K26</strong>! This is the official directive regarding the <strong style="color: #38BDF8;">Agent Vibe AI Agent Quiz Preliminary Round</strong>.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 13px; color: #A3A3A3; line-height: 1.65;">
                The Preliminary Round is designed to evaluate your team's fundamental AI knowledge, quick thinking, and problem-solving skills in a competitive, fast-paced environment. Please read all guidelines below thoroughly to ensure your team is fully prepared.
              </p>

              <!-- Section: Platform & Slot Allocation -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #121212; border: 1px solid #262626; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; color: #38BDF8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                      [ 01 // PLATFORM &amp; SLOT ALLOCATION ]
                    </div>
                    <h2 style="margin: 0 0 14px 0; font-size: 16px; font-weight: 700; color: #FFFFFF;">
                      Kahoot &bull; 6 Slots Architecture
                    </h2>
                    
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #CCCCCC; line-height: 1.6;">
                      <tr>
                        <td width="20" valign="top" style="color: #38BDF8; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 8px;">
                          <strong style="color: #FFFFFF;">Quiz Platform:</strong> Hosted online on <a href="https://kahoot.it" target="_blank" style="color: #38BDF8; text-decoration: underline; font-weight: 600;">Kahoot (kahoot.it)</a> and the Kahoot mobile app.
                        </td>
                      </tr>
                      <tr>
                        <td width="20" valign="top" style="color: #38BDF8; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 8px;">
                          <strong style="color: #FFFFFF;">6 Distinct Slots:</strong> All registered teams are distributed across exactly <strong>six (6) slots</strong> to ensure balanced server load and fair competition.
                        </td>
                      </tr>
                      <tr>
                        <td width="20" valign="top" style="color: #38BDF8; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 8px;">
                          <strong style="color: #FFFFFF;">Dedicated Rooms:</strong> Each slot operates in a separate Kahoot game room with its own unique <strong>Game PIN</strong>.
                        </td>
                      </tr>
                      <tr>
                        <td width="20" valign="top" style="color: #38BDF8; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 8px;">
                          <strong style="color: #FFFFFF;">Mandatory Assigned Participation:</strong> Teams must participate exclusively in their assigned slot. Joining an unassigned slot without coordinator permission will lead to invalidation.
                        </td>
                      </tr>
                      <tr>
                        <td width="20" valign="top" style="color: #38BDF8; font-weight: bold;">&bull;</td>
                        <td>
                          <strong style="color: #FFFFFF;">Slot Status:</strong> <span style="color: #FBBF24; font-family: 'Courier New', monospace; font-weight: 600;">${slotDisplay}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Section: Game PIN Announcement Procedure -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #121212; border: 1px solid #262626; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; color: #F59E0B; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                      [ 02 // GAME PIN DISTRIBUTION PROCEDURE ]
                    </div>
                    <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #FFFFFF;">
                      Live Slot Announcement
                    </h2>
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #CCCCCC; line-height: 1.6;">
                      To preserve fairness and prevent unauthorized early room entries, <strong style="color: #FFFFFF;">no Game PINs are distributed in advance</strong>.
                    </p>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #171717; border-left: 3px solid #F59E0B; padding: 12px 14px;">
                      <tr>
                        <td style="font-size: 12px; color: #E5E5E5; line-height: 1.5;">
                          <strong>Official Distribution Rule:</strong> Event coordinators will announce your team's assigned <strong>Slot ID and Game PIN immediately before the respective round begins</strong> via the official event coordination desk / communication channel. Be on standby 10 minutes prior to your round.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Section: Nickname Convention & 15-Char Limit -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #121212; border: 2px solid #38BDF8; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; color: #38BDF8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                      [ 03 // MANDATORY KAHOOT NICKNAME CONVENTION ]
                    </div>
                    <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #FFFFFF;">
                      Format: Name (TeamName) &bull; Maximum 15 Characters
                    </h2>
                    <p style="margin: 0 0 14px 0; font-size: 13px; color: #CCCCCC; line-height: 1.6;">
                      Kahoot enforces a strict <strong style="color: #EF4444;">15-character limit</strong> for all nicknames. To enable accurate leaderboard tracking and team verification, you must join using this exact format:
                    </p>
                    
                    <!-- Code Tile -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050505; border: 1px dashed #38BDF8; margin-bottom: 14px; text-align: center;">
                      <tr>
                        <td style="padding: 14px; font-family: 'Courier New', Courier, monospace; font-size: 18px; font-weight: 700; color: #38BDF8; letter-spacing: 1px;">
                          Name (TeamName)
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #A3A3A3; line-height: 1.5;">
                      <tr>
                        <td style="padding-bottom: 6px;">
                          <strong style="color: #FFFFFF;">Canonical Example:</strong> <code style="color: #38BDF8; font-family: 'Courier New', monospace;">Arun (ByteRiders)</code>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 6px;">
                          <strong style="color: #EF4444;">Important Character Limit Warning:</strong> Kahoot truncates any input beyond 15 characters. Not all names and team names will fit in full.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong style="color: #FFFFFF;">Pre-Round Requirement:</strong> You must <strong>verify your nickname length before joining</strong>. Use a shortened first name and an abbreviated team name if needed (e.g., <code style="color: #E5E5E5; font-family: 'Courier New', monospace;">Sam (Codex)</code> = 11 chars) to ensure it stays strictly within 15 characters without truncation.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Section: Step-by-Step Quiz Participation Instructions -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #121212; border: 1px solid #262626; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; color: #A3A3A3; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                      [ 04 // STEP-BY-STEP PARTICIPATION PROTOCOL ]
                    </div>
                    <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #FFFFFF;">
                      How to Participate
                    </h2>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #CCCCCC; line-height: 1.6;">
                      <tr>
                        <td width="28" valign="top" style="font-family: 'Courier New', monospace; font-weight: 700; color: #38BDF8;">01.</td>
                        <td style="padding-bottom: 10px;">Be prepared with a stable internet connection 10 minutes prior to your team's assigned slot.</td>
                      </tr>
                      <tr>
                        <td width="28" valign="top" style="font-family: 'Courier New', monospace; font-weight: 700; color: #38BDF8;">02.</td>
                        <td style="padding-bottom: 10px;">Open your web browser and navigate to <a href="https://kahoot.it" target="_blank" style="color: #38BDF8; font-weight: 600;">https://kahoot.it</a> or launch the Kahoot mobile application.</td>
                      </tr>
                      <tr>
                        <td width="28" valign="top" style="font-family: 'Courier New', monospace; font-weight: 700; color: #38BDF8;">03.</td>
                        <td style="padding-bottom: 10px;">Wait for the event coordinator to formally broadcast your assigned Slot ID and Game PIN.</td>
                      </tr>
                      <tr>
                        <td width="28" valign="top" style="font-family: 'Courier New', monospace; font-weight: 700; color: #38BDF8;">04.</td>
                        <td style="padding-bottom: 10px;">Enter the exact Game PIN designated for your slot.</td>
                      </tr>
                      <tr>
                        <td width="28" valign="top" style="font-family: 'Courier New', monospace; font-weight: 700; color: #38BDF8;">05.</td>
                        <td style="padding-bottom: 10px;">Enter your verified nickname in the prescribed <code style="color: #38BDF8; font-family: 'Courier New', monospace;">Name (TeamName)</code> format within the 15-char limit.</td>
                      </tr>
                      <tr>
                        <td width="28" valign="top" style="font-family: 'Courier New', monospace; font-weight: 700; color: #38BDF8;">06.</td>
                        <td style="padding-bottom: 10px;">Enter the game lobby and verify that your nickname is visible on screen. Wait for the host to commence.</td>
                      </tr>
                      <tr>
                        <td width="28" valign="top" style="font-family: 'Courier New', monospace; font-weight: 700; color: #38BDF8;">07.</td>
                        <td style="padding-bottom: 10px;">Read each AI question carefully and submit your answer as quickly and accurately as possible.</td>
                      </tr>
                      <tr>
                        <td width="28" valign="top" style="font-family: 'Courier New', monospace; font-weight: 700; color: #38BDF8;">08.</td>
                        <td>Remain responsive to live audio or text instructions from the event coordinators throughout the quiz.</td>
                      </tr>
                    </table>

                    <!-- Kahoot Direct Button -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 20px auto 4px auto;">
                      <tr>
                        <td align="center" style="background-color: #38BDF8; padding: 12px 28px; border-radius: 4px;">
                          <a href="https://kahoot.it" target="_blank" style="color: #000000 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; display: inline-block;">
                            OPEN KAHOOT.IT &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Section: Scoring & Qualification Criteria -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #121212; border: 1px solid #262626; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; color: #10B981; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                      [ 05 // SCORING &amp; QUALIFICATION CRITERIA ]
                    </div>
                    <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #FFFFFF;">
                      Top 3 Teams Advance Per Slot
                    </h2>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #CCCCCC; line-height: 1.6;">
                      <tr>
                        <td width="20" valign="top" style="color: #10B981; font-weight: bold;">&check;</td>
                        <td style="padding-bottom: 8px;">
                          <strong style="color: #FFFFFF;">Scoring Algorithm:</strong> Points are awarded based on <strong>answer correctness and response speed</strong>. Faster correct answers yield higher points.
                        </td>
                      </tr>
                      <tr>
                        <td width="20" valign="top" style="color: #10B981; font-weight: bold;">&check;</td>
                        <td style="padding-bottom: 8px;">
                          <strong style="color: #FFFFFF;">Slot Qualification Rule:</strong> The <strong>top 3 teams from each of the 6 slots</strong> automatically qualify for the Main Event.
                        </td>
                      </tr>
                      <tr>
                        <td width="20" valign="top" style="color: #10B981; font-weight: bold;">&check;</td>
                        <td>
                          <strong style="color: #FFFFFF;">Qualifying Cohort:</strong> This yields up to <strong>18 qualifying team positions</strong> in total advancing to the Agent Vibe Main Event.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Section: Warnings & Session Disconnection Risk -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #190B0B; border: 1px solid #7F1D1D; border-left: 4px solid #EF4444; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-family: 'Courier New', monospace; font-size: 11px; font-weight: 700; color: #EF4444; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                      &excl; CRITICAL COMPETITION RULES &amp; WARNINGS
                    </div>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #FCA5A5; line-height: 1.6;">
                      <tr>
                        <td width="16" valign="top" style="color: #EF4444; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 6px;">
                          <strong style="color: #FFFFFF;">Do NOT Refresh or Close Tab:</strong> Refreshing the browser, closing the quiz tab, or switching apps on mobile may permanently disconnect your session. Disconnected sessions cannot be restored midway.
                        </td>
                      </tr>
                      <tr>
                        <td width="16" valign="top" style="color: #EF4444; font-weight: bold;">&bull;</td>
                        <td>
                          <strong style="color: #FFFFFF;">No Unauthorized Aliases / Emojis:</strong> Avoid random emojis, offensive nicknames, or aliases that do not match your registered team name. Participants violating the naming rules will be immediately removed from the lobby by coordinators.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Closing -->
              <p style="margin: 0 0 4px 0; font-size: 13px; color: #A3A3A3; line-height: 1.6;">
                Best of luck to you and your team!
              </p>
              <p style="margin: 16px 0 0 0; font-size: 13px; color: #FFFFFF; font-weight: 600; line-height: 1.5;">
                Regards,<br />
                <span style="font-weight: 700; color: #38BDF8;">Agent Vibe Event Coordination Team</span><br />
                <span style="color: #A3A3A3; font-weight: 400; font-size: 12px;">Codehive 2K26 Organizing Committee</span>
              </p>

            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="border-top: 1px solid #262626; padding: 22px 20px; text-align: center; background-color: #080808;">
              <p style="margin: 0 0 6px 0; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 1px;">
                CODEHIVE 2K26 &bull; OFFICIAL EMAIL DISPATCH SYSTEM
              </p>
              <p style="margin: 0; font-size: 11px; color: #525252; line-height: 1.4;">
                This automated briefing was dispatched exclusively to registered team leaders of Agent Vibe. Do not forward this communication.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generate 100% matching Plain-Text fallback email
 */
export function renderAgentVibePlainTextEmail(options: EmailRenderOptions): string {
  const { recipient } = options;
  const leaderFirstName = recipient.leaderName.split(" ")[0] || recipient.leaderName;
  const slotDisplay = recipient.assignedSlotId && recipient.assignedSlotId !== "UNASSIGNED" 
    ? recipient.assignedSlotId 
    : "To be announced immediately before round commencement";

  return `================================================================================
AGENT VIBE – AI AGENT QUIZ (PRELIMINARY ROUND) // CODEHIVE 2K26
Official Competition Guidelines for Team Leaders
================================================================================

Authorized Recipient: ${recipient.leaderName}
Team Name: ${recipient.teamName}
Registration ID: ${recipient.registrationNumber || "APPROVED LEADER"}

Dear ${leaderFirstName},

Welcome to Codehive 2K26! This is the official directive regarding the Agent Vibe AI Agent Quiz Preliminary Round.

The Preliminary Round is designed to evaluate your team's fundamental AI knowledge, quick thinking, and problem-solving skills in a competitive, fast-paced environment. Please read all guidelines below thoroughly to ensure your team is fully prepared.

--------------------------------------------------------------------------------
01. PLATFORM & SLOT ALLOCATION
--------------------------------------------------------------------------------
- Quiz Platform: Hosted online on Kahoot (https://kahoot.it) or via the Kahoot mobile app.
- 6 Distinct Slots: All registered teams are distributed across six (6) slots.
- Dedicated Rooms: Each slot operates in a separate Kahoot game room with its own unique Game PIN.
- Mandatory Assigned Participation: Teams must participate exclusively in their assigned slot. Joining an unassigned slot without coordinator permission will lead to invalidation.
- Slot Status: ${slotDisplay}

--------------------------------------------------------------------------------
02. GAME PIN DISTRIBUTION PROCEDURE
--------------------------------------------------------------------------------
To preserve fairness and prevent unauthorized early room entries, NO Game PINs are distributed in advance.
Event coordinators will announce your team's assigned Slot ID and Game PIN immediately before the respective round begins via the official event coordination desk / communication channel. Be on standby 10 minutes prior to your round.

--------------------------------------------------------------------------------
03. MANDATORY KAHOOT NICKNAME CONVENTION (MAX 15 CHARACTERS)
--------------------------------------------------------------------------------
Kahoot enforces a strict 15-character limit for all nicknames. You must join using this exact format:

  Name (TeamName)

Canonical Example: Arun (ByteRiders)

CRITICAL NICKNAME LENGTH INSTRUCTION:
Kahoot truncates any input beyond 15 characters. Not all names and team names will fit in full.
You MUST verify your nickname length before joining. Use a shortened first name and an abbreviated team name if needed (e.g., "Sam (Codex)" = 11 chars) to ensure it stays strictly within the 15-character limit without truncation.

--------------------------------------------------------------------------------
04. STEP-BY-STEP PARTICIPATION PROTOCOL
--------------------------------------------------------------------------------
1. Be prepared with a stable internet connection 10 minutes prior to your team's assigned slot.
2. Open your web browser and navigate to https://kahoot.it or launch the Kahoot app.
3. Wait for the event coordinator to formally broadcast your assigned Slot ID and Game PIN.
4. Enter the exact Game PIN designated for your slot.
5. Enter your verified nickname in the prescribed "Name (TeamName)" format within 15 chars.
6. Enter the game lobby and verify that your nickname is visible on screen. Wait for the host to commence.
7. Read each AI question carefully and submit your answer as quickly and accurately as possible.
8. Follow all live audio or text instructions from the event coordinators throughout the quiz.

Official Kahoot Portal: https://kahoot.it

--------------------------------------------------------------------------------
05. SCORING & QUALIFICATION CRITERIA
--------------------------------------------------------------------------------
- Scoring Algorithm: Points are awarded based on answer correctness and response speed. Faster correct answers yield higher points.
- Slot Qualification Rule: The top 3 teams from each of the 6 slots automatically qualify for the Main Event.
- Qualifying Cohort: This results in up to 18 qualifying team positions in total advancing to the Agent Vibe Main Event.

--------------------------------------------------------------------------------
06. CRITICAL WARNINGS & DISQUALIFICATION RULES
--------------------------------------------------------------------------------
- DO NOT REFRESH OR CLOSE TAB: Refreshing the browser, closing the quiz tab, or switching apps on mobile may permanently disconnect your session. Disconnected sessions cannot be restored midway.
- NO UNAUTHORIZED ALIASES OR EMOJIS: Avoid random emojis, offensive nicknames, or aliases that do not match your registered team name. Participants who violate naming rules will be immediately removed from the lobby.

Best of luck to you and your team!

Regards,
Agent Vibe Event Coordination Team
Codehive 2K26 Organizing Committee
================================================================================
Dispatched exclusively to registered team leaders of Agent Vibe.`;
}
