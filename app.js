document.addEventListener('DOMContentLoaded', function() {
  let currentPage = 1;
  let totalPages = 1;
  const charactersContainer = document.getElementById('characters');
  const loadingElement = document.getElementById('loading');
  const paginationElement = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  function fetchCharacters(page = 1, name = '') {
    loadingElement.style.display = 'block';
    charactersContainer.innerHTML = '';
    
    let url = `https://rickandmortyapi.com/api/character?page=${page}`;
    if (name) {
      url += `&name=${encodeURIComponent(name)}`;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se encontraron personajes');
        }
        return response.json();
      })
      .then(data => {
        totalPages = data.info.pages;
        displayCharacters(data.results);
        setupPagination(data.info);
        loadingElement.style.display = 'none';
      })
      .catch(error => {
        charactersContainer.innerHTML = `
          <div class="col-12 text-center py-5">
            <div class="alert alert-danger">${error.message}</div>
          </div>
        `;
        loadingElement.style.display = 'none';
        paginationElement.innerHTML = '';
      });
  }

  function displayCharacters(characters) {
    charactersContainer.innerHTML = characters.map(character => `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${character.image}" class="card-img-top" alt="${character.name}">
          <div class="card-body">
            <h5 class="card-title">${character.name}</h5>
            <p class="card-text">
              <i class="bi bi-robot"></i> ${character.species}<br>
              <i class="bi bi-gender-${character.gender.toLowerCase()}"></i> ${character.gender}<br>
              <span class="status-${character.status.toLowerCase()}">
                <i class="bi bi-circle-fill"></i> ${character.status}
              </span>
            </p>
          </div>
          <div class="card-footer bg-transparent">
            <small class="text-muted">Aparece en ${character.episode.length} episodios</small>
          </div>
        </div>
      </div>
    `).join('');
  }

  function setupPagination(info) {
    paginationElement.innerHTML = '';

    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous" data-page="${currentPage - 1}">
      <span aria-hidden="true">&laquo;</span>
    </a>`;
    paginationElement.appendChild(prevLi);

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      const pageLi = document.createElement('li');
      pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
      pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
      paginationElement.appendChild(pageLi);
    }

    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next" data-page="${currentPage + 1}">
      <span aria-hidden="true">&raquo;</span>
    </a>`;
    paginationElement.appendChild(nextLi);

    document.querySelectorAll('.page-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = parseInt(this.getAttribute('data-page'));
        if (page !== currentPage) {
          currentPage = page;
          fetchCharacters(currentPage, searchInput.value.trim());
        }
      });
    });
  }

  
  searchBtn.addEventListener('click', function() {
    currentPage = 1;
    fetchCharacters(currentPage, searchInput.value.trim());
  });


  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      currentPage = 1;
      fetchCharacters(currentPage, searchInput.value.trim());
    }
  });


  fetchCharacters(currentPage);
});
