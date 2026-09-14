const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const CTAS = [
  { label: 'Buy Property', href: '/properties', description: 'Browse ready & investment homes', icon: 'Building2', sortOrder: 1 },
  { label: 'Rent Holiday Homes', href: '/holiday-homes', description: 'Premium short stays in Dubai', icon: 'Home', sortOrder: 2 },
  { label: 'Sell / List', href: '/contact?service=Resale%20Properties', description: 'List your property with Oravya', icon: 'Tag', sortOrder: 3 },
  { label: 'VIP Advisory', href: '/contact?service=Investment%20Consultancy', description: 'Private investor guidance', icon: 'Crown', sortOrder: 4 },
  { label: 'Exclusive Off-Plan', href: '/properties?status=Off-Plan', description: 'Early access to new launches', icon: 'Sparkles', sortOrder: 5 },
];

const CATEGORIES = [
  { name: 'Apartment', description: 'Appartement moderne standard en copropriété ou tour résidentielle.', icon: 'Building2', sortOrder: 1 },
  { name: 'Penthouse', description: "Logement d'exception occupant le ou les derniers étages d'un gratte-ciel avec vue panoramique.", icon: 'Crown', sortOrder: 2 },
  { name: 'Villa', description: 'Résidence privée de prestige avec jardin et piscine, souvent située dans des communautés exclusives.', icon: 'Home', sortOrder: 3 },
  { name: 'Townhouse', description: 'Maison mitoyenne luxueuse sur plusieurs niveaux, très prisée dans les quartiers résidentiels familiaux.', icon: 'Building', sortOrder: 4 },
  { name: 'Duplex', description: 'Appartement spacieux réparti sur deux étages reliés par un escalier intérieur.', icon: 'Layers', sortOrder: 5 },
  { name: 'Triplex', description: "Appartement d'envergure réparti sur trois niveaux.", icon: 'Layers2', sortOrder: 6 },
  { name: 'Mansion', description: 'Propriété immense et ultra-luxueuse (style manoir moderne).', icon: 'Castle', sortOrder: 7 },
  { name: 'Serviced Apartment', description: 'Appartement géré par une grande marque hôtelière (ex: Address, Armani) avec services de conciergerie intégrés.', icon: 'ConciergeBell', sortOrder: 8 },
  { name: 'Full Floor', description: "Un étage entier d'une tour réservé à un seul propriétaire (investissement très haut de gamme).", icon: 'Maximize', sortOrder: 9 },
  { name: 'Waterfront Estate', description: 'Propriété d\'exception "les pieds dans l\'eau" (plage privée ou accès direct au lagon/mer).', icon: 'Waves', sortOrder: 10 },
  { name: 'Land / Plot', description: 'Terrain viabilisé pour construire une villa sur mesure.', icon: 'Map', sortOrder: 11 },
  { name: 'Holiday Home', description: 'Bien meublé et équipé spécifiquement dédié à la location saisonnière à la nuitée.', icon: 'Palmtree', sortOrder: 12 },
];

const SAMPLE_REVIEWS = [
  {
    authorName: 'Alexander V.',
    location: 'London, UK',
    investment: 'Downtown Dubai Investor',
    quote: 'Omayma and the Oravya team made acquiring our penthouse in Downtown Dubai completely seamless. Their market insight and legal guidance gave us total confidence from abroad.',
    rating: 5,
    status: 'Approved',
  },
  {
    authorName: 'Marc & Sophie D.',
    location: 'Paris, France',
    investment: 'Palm Jumeirah Villa Owners',
    quote: 'Professionalism at its finest. No high-pressure tactics, just pure facts and exceptional off-market access. Our rental yields have exceeded projections.',
    rating: 5,
    status: 'Approved',
  },
  {
    authorName: 'Tariq M.',
    location: 'Riyadh, Saudi Arabia',
    investment: 'Multi-Unit Off-Plan Investor',
    quote: 'As a first-time investor in Dubai, I needed a partner I could trust. Oravya handled everything from bank account setup to golden visa processing.',
    rating: 5,
    status: 'Approved',
  },
];

async function main() {
  if ((await p.homeCta.count()) === 0) {
    await p.homeCta.createMany({ data: CTAS });
    console.log('Seeded Home CTAs');
  }
  if ((await p.propertyCategory.count()) === 0) {
    await p.propertyCategory.createMany({ data: CATEGORIES });
    console.log('Seeded Property Categories');
  }
  if ((await p.review.count()) === 0) {
    await p.review.createMany({ data: SAMPLE_REVIEWS });
    console.log('Seeded Reviews');
  }
  console.log('Done');
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
