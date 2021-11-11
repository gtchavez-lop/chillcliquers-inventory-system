import { createClient } from "@supabase/supabase-js";
import { writable } from "svelte/store";

const supabase_url = "https://fzlclhxdijmleazmkwwy.supabase.co";
const supabase_key = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabase_url, supabase_key);
export const activeTab = writable(1);
export const masterKey = writable("admin1234");
export const inventory_activeTab = writable(1);
export const inventory_selectedItemToEdit = writable("");
export const inventory_itemCategory = [
  {
    key: "sc",
    category: "Service Cleaning",
    types: {
      general: [
        "Service Report",
        "Pressure Washer",
        "Chamoise Cloth",
        "Tarpaulin",
        "Wipe-out",
        "Soap",
        "Clip",
        "Thermo Gun",
        "Clamp Tester",
        "Assorted Hand Tools",
        "Others"
      ],
    },
  },
  {
    key: "in",
    category: "Installation",
    types: {
      general: ["Service Report"],
      powerTools: [
        "Power Drill",
        "Grinder with Cutting Wheel",
        "Welding Machine",
        "Vacuum Pump",
        "Nitrogen Tank",
        "Torch and Mapp-Gas",
        "Flaring Tools",
        "Service Ladder",
        "Silver Rod",
        "Refrigerant Tank",
        "Metal Saw",
        "Cut-off Machine",
        "Others"
      ],
      equipment: {
        copperPiping: [
          "Suction Pipe",
          "Liquid Pipe",
          "Rubber Insulation (Suction Line)",
          "Rubber Insulation (Liquid Line)",
        ],
        brackets: [
          "Welded Type",
          "Slotted Type",
          "Slotted Bolt",
          "Expansion Bolt",
          "Bolt Footings",
          "Tox? and Screw",
          "Scaffolding",
          "Joint Pin",
        ],
        handTools: [
          "Gauge Manefoold Set with Hose and Inverter AC Adaptor",
          "Multi Tester",
          "Clamp Ammeter Tester",
          "Adjustable Wrench - 2 pairs",
          "Allen Key",
          "Phillip Screwdriver",
          "Flat Screwdriver",
          "Fliers",
          "Side Cutter",
          "Tube Cutter",
          "Label Bar",
          "Thermo Gunner",
          "Open Wrench",
          "Claw Hammer",
          "Ball Hammer",
          "L-Square",
          "Meter Tape",
        ],
        others: [
          "Boral?",
          "PVC Pipe - Elbow",
          "PVC Pipe - Standard",
          "PVC Pipe - Clamp",
          "Polyethelene Tape",
          "PVC Cement",
          "Electrical Tape",
        ],
      },
    },
  },
  {
    key: "re",
    category: "Repair",
    types: {
      general: [
        "Service Report",
        "Gauge Manefold",
        "System Cleaner",
        "Vacuum Pump",
        "Torch and Mapp Gas",
        "Silver Rod",
        "1/4 2ft Copper Tube",
        "3/8 2ft Copper Tube",
        "Access Valve",
        "Tube Cutter",
        "Nitrogen Tank",
        "Refrigirant Tank",
        "Others"
      ],
      assortedHandTools: [
        "Phillip Screwdriver",
        "Flat Screwdriver",
        "Fliers",
        "Side Cutter",
        "Electrical Tape",
        "Clamp Tester",
        "Multi-tester",
        "Adjustable Wrench",
        "Allen Key",
        "Inverter AC Adapter",
        "Thermo Gun",
      ]
    },
  },
];
