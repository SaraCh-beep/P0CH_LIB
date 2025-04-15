/*Chargement de la page : DOMContentLoaded*/

Document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    let books = JSON.parse(localStorage.getItem('books')) || [];