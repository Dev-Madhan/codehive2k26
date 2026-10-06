// ============================================================================
// Vel Tech High-Tech Transport Network Routes & Pickup Details
// Extracted from Official Vel Tech Route Bus Guide Book (Non-AC Fleet)
// Total Routes: 31 | Total Stops: 598
// ============================================================================

export interface VelTechStopDetail {
  sNo: number;
  pickupPoint: string;
  road?: string;
  landmark?: string;
  morningTime: string;
  eveningTime?: string;
}

export interface VelTechRoute {
  id: string;
  busNumber: string;
  name: string;
  area: string;
  corridor: string;
  departureTime: string;
  arrivalTime: string;
  stops: string[];
  stopsList: VelTechStopDetail[];
}

export const VELTECH_DEPARTURE_TIME = "05:45 AM Onwards";
export const VELTECH_REPORTING_TIME = "10 Mins Prior to Pickup Time";
export const VELTECH_CAMPUS_ARRIVAL_TIME = "07:45 AM - 07:55 AM";

export const VELTECH_BUS_ROUTES: VelTechRoute[] = [
  {
    "id": "route-v1",
    "busNumber": "V1",
    "name": "Route V1: Kottivakkam",
    "area": "Kottivakkam",
    "corridor": "Kottivakkam -> Adyar -> Vadapalani -> CMBT -> Ambattur -> Vel Tech Campus",
    "departureTime": "05:45 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Kottivakkam (05:45 AM • East Cost Road)",
      "Srinivasa Nagar (05:50 AM • East Cost Road)",
      "Thiruvanmiyur (05:52 AM • L.B. Road)",
      "Indira Nagar (05:55 AM • 3rd Avenue)",
      "Vannanturai (05:57 AM • Mahatma Gandhi Road)",
      "Besant Nagar (05:59 AM • Besant 2nd & 3rd Avenue)",
      "Adayar Signals (06:02 AM • Sardar Patel Road)",
      "CLRI & IIT (06:05 AM • Sardar Patel Road)",
      "Kotturpuram (06:10 AM • Gandhi Mandapam Road)",
      "Nandanam Extn. (06:15 AM • Chamiers Road)",
      "Nadanam Arts College. (06:17 AM • Mount Road)",
      "CIT Nagar (06:20 AM • South Usman Road)",
      "Aranganathan Subway (06:22 AM • New Boag Road)",
      "West Mambalam (06:25 AM • Govindan Road)",
      "Ashok Nagar (06:27 AM • 10th Avenue)",
      "Udayam Complex (06:28 AM • Anna Main Road)",
      "Vadapalani (06:36 AM • Javaharlal Nehru Road)",
      "M.M.D.A (06:38 AM • Javaharlal Nehru Road)",
      "Arumbakkam (06:41 AM • poonamallee High road)",
      "Thirumangalam (06:50 AM • Bazar Road)",
      "Collectror Nagar (06:55 AM • Bazar Road)",
      "Ambatur Tele.Exchange (07:10 AM • C.T.H. Road)",
      "Dunlop (07:15 AM • C.T.H. Road)",
      "Ambattur OT (07:15 AM • C.T.H. Road)",
      "Thirumullaivoyal (07:25 AM • C.T.H. Road)",
      "Avadi (07:30 AM • C.T.H. Road)",
      "Vel Tech Univ (07:40 AM • Veltech - Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Kottivakkam",
        "road": "East Cost Road",
        "morningTime": "05:45 AM",
        "eveningTime": "05:45 PM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Srinivasa Nagar",
        "road": "East Cost Road",
        "morningTime": "05:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Thiruvanmiyur",
        "road": "L.B. Road",
        "morningTime": "05:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Indira Nagar",
        "road": "3rd Avenue",
        "morningTime": "05:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Vannanturai",
        "road": "Mahatma Gandhi Road",
        "morningTime": "05:57 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Besant Nagar",
        "road": "Besant 2nd & 3rd Avenue",
        "morningTime": "05:59 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Adayar Signals",
        "road": "Sardar Patel Road",
        "morningTime": "06:02 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "CLRI & IIT",
        "road": "Sardar Patel Road",
        "morningTime": "06:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Kotturpuram",
        "road": "Gandhi Mandapam Road",
        "morningTime": "06:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Nandanam Extn.",
        "road": "Chamiers Road",
        "morningTime": "06:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Nadanam Arts College.",
        "road": "Mount Road",
        "morningTime": "06:17 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "CIT Nagar",
        "road": "South Usman Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Aranganathan Subway",
        "road": "New Boag Road",
        "morningTime": "06:22 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "West Mambalam",
        "road": "Govindan Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Ashok Nagar",
        "road": "10th Avenue",
        "morningTime": "06:27 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Udayam Complex",
        "road": "Anna Main Road",
        "morningTime": "06:28 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Vadapalani",
        "road": "Javaharlal Nehru Road",
        "morningTime": "06:36 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "M.M.D.A",
        "road": "Javaharlal Nehru Road",
        "morningTime": "06:38 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Arumbakkam",
        "road": "poonamallee High road",
        "morningTime": "06:41 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Thirumangalam",
        "road": "Bazar Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Collectror Nagar",
        "road": "Bazar Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Ambatur Tele.Exchange",
        "road": "C.T.H. Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Dunlop",
        "road": "C.T.H. Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 24,
        "pickupPoint": "Ambattur OT",
        "road": "C.T.H. Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 25,
        "pickupPoint": "Thirumullaivoyal",
        "road": "C.T.H. Road",
        "morningTime": "07:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 26,
        "pickupPoint": "Avadi",
        "road": "C.T.H. Road",
        "morningTime": "07:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 27,
        "pickupPoint": "Vel Tech Univ",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 28,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v2",
    "busNumber": "V2",
    "name": "Route V2: Pallikaranai / Madipakkam",
    "area": "Pallikaranai / Madipakkam",
    "corridor": "Pallikaranai -> Nanganallur -> Kundrathur -> Mangadu -> Avadi -> Vel Tech Campus",
    "departureTime": "05:50 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Pallikaranai (05:50 AM • Main road)",
      "Kamatchi Hospital (05:52 AM • Main road)",
      "Kilkattalai MTC B.T (05:52 AM • Medavakkam Main Road)",
      "Ullagaram (05:56 AM • Medavakkam Main Road)",
      "Nanganallur (06:00 AM • West Karikalan Street)",
      "Meenambakkam (06:05 AM • G.S.T. Road)",
      "Trisoolam (06:12 AM • G.S.T. Road)",
      "Pallavaram Mars Hotel (06:25 AM • Pammal Main Road)",
      "Anakaputhur (06:30 AM • Kamaraj Salai)",
      "Kundrathur (06:35 AM • Jawaharlal Nehru MainRd)",
      "Chikkarayapuram (06:42 AM • Kundrathur Main Road)",
      "Mangadu (06:48 AM • Kundrathur Main Road)",
      "Kumanan Chavadi (06:50 AM • Kundrathur Main Road)",
      "Karayan Chavadi (06:55 AM • Avadi-Poonamallee Road)",
      "Viraraghavapuram (06:58 AM • Avadi-Poonamallee Road)",
      "Paruthipattu (07:04 AM • Avadi-Poonamallee Road)",
      "Avadi Market (07:06 AM • Kamaraj Nagar Main Rd.)",
      "Avadi Ramarathna (07:15 AM • Avadi-Poonamallee Road)",
      "Avadi Bus Terminus (07:35 AM • C.T.H. Road)",
      "Vel Tech Univ (07:42 AM • Veltech - Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Pallikaranai",
        "road": "Main road",
        "morningTime": "05:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 2,
        "pickupPoint": "Kamatchi Hospital",
        "road": "Main road",
        "morningTime": "05:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Kilkattalai MTC B.T",
        "road": "Medavakkam Main Road",
        "morningTime": "05:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Ullagaram",
        "road": "Medavakkam Main Road",
        "morningTime": "05:56 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Nanganallur",
        "road": "West Karikalan Street",
        "morningTime": "06:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Meenambakkam",
        "road": "G.S.T. Road",
        "morningTime": "06:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Trisoolam",
        "road": "G.S.T. Road",
        "morningTime": "06:12 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Pallavaram Mars Hotel",
        "road": "Pammal Main Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Anakaputhur",
        "road": "Kamaraj Salai",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Kundrathur",
        "road": "Jawaharlal Nehru MainRd",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Chikkarayapuram",
        "road": "Kundrathur Main Road",
        "morningTime": "06:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Mangadu",
        "road": "Kundrathur Main Road",
        "morningTime": "06:48 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Kumanan Chavadi",
        "road": "Kundrathur Main Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Karayan Chavadi",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Viraraghavapuram",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "06:58 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Paruthipattu",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "07:04 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Avadi Market",
        "road": "Kamaraj Nagar Main Rd.",
        "morningTime": "07:06 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Avadi Ramarathna",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Avadi Bus Terminus",
        "road": "C.T.H. Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Vel Tech Univ",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v3a",
    "busNumber": "V3A",
    "name": "Route V3A: Medavakkam - East Tambaram",
    "area": "Medavakkam - East Tambaram",
    "corridor": "Perumbakkam -> Selaiyur -> Tambaram -> Kundrathur -> Avadi -> Vel Tech Campus",
    "departureTime": "05:45 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Perumbakkam (05:45 AM • MAIN ROAD)",
      "Medavakkam (05:50 AM • MEDAVAKKAM MAIN ROAD)",
      "Santhosapuram (Main Road)",
      "Sempakkam (05:52 AM • Main Road)",
      "Kamarajapuram (05:54 AM • Main Road)",
      "Selaiyur (05:56 AM • Camp road)",
      "Camp Road Signal (05:58 AM • Camp road)",
      "East Thambaram (06:00 AM • Camp road)",
      "Tambaram Rly. Station (06:02 AM • G.S.T. Road)",
      "Chrompet MIT (06:10 AM • G.S.T. Road)",
      "Chrompet B.S. (06:18 AM • G.S.T. Road)",
      "Thiruneermalai (06:25 AM • Main Road)",
      "Anakaputhur (06:28 AM • Kamaraj Salai)",
      "Moondram kattalai (06:30 AM • Kamaraj Salai)",
      "Kundrathur (06:35 AM • Jawaharlal Nehru MainRd)",
      "Chikkarayapuram (06:42 AM • Kundrathur Main Road)",
      "Mangadu (06:48 AM • Kundrathur Main Road)",
      "Kumanan Chavadi (06:50 AM • Kundrathur Main Road)",
      "Karayan Chavadi (06:55 AM • Avadi-Poonamallee Road)",
      "Viraraghavapuram (06:58 AM • Avadi-Poonamallee Road)",
      "Paruthipattu (07:04 AM • Avadi-Poonamallee Road)",
      "Avadi Market (07:06 AM • Kamaraj Nagar Main Rd.)",
      "Avadi Ramarathna (07:15 AM • Avadi-Poonamallee Road)",
      "Avadi Bus Terminus (07:35 AM • C.T.H. Road)",
      "Vel Tech Univ (07:42 AM • Veltech - Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Perumbakkam",
        "road": "MAIN ROAD",
        "morningTime": "05:45 AM",
        "eveningTime": "06:00 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Medavakkam",
        "road": "MEDAVAKKAM MAIN ROAD",
        "morningTime": "05:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Santhosapuram",
        "road": "Main Road",
        "morningTime": "",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Sempakkam",
        "road": "Main Road",
        "morningTime": "05:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Kamarajapuram",
        "road": "Main Road",
        "morningTime": "05:54 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Selaiyur",
        "road": "Camp road",
        "morningTime": "05:56 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Camp Road Signal",
        "road": "Camp road",
        "morningTime": "05:58 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "East Thambaram",
        "road": "Camp road",
        "morningTime": "06:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Tambaram Rly. Station",
        "road": "G.S.T. Road",
        "morningTime": "06:02 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Chrompet MIT",
        "road": "G.S.T. Road",
        "morningTime": "06:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Chrompet B.S.",
        "road": "G.S.T. Road",
        "morningTime": "06:18 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Thiruneermalai",
        "road": "Main Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Anakaputhur",
        "road": "Kamaraj Salai",
        "morningTime": "06:28 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Moondram kattalai",
        "road": "Kamaraj Salai",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Kundrathur",
        "road": "Jawaharlal Nehru MainRd",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Chikkarayapuram",
        "road": "Kundrathur Main Road",
        "morningTime": "06:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Mangadu",
        "road": "Kundrathur Main Road",
        "morningTime": "06:48 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Kumanan Chavadi",
        "road": "Kundrathur Main Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Karayan Chavadi",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Viraraghavapuram",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "06:58 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Paruthipattu",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "07:04 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Avadi Market",
        "road": "Kamaraj Nagar Main Rd.",
        "morningTime": "07:06 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Avadi Ramarathna",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 24,
        "pickupPoint": "Avadi Bus Terminus",
        "road": "C.T.H. Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 25,
        "pickupPoint": "Vel Tech Univ",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 26,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v3b",
    "busNumber": "V3B",
    "name": "Route V3B: Kovur",
    "area": "Kovur",
    "corridor": "Kovur Bridge -> Porur -> Kumananchavadi -> Avadi -> Vel Tech Campus",
    "departureTime": "06:32 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Kovur Bridge (06:32 AM • Kunrathur Main Road)",
      "Bai Kadai (06:35 AM • Kunrathur Main Road)",
      "Madhanandhapuram (06:38 AM • Kunrathur Main Road)",
      "Porur (06:42 AM • Mount-Poonamallee Road)",
      "Ayyappathangal (06:48 AM • Mount-Poonamallee Road)",
      "Kumanan Chavadi (06:55 AM • Mount-Poonamallee Road)",
      "Karayan Chavadi (06:58 AM • Mount-Poonamallee Road)",
      "Senneer kuppam (07:04 AM • Avadi Road)",
      "Govardhanagiri (07:06 AM • Avadi Road)",
      "Avadi Market (07:10 AM • Avadi-Poonamallee Road)",
      "Avadi Ramarathna (07:35 AM • C.T.H. Road)",
      "Avadi Bus Terminus (07:38 AM • Avadi - Veltech Road)",
      "Vel Junction (North) (07:40 AM • Veltech-Alamathi Road)",
      "Veltech Univ (07:42 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Kovur Bridge",
        "road": "Kunrathur Main Road",
        "morningTime": "06:32 AM",
        "eveningTime": ""
      },
      {
        "sNo": 2,
        "pickupPoint": "Bai Kadai",
        "road": "Kunrathur Main Road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Madhanandhapuram",
        "road": "Kunrathur Main Road",
        "morningTime": "06:38 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Porur",
        "road": "Mount-Poonamallee Road",
        "morningTime": "06:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Ayyappathangal",
        "road": "Mount-Poonamallee Road",
        "morningTime": "06:48 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Kumanan Chavadi",
        "road": "Mount-Poonamallee Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Karayan Chavadi",
        "road": "Mount-Poonamallee Road",
        "morningTime": "06:58 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Senneer kuppam",
        "road": "Avadi Road",
        "morningTime": "07:04 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Govardhanagiri",
        "road": "Avadi Road",
        "morningTime": "07:06 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Avadi Market",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Avadi Ramarathna",
        "road": "C.T.H. Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Avadi Bus Terminus",
        "road": "Avadi - Veltech Road",
        "morningTime": "07:38 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Vel Junction (North)",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v4a",
    "busNumber": "V4A",
    "name": "Route V4A: Pattinapakkam",
    "area": "Pattinapakkam",
    "corridor": "Pattinapakkam Signal -> Mylapore -> Vadapalani -> CMBT -> Thirumangalam -> Vel Tech Campus",
    "departureTime": "06:05 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Pattinapakkam Signal (06:05 AM • Santhome High Road)",
      "Mandaveli (06:07 AM • Venkatakrishna Road)",
      "Mylapore Tank (06:10 AM • R.K. Mutt Road)",
      "Mylapore Luz Corner (06:12 AM • Kutchery Road)",
      "Santhome Church (06:15 AM • Santhome High Road)",
      "Vivekananda House (06:18 AM • Besant Road)",
      "Jam Bazar (06:25 AM • Triplicane High Road)",
      "Star Theatre (06:27 AM • Triplicane High Road)",
      "Adam Market (06:31 AM • Triplicane High Road)",
      "Kalaivanar Arangam (06:33 AM • Walaja Road)",
      "Chepauk Stadium (06:35 AM • Walaja Road)",
      "Madras University (06:37 AM • Kamarajar Salai)",
      "All India Radio (06:38 AM • Santhome High Road)",
      "R.B.I. (06:40 AM • Rajaji Salai)",
      "Beach station (06:42 AM • Rajaji Salai)",
      "Mannady (06:45 AM • Rajaji Salai)",
      "Mint (06:47 AM • Basin Bridge Road)",
      "Vyasarpadi (06:50 AM • Erukanchery High Road)",
      "Ambedhkar college (06:52 AM • G.N.T. Road)",
      "Sharma nagar (06:54 AM • G.N.T. Road)",
      "Erukkancherry (06:57 AM • G.N.T. Road)",
      "Moolakadai (07:00 AM • G.N.T. Road)",
      "Madhavaram Ring Road (07:05 AM • G.N.T. Road)",
      "Puzhal (07:10 AM • G.N.T. Road)",
      "Red Hills (07:20 AM • Thiruvallur Redhills Road)",
      "Veltech Univ (07:40 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Pattinapakkam Signal",
        "road": "Santhome High Road",
        "morningTime": "06:05 AM",
        "eveningTime": "05:30 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Mandaveli",
        "road": "Venkatakrishna Road",
        "morningTime": "06:07 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Mylapore Tank",
        "road": "R.K. Mutt Road",
        "morningTime": "06:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Mylapore Luz Corner",
        "road": "Kutchery Road",
        "morningTime": "06:12 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Santhome Church",
        "road": "Santhome High Road",
        "morningTime": "06:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Vivekananda House",
        "road": "Besant Road",
        "morningTime": "06:18 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Jam Bazar",
        "road": "Triplicane High Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Star Theatre",
        "road": "Triplicane High Road",
        "morningTime": "06:27 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Adam Market",
        "road": "Triplicane High Road",
        "morningTime": "06:31 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Kalaivanar Arangam",
        "road": "Walaja Road",
        "morningTime": "06:33 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Chepauk Stadium",
        "road": "Walaja Road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Madras University",
        "road": "Kamarajar Salai",
        "morningTime": "06:37 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "All India Radio",
        "road": "Santhome High Road",
        "morningTime": "06:38 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "R.B.I.",
        "road": "Rajaji Salai",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Beach station",
        "road": "Rajaji Salai",
        "morningTime": "06:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Mannady",
        "road": "Rajaji Salai",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Mint",
        "road": "Basin Bridge Road",
        "morningTime": "06:47 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Vyasarpadi",
        "road": "Erukanchery High Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Ambedhkar college",
        "road": "G.N.T. Road",
        "morningTime": "06:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Sharma nagar",
        "road": "G.N.T. Road",
        "morningTime": "06:54 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Erukkancherry",
        "road": "G.N.T. Road",
        "morningTime": "06:57 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Moolakadai",
        "road": "G.N.T. Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Madhavaram Ring Road",
        "road": "G.N.T. Road",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 24,
        "pickupPoint": "Puzhal",
        "road": "G.N.T. Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 25,
        "pickupPoint": "Red Hills",
        "road": "Thiruvallur Redhills Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 26,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 27,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v5",
    "busNumber": "V5",
    "name": "Route V5: Ennore",
    "area": "Ennore",
    "corridor": "Ennore Barma nagar -> Tiruvottiyur -> Moolakadai -> Redhills -> Vel Tech Campus",
    "departureTime": "05:50 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Ennore Barma nagar (05:50 AM • Kathivakkam Road)",
      "Chinnakuppam (05:52 AM • Kathivakkam Road)",
      "Periyakuppam (05:54 AM • Kathivakkam Road)",
      "Thalanguppam (05:55 AM • Kathivakkam Road)",
      "High school (05:58 AM • Ennore High Road)",
      "Ennore depot (06:00 AM • Ennore High Road)",
      "Foundry (06:02 AM • Ennore High Road)",
      "Ashok Ley Land (06:04 AM • Ennore High Road)",
      "Anna nagar (06:06 AM • Ennore High Road)",
      "E.T.P.S (06:08 AM • Ennore High Road)",
      "Ernavoor (06:10 AM • Ennore High Road)",
      "Murugan Koil (06:12 AM • Ennore High Road)",
      "Mullai Nagar (06:14 AM • Manali High Road)",
      "Murugappa nagar (06:18 AM • Manali High Road)",
      "Sadaiyankuppam (06:20 AM • Manali High Road)",
      "CPCL (06:22 AM • Manali High Road)",
      "Manali Market (06:24 AM • Nedunchezian Road)",
      "MMDA (06:28 AM • Kamarajar Salai)",
      "Mathur (06:30 AM • Kamarajar Salai)",
      "Kosappur (06:33 AM • Main road)",
      "Vadaperumpakkam (06:40 AM • Kamarajar Salai)",
      "Grand lIne (06:48 AM • Kamarajar Salai)",
      "Vadakarai (07:00 AM • Kamarajar Salai)",
      "Redhills (07:10 AM • Thiruvallur Redhills Road)",
      "Vel Junction(South) (07:35 AM • Veltech-Alamathi Road)",
      "Veltech Univ (07:40 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Ennore Barma nagar",
        "road": "Kathivakkam Road",
        "morningTime": "05:50 AM",
        "eveningTime": "05:45 PM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Chinnakuppam",
        "road": "Kathivakkam Road",
        "morningTime": "05:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Periyakuppam",
        "road": "Kathivakkam Road",
        "morningTime": "05:54 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Thalanguppam",
        "road": "Kathivakkam Road",
        "morningTime": "05:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "High school",
        "road": "Ennore High Road",
        "morningTime": "05:58 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Ennore depot",
        "road": "Ennore High Road",
        "morningTime": "06:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Foundry",
        "road": "Ennore High Road",
        "morningTime": "06:02 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Ashok Ley Land",
        "road": "Ennore High Road",
        "morningTime": "06:04 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Anna nagar",
        "road": "Ennore High Road",
        "morningTime": "06:06 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "E.T.P.S",
        "road": "Ennore High Road",
        "morningTime": "06:08 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Ernavoor",
        "road": "Ennore High Road",
        "morningTime": "06:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Murugan Koil",
        "road": "Ennore High Road",
        "morningTime": "06:12 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Mullai Nagar",
        "road": "Manali High Road",
        "morningTime": "06:14 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Murugappa nagar",
        "road": "Manali High Road",
        "morningTime": "06:18 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Sadaiyankuppam",
        "road": "Manali High Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "CPCL",
        "road": "Manali High Road",
        "morningTime": "06:22 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Manali Market",
        "road": "Nedunchezian Road",
        "morningTime": "06:24 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "MMDA",
        "road": "Kamarajar Salai",
        "morningTime": "06:28 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Mathur",
        "road": "Kamarajar Salai",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Kosappur",
        "road": "Main road",
        "morningTime": "06:33 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Vadaperumpakkam",
        "road": "Kamarajar Salai",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Grand lIne",
        "road": "Kamarajar Salai",
        "morningTime": "06:48 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Vadakarai",
        "road": "Kamarajar Salai",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 24,
        "pickupPoint": "Redhills",
        "road": "Thiruvallur Redhills Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 25,
        "pickupPoint": "Vel Junction(South)",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 26,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 27,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v6",
    "busNumber": "V6",
    "name": "Route V6: Saidapet",
    "area": "Saidapet",
    "corridor": "SAIDAPET -> T.Nagar -> Aminjikarai -> Thirumangalam -> Ambattur -> Vel Tech Campus",
    "departureTime": "06:00 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "SAIDAPET (06:00 AM • Depo)",
      "Saidapet Court (06:02 AM • Mount Road)",
      "Raj Bhavan (06:05 AM • Sardar Patel Road)",
      "Guindy railway station (06:00 AM • Anna salai)",
      "Ambal Nagar-Ekattuthangal (06:03 AM • Jawaharlal Nehru Road)",
      "Jafferkhanpet (06:05 AM • Jawaharlal Nehru Road)",
      "Kasi Theatre (06:10 AM • Jawaharlal Nehru Road)",
      "K.K. Nagar (06:13 AM • East Vannier Street)",
      "Pondichery House (06:15 AM • Vannier Street)",
      "Virugambakkam Avichi (06:20 AM • Arcot Road)",
      "Elango Nagar (06:22 AM • Kaliamman Koil Street)",
      "Sai Nagar (06:25 AM • Kaliamman Koil Street)",
      "Sri Ayyappan Nagar (06:28 AM • Kaliamman Koil Street)",
      "Chinmaya Nagar (06:30 AM • Kaliamman Koil Street)",
      "Koyambedu Rountana (06:35 AM • Poonamallee High Road)",
      "Nerkundram (06:38 AM • Poonamallee High Road)",
      "Madhuravoyal (06:40 AM • Poonamallee High Road)",
      "Vanagaram (06:43 AM • Poonamallee High Road)",
      "Kumar Theater (06:45 AM • Poonamallee High Road)",
      "Vellappanchavadi (06:48 AM • Poonamallee High Road)",
      "Govardhanagiri (07:05 AM • Avadi-Poonamallee Road)",
      "Avadi (07:15 AM • C.T.H. Road)",
      "Veltech Univ (07:40 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "SAIDAPET",
        "road": "Depo",
        "morningTime": "06:00 AM",
        "eveningTime": "05:30 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Saidapet Court",
        "road": "Mount Road",
        "morningTime": "06:02 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Raj Bhavan",
        "road": "Sardar Patel Road",
        "morningTime": "06:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Guindy railway station",
        "road": "Anna salai",
        "morningTime": "06:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Ambal Nagar-Ekattuthangal",
        "road": "Jawaharlal Nehru Road",
        "morningTime": "06:03 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Jafferkhanpet",
        "road": "Jawaharlal Nehru Road",
        "morningTime": "06:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Kasi Theatre",
        "road": "Jawaharlal Nehru Road",
        "morningTime": "06:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "K.K. Nagar",
        "road": "East Vannier Street",
        "morningTime": "06:13 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Pondichery House",
        "road": "Vannier Street",
        "morningTime": "06:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Virugambakkam Avichi",
        "road": "Arcot Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Elango Nagar",
        "road": "Kaliamman Koil Street",
        "morningTime": "06:22 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Sai Nagar",
        "road": "Kaliamman Koil Street",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Sri Ayyappan Nagar",
        "road": "Kaliamman Koil Street",
        "morningTime": "06:28 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Chinmaya Nagar",
        "road": "Kaliamman Koil Street",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Koyambedu Rountana",
        "road": "Poonamallee High Road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Nerkundram",
        "road": "Poonamallee High Road",
        "morningTime": "06:38 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Madhuravoyal",
        "road": "Poonamallee High Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Vanagaram",
        "road": "Poonamallee High Road",
        "morningTime": "06:43 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Kumar Theater",
        "road": "Poonamallee High Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Vellappanchavadi",
        "road": "Poonamallee High Road",
        "morningTime": "06:48 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Govardhanagiri",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Avadi",
        "road": "C.T.H. Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 24,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v7a",
    "busNumber": "V7A",
    "name": "Route V7A: Manali New Town",
    "area": "Manali New Town",
    "corridor": "Manali New Town -> Manali -> Madhavaram -> Redhills -> Vel Tech Campus",
    "departureTime": "06:10 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Manali New Town (06:10 AM • Ponneri Road)",
      "Manali N.T Market (06:12 AM • Kamarajar Salai)",
      "Milk Booth (06:14 AM • Milk Colony Road)",
      "Rajivgandhi Nagar (06:16 AM • Rizwan Road)",
      "Andarkuppam (06:18 AM • Kamarajar Salai)",
      "SRF company (06:20 AM • Kamarajar Salai)",
      "Manali Bus stand (06:22 AM • Kamarajar Salai)",
      "Manali Market (06:25 AM • Kamarajar Salai)",
      "MMDA (06:35 AM • Kamarajar Salai)",
      "Mathur (06:40 AM • Kamarajar Salai)",
      "veterinary College (06:45 AM • Milk Colony Road)",
      "Main Gate (06:50 AM • Milk Colony Road)",
      "Arul nagar (06:52 AM • Milk Colony Road)",
      "Medimix (06:53 AM • Kamaraj Road)",
      "ThapalPetti (06:54 AM • Madhavaram High Road)",
      "Madhavaram B.T. (06:55 AM • Madhavaram High Road)",
      "Madhavaram Ring Road (07:00 AM • G.N.T. Road)",
      "Puzhal (07:05 AM • G.N.T. Road)",
      "Redhills (07:10 AM • Thiruvallur Redhills Road)",
      "Veltech Univ (07:40 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Manali New Town",
        "road": "Ponneri Road",
        "morningTime": "06:10 AM",
        "eveningTime": "05:35 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Manali N.T Market",
        "road": "Kamarajar Salai",
        "morningTime": "06:12 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Milk Booth",
        "road": "Milk Colony Road",
        "morningTime": "06:14 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Rajivgandhi Nagar",
        "road": "Rizwan Road",
        "morningTime": "06:16 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Andarkuppam",
        "road": "Kamarajar Salai",
        "morningTime": "06:18 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "SRF company",
        "road": "Kamarajar Salai",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Manali Bus stand",
        "road": "Kamarajar Salai",
        "morningTime": "06:22 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Manali Market",
        "road": "Kamarajar Salai",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "MMDA",
        "road": "Kamarajar Salai",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Mathur",
        "road": "Kamarajar Salai",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "veterinary College",
        "road": "Milk Colony Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Main Gate",
        "road": "Milk Colony Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Arul nagar",
        "road": "Milk Colony Road",
        "morningTime": "06:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Medimix",
        "road": "Kamaraj Road",
        "morningTime": "06:53 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "ThapalPetti",
        "road": "Madhavaram High Road",
        "morningTime": "06:54 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Madhavaram B.T.",
        "road": "Madhavaram High Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Madhavaram Ring Road",
        "road": "G.N.T. Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Puzhal",
        "road": "G.N.T. Road",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Redhills",
        "road": "Thiruvallur Redhills Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v8",
    "busNumber": "V8",
    "name": "Route V8: Teynampet",
    "area": "Teynampet",
    "corridor": "Teynampet -> Alwarpet -> Kodambakkam -> Thirumangalam -> Vel Tech Campus",
    "departureTime": "06:00 AM",
    "arrivalTime": "07:50 AM",
    "stops": [
      "Teynampet (06:00 AM • Anna salai road)",
      "Alwarpet (06:05 AM • Anna salai road)",
      "Anna salai (06:07 AM • Anna salai road)",
      "Pudhupet (06:09 AM • R2)",
      "Egmore (06:12 AM • R2)",
      "EVR periyar (06:14 AM • EVR periyar Salai)",
      "pachaiyappas college (06:16 AM • poonamalle road)",
      "Kilpauk garden (06:20 AM • poonamalle road)",
      "Purasawalkam (06:25 AM • Purasawalkam High Road)",
      "Kellys (06:30 AM • Medavakkam Tank Road)",
      "ESI Hospital (06:35 AM • Medavakkam Tank Road)",
      "Ayanavaram Joint Office (06:37 AM • Konnur High Road)",
      "ICF East Colony (06:40 AM • Konnur High Road)",
      "Villivakkam Nathamuni (06:45 AM • Konnur High Road)",
      "TVS Lucas (06:47 AM • 100 feet road)",
      "Padi (06:49 AM • C.T.H. Road)",
      "Ambattur Estate (06:51 AM • C.T.H. Road)",
      "Telephone Exchange (06:53 AM • C.T.H. Road)",
      "Ambattur O.T. (06:58 AM • C.T.H. Road)",
      "Avadi (07:20 AM • C.T.H. Road)",
      "Vel Junction (North) (07:40 AM • Avadi - Veltech Road)",
      "Veltech Univ (07:42 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:50 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Teynampet",
        "road": "Anna salai road",
        "morningTime": "06:00 AM",
        "eveningTime": "05:45 PM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Alwarpet",
        "road": "Anna salai road",
        "morningTime": "06:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Anna salai",
        "road": "Anna salai road",
        "morningTime": "06:07 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Pudhupet",
        "road": "R2",
        "morningTime": "06:09 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Egmore",
        "road": "R2",
        "morningTime": "06:12 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "EVR periyar",
        "road": "EVR periyar Salai",
        "morningTime": "06:14 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "pachaiyappas college",
        "road": "poonamalle road",
        "morningTime": "06:16 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Kilpauk garden",
        "road": "poonamalle road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Purasawalkam",
        "road": "Purasawalkam High Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Kellys",
        "road": "Medavakkam Tank Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "ESI Hospital",
        "road": "Medavakkam Tank Road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Ayanavaram Joint Office",
        "road": "Konnur High Road",
        "morningTime": "06:37 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "ICF East Colony",
        "road": "Konnur High Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Villivakkam Nathamuni",
        "road": "Konnur High Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "TVS Lucas",
        "road": "100 feet road",
        "morningTime": "06:47 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Padi",
        "road": "C.T.H. Road",
        "morningTime": "06:49 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Ambattur Estate",
        "road": "C.T.H. Road",
        "morningTime": "06:51 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Telephone Exchange",
        "road": "C.T.H. Road",
        "morningTime": "06:53 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Ambattur O.T.",
        "road": "C.T.H. Road",
        "morningTime": "06:58 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Avadi",
        "road": "C.T.H. Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Vel Junction (North)",
        "road": "Avadi - Veltech Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:50 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v8s",
    "busNumber": "V8S",
    "name": "Route V8S: Anna Nagar (K4 Police Station)",
    "area": "Anna Nagar (K4 Police Station)",
    "corridor": "Water Tank -> Shenoy Nagar -> Anna Nagar West -> Padi -> Vel Tech Campus",
    "departureTime": "06:15 AM",
    "arrivalTime": "07:50 AM",
    "stops": [
      "Water Tank (06:15 AM • New Avadi Road)",
      "Chindhamani (06:20 AM • 6th Avenue)",
      "K4 Police Station (06:25 AM • 6th Avenue)",
      "Gandhi Nagar Hospital (06:30 AM • Mani Road)",
      "ICF BS (06:40 AM • Mani Road)",
      "Villivakkam Nathamuni (06:42 AM • Konnur High Road)",
      "TVS Lucas (06:44 AM • 100 feet road)",
      "Padi (06:46 AM • C.T.H. Road)",
      "Ambattur Estate (06:48 AM • C.T.H. Road)",
      "Telephone Exchange (06:53 AM • C.T.H. Road)",
      "Ambattur O.T. (07:10 AM • C.T.H. Road)",
      "Avadi (07:35 AM • C.T.H. Road)",
      "Vel Junction (North) (07:40 AM • Avadi - Veltech Road)",
      "Veltech Univ (07:45 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:50 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Water Tank",
        "road": "New Avadi Road",
        "morningTime": "06:15 AM",
        "eveningTime": "05:15 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Chindhamani",
        "road": "6th Avenue",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "K4 Police Station",
        "road": "6th Avenue",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Gandhi Nagar Hospital",
        "road": "Mani Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "ICF BS",
        "road": "Mani Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Villivakkam Nathamuni",
        "road": "Konnur High Road",
        "morningTime": "06:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "TVS Lucas",
        "road": "100 feet road",
        "morningTime": "06:44 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Padi",
        "road": "C.T.H. Road",
        "morningTime": "06:46 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Ambattur Estate",
        "road": "C.T.H. Road",
        "morningTime": "06:48 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Telephone Exchange",
        "road": "C.T.H. Road",
        "morningTime": "06:53 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Ambattur O.T.",
        "road": "C.T.H. Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Avadi",
        "road": "C.T.H. Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Vel Junction (North)",
        "road": "Avadi - Veltech Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:50 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v8a",
    "busNumber": "V8A",
    "name": "Route V8A: Ayyapakkam E.B",
    "area": "Ayyapakkam E.B",
    "corridor": "Ayyapakkam E.B -> Annanur -> Avadi Market -> Avadi -> Vel Tech Campus",
    "departureTime": "06:58 AM",
    "arrivalTime": "07:40 AM",
    "stops": [
      "Ayyapakkam E.B (06:58 AM • Ayappakkam Road)",
      "Annanur junction (07:00 AM • Ayappakkam Road)",
      "Chinnaman koil (07:02 AM • Ayappakkam Road)",
      "Avadi Market (07:04 AM • Avadi-Poonamallee Road)",
      "Avadi (07:10 AM • C.T.H. Road)",
      "Veltech Univ (07:37 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:40 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Ayyapakkam E.B",
        "road": "Ayappakkam Road",
        "morningTime": "06:58 AM",
        "eveningTime": ""
      },
      {
        "sNo": 2,
        "pickupPoint": "Annanur junction",
        "road": "Ayappakkam Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Chinnaman koil",
        "road": "Ayappakkam Road",
        "morningTime": "07:02 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Avadi Market",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "07:04 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Avadi",
        "road": "C.T.H. Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:37 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v9",
    "busNumber": "V9",
    "name": "Route V9: MKB Nagar / Ambedkar College",
    "area": "MKB Nagar / Ambedkar College",
    "corridor": "MKB Nagar -> Vyasarpadi -> Perambur -> Kolathur -> Ambattur -> Vel Tech Campus",
    "departureTime": "06:05 AM",
    "arrivalTime": "07:50 AM",
    "stops": [
      "MKB Nagar (06:05 AM • R2)",
      "Ambedhkar college (06:05 AM • Melapati-Ponnappa Street)",
      "Vyasarpadi (06:08 AM • Perambur Main Road)",
      "Perambur B.P. Road (06:10 AM • B.P. Road)",
      "Eswarikalyanamandapam (06:20 AM • B.P. Road)",
      "Lakshmi Amman koil (06:22 AM • B.P. Road)",
      "Revathy store (06:24 AM • B.P. Road)",
      "Perambur Market (06:26 AM • B.P. Road)",
      "Peravllur (06:30 AM • Paper Mills Road)",
      "Periyar Nagar (06:33 AM • Paper Mills Road)",
      "Kolathur Welding shop (06:36 AM • Paper Mills Road)",
      "Kolathur Moogambiga (06:40 AM • Paper Mills Road)",
      "Ganga Cuavery (06:42 AM • 60 Ft.Road)",
      "Poombokar Nagar (06:43 AM • 1 st Main Road)",
      "Don Bosco school (06:45 AM • Kolathur road)",
      "Rajamangalam Police Station (06:47 AM • Kolathur road)",
      "Senthil Nagar (06:49 AM • Kolathur road)",
      "Lakshmipuram (06:51 AM • Redhills Road)",
      "Vinayagapuram (06:52 AM • Redhills Road)",
      "Surapet (06:54 AM • Redhills Road)",
      "Kallikuppam (06:56 AM • Redhills Road)",
      "Pudhur (06:58 AM • Redhills Road)",
      "Oragadam (07:00 AM • Redhills Road)",
      "Singapore complex (07:07 AM • C.T.H Road)",
      "Avadi (07:20 AM • C.T.H Road)",
      "Vel Junction (North) (07:40 AM • Avadi - Veltech Road)",
      "Veltech Univ (07:45 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:50 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "MKB Nagar",
        "road": "R2",
        "morningTime": "06:05 AM",
        "eveningTime": "05:45 PM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Ambedhkar college",
        "road": "Melapati-Ponnappa Street",
        "morningTime": "06:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Vyasarpadi",
        "road": "Perambur Main Road",
        "morningTime": "06:08 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Perambur B.P. Road",
        "road": "B.P. Road",
        "morningTime": "06:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Eswarikalyanamandapam",
        "road": "B.P. Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Lakshmi Amman koil",
        "road": "B.P. Road",
        "morningTime": "06:22 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Revathy store",
        "road": "B.P. Road",
        "morningTime": "06:24 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Perambur Market",
        "road": "B.P. Road",
        "morningTime": "06:26 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Peravllur",
        "road": "Paper Mills Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Periyar Nagar",
        "road": "Paper Mills Road",
        "morningTime": "06:33 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Kolathur Welding shop",
        "road": "Paper Mills Road",
        "morningTime": "06:36 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Kolathur Moogambiga",
        "road": "Paper Mills Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Ganga Cuavery",
        "road": "60 Ft.Road",
        "morningTime": "06:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Poombokar Nagar",
        "road": "1 st Main Road",
        "morningTime": "06:43 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Don Bosco school",
        "road": "Kolathur road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Rajamangalam Police Station",
        "road": "Kolathur road",
        "morningTime": "06:47 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Senthil Nagar",
        "road": "Kolathur road",
        "morningTime": "06:49 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Lakshmipuram",
        "road": "Redhills Road",
        "morningTime": "06:51 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Vinayagapuram",
        "road": "Redhills Road",
        "morningTime": "06:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Surapet",
        "road": "Redhills Road",
        "morningTime": "06:54 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Kallikuppam",
        "road": "Redhills Road",
        "morningTime": "06:56 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Pudhur",
        "road": "Redhills Road",
        "morningTime": "06:58 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Oragadam",
        "road": "Redhills Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 24,
        "pickupPoint": "Singapore complex",
        "road": "C.T.H Road",
        "morningTime": "07:07 AM",
        "eveningTime": ""
      },
      {
        "sNo": 25,
        "pickupPoint": "Avadi",
        "road": "C.T.H Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 26,
        "pickupPoint": "Vel Junction (North)",
        "road": "Avadi - Veltech Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 27,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 28,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:50 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v10",
    "busNumber": "V10",
    "name": "Route V10: Thiruvallur Ondikuppam",
    "area": "Thiruvallur Ondikuppam",
    "corridor": "Thiruvallur Theradi -> Thiruvallur -> Kakkalur -> Sevvapet -> Avadi -> Vel Tech Campus",
    "departureTime": "06:20 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Thiruvallur Theradi (06:20 AM • Theradi Road)",
      "Kakkalur (06:30 AM • C.T.H. Road)",
      "Sevapettai (06:40 AM • C.T.H. Road)",
      "Veppampattu (06:45 AM • C.T.H. Road)",
      "Thiruninravur (06:50 AM • C.T.H. Road)",
      "Pattabiram (06:55 AM • C.T.H. Road)",
      "Hindu College (07:00 AM • C.T.H. Road)",
      "Sekkadu (07:05 AM • C.T.H. Road)",
      "Avadi (07:15 AM • C.T.H Road)",
      "Vel tech South Junction (07:35 AM • Avadi-Veltech Road)",
      "Veltech Univ (07:37 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Thiruvallur Theradi",
        "road": "Theradi Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 2,
        "pickupPoint": "Kakkalur",
        "road": "C.T.H. Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Sevapettai",
        "road": "C.T.H. Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Veppampattu",
        "road": "C.T.H. Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Thiruninravur",
        "road": "C.T.H. Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Pattabiram",
        "road": "C.T.H. Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Hindu College",
        "road": "C.T.H. Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Sekkadu",
        "road": "C.T.H. Road",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Avadi",
        "road": "C.T.H Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Vel tech South Junction",
        "road": "Avadi-Veltech Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:37 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v10s",
    "busNumber": "V10S",
    "name": "Route V10S: Kanthankollai",
    "area": "Kanthankollai",
    "corridor": "KANTHANKOLLAI -> Veppampattu -> Thirunindravur -> Nemilichery -> Vel Tech Campus",
    "departureTime": "06:30 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "KANTHANKOLLAI (06:30 AM • C.T.H. Road)",
      "Veppampattu (06:40 AM • C.T.H. Road)",
      "Thiruninravur (06:50 AM • C.T.H. Road)",
      "Pattabiram (06:55 AM • C.T.H. Road)",
      "Hindu College (07:00 AM • C.T.H. Road)",
      "Pattabiram Chathiram (07:05 AM • Pattabiram Airforce Road)",
      "Muthapudupet (07:12 AM • Airforce Road)",
      "Airforce (07:15 AM • Airforce Road)",
      "CRPF (07:20 AM • CRPF-Vel Tech Road)",
      "Vel tech South Junction (07:35 AM • Avadi-Veltech Road)",
      "Veltech Univ (07:37 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "KANTHANKOLLAI",
        "road": "C.T.H. Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 2,
        "pickupPoint": "Veppampattu",
        "road": "C.T.H. Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Thiruninravur",
        "road": "C.T.H. Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Pattabiram",
        "road": "C.T.H. Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Hindu College",
        "road": "C.T.H. Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Pattabiram Chathiram",
        "road": "Pattabiram Airforce Road",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Muthapudupet",
        "road": "Airforce Road",
        "morningTime": "07:12 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Airforce",
        "road": "Airforce Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "CRPF",
        "road": "CRPF-Vel Tech Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Vel tech South Junction",
        "road": "Avadi-Veltech Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:37 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v11",
    "busNumber": "V11",
    "name": "Route V11: Kodungaiyur",
    "area": "Kodungaiyur",
    "corridor": "Kanadhasan nagar -> Moolakadai -> Retteri -> Kolathur -> Padi -> Vel Tech Campus",
    "departureTime": "06:00 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Kanadhasan nagar (06:00 AM • Kamaraj Road)",
      "Muthamizh nagar (06:02 AM • Kamaraj Road)",
      "kanadhasan nagar depo (06:03 AM • Meenammal Road)",
      "Muthukumaraswamy college (06:04 AM • Kamaraj Road)",
      "M.R Nagar (06:06 AM • Kamaraj Road)",
      "Pavithra Hospital (06:08 AM • Kamaraj Road)",
      "Erruckancherry (06:10 AM • Kamaraj Road)",
      "Moolakadai P.O. (06:12 AM • Madhavaram High Road)",
      "Donbosco Schools (06:13 AM • Ottraivaadai Street)",
      "Kennedy Square (06:14 AM • Ottraivaadai Street)",
      "Thiru Vi ka Nagar (06:16 AM • S.P.Koil Street)",
      "Agaram (06:18 AM • Paper Mills Road)",
      "DonBosco Church (06:20 AM • Paper Mills Road)",
      "Peravallur (06:21 AM • Paper Mills Road)",
      "Welding shop (06:23 AM • Paper Mills Road)",
      "Kolathur Mookambiga (06:25 AM • Paper Mills Road)",
      "Retteri Signal (06:28 AM • 100ft. Road)",
      "Madhavaram Roundana (06:32 AM • G.N.T. Road)",
      "Puzhal (06:36 AM • G.N.T. Road)",
      "kavakarai (06:38 AM • G.N.T. Road)",
      "Redhills (06:40 AM • Thiruvallur Redhills Road)",
      "Vel Junction (North) (07:35 AM • Avadi - Veltech Road)",
      "Veltech Univ (07:37 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Kanadhasan nagar",
        "road": "Kamaraj Road",
        "morningTime": "06:00 AM",
        "eveningTime": "05:45 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Muthamizh nagar",
        "road": "Kamaraj Road",
        "morningTime": "06:02 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "kanadhasan nagar depo",
        "road": "Meenammal Road",
        "morningTime": "06:03 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Muthukumaraswamy college",
        "road": "Kamaraj Road",
        "morningTime": "06:04 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "M.R Nagar",
        "road": "Kamaraj Road",
        "morningTime": "06:06 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Pavithra Hospital",
        "road": "Kamaraj Road",
        "morningTime": "06:08 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Erruckancherry",
        "road": "Kamaraj Road",
        "morningTime": "06:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Moolakadai P.O.",
        "road": "Madhavaram High Road",
        "morningTime": "06:12 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Donbosco Schools",
        "road": "Ottraivaadai Street",
        "morningTime": "06:13 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Kennedy Square",
        "road": "Ottraivaadai Street",
        "morningTime": "06:14 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Thiru Vi ka Nagar",
        "road": "S.P.Koil Street",
        "morningTime": "06:16 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Agaram",
        "road": "Paper Mills Road",
        "morningTime": "06:18 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "DonBosco Church",
        "road": "Paper Mills Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Peravallur",
        "road": "Paper Mills Road",
        "morningTime": "06:21 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Welding shop",
        "road": "Paper Mills Road",
        "morningTime": "06:23 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Kolathur Mookambiga",
        "road": "Paper Mills Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Retteri Signal",
        "road": "100ft. Road",
        "morningTime": "06:28 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Madhavaram Roundana",
        "road": "G.N.T. Road",
        "morningTime": "06:32 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Puzhal",
        "road": "G.N.T. Road",
        "morningTime": "06:36 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "kavakarai",
        "road": "G.N.T. Road",
        "morningTime": "06:38 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Redhills",
        "road": "Thiruvallur Redhills Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Vel Junction (North)",
        "road": "Avadi - Veltech Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:37 AM",
        "eveningTime": ""
      },
      {
        "sNo": 24,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v12",
    "busNumber": "V12",
    "name": "Route V12: Uthukottai",
    "area": "Uthukottai",
    "corridor": "UTHUKOTTAI -> Periyapalayam -> Arani -> Karanodai -> Vel Tech Campus",
    "departureTime": "06:15 AM",
    "arrivalTime": "07:50 AM",
    "stops": [
      "UTHUKOTTAI (06:15 AM • Periyapalyam - Uthukottai Road)",
      "MGR nagar (06:25 AM • Periyapalyam - Uthukottai Road)",
      "Karachi (06:35 AM • Periyapalyam - Uthukottai Road)",
      "Perandur (06:40 AM • Periyapalyam - Uthukottai Road)",
      "Perambur Pattai (06:45 AM • Periyapalyam - Uthukottai Road)",
      "Thandalam (06:50 AM • Periyapalyam - Uthukottai Road)",
      "Periyapalayam Bus Stand (06:55 AM • Periyapalyam - Uthukottai Road)",
      "Vadamathurai (07:00 AM • Peryapalyam -Thiruvallur Road)",
      "Vengal (07:05 AM • Peryapalyam -Thiruvallur Road)",
      "Vengal X Road (07:10 AM • Peryapalyam -Thiruvallur Road)",
      "Thamaraipakkam X Road (07:15 AM • Peryapalyam -Thiruvallur Road)",
      "Magalgandigai (07:20 AM • Redhills -Thiruvallur Road)",
      "Koduvalli (07:25 AM • Redhills -Thiruvallur Road)",
      "Poochiatthipedu (07:30 AM • Redhills -Thiruvallur Road)",
      "Bangarupettai (07:35 AM • Avadi-veerapuram Road)",
      "Veerapuram (07:40 AM • Vel Tech Alamathi Road)",
      "Veltech Univ (07:45 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:50 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "UTHUKOTTAI",
        "road": "Periyapalyam - Uthukottai Road",
        "morningTime": "06:15 AM",
        "eveningTime": "05:45 PM"
      },
      {
        "sNo": 2,
        "pickupPoint": "MGR nagar",
        "road": "Periyapalyam - Uthukottai Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Karachi",
        "road": "Periyapalyam - Uthukottai Road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Perandur",
        "road": "Periyapalyam - Uthukottai Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Perambur Pattai",
        "road": "Periyapalyam - Uthukottai Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Thandalam",
        "road": "Periyapalyam - Uthukottai Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Periyapalayam Bus Stand",
        "road": "Periyapalyam - Uthukottai Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Vadamathurai",
        "road": "Peryapalyam -Thiruvallur Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Vengal",
        "road": "Peryapalyam -Thiruvallur Road",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Vengal X Road",
        "road": "Peryapalyam -Thiruvallur Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Thamaraipakkam X Road",
        "road": "Peryapalyam -Thiruvallur Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Magalgandigai",
        "road": "Redhills -Thiruvallur Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Koduvalli",
        "road": "Redhills -Thiruvallur Road",
        "morningTime": "07:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Poochiatthipedu",
        "road": "Redhills -Thiruvallur Road",
        "morningTime": "07:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Bangarupettai",
        "road": "Avadi-veerapuram Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Veerapuram",
        "road": "Vel Tech Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:50 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v13",
    "busNumber": "V13",
    "name": "Route V13: Thiru Vi Ka Nagar",
    "area": "Thiru Vi Ka Nagar",
    "corridor": "Moolakadai -> Moolakadai -> Perambur -> Retteri -> Ambattur -> Vel Tech Campus",
    "departureTime": "06:45 AM",
    "arrivalTime": "07:55 AM",
    "stops": [
      "Moolakadai (06:45 AM • GNT Road)",
      "Brindha (06:50 AM • Paper Mills Road)",
      "Thiru Vi ka Nagar (06:55 AM • S.P.Koil Street)",
      "Agaram (07:00 AM • Paper Mills Road)",
      "Kolathur DonBosco (07:03 AM • Paper Mills Road)",
      "Peravallur (07:08 AM • Paper Mills Road)",
      "Kolathur Welding shop (07:12 AM • Paper Mills Road)",
      "Kolathur Mookambiga (07:18 AM • Paper Mills Road)",
      "Retteri Signal (07:25 AM • 100ft. Road)",
      "Madhavaram Roundana (07:30 AM • G.N.T. Road)",
      "Puzhal (07:35 AM • G.N.T. Road)",
      "kavakarai (07:40 AM • G.N.T. Road)",
      "Redhills (07:45 AM • Thiruvallur Redhills Road)",
      "Veltech Univ (07:50 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:55 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Moolakadai",
        "road": "GNT Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 2,
        "pickupPoint": "Brindha",
        "road": "Paper Mills Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Thiru Vi ka Nagar",
        "road": "S.P.Koil Street",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Agaram",
        "road": "Paper Mills Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Kolathur DonBosco",
        "road": "Paper Mills Road",
        "morningTime": "07:03 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Peravallur",
        "road": "Paper Mills Road",
        "morningTime": "07:08 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Kolathur Welding shop",
        "road": "Paper Mills Road",
        "morningTime": "07:12 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Kolathur Mookambiga",
        "road": "Paper Mills Road",
        "morningTime": "07:18 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Retteri Signal",
        "road": "100ft. Road",
        "morningTime": "07:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Madhavaram Roundana",
        "road": "G.N.T. Road",
        "morningTime": "07:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Puzhal",
        "road": "G.N.T. Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "kavakarai",
        "road": "G.N.T. Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Redhills",
        "road": "Thiruvallur Redhills Road",
        "morningTime": "07:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:55 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v14",
    "busNumber": "V14",
    "name": "Route V14: Melur - Minjur - Ponneri",
    "area": "Melur - Minjur - Ponneri",
    "corridor": "Melur -> Minjur -> Ponneri -> Sholavaram -> Redhills -> Vel Tech Campus",
    "departureTime": "06:10 AM",
    "arrivalTime": "07:50 AM",
    "stops": [
      "Melur (06:10 AM • Ponneri Road)",
      "Nandhiyambakkam (06:12 AM • Ponneri Road)",
      "B.D.O Office (06:15 AM • Ponneri Road)",
      "Minjur Rly.Station (06:17 AM • Ponneri Road)",
      "Minjur (06:20 AM • Ponneri Road)",
      "Kesavapuram (06:23 AM • Ponneri Road)",
      "Nalur (06:25 AM • Ponneri Road)",
      "Mettupalayam (06:28 AM • Ponneri Road)",
      "Pulikulam (06:30 AM • Ponneri Road)",
      "Vembakkam (06:35 AM • Ponneri Road)",
      "Ponneri (06:40 AM • Thatchur Road)",
      "Krishnapuram (06:42 AM • Thatchur Road)",
      "Andarkuppam (06:41 AM • Thatchur Road)",
      "Thatchur (06:43 AM • G.N.T. Road)",
      "Thatchur Koot Road (06:45 AM • G.N.T. Road)",
      "Pancheti (06:50 AM • G.N.T. Road)",
      "Karanodai (06:55 AM • G.N.T. Road)",
      "Padianallur (07:15 AM • G.N.T. Road)",
      "Redhills (07:20 AM • Redhills Main Road)",
      "Redhills Tel. Exchange (07:25 AM • Thiruvallur Redhills Road)",
      "Redhills Gandhi Nagar (07:35 AM • Thiruvallur Redhills Road)",
      "Veltech Univ (07:45 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:50 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Melur",
        "road": "Ponneri Road",
        "morningTime": "06:10 AM",
        "eveningTime": "05:25 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Nandhiyambakkam",
        "road": "Ponneri Road",
        "morningTime": "06:12 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "B.D.O Office",
        "road": "Ponneri Road",
        "morningTime": "06:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Minjur Rly.Station",
        "road": "Ponneri Road",
        "morningTime": "06:17 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Minjur",
        "road": "Ponneri Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Kesavapuram",
        "road": "Ponneri Road",
        "morningTime": "06:23 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Nalur",
        "road": "Ponneri Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Mettupalayam",
        "road": "Ponneri Road",
        "morningTime": "06:28 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Pulikulam",
        "road": "Ponneri Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Vembakkam",
        "road": "Ponneri Road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Ponneri",
        "road": "Thatchur Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Krishnapuram",
        "road": "Thatchur Road",
        "morningTime": "06:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Andarkuppam",
        "road": "Thatchur Road",
        "morningTime": "06:41 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Thatchur",
        "road": "G.N.T. Road",
        "morningTime": "06:43 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Thatchur Koot Road",
        "road": "G.N.T. Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Pancheti",
        "road": "G.N.T. Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Karanodai",
        "road": "G.N.T. Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Padianallur",
        "road": "G.N.T. Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Redhills",
        "road": "Redhills Main Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Redhills Tel. Exchange",
        "road": "Thiruvallur Redhills Road",
        "morningTime": "07:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Redhills Gandhi Nagar",
        "road": "Thiruvallur Redhills Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:50 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v15",
    "busNumber": "V15",
    "name": "Route V15: Kasimedu",
    "area": "Kasimedu",
    "corridor": "Kasimedu -> Royapuram -> Stanley -> Madhavaram -> Vel Tech Campus",
    "departureTime": "06:00 AM",
    "arrivalTime": "07:40 AM",
    "stops": [
      "Kasimedu (06:00 AM • Mannarsamy Koil Street)",
      "Flag street Main Road (06:02 AM • Mannarsamy Koil Street)",
      "Kalmandapam (06:05 AM • Mannarsamy Koil Street)",
      "Royapuram (06:10 AM • Mannarsamy Koil Street)",
      "Stanely (06:15 AM • Old Jail Road)",
      "Mint (06:17 AM • Old Jail Road)",
      "Basin Bridge (06:19 AM • Main Road)",
      "Choolai post office (06:22 AM • Thiru Narayana Road)",
      "Puliyanthope (06:24 AM • Perambur Barracks Road)",
      "Barracks Road (06:27 AM • Perambur Barracks Road)",
      "Dowtton (06:30 AM • Perambur Barracks Road)",
      "Otteri (06:32 AM • Perambur Barracks Road)",
      "Binny Mills (06:34 AM • Cooks Road)",
      "Jamaliya (06:37 AM • Perambur High Road)",
      "Sembiyum (06:40 AM • Perambur High Road)",
      "Venus (06:43 AM • Perambur High Road)",
      "Agaram (06:46 AM • Perambur High Road)",
      "Peravallur (06:48 AM • Paper Mills Road)",
      "Kolathur Welding shop (06:50 AM • Paper Mills Road)",
      "Kolathur Moogambiga (06:52 AM • Paper Mills Road)",
      "Retteri Signal (06:54 AM • Paper Mills Road)",
      "Madhavaram Ring Road (06:58 AM • 100 Ft. Road)",
      "Puzhal (07:02 AM • G.N.T. Road)",
      "Redhills (07:15 AM • G.N.T. Road)",
      "Veltech Univ (07:38 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:40 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Kasimedu",
        "road": "Mannarsamy Koil Street",
        "morningTime": "06:00 AM",
        "eveningTime": "05:35 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Flag street Main Road",
        "road": "Mannarsamy Koil Street",
        "morningTime": "06:02 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Kalmandapam",
        "road": "Mannarsamy Koil Street",
        "morningTime": "06:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Royapuram",
        "road": "Mannarsamy Koil Street",
        "morningTime": "06:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Stanely",
        "road": "Old Jail Road",
        "morningTime": "06:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Mint",
        "road": "Old Jail Road",
        "morningTime": "06:17 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Basin Bridge",
        "road": "Main Road",
        "morningTime": "06:19 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Choolai post office",
        "road": "Thiru Narayana Road",
        "morningTime": "06:22 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Puliyanthope",
        "road": "Perambur Barracks Road",
        "morningTime": "06:24 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Barracks Road",
        "road": "Perambur Barracks Road",
        "morningTime": "06:27 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Dowtton",
        "road": "Perambur Barracks Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Otteri",
        "road": "Perambur Barracks Road",
        "morningTime": "06:32 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Binny Mills",
        "road": "Cooks Road",
        "morningTime": "06:34 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Jamaliya",
        "road": "Perambur High Road",
        "morningTime": "06:37 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Sembiyum",
        "road": "Perambur High Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Venus",
        "road": "Perambur High Road",
        "morningTime": "06:43 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Agaram",
        "road": "Perambur High Road",
        "morningTime": "06:46 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Peravallur",
        "road": "Paper Mills Road",
        "morningTime": "06:48 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Kolathur Welding shop",
        "road": "Paper Mills Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Kolathur Moogambiga",
        "road": "Paper Mills Road",
        "morningTime": "06:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Retteri Signal",
        "road": "Paper Mills Road",
        "morningTime": "06:54 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Madhavaram Ring Road",
        "road": "100 Ft. Road",
        "morningTime": "06:58 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Puzhal",
        "road": "G.N.T. Road",
        "morningTime": "07:02 AM",
        "eveningTime": ""
      },
      {
        "sNo": 24,
        "pickupPoint": "Redhills",
        "road": "G.N.T. Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 25,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:38 AM",
        "eveningTime": ""
      },
      {
        "sNo": 26,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v16",
    "busNumber": "V16",
    "name": "Route V16: Gummidipoondi",
    "area": "Gummidipoondi",
    "corridor": "Gummidipoondi -> Kavarapettai -> Thatchoor -> Karanodai -> Redhills -> Vel Tech Campus",
    "departureTime": "05:45 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Gummidipoondi (05:45 AM • G.N.T. Road)",
      "Bazar (05:55 AM • G.N.T. Road)",
      "Kavarapettai (06:05 AM • G.N.T. Road)",
      "Pudhuvoyal (06:10 AM • G.N.T. Road)",
      "Thatchur Koot Road (06:15 AM • G.N.T. Road)",
      "Janapanchatram X Road (06:20 AM • G.N.T. Road)",
      "Kanniputhur (06:25 AM • Redhills - Peryapalyam Road)",
      "Vadamathurai (06:35 AM • Peryapalyam -Thiruvallur Road)",
      "Vengal (06:40 AM • Peryapalyam -Thiruvallur Road)",
      "Vengal X Road (06:45 AM • Peryapalyam -Thiruvallur Road)",
      "Thamaraipakkam X Road (06:50 AM • Peryapalyam -Thiruvallur Road)",
      "Magalgandigai (06:55 AM • Redhills -Thiruvallur Road)",
      "Koduvalli (07:00 AM • Redhills -Thiruvallur Road)",
      "Poochiatthipedu (07:10 AM • Redhills -Thiruvallur Road)",
      "Bangarupettai (07:15 AM • Avadi-veerapuram Road)",
      "Veerapuram (07:20 AM • Vel Tech Alamathi Road)",
      "Veltech Univ (07:37 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Gummidipoondi",
        "road": "G.N.T. Road",
        "morningTime": "05:45 AM",
        "eveningTime": "05:45 PM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Bazar",
        "road": "G.N.T. Road",
        "morningTime": "05:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Kavarapettai",
        "road": "G.N.T. Road",
        "morningTime": "06:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Pudhuvoyal",
        "road": "G.N.T. Road",
        "morningTime": "06:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Thatchur Koot Road",
        "road": "G.N.T. Road",
        "morningTime": "06:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Janapanchatram X Road",
        "road": "G.N.T. Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Kanniputhur",
        "road": "Redhills - Peryapalyam Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Vadamathurai",
        "road": "Peryapalyam -Thiruvallur Road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Vengal",
        "road": "Peryapalyam -Thiruvallur Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Vengal X Road",
        "road": "Peryapalyam -Thiruvallur Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Thamaraipakkam X Road",
        "road": "Peryapalyam -Thiruvallur Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Magalgandigai",
        "road": "Redhills -Thiruvallur Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Koduvalli",
        "road": "Redhills -Thiruvallur Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Poochiatthipedu",
        "road": "Redhills -Thiruvallur Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Bangarupettai",
        "road": "Avadi-veerapuram Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Veerapuram",
        "road": "Vel Tech Alamathi Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:37 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v17",
    "busNumber": "V17",
    "name": "Route V17: Metha Nagar / Nungambakkam",
    "area": "Metha Nagar / Nungambakkam",
    "corridor": "Nungambakkam -> Loyola College -> Choolaimedu -> Mogappair -> Vel Tech Campus",
    "departureTime": "06:15 AM",
    "arrivalTime": "07:50 AM",
    "stops": [
      "Nungambakkam (06:15 AM • Streling Road)",
      "Mehta Nagar (06:35 AM • Anna Arch Road)",
      "Anna Arch (06:40 AM • 2nd Avenue)",
      "Shanthi Colony (06:45 AM • 2nd Avenue)",
      "Thirumangalam (06:50 AM • 100ft. Road)",
      "Collector Nagar (06:55 AM • Ambattur Estate Road)",
      "J.J. Nagar P.S (06:57 AM • Valaiyapathi Road)",
      "Mugapper East T.N.H.B (07:00 AM • Parl Road)",
      "J.J. Nagar B.T (07:03 AM • Thiruvalluvar Road)",
      "7H Bus stand (07:03 AM • Thiruvalluvar Road)",
      "Velammal School (07:05 AM • Valaiyapathi Road)",
      "Mugapper West Depo (07:08 AM • Main Road)",
      "Ambatuur Telephone Exchange (07:10 AM • C.T.H. Road)",
      "Ambattur O.T. (07:15 AM • C.T.H. Road)",
      "Thirumullaivoyal (07:20 AM • C.T.H. Road)",
      "Avadi (07:25 AM • Avadi-Veltech Road)",
      "Veltech Univ (07:40 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:50 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Nungambakkam",
        "road": "Streling Road",
        "morningTime": "06:15 AM",
        "eveningTime": "05:45 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Mehta Nagar",
        "road": "Anna Arch Road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Anna Arch",
        "road": "2nd Avenue",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Shanthi Colony",
        "road": "2nd Avenue",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Thirumangalam",
        "road": "100ft. Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Collector Nagar",
        "road": "Ambattur Estate Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "J.J. Nagar P.S",
        "road": "Valaiyapathi Road",
        "morningTime": "06:57 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Mugapper East T.N.H.B",
        "road": "Parl Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "J.J. Nagar B.T",
        "road": "Thiruvalluvar Road",
        "morningTime": "07:03 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "7H Bus stand",
        "road": "Thiruvalluvar Road",
        "morningTime": "07:03 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Velammal School",
        "road": "Valaiyapathi Road",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Mugapper West Depo",
        "road": "Main Road",
        "morningTime": "07:08 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Ambatuur Telephone Exchange",
        "road": "C.T.H. Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Ambattur O.T.",
        "road": "C.T.H. Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Thirumullaivoyal",
        "road": "C.T.H. Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Avadi",
        "road": "Avadi-Veltech Road",
        "morningTime": "07:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:50 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v18",
    "busNumber": "V18",
    "name": "Route V18: Thiruvottiyur / Ernavoor",
    "area": "Thiruvottiyur / Ernavoor",
    "corridor": "Ernavoor -> Tollgate -> Moolakadai -> Kolathur -> Padi -> Vel Tech Campus",
    "departureTime": "06:00 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Ernavoor (06:00 AM • Kathivakkam High Road)",
      "Mullainagar (06:02 AM • Thiruvottriyur High Road)",
      "Lift gate (06:05 AM • Thiruvottriyur High Road)",
      "Wimco (06:07 AM • Thiruvottriyur High Road)",
      "Ajax (06:10 AM • Thiruvottriyur High Road)",
      "Periyar Nagar (06:14 AM • Thiruvottriyur High Road)",
      "Thiruvottriyur (06:16 AM • Thiruvottriyur High Road)",
      "Theradi (06:18 AM • Thiruvottriyur High Road)",
      "Ellaiamman Koil (06:20 AM • Thiruvottriyur High Road)",
      "Kaladipet (06:22 AM • Thiruvottriyur High Road)",
      "Rajakadai (06:23 AM • Thiruvottriyur High Road)",
      "Thangal (06:25 AM • Thiruvottriyur High Road)",
      "Toll gate (06:27 AM • Thiruvottriyur High Road)",
      "Lakshmi Koil (06:29 AM • Thiruvottriyur High Road)",
      "Tondiarpet depot (06:31 AM • Thiruvottriyur High Road)",
      "Appollo (06:32 AM • Thiruvottriyur High Road)",
      "Old Wahermenpet (06:36 AM • Thiruvottriyur High Road)",
      "Manikoondu (06:38 AM • Thiruvottriyur High Road)",
      "Maharani Post office (06:40 AM • Thiruvottriyur High Road)",
      "Thyagaraja College (06:41 AM • Thiruvottriyur High Road)",
      "Mint (06:45 AM • Thiruvottriyur High Road)",
      "Basinbridge (06:47 AM • Main road)",
      "Sharma nagar (06:50 AM • G.N.T. Road)",
      "Erukkancherry (06:52 AM • G.N.T. Road)",
      "Moolakadai (07:05 AM • G.N.T. Road)",
      "Madhavaram Ring Road (07:20 AM • 100 Ft. Road)",
      "Redhills (07:30 AM • G.N.T. Road)",
      "Veltech Univ (07:40 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Ernavoor",
        "road": "Kathivakkam High Road",
        "morningTime": "06:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 2,
        "pickupPoint": "Mullainagar",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:02 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Lift gate",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Wimco",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:07 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Ajax",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Periyar Nagar",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:14 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Thiruvottriyur",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:16 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Theradi",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:18 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Ellaiamman Koil",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Kaladipet",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:22 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Rajakadai",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:23 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Thangal",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Toll gate",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:27 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Lakshmi Koil",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:29 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Tondiarpet depot",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:31 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Appollo",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:32 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Old Wahermenpet",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:36 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Manikoondu",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:38 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Maharani Post office",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Thyagaraja College",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:41 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Mint",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Basinbridge",
        "road": "Main road",
        "morningTime": "06:47 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Sharma nagar",
        "road": "G.N.T. Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 24,
        "pickupPoint": "Erukkancherry",
        "road": "G.N.T. Road",
        "morningTime": "06:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 25,
        "pickupPoint": "Moolakadai",
        "road": "G.N.T. Road",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 26,
        "pickupPoint": "Madhavaram Ring Road",
        "road": "100 Ft. Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 27,
        "pickupPoint": "Redhills",
        "road": "G.N.T. Road",
        "morningTime": "07:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 28,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 29,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v19",
    "busNumber": "V19",
    "name": "Route V19: Royapettah",
    "area": "Royapettah",
    "corridor": "Royapettah Hospital -> Express Avenue -> Kilpauk -> Thirumangalam -> Vel Tech Campus",
    "departureTime": "06:10 AM",
    "arrivalTime": "07:50 AM",
    "stops": [
      "Royapettah Hospital (06:10 AM • West Cott Road)",
      "Royapettah Towerclock (06:15 AM • Whites Road)",
      "Spencer Plaza (06:16 AM • Binny Road)",
      "Ethiraj College (06:17 AM • Commander-in-chief Road)",
      "CO-OPTEX (06:19 AM • Pantheon Road)",
      "Sankara Nethralaya (06:22 AM • College Road)",
      "Nungambakkam (06:25 AM • Sterling Road)",
      "Kodambakkam liberty (06:30 AM • Arcot Road)",
      "Vadapalani (06:33 AM • 100ft. Road)",
      "MMDA (06:35 AM • 100ft. Road)",
      "Koyambedu (06:40 AM • 100ft. Road)",
      "Nerkundram (06:45 AM • Poonamallee High Road)",
      "Madhuravoyal (06:47 AM • Poonamallee High Road)",
      "Ambatuur Telephone Exchange (07:05 AM • C.T.H. Road)",
      "Ambattur O.T. (07:15 AM • C.T.H. Road)",
      "Thirumullaivoyal (07:20 AM • C.T.H. Road)",
      "Avadi (07:25 AM • Avadi-Veltech Road)",
      "Veltech Univ (07:40 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:50 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Royapettah Hospital",
        "road": "West Cott Road",
        "morningTime": "06:10 AM",
        "eveningTime": "05:45 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Royapettah Towerclock",
        "road": "Whites Road",
        "morningTime": "06:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Spencer Plaza",
        "road": "Binny Road",
        "morningTime": "06:16 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Ethiraj College",
        "road": "Commander-in-chief Road",
        "morningTime": "06:17 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "CO-OPTEX",
        "road": "Pantheon Road",
        "morningTime": "06:19 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Sankara Nethralaya",
        "road": "College Road",
        "morningTime": "06:22 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Nungambakkam",
        "road": "Sterling Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Kodambakkam liberty",
        "road": "Arcot Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Vadapalani",
        "road": "100ft. Road",
        "morningTime": "06:33 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "MMDA",
        "road": "100ft. Road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Koyambedu",
        "road": "100ft. Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Nerkundram",
        "road": "Poonamallee High Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Madhuravoyal",
        "road": "Poonamallee High Road",
        "morningTime": "06:47 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Ambatuur Telephone Exchange",
        "road": "C.T.H. Road",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Ambattur O.T.",
        "road": "C.T.H. Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Thirumullaivoyal",
        "road": "C.T.H. Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Avadi",
        "road": "Avadi-Veltech Road",
        "morningTime": "07:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:50 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v20",
    "busNumber": "V20",
    "name": "Route V20: IOC (Tondiarpet)",
    "area": "IOC (Tondiarpet)",
    "corridor": "IOC -> Tondiarpet -> Washermanpet -> Madhavaram -> Vel Tech Campus",
    "departureTime": "06:00 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "IOC (06:00 AM • Thiruvottriyur High Road)",
      "Power house (06:05 AM • Thiruvottriyur High Road)",
      "Korukkupettai (06:15 AM • Thiruvottriyur High Road)",
      "Moolakadai (06:20 AM • Madhavaram High Road)",
      "Temple school (06:35 AM • Madhavaram High Road)",
      "Senthil nagar (06:35 AM • 100 ft Road)",
      "D.R.Hospital (06:40 AM • 100 ft Road)",
      "Thathankuppam (06:42 AM • 100 ft Road)",
      "Padi (06:45 AM • 100 ft Road)",
      "Korattur (06:48 AM • Main road)",
      "Telephone Exchange (06:52 AM • C.T.H Road)",
      "Ambattur Canara Bank (06:56 AM • C.T.H Road)",
      "Ambattur OT bus Stand (07:00 AM • C.T.H Road)",
      "Singapore Complex (07:05 AM • C.T.H Road)",
      "Thirumullaivoyal (07:15 AM • C.T.H Road)",
      "Murugappa Polytechnic (07:18 AM • C.T.H Road)",
      "Avadi (07:20 AM • C.T.H Road)",
      "Vel Junction (07:35 AM • Avadi - Veltech Road)",
      "Veltech Univ (07:37 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "IOC",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:00 AM",
        "eveningTime": "05:45 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Power house",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Korukkupettai",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Moolakadai",
        "road": "Madhavaram High Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Temple school",
        "road": "Madhavaram High Road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Senthil nagar",
        "road": "100 ft Road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "D.R.Hospital",
        "road": "100 ft Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Thathankuppam",
        "road": "100 ft Road",
        "morningTime": "06:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Padi",
        "road": "100 ft Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Korattur",
        "road": "Main road",
        "morningTime": "06:48 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Telephone Exchange",
        "road": "C.T.H Road",
        "morningTime": "06:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Ambattur Canara Bank",
        "road": "C.T.H Road",
        "morningTime": "06:56 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Ambattur OT bus Stand",
        "road": "C.T.H Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Singapore Complex",
        "road": "C.T.H Road",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Thirumullaivoyal",
        "road": "C.T.H Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Murugappa Polytechnic",
        "road": "C.T.H Road",
        "morningTime": "07:18 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Avadi",
        "road": "C.T.H Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Vel Junction",
        "road": "Avadi - Veltech Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:37 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v21",
    "busNumber": "V21",
    "name": "Route V21: Valasaravakkam",
    "area": "Valasaravakkam",
    "corridor": "Valasaravakam -> Chinmaya Nagar -> Koyambedu -> Ambattur -> Vel Tech Campus",
    "departureTime": "06:00 AM",
    "arrivalTime": "07:50 AM",
    "stops": [
      "Valasaravakam (06:00 AM • Arcot Road)",
      "Chinmai Nagar (06:18 AM • Kaliamman Koil Street)",
      "Nerkundram (06:20 AM • Poonamallee High Road)",
      "Madhuravoyal (06:21 AM • Poonamallee High Road)",
      "Vanagaram (06:23 AM • Poonamallee High Road)",
      "Kumar Theater (06:25 AM • Poonamallee High Road)",
      "Vellappanchavadi (06:30 AM • Poonamallee High Road)",
      "Senneer kuppam (07:00 AM • By Pass Road)",
      "Govardhanagiri (07:02 AM • Avadi Road)",
      "Avadi (07:15 AM • C.T.H. Road)",
      "Veltech Univ (07:45 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:50 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Valasaravakam",
        "road": "Arcot Road",
        "morningTime": "06:00 AM",
        "eveningTime": "05:45 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Chinmai Nagar",
        "road": "Kaliamman Koil Street",
        "morningTime": "06:18 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Nerkundram",
        "road": "Poonamallee High Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Madhuravoyal",
        "road": "Poonamallee High Road",
        "morningTime": "06:21 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Vanagaram",
        "road": "Poonamallee High Road",
        "morningTime": "06:23 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Kumar Theater",
        "road": "Poonamallee High Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Vellappanchavadi",
        "road": "Poonamallee High Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Senneer kuppam",
        "road": "By Pass Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Govardhanagiri",
        "road": "Avadi Road",
        "morningTime": "07:02 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Avadi",
        "road": "C.T.H. Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:50 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v22",
    "busNumber": "V22",
    "name": "Route V22: MMDA Arumbakkam",
    "area": "MMDA Arumbakkam",
    "corridor": "MMDA -> Arumbakkam -> Koyambedu -> Poonamallee Road -> Vel Tech Campus",
    "departureTime": "06:25 AM",
    "arrivalTime": "07:55 AM",
    "stops": [
      "MMDA (06:25 AM • 100ft. Road)",
      "Arumbakkam (06:35 AM • poonamallee High road)",
      "Panjali Amman Kovil (06:38 AM • Poonamallee High Road)",
      "Vellappanchavadi (07:00 AM • Poonamallee High Road)",
      "Sanjay Gandhi Nagar (07:05 AM • Perumal Agaram Salai)",
      "Thiruverkadu Panchayat (07:10 AM • Sivan Koil Street)",
      "Paruthipattu (07:25 AM • Avadi-Poonamallee Road)",
      "Govardhanagiri (07:30 AM • Avadi-Poonamallee Road)",
      "Avadi (07:35 AM • C.T.H. Road)",
      "Veltech Univ (07:50 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:55 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "MMDA",
        "road": "100ft. Road",
        "morningTime": "06:25 AM",
        "eveningTime": "05:20 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Arumbakkam",
        "road": "poonamallee High road",
        "morningTime": "06:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Panjali Amman Kovil",
        "road": "Poonamallee High Road",
        "morningTime": "06:38 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Vellappanchavadi",
        "road": "Poonamallee High Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Sanjay Gandhi Nagar",
        "road": "Perumal Agaram Salai",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Thiruverkadu Panchayat",
        "road": "Sivan Koil Street",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Paruthipattu",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "07:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Govardhanagiri",
        "road": "Avadi-Poonamallee Road",
        "morningTime": "07:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Avadi",
        "road": "C.T.H. Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:55 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v23",
    "busNumber": "V23",
    "name": "Route V23: Madipakkam",
    "area": "Madipakkam",
    "corridor": "Madipakkam -> Velachery -> Guindy -> Porur -> Avadi -> Vel Tech Campus",
    "departureTime": "06:00 AM",
    "arrivalTime": "07:50 AM",
    "stops": [
      "Madipakkam (06:00 AM • Pillayar Koil Street)",
      "Velachery MTC B.T. (06:08 AM • Velachery Main Road)",
      "Gurunanak College (06:10 AM • Velachery Main Road)",
      "Velachery Checkpost (06:05 AM • Velachery Road)",
      "Guindy Race course Road (06:10 AM • Guindy Race course Road)",
      "Guindy Kathipara (06:15 AM • Butt Road)",
      "St. Thomas Mount Church (06:17 AM • Butt Road)",
      "Butt Road B.S. (06:20 AM • Mount Poonamallee Road)",
      "Nandambakkam CTC B.S. (06:25 AM • Mount Poonamallee Road)",
      "MIOT Hospitals (06:27 AM • Mount Poonamallee Road)",
      "L&T, Ramapuram (06:30 AM • Mount Poonamallee Road)",
      "Mugalivakkam B.S. (06:35 AM • Mount Poonamallee Road)",
      "Porur (06:40 AM • Mount Poonamallee Road)",
      "Iyappanthangal (06:45 AM • Mount Poonamallee Road)",
      "Kattuppakkam (06:50 AM • Mount Poonamallee Road)",
      "Karayanchavadi (07:00 AM • Avadi Road)",
      "Govardhanagiri (07:10 AM • Avadi Road)",
      "Avadi (07:20 AM • C.T.H. Road)",
      "Vel Junction (North) (07:47 AM • Avadi-Veltech Road)",
      "Vel Tech Anna campus (07:50 AM • R1)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Madipakkam",
        "road": "Pillayar Koil Street",
        "morningTime": "06:00 AM",
        "eveningTime": "05:50 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Velachery MTC B.T.",
        "road": "Velachery Main Road",
        "morningTime": "06:08 AM",
        "eveningTime": "05:40 AM"
      },
      {
        "sNo": 3,
        "pickupPoint": "Gurunanak College",
        "road": "Velachery Main Road",
        "morningTime": "06:10 AM",
        "eveningTime": "05:38 AM"
      },
      {
        "sNo": 4,
        "pickupPoint": "Velachery Checkpost",
        "road": "Velachery Road",
        "morningTime": "06:05 AM",
        "eveningTime": "05:35 AM"
      },
      {
        "sNo": 5,
        "pickupPoint": "Guindy Race course Road",
        "road": "Guindy Race course Road",
        "morningTime": "06:10 AM",
        "eveningTime": "05:28 AM"
      },
      {
        "sNo": 6,
        "pickupPoint": "Guindy Kathipara",
        "road": "Butt Road",
        "morningTime": "06:15 AM",
        "eveningTime": "05:10 AM"
      },
      {
        "sNo": 7,
        "pickupPoint": "St. Thomas Mount Church",
        "road": "Butt Road",
        "morningTime": "06:17 AM",
        "eveningTime": "05:05 AM"
      },
      {
        "sNo": 8,
        "pickupPoint": "Butt Road B.S.",
        "road": "Mount Poonamallee Road",
        "morningTime": "06:20 AM",
        "eveningTime": "05:00 AM"
      },
      {
        "sNo": 9,
        "pickupPoint": "Nandambakkam CTC B.S.",
        "road": "Mount Poonamallee Road",
        "morningTime": "06:25 AM",
        "eveningTime": "04:58 PM"
      },
      {
        "sNo": 10,
        "pickupPoint": "MIOT Hospitals",
        "road": "Mount Poonamallee Road",
        "morningTime": "06:27 AM",
        "eveningTime": "04:55 PM"
      },
      {
        "sNo": 11,
        "pickupPoint": "L&T, Ramapuram",
        "road": "Mount Poonamallee Road",
        "morningTime": "06:30 AM",
        "eveningTime": "04:50 PM"
      },
      {
        "sNo": 12,
        "pickupPoint": "Mugalivakkam B.S.",
        "road": "Mount Poonamallee Road",
        "morningTime": "06:35 AM",
        "eveningTime": "04:48 PM"
      },
      {
        "sNo": 13,
        "pickupPoint": "Porur",
        "road": "Mount Poonamallee Road",
        "morningTime": "06:40 AM",
        "eveningTime": "04:45 PM"
      },
      {
        "sNo": 14,
        "pickupPoint": "Iyappanthangal",
        "road": "Mount Poonamallee Road",
        "morningTime": "06:45 AM",
        "eveningTime": "04:42 PM"
      },
      {
        "sNo": 15,
        "pickupPoint": "Kattuppakkam",
        "road": "Mount Poonamallee Road",
        "morningTime": "06:50 AM",
        "eveningTime": "04:40 PM"
      },
      {
        "sNo": 16,
        "pickupPoint": "Karayanchavadi",
        "road": "Avadi Road",
        "morningTime": "07:00 AM",
        "eveningTime": "04:38 PM"
      },
      {
        "sNo": 17,
        "pickupPoint": "Govardhanagiri",
        "road": "Avadi Road",
        "morningTime": "07:10 AM",
        "eveningTime": "04:35 PM"
      },
      {
        "sNo": 18,
        "pickupPoint": "Avadi",
        "road": "C.T.H. Road",
        "morningTime": "07:20 AM",
        "eveningTime": "04:30 PM"
      },
      {
        "sNo": 19,
        "pickupPoint": "Vel Junction (North)",
        "road": "Avadi-Veltech Road",
        "morningTime": "07:47 AM",
        "eveningTime": "04:03 PM"
      },
      {
        "sNo": 20,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "R1",
        "morningTime": "07:50 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v24a",
    "busNumber": "V24A",
    "name": "Route V24A: Mogappair / Collector Nagar",
    "area": "Mogappair / Collector Nagar",
    "corridor": "Collector Nagar -> Collector Nagar -> Mogappair East -> Ambattur -> Vel Tech Campus",
    "departureTime": "06:20 AM",
    "arrivalTime": "07:40 AM",
    "stops": [
      "Collector Nagar (06:20 AM • Bazar Road)",
      "MMM Hospital (06:22 AM • Bazar Road)",
      "J.J. Nagar P.S (06:24 AM • Valaiyapathi Road)",
      "Velammal School (06:26 AM • Valaiyapathi Road)",
      "Mogappair East T.N.H.B (06:28 AM • Parl Road)",
      "J.J. Nagar B.T (06:30 AM • Thiruvalluvar Road)",
      "Panneer Nagar (06:32 AM • Thiruvalluvar Road)",
      "Mohan Ram Nagar (06:34 AM • Thiruvalluvar Road)",
      "DAV Girls H.S. School (06:36 AM • Ambattur Estate Road)",
      "Mugapper Post Office (06:38 AM • Vellar Street)",
      "VGP Nagar (06:40 AM • 1st Avenue)",
      "Mugapper West 6th Block (06:42 AM • 1st Avenue)",
      "Mugapper West Water Tank (06:44 AM • 1st Avenue)",
      "Ambatur Dunlop (06:50 AM • C.T.H. Road)",
      "Ambedkar silai (06:53 AM • Ayappakkam Road)",
      "Avadi (07:10 AM • C.T.H. Road)",
      "Veltech Univ (07:37 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:40 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Collector Nagar",
        "road": "Bazar Road",
        "morningTime": "06:20 AM",
        "eveningTime": "05:35 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "MMM Hospital",
        "road": "Bazar Road",
        "morningTime": "06:22 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "J.J. Nagar P.S",
        "road": "Valaiyapathi Road",
        "morningTime": "06:24 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Velammal School",
        "road": "Valaiyapathi Road",
        "morningTime": "06:26 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Mogappair East T.N.H.B",
        "road": "Parl Road",
        "morningTime": "06:28 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "J.J. Nagar B.T",
        "road": "Thiruvalluvar Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Panneer Nagar",
        "road": "Thiruvalluvar Road",
        "morningTime": "06:32 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Mohan Ram Nagar",
        "road": "Thiruvalluvar Road",
        "morningTime": "06:34 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "DAV Girls H.S. School",
        "road": "Ambattur Estate Road",
        "morningTime": "06:36 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Mugapper Post Office",
        "road": "Vellar Street",
        "morningTime": "06:38 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "VGP Nagar",
        "road": "1st Avenue",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Mugapper West 6th Block",
        "road": "1st Avenue",
        "morningTime": "06:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Mugapper West Water Tank",
        "road": "1st Avenue",
        "morningTime": "06:44 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Ambatur Dunlop",
        "road": "C.T.H. Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Ambedkar silai",
        "road": "Ayappakkam Road",
        "morningTime": "06:53 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Avadi",
        "road": "C.T.H. Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:37 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v25a",
    "busNumber": "V25A",
    "name": "Route V25A: Thandaiyarpet Toll Gate",
    "area": "Thandaiyarpet Toll Gate",
    "corridor": "Tollgate Bus Terminus -> Toll Gate -> Vyasarpadi -> Kolathur -> Ambattur -> Vel Tech Campus",
    "departureTime": "06:10 AM",
    "arrivalTime": "07:45 AM",
    "stops": [
      "Tollgate Bus Terminus (06:10 AM • Thiruvottriyur High Road)",
      "Cross Road (06:12 AM • Thiruvottriyur High Road)",
      "Lakshmi Amman koil (06:14 AM • Thiruvottriyur High Road)",
      "Thandaiyarpet depot (06:16 AM • Thiruvottriyur High Road)",
      "Appollo (06:18 AM • Thiruvottriyur High Road)",
      "Old Wahermenpet (06:20 AM • Thiruvottriyur High Road)",
      "Manikoondu (06:22 AM • Thiruvottriyur High Road)",
      "Maharani Post office (06:24 AM • Thiruvottriyur High Road)",
      "Thyagaraja College (06:25 AM • Thiruvottriyur High Road)",
      "Mint (06:30 AM • Thiruvottriyur High Road)",
      "Ambedkar College (06:40 AM • Thiruvottriyur High Road)",
      "Sharma nagar (06:42 AM • Thiruvottriyur High Road)",
      "Moolakadai (06:45 AM • G.N.T. Road)",
      "Madhavarm Ring Road (06:48 AM • G.N.T. Road)",
      "Retteri Signal (06:50 AM • 100ft. Road)",
      "Vinayakapuram (06:52 AM • Redhills Road)",
      "Kadiravedu (06:55 AM • Redhills Road)",
      "Surapet (06:57 AM • Redhills Road)",
      "Kallikuppam (06:58 AM • Redhills Road)",
      "Pudhur (07:00 AM • Ambattur - Redhills Road)",
      "Rakki cinimas (07:10 AM • C.T.H. Road)",
      "Avadi (07:20 AM • C.T.H. Road)",
      "Veltech Univ (07:40 AM • Veltech-Alamathi Road)",
      "Vel Tech Anna campus (07:45 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Tollgate Bus Terminus",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:10 AM",
        "eveningTime": "05:45 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Cross Road",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:12 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Lakshmi Amman koil",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:14 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Thandaiyarpet depot",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:16 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Appollo",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:18 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Old Wahermenpet",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Manikoondu",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:22 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Maharani Post office",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:24 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Thyagaraja College",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:25 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Mint",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Ambedkar College",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Sharma nagar",
        "road": "Thiruvottriyur High Road",
        "morningTime": "06:42 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Moolakadai",
        "road": "G.N.T. Road",
        "morningTime": "06:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Madhavarm Ring Road",
        "road": "G.N.T. Road",
        "morningTime": "06:48 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Retteri Signal",
        "road": "100ft. Road",
        "morningTime": "06:50 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Vinayakapuram",
        "road": "Redhills Road",
        "morningTime": "06:52 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Kadiravedu",
        "road": "Redhills Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 18,
        "pickupPoint": "Surapet",
        "road": "Redhills Road",
        "morningTime": "06:57 AM",
        "eveningTime": ""
      },
      {
        "sNo": 19,
        "pickupPoint": "Kallikuppam",
        "road": "Redhills Road",
        "morningTime": "06:58 AM",
        "eveningTime": ""
      },
      {
        "sNo": 20,
        "pickupPoint": "Pudhur",
        "road": "Ambattur - Redhills Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 21,
        "pickupPoint": "Rakki cinimas",
        "road": "C.T.H. Road",
        "morningTime": "07:10 AM",
        "eveningTime": ""
      },
      {
        "sNo": 22,
        "pickupPoint": "Avadi",
        "road": "C.T.H. Road",
        "morningTime": "07:20 AM",
        "eveningTime": ""
      },
      {
        "sNo": 23,
        "pickupPoint": "Veltech Univ",
        "road": "Veltech-Alamathi Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 24,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-v26",
    "busNumber": "V26",
    "name": "Route V26: Urapakkam / Tambaram ByPass",
    "area": "Urapakkam / Tambaram ByPass",
    "corridor": "Urapakkam -> Tambaram -> 400 Ft Bypass -> Poonamallee -> Pattabiram -> Vel Tech Campus",
    "departureTime": "06:00 AM",
    "arrivalTime": "07:50 AM",
    "stops": [
      "Urapakkam (06:00 AM • G.S.T Road)",
      "Vandalore (06:05 AM • G.S.T Road)",
      "Perungalathur (06:15 AM • G.S.T Road)",
      "Tambaram (06:30 AM • Walajabad-Oragadam Road)",
      "Mudichur ByPass road (06:40 AM • 400 Ft ByPass Road)",
      "Madanapuram (06:43 AM • 400 Ft ByPass Road)",
      "Thirumudivakkam (06:48 AM • 400 Ft ByPass Road)",
      "Kunrathur (06:55 AM • 400 Ft ByPass Road)",
      "Meppur (07:00 AM • 400 Ft ByPass Road)",
      "Poonamallee Outer Ring Road (07:05 AM • 400 Ft ByPass Road)",
      "Thirumazhisai (07:15 AM • Poonamallee -Tiruvallur High Road)",
      "Pattabiram (07:30 AM • CTH Road)",
      "Nemilichery (07:35 AM • CTH Road)",
      "Avadi (07:40 AM • CTH Road)",
      "Morai (07:43 AM • R1)",
      "Veltech B1 Gate (07:45 AM • Veltech - Alamathi Road)",
      "Vel Tech Anna campus (07:50 AM • Veltech - Alamathi Road)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Urapakkam",
        "road": "G.S.T Road",
        "morningTime": "06:00 AM",
        "eveningTime": "05:15 AM"
      },
      {
        "sNo": 2,
        "pickupPoint": "Vandalore",
        "road": "G.S.T Road",
        "morningTime": "06:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 3,
        "pickupPoint": "Perungalathur",
        "road": "G.S.T Road",
        "morningTime": "06:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 4,
        "pickupPoint": "Tambaram",
        "road": "Walajabad-Oragadam Road",
        "morningTime": "06:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 5,
        "pickupPoint": "Mudichur ByPass road",
        "road": "400 Ft ByPass Road",
        "morningTime": "06:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 6,
        "pickupPoint": "Madanapuram",
        "road": "400 Ft ByPass Road",
        "morningTime": "06:43 AM",
        "eveningTime": ""
      },
      {
        "sNo": 7,
        "pickupPoint": "Thirumudivakkam",
        "road": "400 Ft ByPass Road",
        "morningTime": "06:48 AM",
        "eveningTime": ""
      },
      {
        "sNo": 8,
        "pickupPoint": "Kunrathur",
        "road": "400 Ft ByPass Road",
        "morningTime": "06:55 AM",
        "eveningTime": ""
      },
      {
        "sNo": 9,
        "pickupPoint": "Meppur",
        "road": "400 Ft ByPass Road",
        "morningTime": "07:00 AM",
        "eveningTime": ""
      },
      {
        "sNo": 10,
        "pickupPoint": "Poonamallee Outer Ring Road",
        "road": "400 Ft ByPass Road",
        "morningTime": "07:05 AM",
        "eveningTime": ""
      },
      {
        "sNo": 11,
        "pickupPoint": "Thirumazhisai",
        "road": "Poonamallee -Tiruvallur High Road",
        "morningTime": "07:15 AM",
        "eveningTime": ""
      },
      {
        "sNo": 12,
        "pickupPoint": "Pattabiram",
        "road": "CTH Road",
        "morningTime": "07:30 AM",
        "eveningTime": ""
      },
      {
        "sNo": 13,
        "pickupPoint": "Nemilichery",
        "road": "CTH Road",
        "morningTime": "07:35 AM",
        "eveningTime": ""
      },
      {
        "sNo": 14,
        "pickupPoint": "Avadi",
        "road": "CTH Road",
        "morningTime": "07:40 AM",
        "eveningTime": ""
      },
      {
        "sNo": 15,
        "pickupPoint": "Morai",
        "road": "R1",
        "morningTime": "07:43 AM",
        "eveningTime": ""
      },
      {
        "sNo": 16,
        "pickupPoint": "Veltech B1 Gate",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:45 AM",
        "eveningTime": ""
      },
      {
        "sNo": 17,
        "pickupPoint": "Vel Tech Anna campus",
        "road": "Veltech - Alamathi Road",
        "morningTime": "07:50 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  },
  {
    "id": "route-custom",
    "busNumber": "SPECIAL",
    "name": "Route Special: Other Vel Tech En-Route Stop",
    "area": "Other Vel Tech Corridor Stop",
    "corridor": "Any other approved stop along Vel Tech bus corridors",
    "departureTime": "06:00 AM Onwards",
    "arrivalTime": "07:50 AM",
    "stops": [
      "Custom Boarding Stop (Specify in Landmark field)"
    ],
    "stopsList": [
      {
        "sNo": 1,
        "pickupPoint": "Custom Boarding Stop",
        "road": "Transit Corridor",
        "morningTime": "06:00 AM",
        "eveningTime": "03:45 PM"
      }
    ]
  }
];

export function getRouteById(routeIdOrName: string): VelTechRoute | undefined {
  if (!routeIdOrName) return undefined;
  const normalized = routeIdOrName.toLowerCase().trim();
  return VELTECH_BUS_ROUTES.find(
    (r) =>
      r.id.toLowerCase() === normalized ||
      r.busNumber.toLowerCase() === normalized ||
      r.name.toLowerCase().includes(normalized)
  );
}

export function getPickupStopsForRoute(routeIdOrName: string): string[] {
  const route = getRouteById(routeIdOrName);
  return route ? route.stops : [];
}

export function findStopDetails(routeIdOrName: string, stopQuery: string): VelTechStopDetail | undefined {
  const route = getRouteById(routeIdOrName);
  if (!route) return undefined;
  const q = stopQuery.toLowerCase();
  return route.stopsList.find(
    (s) =>
      s.pickupPoint.toLowerCase().includes(q) ||
      (s.road && s.road.toLowerCase().includes(q))
  );
}

