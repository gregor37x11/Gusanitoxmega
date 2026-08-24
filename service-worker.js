const CACHE_NAME = 'gusanitoxmega-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/game.js',
  '/style.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/screenshot1.png'
];

// Instalación
self.addEventListener('install', (event) => {
  console.log('🐍 Service Worker instalando...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache abierto, cacheando assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('✅ Assets cacheados con éxito');
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch((error) => {
        console.error('❌ Error al cachear:', error);
      })
  );
});

// Activación
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activado');

  // Eliminar caches antiguos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️  Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('🎉 Service Worker listo para controlar la página');
      return self.clients.claim(); // Tomar control de los clientes
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  // Cache with Network Fallback
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Retornar del cache si está disponible
        if (cachedResponse) {
          console.log('📖 Sirviendo desde cache:', event.request.url);
          return cachedResponse;
        }

        // Si no está en cache, ir a la red
        console.log('🌐 Obteniendo de la red:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Clonar la respuesta para cachearla
            const responseClone = response.clone();

            // Cachear solo respuestas exitosas
            if (response.status === 200) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('💾 Cacheando nueva respuesta:', event.request.url);
                  cache.put(event.request, responseClone);
                });
            }

            return response;
          });
      })
      .catch((error) => {
        console.error('❌ Error en fetch:', error);
        // Retornar una página de error offline
        return caches.match('/index.html');
      })
  );
});

// Mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data.action === 'updateCache') {
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.add(event.data.url);
      });
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-high-scores') {
    event.waitUntil(
      console.log('🔄 Sincronizando high scores...')
    );
  }
});

// Notificaciones push
self.addEventListener('push', (event) => {
  const data = event.data?.json();

  if (data) {
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon-192.png',
        data: data.url
      })
    );
  }
});

// Manejo de clic en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

console.log('🐍 Gusanitoxmega Service Worker cargado');