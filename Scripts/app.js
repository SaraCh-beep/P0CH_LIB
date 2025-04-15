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

   // Inserer le formulaire
  searchSection.appendChild(searchForm);

  // Créer un conteneur pour les resultats de recherche
  const searchResults = document.createElement('div');
  searchResults.className = 'search-results';
  searchSection.appendChild(searchResults);

  // Créer un conteneur pour la poch'liste
  const myBooksSection = document.createElement('div');
  myBooksSection.className = 'my-books-section';
  content.appendChild(myBooksSection);

  // Ajouter un titre pour la poch'liste
  const myBooksTitle = document.createElement('h2');
  myBooksTitle.textContent = 'Ma poch\'liste';
  myBooksTitle.className = 'section-title';
  myBooksSection.appendChild(myBooksTitle);

  // Créer un conteneur pour la liste des livres
  const booksList = document.createElement('div');
  booksList.className = 'books-list';
  myBooksSection.appendChild(booksList);

  // Gérer le clic sur le bouton Ajouter un livre
  addBookBtn.addEventListener('click', () => {
    searchForm.classList.add('active');
    addBookBtn.style.display = 'none';
  });

   // Gérer la soumission du formulaire
   searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    
    // Validation des champs
    if (!title || !author) {
      alert('Veuillez remplir à la fois le titre et l\'auteur pour effectuer une recherche.');
      return;
    }
    
    try {
      // Construction de la requête
      const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
      
      const url = `${CONFIG.API_URL}?q=${query}&maxResults=10&printType=books&langRestrict=fr&key=${CONFIG.API_KEY}`;
      console.log('URL de recherche:', url); // Pour déboguer
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Réponse API:', data); // Pour déboguer
      
      if (data.error) {
        searchResults.innerHTML = `<p>Erreur API: ${data.error.message}</p>`;
        console.error('Erreur API:', data.error);
        return;
      }
      
      if (data.items && data.items.length > 0) {
        searchResults.innerHTML = data.items.map(book => {
          const volumeInfo = book.volumeInfo;
          const thumbnail = volumeInfo.imageLinks?.thumbnail || 'https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Salesforce_P1_FR/unavailable.png';
          const authors = volumeInfo.authors && volumeInfo.authors.length > 0 ? volumeInfo.authors[0] : 'Auteur inconnu';
          const description = volumeInfo.description ? 
            volumeInfo.description.substring(0, 200) + (volumeInfo.description.length > 200 ? '...' : '') : 
            'Aucune description disponible';
          
          // Vérifier si le livre est déjà dans la liste
          const isAlreadyInList = books.some(b => b.id === book.id);
          const bookmarkClass = isAlreadyInList ? 'bookmark active' : 'bookmark';
          
          return `
            <div class="book-card">
              <img src="${thumbnail}" alt="${volumeInfo.title}" class="book-cover">
              <h3 class="book-title">${volumeInfo.title}</h3>
              <p class="book-author">${authors}</p>
              <p class="book-description">${description}</p>
              <p class="book-id">ID: ${book.id}</p>
              <div class="bookmark-container">
                <i class="fas fa-bookmark ${bookmarkClass}" onclick="addToMyBooks('${book.id}')" title="${isAlreadyInList ? 'Déjà dans ma liste' : 'Ajouter à ma liste'}"></i>
              </div>
            </div>
          `;
        }).join('');
      } else {
        searchResults.innerHTML = '<p>Aucun résultat trouvé</p>';
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      searchResults.innerHTML = '<p>Une erreur est survenue lors de la recherche</p>';
    }
  });

    // Gérer le buton annuler
    searchForm.querySelector('.cancel').addEventListener('click', () => {
        searchForm.classList.remove('active');
        addBookBtn.style.display = 'block';
        searchForm.reset();
        searchResults.innerHTML = '';
      });

  // Ajout du livre à la liste
  window.addToMyBooks = (bookId) => {
    // Vérifier si le livre est déjà dans la liste
    if (books.some(book => book.id === bookId)) {
      alert('Ce livre est déjà dans votre liste.');
      return;
    }
    
    const bookCard = document.querySelector(`[onclick="addToMyBooks('${bookId}')"]`).closest('.book-card');
    const book = {
      id: bookId,
      title: bookCard.querySelector('.book-title').textContent,
      author: bookCard.querySelector('.book-author').textContent,
      cover: bookCard.querySelector('.book-cover').src,
      description: bookCard.querySelector('.book-description').textContent
    };
    
    books.push(book);
    saveBooks();
    renderBooks();

    // Mettre à jour l'icône de bookmark dans les résultats de recherche
    const bookmarkIcon = document.querySelector(`[onclick="addToMyBooks('${bookId}')"]`);
    if (bookmarkIcon) {
      bookmarkIcon.classList.add('active');
      bookmarkIcon.title = 'Déjà dans ma liste';
    }
  };