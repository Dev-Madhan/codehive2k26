"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  BusIcon,
  CalendarDaysIcon,
  CheckIcon,
  CopyIcon,
  MapPinIcon,
  PlaneIcon,
  PrinterIcon,
  ShieldCheckIcon,
} from "lucide-react";
import type { RegistrationSuccessPayload } from "@/types/registration";
import { getEventCommunity } from "@/lib/event-community";

interface DigitalEventPassProps {
  ticket: RegistrationSuccessPayload;
  onRegisterAnother?: () => void;
}

const PASS_STYLES = `
  * { box-sizing: border-box; }
  .pass-page {
    color: #111827;
    font-family: Arial, Helvetica, sans-serif;
  }
  .pass-shell {
    width: min(100%, 480px);
    margin: 0 auto;
    padding: 22px;
    color: #111827;
    background: #05060a;
  }
  .event-ticket {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: 24px;
    border: 1px solid rgb(255 255 255 / 48%);
    border-radius: 28px;
    background:
      radial-gradient(ellipse at 8% 12%, rgb(255 255 255 / 46%), transparent 22%),
      radial-gradient(ellipse at 94% 82%, rgb(255 240 86 / 80%), transparent 30%),
      radial-gradient(ellipse at 72% 40%, rgb(64 230 255 / 88%), transparent 42%),
      linear-gradient(145deg, #ff3e98 0%, #ef31b4 27%, #a331f5 48%, #32d9f2 73%, #6ff3de 100%);
    color: #11111a;
    box-shadow: 0 22px 60px rgb(0 0 0 / 42%), inset 0 1px 0 rgb(255 255 255 / 65%);
  }
  .event-ticket::before,
  .event-ticket::after {
    position: absolute;
    z-index: 2;
    top: 48%;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #05060a;
    content: "";
  }
  .event-ticket::before { left: -16px; }
  .event-ticket::after { right: -16px; }
  .ticket-content { position: relative; z-index: 1; }
  .ticket-top,
  .ticket-top-brand,
  .ticket-confirmed,
  .ticket-facts,
  .ticket-fact,
  .ticket-code-row,
  .ticket-person-row,
  .ticket-transport-heading,
  .ticket-footer,
  .ticket-actions,
  .ticket-action-group {
    display: flex;
    align-items: center;
  }
  .ticket-top,
  .ticket-code-row,
  .ticket-person-row,
  .ticket-transport-heading,
  .ticket-footer,
  .ticket-actions {
    justify-content: space-between;
  }
  .ticket-top {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgb(17 17 26 / 32%);
  }
  .ticket-top-brand {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
  .ticket-logo {
    display: block;
    width: 220px;
    height: 52px;
    filter: brightness(0);
    object-fit: contain;
  }
  .ticket-edition {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
  }
  .ticket-confirmed {
    gap: 5px;
    padding: 6px 8px;
    border: 1px solid rgb(17 17 26 / 38%);
    border-radius: 99px;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: .06em;
    white-space: nowrap;
  }
  .ticket-event {
    padding: 22px 0 16px;
  }
  .ticket-eyebrow,
  .ticket-label {
    display: block;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: .16em;
    text-transform: uppercase;
  }
  .ticket-event-title {
    margin: 8px 0 0;
    font-size: clamp(30px, 8vw, 46px);
    font-weight: 950;
    letter-spacing: -.055em;
    line-height: .98;
    overflow-wrap: anywhere;
    text-transform: uppercase;
  }
  .ticket-event-subtitle {
    margin-top: 8px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
  .ticket-facts {
    gap: 0;
    padding: 12px 0;
    border-top: 1px solid rgb(17 17 26 / 28%);
    border-bottom: 1px solid rgb(17 17 26 / 28%);
  }
  .ticket-fact {
    min-width: 0;
    flex: 1;
    gap: 8px;
  }
  .ticket-fact + .ticket-fact {
    margin-left: 12px;
    padding-left: 12px;
    border-left: 1px solid rgb(17 17 26 / 28%);
  }
  .ticket-fact-icon { flex: 0 0 auto; }
  .ticket-fact-value {
    display: block;
    margin-top: 4px;
    font-size: 10px;
    font-weight: 800;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }
  .ticket-pass-code {
    margin-top: 17px;
    padding: 12px 14px;
    border: 1px solid rgb(17 17 26 / 42%);
    border-radius: 12px;
    background: rgb(255 255 255 / 72%);
  }
  .ticket-code-row { gap: 12px; }
  .ticket-code {
    display: block;
    margin-top: 4px;
    font-size: clamp(21px, 6vw, 30px);
    font-weight: 950;
    letter-spacing: .035em;
    line-height: 1.1;
    overflow-wrap: anywhere;
  }
  .ticket-qr-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px dashed rgb(17 17 26 / 50%);
  }
  .ticket-scan-copy { max-width: 150px; }
  .ticket-scan-title {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
  .ticket-scan-note {
    margin-top: 5px;
    font-size: 9px;
    font-weight: 600;
    line-height: 1.4;
  }
  .ticket-qr-frame {
    display: grid;
    width: 112px;
    height: 112px;
    flex: 0 0 auto;
    place-items: center;
    padding: 6px;
    border: 2px solid #16131c;
    border-radius: 8px;
    background: #ffffff;
  }
  .ticket-qr-frame img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .ticket-qr-fallback {
    font-size: 9px;
    font-weight: 800;
    text-align: center;
  }
  .ticket-divider {
    position: relative;
    height: 1px;
    margin: 17px -24px 13px;
    border-top: 1px dashed rgb(17 17 26 / 55%);
  }
  .ticket-details-title {
    margin: 0 0 10px;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: .14em;
    text-transform: uppercase;
  }
  .ticket-person-row {
    align-items: flex-start;
    gap: 12px;
  }
  .ticket-person-row > div { min-width: 0; }
  .ticket-person-name {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    font-weight: 900;
    overflow-wrap: anywhere;
  }
  .ticket-person-meta {
    display: block;
    margin-top: 3px;
    font-size: 9px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  .ticket-team {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid rgb(17 17 26 / 28%);
  }
  .ticket-team-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }
  .ticket-team-member {
    padding: 6px 8px;
    border: 1px solid rgb(17 17 26 / 26%);
    border-radius: 7px;
    font-size: 9px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .ticket-transport {
    margin-top: 13px;
    padding-top: 11px;
    border-top: 1px solid rgb(17 17 26 / 28%);
  }
  .ticket-transport-heading {
    gap: 8px;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  .ticket-transport-detail {
    margin-top: 6px;
    font-size: 9px;
    font-weight: 650;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
  .ticket-footer {
    gap: 12px;
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1px solid rgb(17 17 26 / 28%);
    font-size: 8px;
    font-weight: 800;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
  .ticket-flight-icon {
    width: 30px;
    height: 30px;
    flex: 0 0 auto;
  }
  .ticket-actions {
    gap: 12px;
    width: min(100%, 480px);
    margin: 0 auto;
    padding: 0 22px 22px;
  }
  .ticket-action-group { gap: 8px; }
  .ticket-action,
  .ticket-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 42px;
    padding: 0 14px;
    border: 1px solid #34445b;
    border-radius: 8px;
    background: #111b2c;
    color: #f1f5f9;
    cursor: pointer;
    font: 700 10px Arial, sans-serif;
    letter-spacing: .06em;
    text-decoration: none;
    text-transform: uppercase;
  }
  .ticket-action-primary {
    border-color: #3b82f6;
    background: #2563eb;
  }
  .ticket-link { border-color: transparent; background: transparent; color: #93c5fd; }
  @media (max-width: 480px) {
    .pass-shell { padding: 12px; }
    .event-ticket { padding: 19px; border-radius: 23px; }
    .ticket-divider { margin-right: -19px; margin-left: -19px; }
    .ticket-actions { align-items: stretch; flex-direction: column; padding: 0 12px 12px; }
    .ticket-action-group { width: 100%; }
    .ticket-action { flex: 1; padding: 0 8px; }
    .ticket-link { align-self: flex-end; }
  }
  @media print {
    @page { size: A4 portrait; margin: 0; }
    html, body {
      width: 210mm;
      height: 297mm;
      min-height: 297mm;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #ffffff;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    .pass-page {
      display: flex;
      width: 210mm;
      height: 297mm;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: #ffffff;
    }
    .pass-shell {
      width: 200mm;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    .event-ticket {
      width: 200mm;
      height: 287mm;
      max-height: 287mm;
      padding: 10mm;
      border-radius: 8mm;
      box-shadow: none;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    .ticket-content {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
    }
    .ticket-logo {
      width: 80mm;
      height: 19mm;
    }
    .ticket-top { padding-bottom: 5mm; }
    .ticket-divider { margin-right: -10mm; margin-left: -10mm; }
    .event-ticket::before,
    .event-ticket::after {
      background: #ffffff;
    }
    .ticket-confirmed { font-size: 7pt; }
    .ticket-event { padding-top: 6mm; padding-bottom: 5mm; }
    .ticket-event-title { font-size: 28pt; }
    .ticket-qr-frame { width: 30mm; height: 30mm; }
    .ticket-pass-code { margin-top: 5mm; padding: 4mm; }
    .ticket-qr-area { margin-top: 4mm; padding-top: 4mm; }
    .ticket-person-name { font-size: 10pt; }
    .ticket-details-title { margin-bottom: 2mm; }
    .ticket-team { margin-top: 3mm; padding-top: 3mm; }
    .ticket-transport { margin-top: 3mm; padding-top: 3mm; }
    .ticket-footer { margin-top: 4mm; padding-top: 3mm; }
    .ticket-print-hide { display: none !important; }
    .ticket-actions { display: none !important; }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function DigitalEventPass({
  ticket,
  onRegisterAnother,
}: DigitalEventPassProps) {
  const [copied, setCopied] = useState(false);
  const hasTeam =
    Boolean(ticket.teamName) || ticket.teamMembers.length > 0;
  const eventCommunity = getEventCommunity(ticket.eventSlug);
  const whatsappShareUrl = eventCommunity
    ? `https://wa.me/?text=${encodeURIComponent(
        `Join the ${eventCommunity.name} WhatsApp group: ${eventCommunity.whatsappInviteUrl}`
      )}`
    : null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(ticket.registrationNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "popup,width=900,height=1100");
    if (!printWindow) {
      window.alert("Allow pop-ups for this site to print your event pass.");
      return;
    }

    const ticketElement = document.getElementById("codehive-digital-pass");
    if (!ticketElement) {
      printWindow.close();
      window.alert("The event pass could not be found. Please reload and try again.");
      return;
    }

    const printableTicket = ticketElement.outerHTML;
    const printTitle = escapeHtml(`${ticket.eventName} - ${ticket.registrationNumber}`);
    printWindow.document.open();
    printWindow.document.write(`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${printTitle}</title>
          <style>${PASS_STYLES}</style>
        </head>
        <body>
          <main class="pass-page">
            <div class="pass-shell">${printableTicket}</div>
          </main>
          <script>
            window.addEventListener("load", async () => {
              if (document.fonts && document.fonts.ready) await document.fonts.ready;
              await Promise.all(Array.from(document.images, (image) => image.decode().catch(() => undefined)));
              window.focus();
              window.print();
            }, { once: true });
            window.addEventListener("afterprint", () => window.close(), { once: true });
          </script>
        </body>
      </html>`);
    printWindow.document.close();
  };

  const leaderRole = hasTeam ? "Team leader" : "Participant";
  const pickupDetails = ticket.pickupStop
    ? `${ticket.pickupStop}${ticket.pickupLandmark ? ` · ${ticket.pickupLandmark}` : ""}`
    : "Pickup details confirmed by the transport coordinator";

  return (
    <div className="pass-page">
      <style>{PASS_STYLES}</style>
      <main className="pass-shell">
        <article id="codehive-digital-pass" className="event-ticket">
          <div className="ticket-content">
            <header className="ticket-top">
              <div className="ticket-top-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="ticket-logo"
                  src="/code%20hive%20logo.svg"
                  alt="CodeHive"
                  width="106"
                  height="25"
                />
                <div className="ticket-edition">2K26 · Official event pass</div>
              </div>
              <div className="ticket-confirmed">
                <ShieldCheckIcon size={13} />
                <span>CONFIRMED</span>
              </div>
            </header>

            <section className="ticket-event">
              <span className="ticket-eyebrow">Your entry pass</span>
              <h1 className="ticket-event-title">{ticket.eventName}</h1>
              <div className="ticket-event-subtitle">
                {ticket.teamName ? `TEAM · ${ticket.teamName}` : "Hackathon participant"}
              </div>
            </section>

            <section className="ticket-facts" aria-label="Event details">
              <div className="ticket-fact">
                <CalendarDaysIcon className="ticket-fact-icon" size={17} />
                <div>
                  <span className="ticket-label">Date</span>
                  <span className="ticket-fact-value">{ticket.date}</span>
                </div>
              </div>
              <div className="ticket-fact">
                <MapPinIcon className="ticket-fact-icon" size={17} />
                <div>
                  <span className="ticket-label">Venue</span>
                  <span className="ticket-fact-value">{ticket.venue}</span>
                </div>
              </div>
            </section>

            <section className="ticket-pass-code" aria-label="Pass code and QR code">
              <div className="ticket-code-row">
                <div>
                  <span className="ticket-label">Registration code</span>
                  <span className="ticket-code">{ticket.registrationNumber}</span>
                </div>
                <PlaneIcon className="ticket-flight-icon" />
              </div>
              <div className="ticket-qr-area">
                <div className="ticket-scan-copy">
                  <div className="ticket-scan-title">Scan for entry</div>
                  <p className="ticket-scan-note">
                    Show this QR code at the event check-in desk.
                  </p>
                </div>
                <div className="ticket-qr-frame">
                  {ticket.qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ticket.qrDataUrl}
                      alt={`Entry QR code for ${ticket.registrationNumber}`}
                    />
                  ) : (
                    <span className="ticket-qr-fallback">QR unavailable</span>
                  )}
                </div>
              </div>
            </section>

            <div className="ticket-divider" />

            <section aria-label="Participant details">
              <h2 className="ticket-details-title">
                {hasTeam ? "Attendee & team" : "Attendee"}
              </h2>
              <div className="ticket-person-row">
                <div>
                  <span className="ticket-label">{leaderRole}</span>
                  <span className="ticket-person-name">{ticket.leaderName}</span>
                  <span className="ticket-person-meta">{ticket.leaderPhone}</span>
                </div>
                <div>
                  <span className="ticket-label">Institution</span>
                  <span className="ticket-person-name">{ticket.college}</span>
                  <span className="ticket-person-meta">
                    {ticket.department} · Year {ticket.year}
                  </span>
                </div>
              </div>

              {ticket.teamMembers.length > 0 && (
                <div className="ticket-team">
                  <span className="ticket-label">
                    Team roster · {ticket.teamMembers.length + 1} members
                  </span>
                  <ul className="ticket-team-list">
                    {ticket.teamMembers.map((member, index) => (
                      <li className="ticket-team-member" key={`${member.name}-${index}`}>
                        {String(index + 2).padStart(2, "0")} · {member.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <section className="ticket-transport" aria-label="Transportation">
              <div className="ticket-transport-heading">
                <span>
                  <BusIcon
                    aria-hidden="true"
                    size={14}
                    style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }}
                  />
                  Transportation
                </span>
                <span>{ticket.transportOptIn ? "BUS PASS" : "SELF ARRANGED"}</span>
              </div>
              <p className="ticket-transport-detail">
                {ticket.transportOptIn
                  ? `${ticket.pickupRoute || "Vel Tech bus"} · ${pickupDetails}`
                  : "Direct travel to the event venue"}
              </p>
            </section>

            <footer className="ticket-footer">
              <span>CODEHIVE · 2K26</span>
              <span>PASS · {ticket.registrationNumber}</span>
            </footer>
          </div>
        </article>
      </main>

      <nav className="ticket-actions ticket-print-hide" aria-label="Pass actions">
        <div className="ticket-action-group">
          <button
            type="button"
            onClick={handlePrint}
            className="ticket-action ticket-action-primary"
          >
            <PrinterIcon size={15} />
            <span>Print / Save pass</span>
          </button>
          <button type="button" onClick={handleCopyCode} className="ticket-action">
            {copied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
            <span>{copied ? "Copied" : "Copy code"}</span>
          </button>
          {eventCommunity && whatsappShareUrl && (
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ticket-action"
            >
              <span>Share {eventCommunity.name} invite</span>
            </a>
          )}
        </div>
        {onRegisterAnother ? (
          <button
            type="button"
            onClick={onRegisterAnother}
            className="ticket-link"
          >
            Register another <ArrowRightIcon size={14} />
          </button>
        ) : (
          <Link href="/events" className="ticket-link">
            Explore events <ArrowRightIcon size={14} />
          </Link>
        )}
      </nav>
    </div>
  );
}

export default DigitalEventPass;
