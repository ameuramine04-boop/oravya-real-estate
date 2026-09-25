import { NextResponse } from 'next/server';
// Importe ta connexion MySQL ici (ex: import pool from '@/lib/db');

export async function GET() {
  try {
    /* 
      Exemple de requête MySQL pour récupérer le service Master Agency depuis ta base de données :
      const [rows] = await pool.query('SELECT * FROM services WHERE slug = ?', ['master-agency']);
      if (rows.length === 0) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      return NextResponse.json(rows[0]);
    */

    // Objet retourné par ta base de données MySQL (simulation si la table est vide pour l'instant)
    const dbServiceRecord = {
      id: 1,
      slug: 'master-agency',
      title: 'Real Estate Master Agency',
      subtitle: 'Acting as a premier master agency to streamline, orchestrate, and manage high-end property transactions from concept to completion.',
      description: 'At Oravya, we act as your trusted Real Estate Master Agency, partnering directly with developers to streamline and manage the entire property transaction lifecycle. We serve as the central operational hub between developers, sub-agents, and ultra-high-net-worth buyers, ensuring absolute consistency in communication, positioning, pricing, and execution.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1400&auto=format&fit=crop'
      ]),
      benefits: JSON.stringify([
        'Project Launch Strategy & Positioning',
        'Sales Management & Sub-Agency Network',
        'Centralized CRM & Real-Time Reporting',
        'Branding & Marketing Campaign Oversight',
        'VIP Investor Relations & Early Sales',
        'DLD Compliance & Post-Sales Support'
      ])
    };

    return NextResponse.json(dbServiceRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}