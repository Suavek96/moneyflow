(() => {
  const status = text => { window.mfPwaStatus = text; const el = document.getElementById('mf-pwa-status'); if (el) el.textContent = text; };
  if (!window.isSecureContext || !('serviceWorker' in navigator)) { status('Modalità offline non disponibile: apri il sito tramite HTTPS in un browser compatibile.'); return; }
  status('Preparazione della copia offline…');
  navigator.serviceWorker.addEventListener('controllerchange', () => status('Copia offline attiva. Verifica l’avvio in modalità aereo.'));
  navigator.serviceWorker.register('./sw.js', {scope:'./', updateViaCache:'none'}).then(async registration => {
    await navigator.serviceWorker.ready;
    status(navigator.serviceWorker.controller ? 'Copia offline attiva. Verifica l’avvio in modalità aereo.' : 'Copia offline pronta. Riapri MoneyFlow per attivarla.');
    if (registration.waiting) status('Aggiornamento pronto: salva il tuo lavoro e chiudi tutte le finestre MoneyFlow prima di riaprirle.');
    registration.addEventListener('updatefound', () => { const worker=registration.installing; if(worker) worker.addEventListener('statechange', () => { if(worker.state==='installed' && navigator.serviceWorker.controller && registration.waiting) status('Aggiornamento pronto: salva il tuo lavoro e chiudi tutte le finestre MoneyFlow prima di riaprirle.'); }); });
  }).catch(() => status('Impossibile preparare la copia offline. Riprova con una connessione Internet.'));
})();
