import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { CheckCircle2, XCircle, AlertTriangle, ScanLine, RotateCcw, Lock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ScanState =
  | { kind: "idle" }
  | { kind: "valid"; sponsor: ScanSponsor }
  | { kind: "already_used"; sponsor: ScanSponsor }
  | { kind: "invalid"; message: string };

type ScanSponsor = {
  company_name: string;
  contact_name: string | null;
  tier: "gold" | "silver" | "bronze";
  used_at: string | null;
};

const tierLabel: Record<ScanSponsor["tier"], string> = {
  gold: "Gold", silver: "Silver", bronze: "Bronze",
};

// ───────────────── PIN screen ─────────────────
function PinScreen({ onUnlock }: { onUnlock: (pin: string) => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/scan/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "PIN incorrecto");
      }
      sessionStorage.setItem("bf_scanner_pin", pin);
      onUnlock(pin);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setPin("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-ink flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xs flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center">
            <Lock className="w-7 h-7 text-brand-gold" />
          </div>
          <h1 className="font-display text-3xl text-brand-cream tracking-wide">Burger Fest</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-cream/50 text-center">Personal de entrada</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            type="password"
            inputMode="numeric"
            placeholder="PIN de acceso"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={12}
            autoFocus
            className="text-center text-xl tracking-widest bg-brand-cream/5 border-brand-cream/15 text-brand-cream placeholder:text-brand-cream/30 h-14"
          />
          {error && (
            <p className="text-sm text-brand-flame text-center">{error}</p>
          )}
          <Button
            type="submit"
            disabled={!pin || busy}
            className="h-12 bg-brand-gold hover:bg-brand-gold/90 text-brand-ink font-bold uppercase tracking-wider"
          >
            {busy ? "Verificando…" : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ───────────────── Result screen ─────────────────
function ResultScreen({ state, onContinue }: { state: ScanState; onContinue: () => void }) {
  if (state.kind === "valid") {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center px-6 py-12 text-center gap-6">
        <CheckCircle2 className="w-32 h-32 text-emerald-400" strokeWidth={1.5} />
        <div className="space-y-2">
          <p className="font-display text-4xl text-emerald-50 tracking-wide">¡Acceso autorizado!</p>
          <p className="text-emerald-200/80 text-lg">{state.sponsor.company_name}</p>
          {state.sponsor.contact_name && (
            <p className="text-emerald-200/60 text-sm">{state.sponsor.contact_name}</p>
          )}
          <span className="mt-3 inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
            Patrocinador {tierLabel[state.sponsor.tier]}
          </span>
        </div>
        <Button
          onClick={onContinue}
          size="lg"
          className="mt-6 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold uppercase tracking-wider"
        >
          <RotateCcw className="w-5 h-5 mr-2" /> Escanear siguiente
        </Button>
      </div>
    );
  }

  if (state.kind === "already_used") {
    return (
      <div className="min-h-screen bg-amber-950 flex flex-col items-center justify-center px-6 py-12 text-center gap-6">
        <AlertTriangle className="w-32 h-32 text-amber-400" strokeWidth={1.5} />
        <div className="space-y-2">
          <p className="font-display text-4xl text-amber-50 tracking-wide">Credencial ya usada</p>
          <p className="text-amber-200/80 text-lg">{state.sponsor.company_name}</p>
          {state.sponsor.used_at && (
            <p className="text-amber-200/60 text-sm">
              Usada el {new Date(state.sponsor.used_at).toLocaleString("es-ES")}
            </p>
          )}
        </div>
        <Button
          onClick={onContinue}
          size="lg"
          className="mt-6 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold uppercase tracking-wider"
        >
          <RotateCcw className="w-5 h-5 mr-2" /> Escanear siguiente
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-950 flex flex-col items-center justify-center px-6 py-12 text-center gap-6">
      <XCircle className="w-32 h-32 text-red-400" strokeWidth={1.5} />
      <div className="space-y-2">
        <p className="font-display text-4xl text-red-50 tracking-wide">Acceso denegado</p>
        <p className="text-red-200/80">{state.kind === "invalid" ? state.message : "Código no válido"}</p>
      </div>
      <Button
        onClick={onContinue}
        size="lg"
        className="mt-6 bg-red-400 hover:bg-red-300 text-red-950 font-bold uppercase tracking-wider"
      >
        <RotateCcw className="w-5 h-5 mr-2" /> Volver a escanear
      </Button>
    </div>
  );
}

// ───────────────── Scanner screen ─────────────────
function ScannerScreen({ pin, onResult }: { pin: string; onResult: (s: ScanState) => void }) {
  const containerId = "bf-scanner-region";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lockRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const html5 = new Html5Qrcode(containerId, { verbose: false });
    scannerRef.current = html5;

    async function processCode(code: string) {
      if (lockRef.current === code) return;
      lockRef.current = code;
      try {
        await html5.stop();
      } catch { /* ignore */ }
      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, pin }),
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok && body.status === "valid") {
          onResult({ kind: "valid", sponsor: body.sponsor });
        } else if (res.ok && body.status === "already_used") {
          onResult({ kind: "already_used", sponsor: body.sponsor });
        } else {
          onResult({ kind: "invalid", message: body.error ?? "Código no válido" });
        }
      } catch (err) {
        onResult({ kind: "invalid", message: err instanceof Error ? err.message : "Error de red" });
      }
    }

    html5
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decoded) => { void processCode(decoded); },
        () => { /* ignore per-frame decode errors */ },
      )
      .catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        setError(`No se pudo abrir la cámara: ${msg}`);
      });

    return () => {
      html5.stop().catch(() => {});
      html5.clear();
    };
  }, [pin, onResult]);

  return (
    <div className="min-h-screen bg-brand-ink flex flex-col">
      <div className="px-6 py-4 flex items-center gap-3 border-b border-brand-cream/10">
        <Flame className="w-5 h-5 text-brand-gold" />
        <p className="text-brand-cream font-display text-lg tracking-wide">Escáner</p>
        <span className="ml-auto text-xs uppercase tracking-[0.25em] text-brand-cream/40">Burger Fest</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6">
        <div id={containerId} className="w-full max-w-md bg-black rounded-3xl overflow-hidden aspect-square" />
        <div className="flex items-center gap-2 text-brand-cream/60 text-sm">
          <ScanLine className="w-4 h-4 text-brand-gold" />
          Apunta la cámara al QR del patrocinador
        </div>
        {error && (
          <p className="text-brand-flame text-sm text-center max-w-md">{error}</p>
        )}
      </div>
    </div>
  );
}

// ───────────────── Page ─────────────────
export default function ScannerPage() {
  const [pin, setPin] = useState<string | null>(() => sessionStorage.getItem("bf_scanner_pin"));
  const [state, setState] = useState<ScanState>({ kind: "idle" });

  if (!pin) {
    return <PinScreen onUnlock={setPin} />;
  }

  if (state.kind !== "idle") {
    return <ResultScreen state={state} onContinue={() => setState({ kind: "idle" })} />;
  }

  return <ScannerScreen pin={pin} onResult={setState} />;
}
