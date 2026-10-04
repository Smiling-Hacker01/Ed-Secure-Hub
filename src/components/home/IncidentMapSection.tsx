'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  PhoneCall,
  Search,
  Building2,
  ExternalLink,
  Shield,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { CyberStation } from '@/lib/db/types';

interface StationWithDistance extends CyberStation {
  distanceKm?: number | null;
}

const REGIONS = [
  { label: 'All India', state: 'ALL' },
  { label: 'Delhi NCR', state: 'Delhi' },
  { label: 'Mumbai', state: 'Maharashtra' },
  { label: 'Bengaluru', state: 'Karnataka' },
  { label: 'Hyderabad', state: 'Telangana' },
  { label: 'Chennai', state: 'Tamil Nadu' },
  { label: 'Kolkata', state: 'West Bengal' },
  { label: 'Ahmedabad', state: 'Gujarat' },
  { label: 'Lucknow', state: 'Uttar Pradesh' },
];

export function IncidentMapSection() {
  const [stations, setStations] = useState<StationWithDistance[]>([]);
  const [selectedStation, setSelectedStation] = useState<StationWithDistance | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationActive, setLocationActive] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchStations();
  }, []);

  const fetchStations = async (lat?: number, lng?: number) => {
    try {
      const hasCoords = lat !== undefined && lng !== undefined;
      const url = hasCoords ? `/api/safety/stations?lat=${lat}&lng=${lng}` : '/api/safety/stations';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data.stations) {
        setStations(json.data.stations);
        if (json.data.nearest) {
          setSelectedStation(json.data.nearest);
        } else if (json.data.stations.length > 0) {
          setSelectedStation(json.data.stations[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching cyber stations:', e);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported. Please select your city from the list below.');
      return;
    }

    setLoadingLocation(true);
    setLocationStatus('Locating your device...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationActive(true);
        setLoadingLocation(false);
        setLocationStatus('Nearest cyber cell identified based on your GPS coordinates.');
        fetchStations(latitude, longitude);
      },
      () => {
        setLoadingLocation(false);
        setLocationActive(false);
        setLocationStatus('Location access was not provided. Showing all verified regional cyber cells.');
        fetchStations();
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  const handleResetLocation = () => {
    setLocationActive(false);
    setLocationStatus(null);
    setSelectedRegion('ALL');
    setSearchQuery('');
    fetchStations();
  };

  // Filter stations based on quick region pill or text search
  const filteredStations = useMemo(() => {
    return stations.filter((st) => {
      const matchesRegion = selectedRegion === 'ALL' || st.state === selectedRegion;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        st.station_name.toLowerCase().includes(query) ||
        st.state.toLowerCase().includes(query) ||
        st.address.toLowerCase().includes(query) ||
        st.jurisdiction.toLowerCase().includes(query);

      return matchesRegion && matchesSearch;
    });
  }, [stations, selectedRegion, searchQuery]);

  return (
    <section
      id="safety-radar"
      style={{
        padding: 'clamp(2.5rem, 5vw, 4.25rem) 0',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(7, 10, 18, 0.75)',
      }}
    >
      <div className="container">
        {/* Section Header with concise visual cues */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto clamp(1.5rem, 3vw, 2.25rem)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              color: 'var(--accent-cyan)',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '0.65rem',
            }}
          >
            <Radio style={{ width: '13px', height: '13px', color: '#06B6D4' }} />
            <span>National Cyber Crime Cells & Helplines</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)', marginBottom: '0.5rem', color: '#F8FAFC' }}>
            Find Your Nearest Cyber Police Station
          </h2>

          <p style={{ fontSize: 'clamp(0.875rem, 1.5vw, 0.975rem)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Direct access to verified state cyber investigation cells, desk helplines, and station commanders.
          </p>
        </div>

        {/* Quick Search & Geo Location Toolbar */}
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {/* Top Row: Search Input + GPS Button */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                flex: '1 1 280px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                style={{
                  position: 'absolute',
                  left: '14px',
                  width: '16px',
                  height: '16px',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                placeholder="Search city, state (e.g. Mumbai, Delhi, Bengaluru)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-medium)',
                  color: '#F8FAFC',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={locationActive ? handleResetLocation : handleDetectLocation}
              disabled={loadingLocation}
              className={`btn ${locationActive ? 'btn-secondary' : 'btn-primary'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                padding: '0.75rem 1.25rem',
                whiteSpace: 'nowrap',
              }}
            >
              <Navigation style={{ width: '15px', height: '15px' }} />
              <span>
                {loadingLocation ? 'Locating...' : locationActive ? 'Reset Location' : 'Find Near Me (GPS)'}
              </span>
            </button>
          </div>

          {/* Quick Region / Metro Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.35rem',
              scrollbarWidth: 'none',
            }}
          >
            {REGIONS.map((reg) => {
              const isActive = selectedRegion === reg.state && !searchQuery;
              return (
                <button
                  key={reg.label}
                  onClick={() => {
                    setSelectedRegion(reg.state);
                    setSearchQuery('');
                    // Auto-select the first matching station
                    const firstMatch = stations.find((s) => reg.state === 'ALL' || s.state === reg.state);
                    if (firstMatch) setSelectedStation(firstMatch);
                  }}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: 'var(--radius-full)',
                    border: isActive ? '1px solid var(--accent-cyan)' : '1px solid var(--border-medium)',
                    background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                    color: isActive ? '#38BDF8' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {reg.label}
                </button>
              );
            })}
          </div>

          {/* Status Message */}
          {locationStatus && (
            <div
              style={{
                fontSize: '0.78rem',
                color: locationActive ? '#34D399' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.5rem',
              }}
            >
              <CheckCircle2 style={{ width: '13px', height: '13px' }} />
              <span>{locationStatus}</span>
            </div>
          )}
        </div>

        {/* Main Content Layout: Interactive Station List + Focused Official Station Detail Card */}
        <div
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: '1.25rem',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: Selectable Precinct Cards List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxHeight: '520px',
              overflowY: 'auto',
              paddingRight: '0.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Verified Precincts ({filteredStations.length})
              </span>
              <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                ● 24/7 Active Desks
              </span>
            </div>

            {filteredStations.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
              >
                No cyber stations matched your search. Try searching for &quot;Delhi&quot;, &quot;Mumbai&quot;, or click &quot;All India&quot;.
              </div>
            ) : (
              filteredStations.map((st) => {
                const isSelected = selectedStation?.id === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStation(st)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-medium)',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : 'rgba(15, 23, 42, 0.65)',
                      boxShadow: isSelected ? '0 0 16px rgba(6, 182, 212, 0.2)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(6, 182, 212, 0.15)',
                            color: '#38BDF8',
                          }}
                        >
                          {st.state}
                        </span>
                        {st.distanceKm !== undefined && st.distanceKm !== null && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#34D399',
                            }}
                          >
                            ~{st.distanceKm} km
                          </span>
                        )}
                      </div>

                      <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 600 }}>
                        24/7 Desk
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', color: isSelected ? '#F8FAFC' : '#CBD5E1', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                      {st.station_name}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <MapPin style={{ width: '12px', height: '12px', flexShrink: 0, color: 'var(--accent-cyan)' }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {st.address}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: '0.75rem', color: '#FCA5A5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <PhoneCall style={{ width: '11px', height: '11px' }} />
                        {st.helpline.split('/')[0].trim()}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-dim)', fontWeight: 600 }}>
                        {isSelected ? 'Selected' : 'View details →'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Official Station Card */}
          {selectedStation ? (
            <div
              className="glass-panel"
              style={{
                padding: 'clamp(1.25rem, 3vw, 2rem)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(7, 10, 18, 0.98) 100%)',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)',
              }}
            >
              <div>
                {/* Header with verified badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(6, 182, 212, 0.15)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-cyan)',
                      }}
                    >
                      <Building2 style={{ width: '16px', height: '16px' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                        {selectedStation.state} State Cyber Jurisdiction
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        Official Law Enforcement Intake
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    ● 24/7 ACTIVE CELL
                  </span>
                </div>

                <h3 style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.45rem)', color: '#F8FAFC', marginBottom: '0.75rem', lineHeight: 1.25 }}>
                  {selectedStation.station_name}
                </h3>

                {/* Distance Badge if available */}
                {selectedStation.distanceKm !== undefined && selectedStation.distanceKm !== null && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(6, 182, 212, 0.12)',
                      border: '1px solid rgba(6, 182, 212, 0.25)',
                      color: '#38BDF8',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      marginBottom: '1rem',
                    }}
                  >
                    <Navigation style={{ width: '13px', height: '13px' }} />
                    <span>Approx. {selectedStation.distanceKm} km from your current location</span>
                  </div>
                )}

                {/* Visual Specification Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
                      Helpline Numbers
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#FECACA', fontWeight: 600 }}>
                      {selectedStation.helpline}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>
                      Officer in Charge
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#F8FAFC', fontWeight: 600 }}>
                      {selectedStation.officer_in_charge || 'Nodal Cyber Officer'}
                    </div>
                  </div>
                </div>

                {/* Physical Address & Jurisdiction */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.15rem' }}>
                      Physical Address
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {selectedStation.address}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.15rem' }}>
                      Jurisdiction Coverage
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {selectedStation.jurisdiction}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <a
                  href={`tel:${selectedStation.helpline.split('/')[0].trim()}`}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.8rem',
                    fontSize: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <PhoneCall style={{ width: '16px', height: '16px' }} />
                  <span>Call Station Desk ({selectedStation.helpline.split('/')[0].trim()})</span>
                </a>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <a
                    href="tel:1930"
                    className="btn btn-danger btn-sm"
                    style={{
                      justifyContent: 'center',
                      gap: '0.4rem',
                      fontSize: '0.8rem',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <PhoneCall style={{ width: '14px', height: '14px' }} />
                    <span>Dial 1930 Helpline</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedStation.station_name + ', ' + selectedStation.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{
                      justifyContent: 'center',
                      gap: '0.4rem',
                      fontSize: '0.8rem',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <ExternalLink style={{ width: '14px', height: '14px' }} />
                    <span>Directions in Maps</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
                color: 'var(--text-muted)',
              }}
            >
              Select a cyber crime precinct to view contact numbers and jurisdiction details.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
