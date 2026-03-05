// offline caching utilities (placeholder)
export const cacheDistrictData = (data) => {
  if ('caches' in window) {
    caches.open('pinkroute-data').then(cache => {
      cache.put('districts', new Response(JSON.stringify(data)));
    });
  }
};