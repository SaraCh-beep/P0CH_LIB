// Chargement de la page : DOMContentLoaded

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

 // Créer un conteneur pour la section de recherche
 const searchSection = document.createElement('div');
 searchSection.className = 'search-section';
 content.appendChild(searchSection);

  // Ajouter un titre pour la section de recherche
  const searchTitle = document.createElement('h2');
  searchTitle.textContent = 'Nouveau livre';
  searchTitle.className = 'section-title';
  searchSection.appendChild(searchTitle);

  // Créer un boutton d'ajout de livre
  const addBookBtn = document.createElement('button');
  addBookBtn.className = 'add-book-btn';
  addBookBtn.textContent = 'Ajouter un livre';
  searchSection.appendChild(addBookBtn);

   // Créer un formulaire de recherche
   const searchForm = document.createElement('form');
   searchForm.className = 'search-form';
   searchForm.innerHTML = `
     <div class="form-group">
       <label for="title">Titre du livre</label>
       <input type="text" id="title" name="title" placeholder="Entrez le titre du livre" required>
     </div>
     <div class="form-group">
       <label for="author">Auteur</label>
       <input type="text" id="author" name="author" placeholder="Entrez le nom de l'auteur" required>
     </div>
     <div class="button-group">
       <button type="submit" class="search">Rechercher</button>
       <button type="button" class="cancel">Annuler</button>
     </div>
   `;