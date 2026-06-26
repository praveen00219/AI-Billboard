import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds realistic billboard-violation reports for two demo citizens so the
 * citizen dashboard, authority dashboard, citizen list and the violation
 * heatmap all have lifelike data.
 *
 * Idempotent: each citizen is upserted (password = Asdf@123) and their
 * existing reports are wiped (cascade removes media + AI analysis) before the
 * sample set is recreated.
 *
 * Field choices match how the UI consumes data:
 *  - status:   pending | approved | rejected | under-review
 *  - category: AI category names (also satisfy the heatmap keyword filters)
 *  - lat/lng:  real Bengaluru coordinates so markers spread across the map
 */

// Real photos already present in /uploads (served at /uploads/<file>)
const IMG = [
  "uploads/1755860414026-bill1.jpg",
  "uploads/1755860241619-bill.webp",
  "uploads/1755888131224-bill.webp",
  "uploads/1755975760061-bill1.jpg",
  "uploads/1755976002745-bill.webp",
  "uploads/1755861316642-bill1.jpg",
  "uploads/1755976154899-2.png",
  "uploads/1755860775939-bill1.jpg",
];

// ── Reports for the primary citizen (citizen@gmail.com) ───────────────────────
const primaryReports = [
  {
    title: "Oversized hoarding obstructing junction view",
    category: "Size & Placement",
    location: "100 Ft Road, Indiranagar, Bengaluru",
    description:
      "A large unauthorized hoarding has been erected right at the Indiranagar junction, exceeding the permitted dimensions and blocking the line of sight for motorists turning onto 100 Ft Road.",
    date: "2026-06-21",
    latitude: 12.971891,
    longitude: 77.641151,
    status: "pending",
    ai: {
      extractedText: "MEGA SUMMER SALE · UP TO 70% OFF · SHOP NOW",
      riskPercentage: 78,
      riskLevel: "High",
      riskDescription:
        "Structure exceeds permitted size and obstructs sightlines at a busy junction, posing a traffic-safety risk.",
    },
  },
  {
    title: "Illegal billboard on pedestrian footpath",
    category: "Size & Placement",
    location: "5th Block, Koramangala, Bengaluru",
    description:
      "Advertising board installed directly on the footpath, forcing pedestrians onto the carriageway. No visible permit number displayed.",
    date: "2026-06-18",
    latitude: 12.935242,
    longitude: 77.624481,
    status: "pending",
    ai: {
      extractedText: "GRAND OPENING · CAFE AURORA · KORAMANGALA",
      riskPercentage: 55,
      riskLevel: "Medium",
      riskDescription:
        "Encroaches on pedestrian footpath; moderate obstruction with no displayed permit.",
    },
  },
  {
    title: "Torn flex banner with exposed metal frame",
    category: "Structural Hazard",
    location: "Brigade Road near MG Road, Bengaluru",
    description:
      "The flex sheet has torn away leaving sharp exposed metal supports overhanging the pavement. Sections flap loose in the wind.",
    date: "2026-06-10",
    latitude: 12.9756,
    longitude: 77.606812,
    status: "approved",
    ai: {
      extractedText: "BRIGADE ROAD · FASHION WEEK 2026",
      riskPercentage: 82,
      riskLevel: "High",
      riskDescription:
        "Exposed sharp metal frame and loose sheeting present an immediate injury hazard to pedestrians below.",
    },
  },
  {
    title: "Political hoarding without municipal permit",
    category: "Content Violation",
    location: "4th Block, Jayanagar, Bengaluru",
    description:
      "Large political advertisement installed overnight with no permit reference and no licensing authority details printed, as required by the bye-laws.",
    date: "2026-05-29",
    latitude: 12.925034,
    longitude: 77.593782,
    status: "rejected",
    ai: {
      extractedText: "VOTE FOR PROGRESS · WARD 152",
      riskPercentage: 47,
      riskLevel: "Medium",
      riskDescription:
        "Unpermitted political content; flagged for missing licensing details but no structural danger.",
    },
  },
  {
    title: "Billboard leaning dangerously over road",
    category: "Structural Hazard",
    location: "Whitefield Main Road, Bengaluru",
    description:
      "A tall billboard has tilted significantly toward the road after recent rains. The base footing appears cracked and undermined.",
    date: "2026-06-23",
    latitude: 12.969806,
    longitude: 77.74998,
    status: "under-review",
    ai: {
      extractedText: "TECH PARK SPACES · LEASING NOW",
      riskPercentage: 88,
      riskLevel: "High",
      riskDescription:
        "Significant structural tilt with compromised footing — high risk of collapse onto the carriageway.",
    },
  },
  {
    title: "Unauthorized advertisement on flyover pillar",
    category: "Size & Placement",
    location: "Hebbal Flyover, Bengaluru",
    description:
      "Adhesive vinyl advertising wrapped around a flyover support pillar, which is public infrastructure and not a sanctioned advertising surface.",
    date: "2026-06-05",
    latitude: 13.0358,
    longitude: 77.597,
    status: "pending",
    ai: {
      extractedText: "FAST LOANS · APPROVED IN 10 MINUTES",
      riskPercentage: 52,
      riskLevel: "Medium",
      riskDescription:
        "Placed on public infrastructure without authorization; moderate compliance violation.",
    },
  },
  {
    title: "Obscene content on roadside hoarding",
    category: "Content Violation",
    location: "BTM Layout 2nd Stage, Bengaluru",
    description:
      "Resident complaint regarding inappropriate imagery on a hoarding visible from a school route. Requesting urgent content review.",
    date: "2026-05-22",
    latitude: 12.9166,
    longitude: 77.6101,
    status: "approved",
    ai: {
      extractedText: "NIGHTLIFE · CLUB MIRAGE",
      riskPercentage: 73,
      riskLevel: "High",
      riskDescription:
        "Content flagged as inappropriate for a location on a school route; high priority for removal.",
    },
  },
  {
    title: "Hoarding blocking traffic signal visibility",
    category: "Safety Hazard",
    location: "Marathahalli Bridge, Bengaluru",
    description:
      "A newly installed board partially obscures the traffic signal head when approaching the bridge, creating a serious road-safety concern.",
    date: "2026-06-24",
    latitude: 12.956,
    longitude: 77.701,
    status: "pending",
    ai: {
      extractedText: "DRIVE HOME YOUR DREAM CAR · 0% EMI",
      riskPercentage: 80,
      riskLevel: "High",
      riskDescription:
        "Obstructs a traffic signal head — direct safety threat to vehicles approaching the junction.",
    },
  },
  {
    title: "Faded billboard with loose hanging wires",
    category: "Safety Hazard",
    location: "HSR Layout Sector 1, Bengaluru",
    description:
      "Old illuminated billboard with frayed electrical wiring hanging within reach of pedestrians. Lighting flickers intermittently.",
    date: "2026-06-12",
    latitude: 12.9116,
    longitude: 77.6389,
    status: "under-review",
    ai: {
      extractedText: "SHOP & SAVE · HSR CENTRAL",
      riskPercentage: 61,
      riskLevel: "Medium",
      riskDescription:
        "Exposed electrical wiring within pedestrian reach; moderate-to-high electrical safety risk.",
    },
  },
  {
    title: "Routine compliance check — permitted board",
    category: "Regulatory Compliance",
    location: "Electronic City Phase 1, Bengaluru",
    description:
      "Verification submission for a properly licensed billboard. Permit and dimensions appear within sanctioned limits.",
    date: "2026-05-30",
    latitude: 12.8452,
    longitude: 77.6602,
    status: "approved",
    ai: {
      extractedText: "ELECTRONIC CITY · IT CORRIDOR ADVERTISING",
      riskPercentage: 16,
      riskLevel: "Low",
      riskDescription:
        "Board is within sanctioned size and carries a valid permit; informational compliance record only.",
    },
  },
  {
    title: "Banner placed too close to highway curve",
    category: "Size & Placement",
    location: "Banashankari 2nd Stage, Bengaluru",
    description:
      "Advertising banner installed on the inside of a sharp curve, distracting drivers at a point that already has poor visibility.",
    date: "2026-06-08",
    latitude: 12.9255,
    longitude: 77.5468,
    status: "pending",
    ai: {
      extractedText: "WEEKEND GETAWAYS · BOOK NOW",
      riskPercentage: 58,
      riskLevel: "Medium",
      riskDescription:
        "Distracting placement on a low-visibility curve; moderate traffic-safety concern.",
    },
  },
  {
    title: "Rusted billboard structure near bus stop",
    category: "Structural Hazard",
    location: "Yeshwanthpur Circle, Bengaluru",
    description:
      "Heavily corroded steel billboard frame directly above a crowded bus stop. Rust flakes and a bent cross-member are visible.",
    date: "2026-06-02",
    latitude: 13.0287,
    longitude: 77.55,
    status: "rejected",
    ai: {
      extractedText: "YESHWANTHPUR · WHOLESALE MARKET",
      riskPercentage: 45,
      riskLevel: "Medium",
      riskDescription:
        "Visible corrosion above a crowded area; flagged but assessed as not an imminent failure on review.",
    },
  },
];

