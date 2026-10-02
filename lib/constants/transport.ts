export interface VelTechRoute {
  id: string;
  name: string;
  corridor: string;
  departureTime: string;
  stops: string[];
}

export const VELTECH_DEPARTURE_TIME = "06:00 AM Onwards";
export const VELTECH_REPORTING_TIME = "06:00 AM Sharp";

export const VELTECH_BUS_ROUTES: VelTechRoute[] = [
  {
    id: "route-01-central",
    name: "Route 01: Central & Egmore Corridor",
    corridor: "Central -> Egmore -> Kilpauk -> Aminjikarai",
    departureTime: "06:00 AM Onwards",
    stops: [
      "Chennai Central Railway Station (Main Gate / Park Station)",
      "Egmore Railway Station (Gandhi Irwin Road Exit)",
      "Kilpauk Medical College (KMC Bus Stop)",
      "Aminjikarai (Market Bus Stop)",
      "Other stop along Route 01",
    ],
  },
  {
    id: "route-02-koyambedu",
    name: "Route 02: Koyambedu & Vadapalani Corridor",
    corridor: "CMBT -> Koyambedu Metro -> Rohini -> Vadapalani",
    departureTime: "06:00 AM Onwards",
    stops: [
      "CMBT Inter-State Bus Terminus (Main Entrance Gate)",
      "Koyambedu Metro Station (Exit B)",
      "Rohini Theatre / Koyambedu Roundtana",
      "Vadapalani Bus Depot / Metro Station",
      "Other stop along Route 02",
    ],
  },
  {
    id: "route-03-tambaram",
    name: "Route 03: Tambaram & Guindy Corridor",
    corridor: "Tambaram -> Chromepet -> Pallavaram -> Guindy",
    departureTime: "06:00 AM Onwards",
    stops: [
      "Tambaram Sanatorium Bus Stand",
      "Chromepet (MIT Gate / Bus Stop)",
      "Pallavaram Bus Stop (Opposite Airport flyover)",
      "Guindy (Kathipara Junction / Metro Station)",
      "Other stop along Route 03",
    ],
  },
  {
    id: "route-04-broadway",
    name: "Route 04: Broadway & Beach Corridor",
    corridor: "Parrys -> Central -> Perambur -> Purasawalkam",
    departureTime: "06:00 AM Onwards",
    stops: [
      "Parrys Corner / Chennai Beach Station",
      "Perambur Barracks (Church Stop)",
      "Purasawalkam (Doveton Junction / Tank)",
      "Other stop along Route 04",
    ],
  },
  {
    id: "route-05-redhills",
    name: "Route 05: Redhills & Madhavaram Corridor",
    corridor: "Madhavaram -> Puzhal -> Redhills -> Surapet",
    departureTime: "06:00 AM Onwards",
    stops: [
      "Madhavaram Roundtana Bus Stop",
      "Puzhal (Central Prison Camp Stop)",
      "Redhills Bus Stand (Market Junction)",
      "Surapet Tollgate / Bypass",
      "Other stop along Route 05",
    ],
  },
  {
    id: "route-06-annanagar",
    name: "Route 06: Anna Nagar & Mogappair Corridor",
    corridor: "Thirumangalam -> Anna Nagar West -> Mogappair",
    departureTime: "06:00 AM Onwards",
    stops: [
      "Thirumangalam Metro Station (Exit A)",
      "Anna Nagar West Bus Depot",
      "Golden Flats Signal Junction",
      "Mogappair East (Bus Terminus)",
      "Mogappair West (Bus Depot)",
      "Other stop along Route 06",
    ],
  },
  {
    id: "route-07-porur",
    name: "Route 07: Porur & Poonamallee Corridor",
    corridor: "Iyyappanthangal -> Porur -> Kumananchavadi -> Poonamallee",
    departureTime: "06:00 AM Onwards",
    stops: [
      "Iyyappanthangal Bus Depot",
      "Porur Roundtana / Junction Stop",
      "Kumananchavadi Signal Bus Stop",
      "Poonamallee Bypass (Bus Stop)",
      "Other stop along Route 07",
    ],
  },
  {
    id: "route-08-ambattur",
    name: "Route 08: Ambattur & Avadi Local Corridor",
    corridor: "Ambattur OT -> Estate -> Thirumullaivoyal -> Avadi",
    departureTime: "06:00 AM Onwards",
    stops: [
      "Ambattur OT Bus Stand",
      "Ambattur Industrial Estate (Telephone Exchange Stop)",
      "Thirumullaivoyal Bus Stop (Murugan Temple Junction)",
      "Avadi Checkpost (Market Bus Stop)",
      "Avadi Bus Terminus / Railway Station",
      "Other stop along Route 08",
    ],
  },
  {
    id: "route-09-tiruvallur",
    name: "Route 09: Tiruvallur & Suburban Corridor",
    corridor: "Tiruvallur -> Veppampattu -> Sevvapet -> Nemilichery",
    departureTime: "06:00 AM Onwards",
    stops: [
      "Tiruvallur Railway Station Bus Stop",
      "Tiruvallur Collectorate Office Junction",
      "Veppampattu Bus Stop (Railway Station Exit)",
      "Sevvapet Road Bus Stop",
      "Other stop along Route 09",
    ],
  },
  {
    id: "route-10-custom",
    name: "Route 10: Other Vel Tech En-Route Stop",
    corridor: "Any other approved stop along Vel Tech bus routes",
    departureTime: "06:00 AM Onwards",
    stops: [
      "Custom Boarding Stop (Specify in Landmark field)",
    ],
  },
];
