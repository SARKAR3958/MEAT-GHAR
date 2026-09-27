import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Clock, ShieldCheck, Phone, MessageSquare, Navigation } from 'lucide-react';
import { LocationData } from '../../types/location';

// Fix Leaflet default icon paths in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LiveOrderTrackerMapProps {
  customerLocation?: LocationData;
  onArrivedOtpView?: () => void;
  onBack?: () => void;
}

const DEFAULT_STORE = {
  lat: 28.5980,
  lng: 77.3200,
  name: 'Meat Ghar Store - Sector 10 Noida',
};

export const LiveOrderTrackerMap: React.FC<LiveOrderTrackerMapProps> = ({
  customerLocation,
  onArrivedOtpView,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const riderMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const customerLat = customerLocation?.lat || 28.5900;
  const customerLng = customerLocation?.lng || 77.3300;
  const customerAddress = customerLocation?.address || 'MG Road, Sector 10, Noida, 201301';

  // Simulation State
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [riderIndex, setRiderIndex] = useState(0);
  const [totalDistanceKm, setTotalDistanceKm] = useState('3.2');
  const [remainingMinutes, setRemainingMinutes] = useState(8);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Generate Fallback Line Interpolation if OSRM is unavailable
  const generateFallbackRoute = useCallback((sLat: number, sLng: number, cLat: number, cLng: number) => {
    const points: [number, number][] = [];
    const steps = 15;
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      // add slight curve for realism
      const midLat = sLat + (cLat - sLat) * ratio + Math.sin(ratio * Math.PI) * 0.0015;
      const midLng = sLng + (cLng - sLng) * ratio + Math.sin(ratio * Math.PI) * -0.0015;
      points.push([midLat, midLng]);
    }
    return points;
  }, []);

  // Fetch OSRM Road Polyline
  const fetchOSRMRoute = useCallback(async () => {
    const storeLng = DEFAULT_STORE.lng;
    const storeLat = DEFAULT_STORE.lat;

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${storeLng},${storeLat};${customerLng},${customerLat}?overview=full&geometries=geojson`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords: [number, number][] = route.geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          );

          setRoutePoints(coords);
          if (route.distance) {
            setTotalDistanceKm((route.distance / 1000).toFixed(1));
          }
          if (route.duration) {
            const mins = Math.ceil(route.duration / 60);
            setRemainingMinutes(mins > 0 ? mins : 8);
          }
          return;
        }
      }
      throw new Error('OSRM route failed');
    } catch (e) {
      console.warn('OSRM Route fetch error, using fallback interpolated road path:', e);
      const fallback = generateFallbackRoute(storeLat, storeLng, customerLat, customerLng);
      setRoutePoints(fallback);
      setTotalDistanceKm('3.2');
      setRemainingMinutes(8);
    }
  }, [customerLat, customerLng, generateFallbackRoute]);

  // Setup Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent map re-initialization error on stale DOM containers
    if ((mapContainerRef.current as unknown as { _leaflet_id?: string | null })._leaflet_id) {
      (mapContainerRef.current as unknown as { _leaflet_id?: string | null })._leaflet_id = null;
    }

    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch (e) {
        console.warn('Stale map cleanup error:', e);
      }
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [DEFAULT_STORE.lat, DEFAULT_STORE.lng],
      zoom: 14,
      minZoom: 5,
      maxZoom: 19,
      maxBounds: [
        [6.5546, 68.1113],
        [35.6745, 97.3953],
      ],
      maxBoundsViscosity: 1.0,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Custom Store Marker
    const storeIcon = L.divIcon({
      className: 'custom-store-pin',
      html: `
        <div style="background-color: #A8071A; color: white; width: 36px; height: 36px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">
          🥩
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const storeMarker = L.marker([DEFAULT_STORE.lat, DEFAULT_STORE.lng], { icon: storeIcon }).addTo(map);
    storeMarker.bindPopup('<b>Meat Ghar Store</b><br/>Sector 10 Noida');

    // Custom Customer Destination Marker
    const customerIcon = L.divIcon({
      className: 'custom-customer-pin',
      html: `
        <div style="background-color: #0284c7; color: white; width: 36px; height: 36px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">
          📍
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const custMarker = L.marker([customerLat, customerLng], { icon: customerIcon }).addTo(map);
    custMarker.bindPopup(`<b>Your Delivery Location</b><br/>${customerAddress}`);

    fetchOSRMRoute();

    return () => {
      if (riderMarkerRef.current) {
        try {
          riderMarkerRef.current.remove();
        } catch (e) {
          console.warn('Rider marker remove error:', e);
        }
        riderMarkerRef.current = null;
      }
      if (polylineRef.current) {
        try {
          polylineRef.current.remove();
        } catch (e) {
          console.warn('Polyline remove error:', e);
        }
        polylineRef.current = null;
      }
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          console.warn('Map remove error:', e);
        }
        mapRef.current = null;
      }
    };
  }, [customerAddress, customerLat, customerLng, fetchOSRMRoute]);

  // Render Polyline & Initialize Scooter Marker when routePoints update
  useEffect(() => {
    if (!mapRef.current || routePoints.length === 0) return;

    const map = mapRef.current;

    // Draw Polyline safely
    if (polylineRef.current) {
      try {
        map.removeLayer(polylineRef.current);
      } catch (e) {
        console.warn('Error removing old polyline:', e);
      }
      polylineRef.current = null;
    }

    const polyline = L.polyline(routePoints, {
      color: '#10b981',
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    polylineRef.current = polyline;

    // Safely fit map bounds to show full route
    try {
      const bounds = polyline.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    } catch (e) {
      console.warn('fitBounds warning:', e);
    }

    // Scooter Icon
    const riderIcon = L.divIcon({
      className: 'custom-rider-scooter',
      html: `
        <div style="background-color: #dc2626; color: white; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 16px rgba(220, 38, 38, 0.5); display: flex; align-items: center; justify-content: center; font-size: 20px; animation: pulse 1.5s infinite;">
          🛵
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    if (riderMarkerRef.current) {
      try {
        map.removeLayer(riderMarkerRef.current);
      } catch (e) {
        console.warn('Error removing old rider marker:', e);
      }
      riderMarkerRef.current = null;
    }

    const initialRiderPos = routePoints[0];
    const riderMarker = L.marker(initialRiderPos, { icon: riderIcon }).addTo(map);
    riderMarkerRef.current = riderMarker;

    setRiderIndex(0);
  }, [routePoints]);

  // Simulation Interval: Move rider forward along polyline every 3 seconds
  useEffect(() => {
    if (routePoints.length === 0) return;

    const interval = setInterval(() => {
      setRiderIndex((prevIndex) => {
        const nextIndex = prevIndex < routePoints.length - 1 ? prevIndex + 1 : prevIndex;
        
        // Ensure marker, DOM element, and map exist before setting LatLng
        if (
          riderMarkerRef.current &&
          riderMarkerRef.current.getElement() &&
          mapRef.current &&
          routePoints[nextIndex]
        ) {
          try {
            riderMarkerRef.current.setLatLng(routePoints[nextIndex]);
          } catch (err) {
            console.warn('Error setting rider marker position:', err);
          }
        }

        // Calculate dynamic ETA reduction as rider moves forward
        const progress = nextIndex / (routePoints.length - 1);
        const minsLeft = Math.max(1, Math.ceil(8 * (1 - progress)));
        setRemainingMinutes(minsLeft);

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [routePoints]);

  // Seconds Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === 0) {
          return 59;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-slate-50 relative overflow-hidden">
      {/* Live Route Interactive Map Banner */}
      <div className="relative w-full h-[280px] bg-slate-200 border-b border-slate-200 overflow-hidden shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Live Tracking Status Badge Overlay */}
        <div className="absolute top-3 left-3 z-[800] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-md border border-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-black text-slate-800">
            {riderIndex >= routePoints.length - 1 ? 'Arrived at Location!' : 'Live Scooter Tracking'}
          </span>
        </div>

        {/* Distance Badge Overlay */}
        <div className="absolute top-3 right-3 z-[800] bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
          {totalDistanceKm} km away
        </div>
      </div>

      {/* Main Stats & Progress Details Container */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar pb-24">
        {/* Live Timer Circular Gauge */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#A8071A]"
                strokeDasharray={`${Math.max(10, (remainingMinutes / 8) * 100)}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-black text-[#A8071A] font-mono leading-none">
                0{remainingMinutes}:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
              </span>
              <span className="text-[8px] font-bold text-slate-500 mt-0.5">mins remaining</span>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xs font-black text-[#A8071A] leading-tight">
              70-Min Express Guarantee
            </h3>
            <p className="text-[11px] text-slate-600 font-medium leading-snug mt-0.5">
              Rider is navigating real-time traffic to bring your fresh meat order.
            </p>
            <p className="text-[10px] text-slate-400 font-bold mt-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> Estimated arrival in {remainingMinutes} mins
            </p>
          </div>
        </div>

        {/* Delivery Guarantee Box */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-950">ON-TIME DELIVERY ASSURED</p>
              <p className="text-[10px] text-emerald-700 font-medium">Free delivery credit if breached.</p>
            </div>
          </div>
          <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
            Active ✓
          </span>
        </div>

        {/* Order Status Steps */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs">
          <h4 className="text-xs font-extrabold text-slate-900 mb-2.5">Live Order Status</h4>
          
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar pb-1 text-center">
            {['Placed', 'Confirmed', 'Preparing', 'Packed', 'Assigned', 'Out for Delivery'].map((step, idx) => (
              <div key={step} className="flex flex-col items-center min-w-[55px] shrink-0">
                <div className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center mb-1 ${
                  idx <= 5 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  ✓
                </div>
                <span className="text-[9px] font-bold text-slate-800 leading-tight">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Partner Details Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <img
                src="/src/assets/images/delivery_partner_avatar_1790502025354.jpg"
                alt="Delivery Partner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-extrabold text-slate-900">Amit Kumar</h4>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                  On Scooter
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">UP16 AB 4587 &bull; ⭐ 4.9 (340 deliveries)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+919876543210"
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action: Confirm Handover when Rider Arrives */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-[850] shadow-2xl">
        <button
          onClick={onArrivedOtpView}
          className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 active:bg-red-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-900/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>Delivery Partner Arrived - Confirm Delivery &rarr;</span>
        </button>
      </div>
    </div>
  );
};
