import { NextResponse } from 'next/server';
// Importe ta connexion MySQL ici (ex: import pool from '@/lib/db');

export async function GET() {
  try {
    /* 
      Exemple de requête MySQL si tu as une table 'agents' :
      const [rows] = await pool.query('SELECT * FROM agents');
      return NextResponse.json(rows);
    */

    // Données de test temporaires tant que la table MySQL n'est pas créée :
    const mockAgentsFromDb = [
      {
        id: 1,
        name: 'Alexander Vance',
        role: 'Senior Luxury Property Advisor',
        specialty: 'Palm Jumeirah & Downtown Dubai',
        languages: 'English, French',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
        sales: 'AED 450M+ Sold',
      }
    ];

    return NextResponse.json(mockAgentsFromDb);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}