import ExcelJS from "exceljs";

export interface ExportRegistrationRecord {
  id: string;
  registrationNumber: string;
  status: string;
  paymentStatus: string;
  transportOptIn: boolean;
  pickupRoute?: string | null;
  pickupStop?: string | null;
  pickupLandmark?: string | null;
  passengersCount: number;
  samePickupForTeam?: boolean;
  createdAt: string | Date;
  event: {
    id: string;
    name: string;
    slug: string;
    venue?: string | null;
    startAt?: string | Date;
  };
  participant: {
    id: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    department?: string | null;
    year?: string | null;
  };
  team?: {
    id: string;
    name: string;
    members?: Array<{
      id: string;
      name: string;
      phone: string;
      transportOptIn?: boolean;
      pickupRoute?: string | null;
      pickupStop?: string | null;
      pickupLandmark?: string | null;
    }>;
  } | null;
  checkIn?: {
    checkedInAt: string | Date;
  } | null;
}

export interface ExportSummaryRecord {
  id: string;
  name: string;
  category?: string;
  registrationsCount: number;
  checkedInCount: number;
  turnoutRate: number;
  busCommutersCount: number;
  status: string;
}

export interface ExportColumnOptions {
  contactInfo: boolean;
  academicInfo: boolean;
  teamInfo: boolean;
  transportInfo: boolean;
  gateTelemetry: boolean;
  paymentDetails?: boolean;
}

export interface ExportOptions {
  scope: "MASTER" | "REGISTRATIONS" | "TRANSPORT" | "SUMMARY";
  format: "XLSX" | "CSV";
  includeKpiSummary: boolean;
  columns: ExportColumnOptions;
  activeFiltersText?: string;
}

// ── Palette Definition ──
const BRAND_NAVY = "152A54";
const BRAND_DARK = "060D1A";
const ACCENT_BLUE = "2563EB";
const ICE_ROW = "F8FAFC";
const WHITE_ROW = "FFFFFF";
const BORDER_COLOR = "CBD5E1";
const GREEN_FILL = "ECFDF5";
const GREEN_TEXT = "065F46";
const AMBER_FILL = "FFFBEB";
const AMBER_TEXT = "92400E";

/**
 * Applies executive styling to a worksheet header banner
 */
function applyExecutiveHeaderBanner(
  worksheet: ExcelJS.Worksheet,
  title: string,
  subTitle: string,
  totalColumns: number
) {
  const lastColLetter = String.fromCharCode(64 + Math.min(totalColumns, 26));

  // Title Row
  worksheet.mergeCells(`A1:${lastColLetter}1`);
  const titleRow = worksheet.getRow(1);
  titleRow.height = 36;
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `CODEHIVE 2K26 // ${title.toUpperCase()}`;
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: `FF${BRAND_NAVY}` },
  };
  titleCell.font = {
    name: "Calibri",
    size: 14,
    bold: true,
    color: { argb: "FFFFFFFF" },
  };
  titleCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

  // Subtitle / Metadata Row
  worksheet.mergeCells(`A2:${lastColLetter}2`);
  const subRow = worksheet.getRow(2);
  subRow.height = 20;
  const subCell = worksheet.getCell("A2");
  subCell.value = subTitle;
  subCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: `FF${BRAND_DARK}` },
  };
  subCell.font = {
    name: "Calibri",
    size: 9.5,
    italic: true,
    color: { argb: "FF94A3B8" },
  };
  subCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

  // Empty Spacer Row
  worksheet.getRow(3).height = 10;
}

/**
 * Auto-adjusts column widths based on content lengths
 */
function autoAdjustColumnWidths(worksheet: ExcelJS.Worksheet, minWidth = 14) {
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell?.({ includeEmpty: false }, (cell, rowNumber) => {
      // Don't size based on merged header banner in rows 1-3
      if (rowNumber <= 3) return;
      const cellLength = cell.value ? String(cell.value).length : 0;
      if (cellLength > maxLength) {
        maxLength = cellLength;
      }
    });
    column.width = Math.max(minWidth, maxLength + 4);
  });
}

