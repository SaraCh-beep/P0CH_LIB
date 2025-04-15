/*Chargement de la page : DOMContentLoaded*/

Document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    let books = JSON.parse(localStorage.getItem('books')) || [];

    // Configuration de l'API
  const CONFIG = {
    API_KEY: 'AIzaSyCxT3W7AlUuARzmCls-o7QYRFibraseKDE',
    API_URL: 'https://www.googleapis.com/books/v1/volumes'
  };
  
  // Vérification de la clé API
  if (CONFIG.API_KEY === 'YOUR_API_KEY') {
    alert('Veuillez remplacer YOUR_API_KEY par une clé API Google Books valide dans le fichier app.js');
    console.error('Clé API non configurée. Veuillez obtenir une clé API sur https://console.cloud.google.com/');
  }
