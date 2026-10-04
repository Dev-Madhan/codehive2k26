export interface VelTechRoute {
  id: string;
  name: string;
  serviceType: "AC" | "Non-AC";
  stops: string[];
}

export const VELTECH_SCHEDULE_NOTE =
  "Confirm exact pickup time with your transport coordinator";

let routesPromise: Promise<VelTechRoute[]> | undefined;

function parseCsv(content: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];

    if (quoted) {
      if (character === '"' && content[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && content[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim().length > 0)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((value) => value.trim().length > 0)) rows.push(row);
  }

  const headers = rows.shift()?.map((header, index) =>
    index === 0 ? header.replace(/^\uFEFF/, "").trim() : header.trim()
  );

  if (!headers?.length) {
    throw new Error("The bus route CSV is empty or missing its header row.");
  }

  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ""]))
  );
}

async function fetchCsv(path: string): Promise<Record<string, string>[]> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load bus route data (${response.status} ${response.statusText}).`);
  }

  return parseCsv(await response.text());
}

async function loadRoutes(): Promise<VelTechRoute[]> {
  const [acRows, nonAcRows] = await Promise.all([
    fetchCsv("/bus%20route/AC_Bus_Route_Details.csv"),
    fetchCsv("/bus%20route/Non_AC_Bus_Route_Details_FIXED.csv"),
  ]);

  const groupedRoutes = new Map<
    string,
    { id: string; name: string; serviceType: VelTechRoute["serviceType"]; stops: string[] }
  >();

  for (const row of acRows) {
    const routeName = row.Route;
    const pickupPoint = row["Pickup Point"];
    if (!routeName || !pickupPoint) continue;

    const id = `ac:${routeName}`;
    let route = groupedRoutes.get(id);
    if (!route) {
      route = {
        id,
        name: `AC - ${routeName}`,
        serviceType: "AC",
        stops: [],
      };
      groupedRoutes.set(id, route);
    }

    const details = [
      `Pickup point: ${pickupPoint}`,
      row.Road && `Road: ${row.Road}`,
      row["Morning Pickup"] && `Morning pickup: ${row["Morning Pickup"]}`,
    ]
      .filter(Boolean)
      .join(" • ");
    route.stops.push(`Stop ${route.stops.length + 1}: ${details}`);
  }

  for (const row of nonAcRows) {
    const busNumber = row["Bus No"];
    const routeName = row["Route Name"];
    const pickupPoint = row["Pickup Point"];
    if (!busNumber || !routeName || !pickupPoint) continue;

    const id = `non-ac:${busNumber}:${routeName}`;
    let route = groupedRoutes.get(id);
    if (!route) {
      route = {
        id,
        name: `Non-AC - ${busNumber}: ${routeName}`,
        serviceType: "Non-AC",
        stops: [],
      };
      groupedRoutes.set(id, route);
    }

    const details = [
      `Pickup point: ${pickupPoint}`,
      row.Road && `Road: ${row.Road}`,
      row.Route && `Route: ${row.Route}`,
      row["Morning Pickup"] && `Morning pickup: ${row["Morning Pickup"]}`,
    ]
      .filter(Boolean)
      .join(" • ");
    route.stops.push(`Stop ${route.stops.length + 1}: ${details}`);
  }

  const routes = Array.from(groupedRoutes.values());
  if (routes.length === 0) {
    throw new Error("No valid bus routes were found in the supplied CSV files.");
  }

  return routes;
}

export function getVelTechBusRoutes(): Promise<VelTechRoute[]> {
  if (!routesPromise) {
    routesPromise = loadRoutes().catch((error: unknown) => {
      routesPromise = undefined;
      throw error;
    });
  }

  return routesPromise;
}