/**
 * Builds the Full Registrations Sheet
 */
function buildRegistrationsSheet(
  workbook: ExcelJS.Workbook,
  records: ExportRegistrationRecord[],
  options: ExportOptions
) {
  const worksheet = workbook.addWorksheet("Registrations", {
    properties: { tabColor: { argb: `FF${ACCENT_BLUE}` } },
    views: [{ state: "frozen", ySplit: 4 }],
  });

  const cols: Array<{ header: string; key: string; width?: number; alignment?: Partial<ExcelJS.Alignment> }> = [
    { header: "PASS CODE", key: "regNo", width: 16, alignment: { horizontal: "center" } },
    { header: "EVENT NAME", key: "eventName", width: 22 },
  ];

  if (options.columns.contactInfo) {
    cols.push(
      { header: "PARTICIPANT NAME", key: "name", width: 24 },
      { header: "EMAIL ADDRESS", key: "email", width: 28 },
      { header: "CONTACT PHONE", key: "phone", width: 18, alignment: { horizontal: "center" } }
    );
  }

  if (options.columns.academicInfo) {
    cols.push(
      { header: "COLLEGE", key: "college", width: 30 },
      { header: "DEPARTMENT", key: "department", width: 20 },
      { header: "YEAR", key: "year", width: 12, alignment: { horizontal: "center" } }
    );
  }

  if (options.columns.teamInfo) {
    cols.push(
      { header: "FORMAT", key: "format", width: 14, alignment: { horizontal: "center" } },
      { header: "TEAM NAME", key: "teamName", width: 22 },
      { header: "TEAM MEMBERS", key: "members", width: 36 }
    );
  }

  if (options.columns.transportInfo) {
    cols.push(
      { header: "BUS OPT-IN", key: "busOptIn", width: 14, alignment: { horizontal: "center" } },
      { header: "PICKUP ROUTE", key: "pickupRoute", width: 28 },
      { header: "PICKUP STOP", key: "pickupStop", width: 30 },
      { header: "LANDMARK", key: "landmark", width: 26 },
      { header: "SEATS", key: "seats", width: 12, alignment: { horizontal: "center" } }
    );
  }

  if (options.columns.gateTelemetry) {
    cols.push(
      { header: "STATUS", key: "status", width: 16, alignment: { horizontal: "center" } },
      { header: "GATE CHECK-IN", key: "checkInTime", width: 22, alignment: { horizontal: "center" } },
      { header: "REGISTERED AT", key: "registeredAt", width: 20, alignment: { horizontal: "center" } }
    );
  }

  if (options.columns.paymentDetails) {
    cols.push(
      { header: "PAYMENT STATUS", key: "paymentStatus", width: 18, alignment: { horizontal: "center" } }
    );
  }

  const generatedDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const filterDesc = options.activeFiltersText ? ` | Filters: ${options.activeFiltersText}` : "";
  applyExecutiveHeaderBanner(
    worksheet,
    "OFFICIAL REGISTRATIONS MANIFEST",
    `Generated on: ${generatedDate} IST | Total Records: ${records.length}${filterDesc}`,
    cols.length
  );

  // Table Header Row (Row 4)
  const headerRow = worksheet.getRow(4);
  headerRow.height = 28;
  headerRow.values = cols.map((c) => c.header);

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${BRAND_NAVY}` },
    };
    cell.font = {
      name: "Calibri",
      size: 10.5,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      bottom: { style: "medium", color: { argb: `FF${ACCENT_BLUE}` } },
      left: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      right: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
    };
  });

  // Populate Data Rows
  records.forEach((r, idx) => {
    const rowValues: any = {
      regNo: r.registrationNumber,
      eventName: r.event.name,
      name: r.participant.name,
      email: r.participant.email,
      phone: String(r.participant.phone || ""),
      college: r.participant.college,
      department: r.participant.department || "-",
      year: r.participant.year || "-",
      format: r.team ? "Team Entry" : "Solo Entry",
      teamName: r.team?.name || "-",
      members: r.team?.members ? r.team.members.map((m) => m.name).join(", ") : "-",
      busOptIn: r.transportOptIn ? "YES" : "NO",
      pickupRoute: r.pickupRoute || (r.transportOptIn ? "Vel Tech Bus" : "-"),
      pickupStop: r.pickupStop || "-",
      landmark: r.pickupLandmark || "-",
      seats: r.passengersCount || 1,
      status: r.status,
      checkInTime: r.checkIn?.checkedInAt
        ? new Date(r.checkIn.checkedInAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        : "NOT CHECKED IN",
      registeredAt: new Date(r.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      paymentStatus: r.paymentStatus || "COMPLETED",
    };

    const rowData = cols.map((c) => rowValues[c.key] ?? "-");
    const dataRow = worksheet.addRow(rowData);
    dataRow.height = 22;

    const isEven = idx % 2 === 0;
    const rowBgColor = isEven ? WHITE_ROW : ICE_ROW;

    dataRow.eachCell((cell, colNum) => {
      const colDef = cols[colNum - 1];
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${rowBgColor}` },
      };
      cell.font = { name: "Calibri", size: 10 };
      cell.alignment = {
        vertical: "middle",
        horizontal: colDef?.alignment?.horizontal || "left",
      };
      cell.border = {
        top: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
        bottom: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
        left: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
        right: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      };

      // Pass code monospace styling
      if (colDef?.key === "regNo") {
        cell.font = { name: "Consolas", size: 10, bold: true, color: { argb: `FF${ACCENT_BLUE}` } };
      }

      // Phone string formatting so numbers aren't treated as scientific
      if (colDef?.key === "phone") {
        cell.numFmt = "@";
      }

      // Check-in status highlights
      if (colDef?.key === "checkInTime") {
        if (cell.value && cell.value !== "NOT CHECKED IN") {
          cell.font = { name: "Calibri", size: 9.5, bold: true, color: { argb: `FF${GREEN_TEXT}` } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${GREEN_FILL}` } };
        } else {
          cell.font = { name: "Calibri", size: 9.5, color: { argb: `FF${AMBER_TEXT}` } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${AMBER_FILL}` } };
        }
      }
    });
  });

  autoAdjustColumnWidths(worksheet);
}

