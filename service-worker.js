const CACHE_NAME = "gusanitoxmega-v3";

const FILES = [

"./index.html",

"./style.css",

"./game.js",

"./manifest.json"

];

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)

.then(cache => {

return cache.addAll(FILES);

})

);

});

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(keys => {

return Promise.all(

keys.map(key=>{

if(key !== CACHE_NAME){

return caches.delete(key);

}

})

);

})

);

});

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)

.then(response=>{

return response || fetch(event.request);

})

);

});
