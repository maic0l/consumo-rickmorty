fetch('https://rickandmortyapi.com/api/character')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('characters');
    data.results.forEach(character => {
      container.innerHTML += `
        <div class="col-md-3">
          <div class="card mb-4 shadow-sm">
            <img src="${character.image}" class="card-img-top" alt="${character.name}">
            <div class="card-body">
              <h5 class="card-title">${character.name}</h5>
              <p class="card-text">${character.species}</p>
              <p class="text-muted">Estado: ${character.status}</p>
            </div>
          </div>
        </div>`;
    });
  });
  