/**
 * Builds the Transportation Logistics Manifest Sheet
 */
function buildTransportSheet(
  workbook: ExcelJS.Workbook,
  records: ExportRegistrationRecord[],
  options: ExportOptions
) {
  const busRecords = records.filter((r) => r.transportOptIn);

  const worksheet = workbook.addWorksheet("Transport Manifest", {
    properties: { tabColor: { argb: "FF0284C7" } },
    views: [{ state: "frozen", ySplit: 4 }],
  });

  const cols: Array<{ header: string; key: string; width: number; alignment?: Partial<ExcelJS.Alignment> }> = [
    { header: "PASS CODE", key: "regNo", width: 16, alignment: { horizontal: "center" } },
    { header: "PICKUP ROUTE", key: "pickupRoute", width: 30 },
    { header: "ASSIGNED STOP", key: "pickupStop", width: 34 },
    { header: "LANDMARK", key: "landmark", width: 28 },
    { header: "SEATS", key: "seats", width: 10, alignment: { horizontal: "center" } },
    { header: "PRIMARY CONTACT", key: "name", width: 24 },
    { header: "PHONE NUMBER", key: "phone", width: 18, alignment: { horizontal: "center" } },
    { header: "COLLEGE", key: "college", width: 28 },
    { header: "EVENT", key: "eventName", width: 20 },
    { header: "TEAM NAME", key: "teamName", width: 22 },
  ];

  const totalSeats = busRecords.reduce((acc, r) => acc + (r.passengersCount || 1), 0);
  const generatedDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  applyExecutiveHeaderBanner(
    worksheet,
    "SHUTTLE BUS LOGISTICS MANIFEST",
    `Generated on: ${generatedDate} IST | Total Commuters: ${totalSeats} Seats across ${busRecords.length} Bookings`,
    cols.length
  );

  const headerRow = worksheet.getRow(4);
  headerRow.height = 28;
  headerRow.values = cols.map((c) => c.header);
  headerRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${BRAND_NAVY}` } };
    cell.font = { name: "Calibri", size: 10.5, bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      bottom: { style: "medium", color: { argb: "FF0284C7" } },
      left: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      right: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
    };
  });

  busRecords.forEach((r, idx) => {
    const rowValues = [
      r.registrationNumber,
      r.pickupRoute || "Vel Tech Fleet",
      r.pickupStop || "Assigned Stop",
      r.pickupLandmark || "-",
      r.passengersCount || 1,
      r.participant.name,
      String(r.participant.phone || ""),
      r.participant.college,
      r.event.name,
      r.team?.name || "Solo",
    ];

    const dataRow = worksheet.addRow(rowValues);
    dataRow.height = 22;
    const isEven = idx % 2 === 0;

    dataRow.eachCell((cell, colNum) => {
      const colDef = cols[colNum - 1];
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${isEven ? WHITE_ROW : ICE_ROW}` },
      };
      cell.font = { name: "Calibri", size: 10 };
      cell.alignment = {
        vertical: "middle",
        horizontal: colDef?.alignment?.horizontal || "left",
      };
      cell.border = {
        top: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
        bottom: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
        left: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
        right: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      };

      if (colDef?.key === "regNo") {
        cell.font = { name: "Consolas", size: 10, bold: true, color: { argb: "FF0284C7" } };
      }
      if (colDef?.key === "phone") {
        cell.numFmt = "@";
      }
    });
  });

  autoAdjustColumnWidths(worksheet);
}

