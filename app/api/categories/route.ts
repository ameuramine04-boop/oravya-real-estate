import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_CATEGORIES = [
  { name: 'Apartment', description: 'Appartement moderne standard en copropriété ou tour résidentielle.', icon: 'Building2', sortOrder: 1 },
  { name: 'Penthouse', description: "Logement d'exception occupant le ou les derniers étages d'un gratte-ciel avec vue panoramique.", icon: 'Crown', sortOrder: 2 },
  { name: 'Villa', description: 'Résidence privée de prestige avec jardin et piscine, souvent située dans des communautés exclusives.', icon: 'Home', sortOrder: 3 },
  { name: 'Townhouse', description: 'Maison mitoyenne luxueuse sur plusieurs niveaux, très prisée dans les quartiers résidentiels familiaux.', icon: 'Building', sortOrder: 4 },
  { name: 'Duplex', description: 'Appartement spacieux réparti sur deux étages reliés par un escalier intérieur.', icon: 'Layers', sortOrder: 5 },
  { name: 'Triplex', description: "Appartement d'envergure réparti sur trois niveaux.", icon: 'Layers2', sortOrder: 6 },
  { name: 'Mansion', description: 'Propriété immense et ultra-luxueuse (style manoir moderne).', icon: 'Castle', sortOrder: 7 },
  { name: 'Serviced Apartment', description: 'Appartement géré par une grande marque hôtelière (ex: Address, Armani) avec services de conciergerie intégrés.', icon: 'ConciergeBell', sortOrder: 8 },
  { name: 'Full Floor', description: "Un étage entier d'une tour réservé à un seul propriétaire (investissement très haut de gamme).", icon: 'Maximize', sortOrder: 9 },
  { name: 'Waterfront Estate', description: 'Propriété d\'exception les pieds dans l\'eau (plage privée ou accès direct au lagon/mer).', icon: 'Waves', sortOrder: 10 },
  { name: 'Land / Plot', description: 'Terrain viabilisé pour construire une villa sur mesure.', icon: 'Map', sortOrder: 11 },
  { name: 'Holiday Home', description: 'Bien meublé et équipé spécifiquement dédié à la location saisonnière à la nuitée.', icon: 'Palmtree', sortOrder: 12 },
];

async function ensureCategories() {
  const count = await prisma.propertyCategory.count();
  if (count === 0) {
    await prisma.propertyCategory.createMany({ data: DEFAULT_CATEGORIES });
  }
}

export async function GET(request: Request) {
  try {
    await ensureCategories();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === '1';

    // Si on demande toutes les catégories (y compris inactives), on sécurise pour l'admin
    if (all) {
      const authHeader = request.headers.get('x-user-role');
      if (!authHeader || authHeader !== 'ADMIN') {
        return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 403 });
      }
    }

    const categories = await prisma.propertyCategory.findMany({
      where: all ? undefined : { active: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Erreur GET categories:', error);
    return NextResponse.json({ error: 'Erreur récupération catégories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Vérification de sécurité : Seul un administrateur peut créer une catégorie
    const authHeader = request.headers.get('x-user-role');
    if (!authHeader || authHeader !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' }, 
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, icon, sortOrder, active } = body;
    
    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description required' }, { status: 400 });
    }

    const item = await prisma.propertyCategory.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        icon: icon || 'Building2',
        sortOrder: parseInt(sortOrder) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Erreur POST category:', error);
    return NextResponse.json({ error: 'Erreur création catégorie' }, { status: 500 });
  }
}