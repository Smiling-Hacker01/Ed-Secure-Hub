import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/utils/security';

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userLat = parseFloat(searchParams.get('lat') || '');
    const userLng = parseFloat(searchParams.get('lng') || '');
    const hasCoordinates = !isNaN(userLat) && !isNaN(userLng);

    const stations = await db.getCyberStations();

    const formattedStations = stations.map((s) => {
      const distanceKm = hasCoordinates
        ? calculateDistanceKm(userLat, userLng, s.latitude, s.longitude)
        : null;
      return {
        ...s,
        distanceKm,
      };
    });

    if (hasCoordinates) {
      formattedStations.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    return successResponse({
      stations: formattedStations,
      nearest: hasCoordinates && formattedStations.length > 0 ? formattedStations[0] : null,
      emergencyHotline: '1930',
      emergencyAdvisory:
        'National Cyber Crime Reporting Portal 24x7 Emergency Helpline is 1930. For active financial fraud, report within 2 hours to initiate immediate interbank beneficiary freeze.',
    });
  } catch (error) {
    console.error('Cyber stations error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to retrieve cyber cell station coordinates.', 500);
  }
}