/**
 * Builds the Event Summary Analytics Sheet
 */
function buildSummarySheet(
  workbook: ExcelJS.Workbook,
  summaryData: ExportSummaryRecord[],
  totalRegs: number,
  totalCheckedIn: number,
  totalBus: number
) {
  const worksheet = workbook.addWorksheet("Event Summary", {
    properties: { tabColor: { argb: "FF10B981" } },
    views: [{ state: "frozen", ySplit: 6 }],
  });

  const totalCols = 7;
  const generatedDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  applyExecutiveHeaderBanner(
    worksheet,
    "SYMPOSIUM EXECUTIVE ANALYTICS SUMMARY",
    `Generated on: ${generatedDate} IST | Official Symposium Turnout Report`,
    totalCols
  );

  // Executive KPI summary block (Row 4 & 5)
  worksheet.mergeCells("A4:B4");
  worksheet.mergeCells("C4:D4");
  worksheet.mergeCells("E4:F4");
  worksheet.mergeCells("G4:G4");

  worksheet.getCell("A4").value = `TOTAL REGISTRATIONS: ${totalRegs}`;
  worksheet.getCell("C4").value = `TOTAL CHECKED IN: ${totalCheckedIn}`;
  const overallTurnout = totalRegs > 0 ? Math.round((totalCheckedIn / totalRegs) * 100) : 0;
  worksheet.getCell("E4").value = `CHECK-IN RATE: ${overallTurnout}%`;
  worksheet.getCell("G4").value = `BUS COMMUTERS: ${totalBus}`;

  ["A4", "C4", "E4", "G4"].forEach((pos) => {
    const c = worksheet.getCell(pos);
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0B162C" } };
    c.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF38BDF8" } };
    c.alignment = { vertical: "middle", horizontal: "center" };
    c.border = {
      top: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      bottom: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      left: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      right: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
    };
  });

  worksheet.getRow(5).height = 10; // Spacer

  // Table Headers (Row 6)
  const cols: Array<{ header: string; width: number; alignment?: Partial<ExcelJS.Alignment> }> = [
    { header: "TRACK / EVENT NAME", width: 28 },
    { header: "CATEGORY", width: 20 },
    { header: "TOTAL REGISTRATIONS", width: 24, alignment: { horizontal: "center" } },
    { header: "CHECKED-IN COUNT", width: 22, alignment: { horizontal: "center" } },
    { header: "TURNOUT RATE (%)", width: 20, alignment: { horizontal: "center" } },
    { header: "BUS COMMUTERS", width: 18, alignment: { horizontal: "center" } },
    { header: "STATUS", width: 14, alignment: { horizontal: "center" } },
  ];

  const headerRow = worksheet.getRow(6);
  headerRow.height = 28;
  headerRow.values = cols.map((c) => c.header);
  headerRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${BRAND_NAVY}` } };
    cell.font = { name: "Calibri", size: 10.5, bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      bottom: { style: "medium", color: { argb: "FF10B981" } },
      left: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      right: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
    };
  });

  summaryData.forEach((ev, idx) => {
    const dataRow = worksheet.addRow([
      ev.name,
      ev.category || "General",
      ev.registrationsCount,
      ev.checkedInCount,
      `${ev.turnoutRate}%`,
      ev.busCommutersCount,
      ev.status,
    ]);
    dataRow.height = 24;

    const isEven = idx % 2 === 0;
    dataRow.eachCell((cell, colNum) => {
      const colDef = cols[colNum - 1];
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${isEven ? WHITE_ROW : ICE_ROW}` },
      };
      cell.font = { name: "Calibri", size: 10 };
      cell.alignment = {
        vertical: "middle",
        horizontal: (colDef?.alignment as any)?.horizontal || "left",
      };
      cell.border = {
        top: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
        bottom: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
        left: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
        right: { style: "thin", color: { argb: `FF${BORDER_COLOR}` } },
      };

      if (colNum === 1) {
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: `FF${BRAND_NAVY}` } };
      }
    });
  });

  autoAdjustColumnWidths(worksheet);
}

