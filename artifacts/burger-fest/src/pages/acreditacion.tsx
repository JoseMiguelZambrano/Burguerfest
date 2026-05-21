import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, XCircle, AlertTriangle, Flame } from "lucide-react";

type SponsorInfo = {
  code: string;
  company_name: string;
  contact_name: string | null;
  tier: "gold" | "silver" | "bronze";
  used: boolean;
  used_at: string | null;
};

const tierStyles: Record<SponsorInfo["tier"], string> = {
  gold:   "bg-brand-gold text-brand-ink",
  silver: "bg-slate-200 text-slate-800",
  bronze: "bg-amber-700 text-amber-50",
};

const tierLabel: Record<SponsorInfo["tier"], string> = {
  gold: "Gold", silver: "Silver", bronze: "Bronze",
};

export default function AcreditacionPage() {
  const [, params] = useRoute<{ code: string }>("/acreditar/:code");
  const code = params?.code ?? "";

  const [data, setData] = useState<SponsorInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) { setLoading(false); setError("Código faltante"); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/sponsors/accreditation/${encodeURIComponent(code)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "No se pudo cargar la credencial");
        }
        const json = (await res.json()) as SponsorInfo;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ink flex items-center justify-center text-brand-cream/70">
        Cargando credencial…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-brand-ink flex flex-col items-center justify-center px-6 text-center gap-6">
        <XCircle className="w-20 h-20 text-brand-flame" strokeWidth={1.5} />
        <div>
          <h1 className="font-display text-3xl text-brand-cream tracking-wide">Código no válido</h1>
          <p className="text-brand-cream/50 text-sm mt-2 max-w-xs">{error ?? "Este enlace de acreditación no existe o ha expirado."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ink flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col items-center gap-7">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center">
            <Flame className="w-7 h-7 text-brand-gold" />
          </div>
          <h1 className="font-display text-3xl text-brand-cream tracking-wide">Burger Fest 2026</h1>
          <p className="text-brand-cream/50 text-xs uppercase tracking-[0.3em]">Credencial de patrocinador</p>
        </div>

        <div className="w-full bg-brand-cream rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xl">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <p className="font-display text-2xl text-brand-ink tracking-wide">{data.company_name}</p>
            {data.contact_name && (
              <p className="text-sm text-brand-ink/60">{data.contact_name}</p>
            )}
            <span className={`mt-2 inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${tierStyles[data.tier]}`}>
              Patrocinador {tierLabel[data.tier]}
            </span>
          </div>

          <div className="p-3 bg-white rounded-2xl">
            <QRCodeSVG value={data.code} size={220} level="H" includeMargin={false} />
          </div>

          <div className="w-full bg-brand-cream/60 rounded-xl px-4 py-3 text-center border border-brand-ink/10">
            <p className="text-xs text-brand-ink/50 font-mono break-all">{data.code}</p>
          </div>

          {data.used && (
            <div className="w-full flex items-start gap-2 bg-brand-flame/10 border border-brand-flame/30 rounded-xl px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-brand-flame flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-bold text-brand-flame">Credencial ya usada</p>
                {data.used_at && (
                  <p className="text-xs text-brand-flame/80">
                    {new Date(data.used_at).toLocaleString("es-ES")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <CheckCircle2 className="w-5 h-5 text-brand-gold" />
          <p className="text-brand-cream/70 text-sm">
            Muestra este QR al personal de entrada del evento.
          </p>
          <p className="text-brand-cream/40 text-xs">
            21 – 30 de Junio · SC Pabellones
          </p>
        </div>
      </div>
    </div>
  );
}
