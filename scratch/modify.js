const fs = require('fs');
let content = fs.readFileSync('lib/mailer.ts', 'utf-8');
let fn = content.substring(content.indexOf('export async function sendRegistrationConfirmationEmail('), content.indexOf('export interface SendOtpEmailParams {'));

fn = fn.replace('sendRegistrationConfirmationEmail', 'sendEventPostponedEmail');
fn = fn.replace('<!-- Main Brand Title -->', `<!-- Postponed Banner -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; margin-bottom: 20px;"><tr><td align="center" style="padding: 12px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: #000000; text-transform: uppercase; letter-spacing: 2px;">IMPORTANT NOTICE: EVENT POSTPONED TO OCT 23</td></tr></table>
<!-- Main Brand Title -->`);
fn = fn.replace('Official Event Pass', 'UPDATED EVENT PASS - POSTPONED');
fn = fn.replace(/Subject:.*\n/, 'subject: `[POSTPONED TO OCT 23] Updated Event Pass [${params.registrationNumber}] — ${params.eventName} | CodeHive 2K26`,\n');

fs.writeFileSync('lib/mailer.ts', content + '\n\n' + fn);