// ── Reports for a second citizen (aarav@gmail.com) ────────────────────────────
const secondaryReports = [
  {
    title: "Damaged digital billboard flickering at night",
    category: "Safety Hazard",
    location: "Outer Ring Road, Bellandur, Bengaluru",
    description:
      "A large digital LED billboard flickers erratically and throws intense glare onto the carriageway at night, distracting drivers on the Outer Ring Road.",
    date: "2026-06-19",
    latitude: 12.926,
    longitude: 77.6762,
    status: "pending",
    ai: {
      extractedText: "LED DISPLAY · BRAND PROMOS 24x7",
      riskPercentage: 76,
      riskLevel: "High",
      riskDescription:
        "Erratic high-intensity glare distracts drivers at night — significant road-safety hazard.",
    },
  },
  {
    title: "Hoarding installed without structural certificate",
    category: "Structural Hazard",
    location: "Rajajinagar 1st Block, Bengaluru",
    description:
      "Newly erected steel hoarding with no displayed structural stability certificate or engineer sign-off, as mandated for boards of this size.",
    date: "2026-06-07",
    latitude: 12.991,
    longitude: 77.555,
    status: "under-review",
    ai: {
      extractedText: "PROPERTY EXPO 2026 · BOOK YOUR FLAT",
      riskPercentage: 64,
      riskLevel: "Medium",
      riskDescription:
        "Missing mandatory structural certification for a large board; pending engineer verification.",
    },
  },
  {
    title: "Advertisement obstructing heritage facade",
    category: "Size & Placement",
    location: "Near Vidhana Soudha, Bengaluru",
    description:
      "Commercial banner mounted directly in front of a protected heritage facade, violating placement norms around designated heritage zones.",
    date: "2026-05-26",
    latitude: 12.9796,
    longitude: 77.5909,
    status: "rejected",
    ai: {
      extractedText: "CITY TOURS · HOP ON HOP OFF",
      riskPercentage: 42,
      riskLevel: "Medium",
      riskDescription:
        "Placement breaches heritage-zone norms; flagged but reassessed as low structural risk.",
    },
  },
  {
    title: "Routine night audit — compliant board",
    category: "Regulatory Compliance",
    location: "Malleshwaram 8th Cross, Bengaluru",
    description:
      "Verification of a permitted illuminated board during a routine night audit. Brightness and dimensions are within sanctioned limits.",
    date: "2026-06-01",
    latitude: 13.003,
    longitude: 77.571,
    status: "approved",
    ai: {
      extractedText: "MALLESHWARAM · FESTIVE SHOPPING",
      riskPercentage: 20,
      riskLevel: "Low",
      riskDescription:
        "Board carries a valid permit and meets brightness/size limits; informational record.",
    },
  },
];

