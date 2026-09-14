const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const DEFAULT_SERVICES = [
  {
    title: 'Off Plan Properties',
    tagline: 'Premium projects — Smart investments',
    description:
      'Access exclusive off-plan developments with strong capital growth potential, flexible payment plans, and early-bird pricing before public launch.',
    icon: 'Building2',
    sortOrder: 1,
  },
  {
    title: 'Resale Properties',
    tagline: 'Great locations — Great value',
    description:
      'Curated ready and secondary-market homes in Dubai\'s most demanded communities, priced for lifestyle and long-term appreciation.',
    icon: 'RefreshCcw',
    sortOrder: 2,
  },
  {
    title: 'Luxury Properties',
    tagline: 'Exclusive living — Extraordinary lifestyles',
    description:
      'Ultra-premium residences, penthouses and waterfront villas selected for privacy, design excellence and lasting prestige.',
    icon: 'Crown',
    sortOrder: 3,
  },
  {
    title: 'Rental Properties',
    tagline: 'Quality homes — Long-term comfort',
    description:
      'Quality rental homes and managed stays tailored for comfort, convenience and reliable long-term living in Dubai.',
    icon: 'KeyRound',
    sortOrder: 4,
  },
  {
    title: 'Investment Consultancy',
    tagline: 'Data-driven advice — Better returns',
    description:
      'Market analysis, yield projections and portfolio strategy so every acquisition is backed by clear numbers and local expertise.',
    icon: 'LineChart',
    sortOrder: 5,
  },
];

async function main() {
  const count = await p.service.count();
  if (count === 0) {
    await p.service.createMany({ data: DEFAULT_SERVICES });
    console.log('Seeded 5 services');
  } else {
    console.log('Services already present:', count);
  }
  const rows = await p.service.findMany({ orderBy: { sortOrder: 'asc' } });
  console.log(rows.map((r) => `${r.sortOrder}. ${r.title} — ${r.tagline}`).join('\n'));
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
