import { useState } from "react";
import { QrCode, MessageCircle, Trash2, Copy, ExternalLink, X, Phone, CheckCircle2, XCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface AdminSponsor {
  id: string;
  company_name: string;
  contact_name: string | null;
  contact_phone: string | null;
  tier: "gold" | "silver" | "bronze";
  status: "pending" | "approved" | "rejected";
  logo_url: string | null;
  accreditation_code: string | null;
  accreditation_used: boolean;
  accreditation_used_at: string | null;
  profile_email?: string | null;
}

interface Props {
  sponsors: AdminSponsor[];
  onGenerateCode: (id: string) => Promise<string>;
  onUpdatePhone: (id: string, phone: string) => Promise<void>;
  onDelete: (id: string) => void;
}

const tierBadge: Record<AdminSponsor["tier"], string> = {
  gold:   "bg-brand-gold text-brand-ink",
  silver: "bg-slate-200 text-slate-800",
  bronze: "bg-amber-700 text-amber-50",
};

function buildAcreditarUrl(code: string): string {
  return `${window.location.origin}/acreditar/${code}`;
}

function whatsappLink(phone: string, message: string): string {
  const clean = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function SponsorList({ sponsors, onGenerateCode, onUpdatePhone, onDelete }: Props) {
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("approved");
  const [openQr, setOpenQr] = useState<AdminSponsor | null>(null);

  const filtered = sponsors.filter((s) => filter === "all" ? true : s.status === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-brand-ink tracking-wide">Patrocinadores</h1>
          <p className="text-sm text-muted-foreground">Genera credenciales QR y envíalas por WhatsApp.</p>
        </div>
        <div className="flex gap-2">
          {(["approved", "pending", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                filter === f
                  ? "bg-brand-maroon text-brand-cream"
                  : "bg-brand-cream/40 text-brand-ink/70 hover:bg-brand-cream"
              }`}
            >
              {f === "approved" ? "Aprobados" : f === "pending" ? "Pendientes" : "Todos"}
            </button>
          ))}
        </div>
      </header>

      {filtered.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
          No hay patrocinadores en este filtro.
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((s) => (
          <SponsorRow
            key={s.id}
            sponsor={s}
            onShowQr={() => setOpenQr(s)}
            onGenerateCode={() => onGenerateCode(s.id)}
            onUpdatePhone={(p) => onUpdatePhone(s.id, p)}
            onDelete={() => onDelete(s.id)}
          />
        ))}
      </div>

      {openQr && (
        <QrModal
          sponsor={openQr}
          onClose={() => setOpenQr(null)}
          onGenerate={() => onGenerateCode(openQr.id)}
        />
      )}
    </div>
  );
}

interface RowProps {
  sponsor: AdminSponsor;
  onShowQr: () => void;
  onGenerateCode: () => Promise<string>;
  onUpdatePhone: (phone: string) => Promise<void>;
  onDelete: () => void;
}

function SponsorRow({ sponsor, onShowQr, onGenerateCode, onUpdatePhone, onDelete }: RowProps) {
  const [phone, setPhone] = useState(sponsor.contact_phone ?? "");
  const [savingPhone, setSavingPhone] = useState(false);
  const [busy, setBusy] = useState(false);

  const acreditarUrl = sponsor.accreditation_code ? buildAcreditarUrl(sponsor.accreditation_code) : null;
  const waMessage = `Hola ${sponsor.contact_name ?? sponsor.company_name}, te enviamos tu credencial digital para Burger Fest 2026. Muestra este QR en la entrada:\n\n${acreditarUrl}`;

  async function handleSendWhatsApp() {
    if (!sponsor.contact_phone) return;
    let url = acreditarUrl;
    if (!url) {
      setBusy(true);
      try {
        const code = await onGenerateCode();
        url = buildAcreditarUrl(code);
      } finally { setBusy(false); }
    }
    const msg = `Hola ${sponsor.contact_name ?? sponsor.company_name}, te enviamos tu credencial digital para Burger Fest 2026. Muestra este QR en la entrada:\n\n${url}`;
    window.open(whatsappLink(sponsor.contact_phone, msg), "_blank");
  }

  async function handleSavePhone() {
    setSavingPhone(true);
    try { await onUpdatePhone(phone); } finally { setSavingPhone(false); }
  }

  return (
    <div className="w-full bg-card rounded-xl border border-border p-5 flex flex-col lg:flex-row items-start lg:items-center gap-5">
      <div className="w-14 h-14 rounded-full bg-brand-maroon/10 flex items-center justify-center overflow-hidden border-2 border-brand-gold/30 flex-shrink-0">
        {sponsor.logo_url ? (
          <img src={sponsor.logo_url} alt={sponsor.company_name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display text-xl text-brand-maroon">
            {sponsor.company_name.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-display text-xl text-brand-ink tracking-wide truncate">{sponsor.company_name}</h3>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tierBadge[sponsor.tier]}`}>
            {sponsor.tier}
          </span>
          {sponsor.status === "approved" && sponsor.accreditation_used && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Acreditado
            </span>
          )}
          {sponsor.status === "approved" && !sponsor.accreditation_used && sponsor.accreditation_code && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-gold/30 text-brand-ink">
              QR listo
            </span>
          )}
          {sponsor.status !== "approved" && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
              {sponsor.status === "pending" ? "Pendiente" : "Rechazado"}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
          {sponsor.contact_name && <span>{sponsor.contact_name}</span>}
          {sponsor.profile_email && <span className="text-xs">{sponsor.profile_email}</span>}
          {sponsor.accreditation_used_at && (
            <span className="text-xs text-emerald-700">
              Entrada: {new Date(sponsor.accreditation_used_at).toLocaleString("es-ES")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2 max-w-md">
          <Phone className="w-4 h-4 text-brand-maroon flex-shrink-0" />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+58 412 1234567"
            className="h-9 text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            disabled={savingPhone || phone === (sponsor.contact_phone ?? "")}
            onClick={handleSavePhone}
            className="border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-brand-cream"
          >
            {savingPhone ? "…" : "Guardar"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        {sponsor.status === "approved" && (
          <>
            <Button
              size="sm"
              onClick={onShowQr}
              disabled={busy}
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-ink font-bold"
            >
              <QrCode className="w-4 h-4 mr-1.5" /> Ver QR
            </Button>
            <Button
              size="sm"
              onClick={handleSendWhatsApp}
              disabled={!sponsor.contact_phone || busy}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              title={!sponsor.contact_phone ? "Añade un teléfono primero" : "Enviar por WhatsApp"}
            >
              <MessageCircle className="w-4 h-4 mr-1.5" /> WhatsApp
            </Button>
          </>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={onDelete}
          className="border-brand-flame text-brand-flame hover:bg-brand-flame hover:text-white"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ───────────────── QR modal ─────────────────
interface ModalProps {
  sponsor: AdminSponsor;
  onClose: () => void;
  onGenerate: () => Promise<string>;
}

function QrModal({ sponsor, onClose, onGenerate }: ModalProps) {
  const [code, setCode] = useState<string | null>(sponsor.accreditation_code);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = code ? buildAcreditarUrl(code) : null;

  async function handleGenerate() {
    setBusy(true);
    try { setCode(await onGenerate()); } finally { setBusy(false); }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="fixed inset-0 bg-brand-ink/80 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
      <div className="bg-brand-cream rounded-3xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-ink/10 hover:bg-brand-ink/20 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-brand-ink" />
        </button>

        <div className="text-center space-y-1 mb-5">
          <p className="font-display text-2xl text-brand-ink tracking-wide">{sponsor.company_name}</p>
          {sponsor.contact_name && <p className="text-sm text-brand-ink/60">{sponsor.contact_name}</p>}
        </div>

        {!code ? (
          <div className="text-center space-y-4 py-6">
            <p className="text-sm text-brand-ink/70">Aún no se ha generado credencial para este patrocinador.</p>
            <Button
              onClick={handleGenerate}
              disabled={busy}
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-ink font-bold uppercase tracking-wider"
            >
              {busy ? "Generando…" : "Generar credencial"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-white rounded-2xl border border-brand-ink/10">
              <QRCodeSVG value={code} size={220} level="H" />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-ink/50 font-bold">Código</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-brand-ink/5 px-3 py-2 rounded-lg text-xs font-mono break-all">{code}</code>
                <Button size="sm" variant="outline" onClick={() => copy(code)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-ink/50 font-bold">Enlace para el patrocinador</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-brand-ink/5 px-3 py-2 rounded-lg text-xs break-all">{url}</code>
                <Button size="sm" variant="outline" onClick={() => url && copy(url)}>
                  <Copy className="w-4 h-4" />
                </Button>
                {url && (
                  <Button size="sm" variant="outline" onClick={() => window.open(url, "_blank")}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {copied && <p className="text-xs text-emerald-700">¡Copiado!</p>}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={busy}
              variant="outline"
              className="w-full border-brand-flame text-brand-flame hover:bg-brand-flame hover:text-white"
            >
              {busy ? "Generando…" : "Regenerar credencial (invalida la anterior)"}
            </Button>

            {sponsor.accreditation_used && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-amber-900">Credencial ya utilizada</p>
                  {sponsor.accreditation_used_at && (
                    <p className="text-amber-700">{new Date(sponsor.accreditation_used_at).toLocaleString("es-ES")}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
