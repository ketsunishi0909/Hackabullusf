import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface ScannerViewProps {
  onScan: (data: string) => void;
}

let pendingCleanup: Promise<void> = Promise.resolve();

export default function ScannerView({ onScan }: ScannerViewProps) {
  const onScanRef = useRef(onScan);
  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  useEffect(() => {
    let qr: Html5Qrcode | null = null;

    const init: Promise<void> = pendingCleanup.then(async () => {
      const el = document.getElementById('qr-scanner-container');
      if (el) el.innerHTML = '';

      qr = new Html5Qrcode('qr-scanner-container');
      await qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decoded) => { onScanRef.current(decoded); },
        undefined
      );
    }).catch(() => { /* permission denied, no device, or interrupted */ });

    return () => {
      pendingCleanup = init.then(async () => {
        if (!qr) return;
        try { await qr.stop(); } catch { /* already stopped or never started */ }
        try { qr.clear(); } catch { /* ignore */ }
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div id="qr-scanner-container" className="w-full" />;
}