const citizens = [
  { name: "Demo Citizen", email: "citizen@gmail.com", number: "9000000001", reports: primaryReports },
  { name: "Aarav Mehta", email: "aarav@gmail.com", number: "9000000003", reports: secondaryReports },
];

function buildReportData(citizenId, r, i) {
  return {
    citizenId,
    title: r.title,
    category: r.category,
    location: r.location,
    description: r.description,
    date: new Date(r.date),
    latitude: r.latitude,
    longitude: r.longitude,
    status: r.status,
    media: { create: [{ fileUrl: IMG[i % IMG.length], fileType: "image" }] },
    aiAnalysis: {
      create: {
        extractedText: r.ai.extractedText,
        riskPercentage: r.ai.riskPercentage,
        riskLevel: r.ai.riskLevel,
        riskDescription: r.ai.riskDescription,
        category: r.category,
      },
    },
  };
}

async function main() {
  const password = await bcrypt.hash("Asdf@123", 10);
  let totalReports = 0;
  const summary = [];

  for (const c of citizens) {
    const citizen = await prisma.userAuth.upsert({
      where: { email: c.email },
      update: { name: c.name, password, userType: "citizen" },
      create: { name: c.name, email: c.email, number: c.number, password, userType: "citizen" },
    });

    await prisma.report.deleteMany({ where: { citizenId: citizen.id } });

    for (let i = 0; i < c.reports.length; i++) {
      await prisma.report.create({ data: buildReportData(citizen.id, c.reports[i], i) });
      totalReports++;
    }

    summary.push(`   ${c.email.padEnd(20)} → ${c.reports.length} reports`);
  }

  console.log(`✅ Seeded ${totalReports} billboard reports across ${citizens.length} citizens:`);
  console.log(summary.join("\n"));
}

main()
  .catch((e) => {
    console.error("❌ Report seed failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
