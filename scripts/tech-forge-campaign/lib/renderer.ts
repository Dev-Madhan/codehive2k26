import { ValidatedRecipient } from "./validator";

export interface EmailRenderOptions {
  recipient: ValidatedRecipient;
}

export const OFFICIAL_HACKERRANK_URL = "https://www.hackerrank.com/tech-forge-codehive2k26";
export const EMAIL_SUBJECT = "Action Required: Tech Forge Pre-Elimination Round – Team Leader Instructions";
export const EVENT_WINDOW_DISPLAY = "15 October 2026, 12:00 AM IST – 16 October 2026, 12:00 AM IST";

/**
 * Generate a high-contrast, responsive, email-client-safe HTML email template
 * strictly matching the Codehive 2K26 Monochrome Terminal & Cyber Design System.
 *
 * Design System Specifications:
 * - Palette: #000000 (Ground) → #080808 (Canvas) → #0F0F0F (Card Surfaces) → #161616 (Elevated) → #262626 (Borders) → #FFFFFF (Text & Primary CTA)
 * - Typography: Monospace accents ('Courier New', monospace) + Clean geometric body (-apple-system, sans-serif)
 * - Spacing: Pixel-perfect tabular grid with 0px radius terminal aesthetic
 * - Compatibility: Outlook MSO conditional blocks, Apple Mail, Gmail, Android, Dark/Light mode overrides
 */
