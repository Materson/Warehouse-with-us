window.addEventListener('load', e => {
    registerSW(); 
    console.log("load event");
  });
  
  async function registerSW() { 
    if ('serviceWorker' in navigator) { 
      try {
        await navigator.serviceWorker.register('./sw.js'); 
      } catch (e) {
        alert('ServiceWorker registration failed. Sorry about that.' + e); 
      }
    } else {
      alert("Your browser doesn’t support ServiceWorker and offline mode is not supported.");
    }
  }