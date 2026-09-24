/*
  Service worker minimal untuk PANEL KONTROL ENERGI.
  Tujuannya HANYA supaya browser menganggap halaman ini "installable"
  (syarat Chrome untuk PWA: https + manifest + service worker dengan
  fetch handler) dan supaya kerangka tampilan (HTML/CSS/JS/ikon) tetap
  bisa terbuka walau koneksi sempat putus.

  PENTING: data panel (Firebase Realtime Database & Authentication)
  TETAP butuh internet seperti biasa — service worker ini tidak
  meng-cache atau mem-proxy data Firebase, jadi tidak akan pernah
  menampilkan data basi tanpa disadari.
*/

const CACHE_NAME = 'panel-energi-shell-v1';
const SHELL_FILES = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Jangan pernah campur tangan permintaan ke Firebase / domain lain —
  // biarkan selalu langsung ke jaringan supaya data selalu yang terbaru.
  if (url.origin !== self.location.origin) return;

  // Untuk file kerangka aplikasi sendiri: coba jaringan dulu (supaya
  // update terbaru selalu didapat kalau online), baru jatuh ke cache
  // kalau benar-benar offline.
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone)).catch(()=>{});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
