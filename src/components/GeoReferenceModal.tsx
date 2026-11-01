import React, { useState } from 'react';
import { Globe, LocateFixed, X } from 'lucide-react';
import { Language } from '../types/guild';
import { t } from '../i18n/translations';

export interface GeoAnchorOption {
  /** 'origin' or a star-plant instanceId. */
  id: string;
  label: string;
}

export interface GeoReferenceInput {
  anchorId: string;
  lat: number;
  lon: number;
}

interface GeoReferenceModalProps {
  language: Language;
  anchors: GeoAnchorOption[];
  initial?: Partial<GeoReferenceInput>;
  onCancel: () => void;
  onConfirm: (ref: GeoReferenceInput) => void;
}

const isValidGeoReference = (lat: number, lon: number) =>
  isFinite(lat) && isFinite(lon) && Math.abs(lat) <= 85 && Math.abs(lon) <= 180;

/** Accepts "53.1435" and "53,1435"; a pasted "53.1435, 8.2146" pair is split into both fields. */
function parseCoord(s: string): number {
  const v = s.trim().replace(/°/g, '');
  if (/^-?\d+,\d+$/.test(v)) return Number(v.replace(',', '.'));
  return v === '' ? NaN : Number(v);
}

export const GeoReferenceModal: React.FC<GeoReferenceModalProps> = ({ language, anchors, initial, onCancel, onConfirm }) => {
  const tr = t(language);
  const [anchorId, setAnchorId] = useState(
    initial?.anchorId && anchors.some(a => a.id === initial.anchorId) ? initial.anchorId : anchors[0]?.id ?? 'origin'
  );
  const [lat, setLat] = useState(initial?.lat != null ? String(initial.lat) : '');
  const [lon, setLon] = useState(initial?.lon != null ? String(initial.lon) : '');
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const handleLatChange = (value: string) => {
    const pair = /^\s*(-?\d+\.\d+)\s*[,;\s]\s*(-?\d+\.\d+)\s*$/.exec(value);
    if (pair) {
      setLat(pair[1]);
      setLon(pair[2]);
    } else {
      setLat(value);
    }
    setError(null);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError(tr.geoRefLocationError);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(pos.coords.latitude.toFixed(7));
        setLon(pos.coords.longitude.toFixed(7));
        setLocating(false);
        setError(null);
      },
      () => {
        setLocating(false);
        setError(tr.geoRefLocationError);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const la = parseCoord(lat);
    const lo = parseCoord(lon);
    if (!isValidGeoReference(la, lo)) {
      setError(tr.geoRefInvalid);
      return;
    }
    onConfirm({ anchorId, lat: la, lon: lo });
  };

  const inputCls = 'w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-forest-500';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onCancel}
    >
      <form
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="geo-ref-title"
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-forest-100 text-forest-700">
              <Globe className="w-5 h-5" />
            </div>
            <h2 id="geo-ref-title" className="font-bold text-stone-900">{tr.geoRefTitle}</h2>
          </div>
          <button type="button" onClick={onCancel} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100" aria-label={tr.geoRefCancel}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">{tr.geoRefIntro}</p>

          <label className="block">
            <span className="block text-xs font-semibold text-stone-700 mb-1">{tr.geoRefAnchor}</span>
            <select className={inputCls} value={anchorId} onChange={e => setAnchorId(e.target.value)}>
              {anchors.map(a => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-stone-700 mb-1">{tr.geoRefLat}</span>
              <input className={inputCls} inputMode="decimal" placeholder="53.1435" value={lat} onChange={e => handleLatChange(e.target.value)} autoFocus />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-stone-700 mb-1">{tr.geoRefLon}</span>
              <input className={inputCls} inputMode="decimal" placeholder="8.2146" value={lon} onChange={e => { setLon(e.target.value); setError(null); }} />
            </label>
          </div>

          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="flex items-center gap-1.5 text-xs font-medium text-forest-700 hover:text-forest-900 disabled:opacity-60"
          >
            <LocateFixed className="w-4 h-4" />
            {locating ? tr.geoRefLocating : tr.geoRefUseLocation}
          </button>

          <p className="text-[11px] text-stone-500 leading-relaxed">{tr.geoRefPaste}</p>
          {error && <p className="text-xs font-medium text-rose-700" role="alert">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 p-4 sm:p-5 border-t border-stone-100 bg-stone-50/50">
          <button type="button" onClick={onCancel} className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100">
            {tr.geoRefCancel}
          </button>
          <button type="submit" className="px-3 py-2 rounded-lg bg-forest-700 text-white text-xs font-semibold hover:bg-forest-800">
            {tr.geoRefExport}
          </button>
        </div>
      </form>
    </div>
  );
};