export function renderTechForgeHtmlEmail(options: EmailRenderOptions): string {
  const { recipient } = options;
  const leaderFirstName = recipient.leaderName.split(" ")[0] || recipient.leaderName;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="dark only" />
  <title>Tech Forge – Pre-Elimination Round Instructions</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a, h1, h2, h3, div, span { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    :root {
      color-scheme: dark only;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #000000 !important;
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
      color: #FFFFFF;
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
        padding: 6px !important;
      }
      .content-padding {
        padding: 24px 16px !important;
      }
      .section-padding {
        padding: 16px !important;
      }
      .stack-column {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        margin-bottom: 12px !important;
      }
      .stack-column-last {
        margin-bottom: 0 !important;
      }
      .cta-button {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        text-align: center !important;
      }
      .mobile-center {
        text-align: center !important;
      }
    }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #000000; color: #E5E5E5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  
  <!-- Outer Background Container -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #000000; padding: 32px 10px;">
    <tr>
      <td align="center" style="padding: 0;">
        
        <!-- Main Email Container (Max 600px, Sharp Borders, Monochromatic Depth) -->
        <table role="presentation" class="email-wrapper" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; background-color: #080808; border: 1px solid #262626; border-collapse: collapse; margin: 0 auto;">
          
          <!-- Top Razor White Header Accent Bar -->
          <tr>
            <td height="3" style="background-color: #FFFFFF; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td align="center" style="padding: 36px 28px 24px 28px; border-bottom: 1px solid #262626; text-align: center; background-color: #080808;">
              
              <!-- Terminal Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
                <tr>
                  <td style="background-color: #121212; border: 1px solid #333333; padding: 5px 14px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px;">
                      [ OFFICIAL COMPETITION DISPATCH // PRE-ELIMINATION ]
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Main Title -->
              <h1 style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 28px; font-weight: 900; color: #FFFFFF; letter-spacing: 2px; text-transform: uppercase;">
                TECH FORGE
              </h1>
              
              <!-- Subtitle -->
              <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 700; color: #888888; letter-spacing: 2.5px; text-transform: uppercase;">
                ONLINE HACKATHON &bull; CODEHIVE 2K26
              </p>
            </td>
          </tr>

          <!-- Greeting & Team Overview -->
          <tr>
            <td class="content-padding" style="padding: 32px 32px 20px 32px;">
              
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #FFFFFF;">
                Dear <strong>${leaderFirstName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: #CCCCCC;">
                Congratulations on your team's successful registration for <strong>Tech Forge</strong> at <strong>Codehive 2K26</strong>. As Team Leader, you are receiving this official operational briefing detailing participation rules, contest duration, and the official challenge link for the <strong>Online Pre-Elimination Round</strong>.
              </p>

              <!-- Recipient Metadata Terminal Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0F0F0F; border: 1px solid #262626; margin: 20px 0 24px 0;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="50%" class="stack-column" style="vertical-align: top; padding: 4px 10px 4px 0;">
                          <div style="font-size: 11px; font-family: 'Courier New', Courier, monospace; color: #777777; text-transform: uppercase; letter-spacing: 1px;">REGISTERED TEAM</div>
                          <div style="font-size: 15px; font-weight: 700; color: #FFFFFF; margin-top: 4px;">${recipient.teamName}</div>
                        </td>
                        <td width="50%" class="stack-column" style="vertical-align: top; padding: 4px 0 4px 10px;">
                          <div style="font-size: 11px; font-family: 'Courier New', Courier, monospace; color: #777777; text-transform: uppercase; letter-spacing: 1px;">TEAM LEADER</div>
                          <div style="font-size: 15px; font-weight: 700; color: #FFFFFF; margin-top: 4px;">${recipient.leaderName}</div>
                        </td>
                      </tr>
                      ${
                        recipient.registrationNumber
                          ? `<tr>
                        <td colspan="2" style="padding-top: 12px; margin-top: 10px; border-top: 1px solid #1F1F1F;">
                          <span style="font-size: 11px; font-family: 'Courier New', Courier, monospace; color: #777777; text-transform: uppercase; letter-spacing: 1px;">REGISTRATION ID: </span>
                          <span style="font-size: 13px; font-family: 'Courier New', Courier, monospace; font-weight: 700; color: #FFFFFF; letter-spacing: 1px;">${recipient.registrationNumber}</span>
                        </td>
                      </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CRITICAL NOTICE: Event Window vs. Coding Attempt Duration -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0F0F0F; border: 1px solid #333333; border-left: 4px solid #FFFFFF; margin: 0 0 28px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;">
                      // CRITICAL: 24-HOUR ACCESS WINDOW VS. 1-HOUR CODING TIMER
                    </div>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 13px; line-height: 20px; color: #DDDDDD;">
                          <strong style="color: #FFFFFF;">1. Overall Event Window (24 Hours):</strong><br />
                          The contest portal opens on <span style="font-family: 'Courier New', monospace; color: #FFFFFF; font-weight: 700;">15 October 2026, 12:00 AM IST</span> and closes strictly on <span style="font-family: 'Courier New', monospace; color: #FFFFFF; font-weight: 700;">16 October 2026, 12:00 AM IST</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; line-height: 20px; color: #DDDDDD;">
                          <strong style="color: #FFFFFF;">2. Coding Attempt Duration (1 Hour):</strong><br />
                          Once your team's representative clicks "Start" on HackerRank, the timer runs continuously for <span style="font-family: 'Courier New', monospace; color: #FFFFFF; font-weight: 700;">60 minutes</span>. Your attempt must be submitted within this 1-hour window.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Round Specifications Grid (2x2 Matrix) -->
          <tr>
            <td style="padding: 0 32px 28px 32px;">
              
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 700; color: #888888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 14px;">
                // ROUND SPECIFICATIONS
              </div>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <!-- Card 1: Platform -->
                  <td width="48%" class="stack-column" style="background-color: #0F0F0F; border: 1px solid #262626; padding: 16px 18px; vertical-align: top;">
                    <div style="font-size: 10px; font-family: 'Courier New', Courier, monospace; color: #777777; text-transform: uppercase; letter-spacing: 1px;">PLATFORM</div>
                    <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">HackerRank</div>
                    <div style="font-size: 12px; color: #888888; margin-top: 4px;">Official online contest portal</div>
                  </td>
                  <td width="4%" class="stack-column">&nbsp;</td>
                  <!-- Card 2: Challenge -->
                  <td width="48%" class="stack-column stack-column-last" style="background-color: #0F0F0F; border: 1px solid #262626; padding: 16px 18px; vertical-align: top;">
                    <div style="font-size: 10px; font-family: 'Courier New', Courier, monospace; color: #777777; text-transform: uppercase; letter-spacing: 1px;">PROBLEM SCOPE</div>
                    <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">1 Coding Problem</div>
                    <div style="font-size: 12px; color: #888888; margin-top: 4px;">One coding question &bull; Algorithmic</div>
                  </td>
                </tr>
                <tr><td colspan="3" height="12">&nbsp;</td></tr>
                <tr>
                  <!-- Card 3: Time Limit -->
                  <td width="48%" class="stack-column" style="background-color: #0F0F0F; border: 1px solid #262626; padding: 16px 18px; vertical-align: top;">
                    <div style="font-size: 10px; font-family: 'Courier New', Courier, monospace; color: #777777; text-transform: uppercase; letter-spacing: 1px;">TIME LIMIT</div>
                    <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">1 Hour (60 Minutes)</div>
                    <div style="font-size: 12px; color: #888888; margin-top: 4px;">Continuous attempt countdown</div>
                  </td>
                  <td width="4%" class="stack-column">&nbsp;</td>
                  <!-- Card 4: Representation -->
                  <td width="48%" class="stack-column stack-column-last" style="background-color: #0F0F0F; border: 1px solid #262626; padding: 16px 18px; vertical-align: top;">
                    <div style="font-size: 10px; font-family: 'Courier New', Courier, monospace; color: #777777; text-transform: uppercase; letter-spacing: 1px;">REPRESENTATION</div>
                    <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">1 Participant Only</div>
                    <div style="font-size: 12px; color: #888888; margin-top: 4px;">Represents the entire team</div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Prominent HackerRank CTA Block -->
          <tr>
            <td align="center" style="padding: 32px 28px; background-color: #0F0F0F; border-top: 1px solid #262626; border-bottom: 1px solid #262626; text-align: center;">
              
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #888888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px;">
                // OFFICIAL CONTEST LINK
              </div>

              <!-- High-Contrast Monochrome White Button -->
              <div>
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${OFFICIAL_HACKERRANK_URL}" style="height:50px;v-text-anchor:middle;width:380px;" arcsize="0%" strokecolor="#FFFFFF" fillcolor="#FFFFFF">
                  <w:anchorlock/>
                  <center style="color:#000000;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;letter-spacing:1px;">ACCESS HACKERRANK CHALLENGE &rarr;</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="${OFFICIAL_HACKERRANK_URL}" target="_blank" rel="noopener noreferrer" class="cta-button" style="display: inline-block; background-color: #FFFFFF; color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; text-decoration: none; padding: 15px 32px; letter-spacing: 1px; text-transform: uppercase; border: 1px solid #FFFFFF;">
                  ACCESS HACKERRANK CHALLENGE &rarr;
                </a>
                <!--<![endif]-->
              </div>

              <!-- Plain Text Link Fallback -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 16px;">
                <tr>
                  <td align="center" style="background-color: #161616; border: 1px solid #262626; padding: 10px 14px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #FFFFFF; word-break: break-all;">
                      ${OFFICIAL_HACKERRANK_URL}
                    </span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Participation Rules Section -->
          <tr>
            <td style="padding: 32px 32px 20px 32px;">
              
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 700; color: #888888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px;">
                // PARTICIPATION RULES & PROTOCOL
              </div>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 0 0 14px 0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 700; color: #FFFFFF;">[01]</td>
                        <td style="font-size: 14px; line-height: 22px; color: #CCCCCC;">
                          <strong style="color: #FFFFFF;">Designate One Representative:</strong> Each team must select exactly one participant to attempt the coding challenge on behalf of the entire team.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 14px 0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 700; color: #FFFFFF;">[02]</td>
                        <td style="font-size: 14px; line-height: 22px; color: #CCCCCC;">
                          <strong style="color: #FFFFFF;">Login to HackerRank:</strong> The selected participant must log in to their HackerRank account and open the official contest URL: <a href="${OFFICIAL_HACKERRANK_URL}" style="color: #FFFFFF; text-decoration: underline;">${OFFICIAL_HACKERRANK_URL}</a>.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 14px 0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 700; color: #FFFFFF;">[03]</td>
                        <td style="font-size: 14px; line-height: 22px; color: #CCCCCC;">
                          <strong style="color: #FFFFFF;">Analyze Problem & Constraints:</strong> Carefully read the problem statement, sample test cases, input/output specifications, and time complexity constraints before writing code.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 14px 0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 700; color: #FFFFFF;">[04]</td>
                        <td style="font-size: 14px; line-height: 22px; color: #CCCCCC;">
                          <strong style="color: #FFFFFF;">Develop & Submit Solution:</strong> Solve, test, and submit your code within the <strong>1-hour challenge duration</strong> from the moment the attempt begins.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 14px 0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 700; color: #FFFFFF;">[05]</td>
                        <td style="font-size: 14px; line-height: 22px; color: #CCCCCC;">
                          <strong style="color: #FFFFFF;">Window Compliance:</strong> The coding attempt must begin and be submitted within the official 24-hour event window (<strong>15 October 2026, 12:00 AM IST – 16 October 2026, 12:00 AM IST</strong>).
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" style="vertical-align: top; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 700; color: #FFFFFF;">[06]</td>
                        <td style="font-size: 14px; line-height: 22px; color: #CCCCCC;">
                          <strong style="color: #FFFFFF;">Team Representation:</strong> The selected participant's score and evaluation metrics will serve as the official standing for the entire team.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Evaluation Criteria Section -->
          <tr>
            <td style="padding: 0 32px 28px 32px;">
              
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 700; color: #888888; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 14px;">
                // EVALUATION CRITERIA
              </div>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0F0F0F; border: 1px solid #262626;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; line-height: 20px; color: #CCCCCC;">
                          <strong style="color: #FFFFFF;">1. Correctness & Test Cases:</strong> Accuracy of the solution across all public and hidden edge test cases.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; line-height: 20px; color: #CCCCCC; border-top: 1px solid #1F1F1F;">
                          <strong style="color: #FFFFFF;">2. Algorithmic Efficiency:</strong> Time complexity, space complexity, and execution speed under stress constraints.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; line-height: 20px; color: #CCCCCC; border-top: 1px solid #1F1F1F;">
                          <strong style="color: #FFFFFF;">3. Problem-Solving Approach:</strong> Logical reasoning, data structure selection, and robust handling of boundary conditions.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; line-height: 20px; color: #CCCCCC; border-top: 1px solid #1F1F1F;">
                          <strong style="color: #FFFFFF;">4. Code Quality & Cleanliness:</strong> Readability, variable naming conventions, modularity, and optimal implementation patterns.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Official Sign-off Block -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; border-top: 1px solid #262626; background-color: #080808;">
              <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 22px; color: #999999;">
                Please ensure your team coordinates smoothly, designates its representative in advance, and completes the challenge well before the closing cutoff. We wish you and your team maximum success!
              </p>
              
              <div style="font-size: 14px; line-height: 22px; color: #E5E5E5;">
                Regards,<br />
                <strong style="color: #FFFFFF; font-size: 15px; letter-spacing: 0.5px;">Madhan Kumar</strong><br />
                <span style="color: #AAAAAA; font-family: 'Courier New', Courier, monospace; font-size: 12px;">Technical Team Coordinator</span><br />
                <span style="color: #777777; font-family: 'Courier New', Courier, monospace; font-size: 11px;">Tech Forge | Codehive 2K26</span>
              </div>
            </td>
          </tr>

          <!-- System Footer -->
          <tr>
            <td align="center" style="padding: 20px 24px; background-color: #000000; border-top: 1px solid #1A1A1A; text-align: center;">
              <p style="margin: 0 0 4px 0; font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #555555; text-transform: uppercase; letter-spacing: 1.5px;">
                CODEHIVE 2K26 // TECHNICAL SYMPOSIUM // TECH FORGE HACKATHON
              </p>
              <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #444444; letter-spacing: 1px;">
                DISPATCH ID: CH26-TF-PRE-ELIM // CONFIDENTIAL & DIRECT
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
 * Generate a clean, structured Plain-Text fallback email matching the terminal aesthetic.
 */
export function renderTechForgePlainTextEmail(options: EmailRenderOptions): string {
  const { recipient } = options;
  const leaderFirstName = recipient.leaderName.split(" ")[0] || recipient.leaderName;

  return `================================================================================
[ OFFICIAL COMPETITION DISPATCH // PRE-ELIMINATION ]
TECH FORGE – ONLINE HACKATHON
CODEHIVE 2K26
================================================================================

Dear ${leaderFirstName},

Congratulations on your team's successful registration for Tech Forge at Codehive 2K26. As Team Leader, you are receiving this official operational briefing for the Online Hackathon Pre-Elimination Round.

--------------------------------------------------------------------------------
TEAM DETAILS
--------------------------------------------------------------------------------
Team Name:       ${recipient.teamName}
Team Leader:     ${recipient.leaderName}
Leader Email:    ${recipient.leaderEmail}
${recipient.registrationNumber ? `Registration ID: ${recipient.registrationNumber}\n` : ""}
--------------------------------------------------------------------------------
CRITICAL NOTICE: 24-HOUR ACCESS WINDOW VS. 1-HOUR CODING TIMER
--------------------------------------------------------------------------------
1. Overall Event Window (24 Hours):
   Opens:  15 October 2026, 12:00 AM IST
   Closes: 16 October 2026, 12:00 AM IST

2. Coding Attempt Duration (1 Hour):
   Once your representative begins the challenge on HackerRank, the timer
   runs continuously for 60 minutes. Your attempt must be submitted within
   this 1-hour window.

--------------------------------------------------------------------------------
ROUND SPECIFICATIONS
--------------------------------------------------------------------------------
* Official Platform: HackerRank
* Problem Scope:     1 Coding Question
* Time Limit:        1 Hour (60 Minutes)
* Representation:    1 Selected Participant per team (represents entire team)

--------------------------------------------------------------------------------
OFFICIAL HACKERRANK CONTEST LINK
--------------------------------------------------------------------------------
Access the challenge here:
${OFFICIAL_HACKERRANK_URL}

--------------------------------------------------------------------------------
PARTICIPATION RULES & PROTOCOL
--------------------------------------------------------------------------------
[01] Designate One Representative:
     Each team must select exactly one participant to attempt the coding
     challenge on behalf of the entire team.

[02] Login to HackerRank:
     The selected participant must log in to HackerRank and open the official
     contest link: ${OFFICIAL_HACKERRANK_URL}

[03] Analyze Problem & Constraints:
     Carefully review the problem statement, sample test cases, and time
     complexity constraints before writing code.

[04] Develop & Submit Solution:
     Develop and submit your solution within the 1-hour challenge limit.

[05] Window Compliance:
     Participate within the announced 24-hour event window:
     15 October 2026, 12:00 AM IST – 16 October 2026, 12:00 AM IST.

[06] Team Representation:
     The selected representative's score will represent the official standing
     of the entire team.

--------------------------------------------------------------------------------
EVALUATION CRITERIA
--------------------------------------------------------------------------------
1. Correctness of the solution and test cases passed.
2. Algorithmic efficiency and time complexity.
3. Problem-solving approach and logical reasoning.
4. Code quality and optimization.

--------------------------------------------------------------------------------
SUBMISSION & CLOSING
--------------------------------------------------------------------------------
Please ensure your team coordinates in advance and submits before the closing
cutoff. We wish you and your team maximum success!

Regards,
Madhan Kumar
Technical Team Coordinator
Tech Forge | Codehive 2K26
================================================================================
`;
}