/**
 * Main generator function that handles both XLSX and CSV creation
 */
export async function generateExportFile(
  registrations: ExportRegistrationRecord[],
  summaryList: ExportSummaryRecord[],
  options: ExportOptions
): Promise<{ buffer: Uint8Array; filename: string; mimeType: string }> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "CodeHive 2K26 Operations";
  workbook.lastModifiedBy = "CodeHive Admin Console";
  workbook.created = new Date();
  workbook.modified = new Date();

  const totalRegs = registrations.length;
  const totalCheckedIn = registrations.filter((r) => r.checkIn?.checkedInAt).length;
  const totalBus = registrations
    .filter((r) => r.transportOptIn)
    .reduce((acc, r) => acc + (r.passengersCount || 1), 0);

  if (options.scope === "MASTER") {
    buildSummarySheet(workbook, summaryList, totalRegs, totalCheckedIn, totalBus);
    buildRegistrationsSheet(workbook, registrations, options);
    buildTransportSheet(workbook, registrations, options);
  } else if (options.scope === "TRANSPORT") {
    buildTransportSheet(workbook, registrations, options);
  } else if (options.scope === "SUMMARY") {
    buildSummarySheet(workbook, summaryList, totalRegs, totalCheckedIn, totalBus);
  } else {
    buildRegistrationsSheet(workbook, registrations, options);
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  const scopeTag = options.scope.toLowerCase();

  if (options.format === "CSV") {
    const worksheet = workbook.worksheets[0];
    const csvBuffer = await workbook.csv.writeBuffer({ sheetId: worksheet.id });
    // Prepend UTF-8 BOM (\uFEFF) so Excel opens CSV with proper encoding
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const merged = new Uint8Array(bom.length + csvBuffer.byteLength);
    merged.set(bom, 0);
    merged.set(new Uint8Array(csvBuffer), bom.length);

    return {
      buffer: merged,
      filename: `codehive-2k26-${scopeTag}-report-${timestamp}.csv`,
      mimeType: "text/csv;charset=utf-8;",
    };
  }

  const xlsxBuffer = await workbook.xlsx.writeBuffer();
  return {
    buffer: new Uint8Array(xlsxBuffer),
    filename: `codehive-2k26-${scopeTag}-report-${timestamp}.xlsx`,
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
}
