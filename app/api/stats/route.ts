import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    // 1. Calculs Financiers
    const payments = await prisma.payment.findMany();
    let totalRevenue = 0;
    let totalCollected = 0;

    payments.forEach(p => {
      totalRevenue += Number(p.totalAmount || 0);
      totalCollected += Number(p.paidAmount || 0);
    });

    const totalPending = totalRevenue - totalCollected;

    // 2. Opérations & Leads
    const bookings = await prisma.reservation.count({ where: { status: { not: 'Cancelled' } } });
    const sellRequestsCount = await prisma.sellRequest.count();
    const usersLeadCount = await prisma.user.count({ where: { role: 'Lead' } });
    const totalLeads = sellRequestsCount + usersLeadCount;
    const services = await prisma.service.count();

    // Portfolio Propriétés
    let propertiesCount = 0;
    try { propertiesCount += await prisma.holidayHome.count(); } catch(e) {}
    try { propertiesCount += await prisma.luxuryProperty.count(); } catch(e) {}
    try { propertiesCount += await prisma.newProject.count(); } catch(e) {}

    // --------------------------------------------------------
    // NOUVEAUTÉS : ACTIVITÉ RÉCENTE ET AGENDA
    // --------------------------------------------------------
    
    // Les 5 dernières demandes de vente
    const recentLeads = await prisma.sellRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    // Les prochains événements de l'agenda (à partir d'aujourd'hui)
    const upcomingEvents = await prisma.agendaEvent.findMany({
      where: { date: { gte: new Date() } },
      take: 4,
      orderBy: { date: 'asc' }
    });

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalCollected,
        totalPending,
        properties: propertiesCount,
        bookings,
        leads: totalLeads,
        services
      },
      recentLeads,
      upcomingEvents
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}