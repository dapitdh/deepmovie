//Get element
const input = document.getElementById('search-input');
const search = document.getElementById('search-button');
const hasilCari = document.getElementById(`movie-container`);

//Search
search.addEventListener('click', async function(){
    // Show loading image
    hasilCari.innerHTML = ``;
    const loadingImage = document.createElement('img');
    loadingImage.src = 'asset/loading.gif';
    loadingImage.alt = 'Loading...';
    loadingImage.classList.add('loading-image');
    hasilCari.appendChild(loadingImage);

    const movies = await getMovie();
    addMovie(movies, loadingImage);
});

//Element Function
function getMovie(){
    return fetch(`https://www.omdbapi.com/?s=${input.value}&apikey=665ddef7`)
    .then(response => response.json())
    .then(response => response.Search)
    .catch(error => {
        console.log(error);
    });
}

function addMovie(movies,loadingImage){ 
    // Remove loading image
    hasilCari.removeChild(loadingImage);

    // If movie not found
    if (movies == undefined) {
        const notFound = document.createElement(`figure`);
        notFound.classList.add(`col-12`);
        notFound.classList.add(`col-sm-6`);
        notFound.classList.add(`text-center`);
        notFound.innerHTML = `
            <img src="asset/notFound.gif" alt="Not Found" class="img-fluid"/>
            <figcaption class="text-center">Movie not found</figcaption>
        `;
        hasilCari.appendChild(notFound);
        return;
    }

    // If movie found
    movies.forEach(m => {
        const movie = document.createElement(`div`);
        createMovieCard(m, movie);
        hasilCari.appendChild(movie);

        fetch(`https://www.omdbapi.com/?i=${m.imdbID}&apikey=665ddef7`)
        .then(response => response.json())
        .then(detail => {
            if(detail.Response == "True"){
                const info = document.createElement(`div`);
            info.classList.add(`modal`);
            info.classList.add(`fade`);
            info.classList.add(`col-12`);
            info.classList.add(`col-sm-auto`);
            info.id = `modalFilm${m.imdbID}`;
            info.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">${detail.Title}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-4">
                                    <img src="${detail.Poster}" class="img-fluid" alt="">
                                </div>
                                <div class="col-8">
                                    <p class="fs-6"><span class="fw-bold">Released</span>: ${detail.Released}</p>
                                    <p class="fs-6"><span class="fw-bold">Genre</span>: ${detail.Genre}</p>
                                    <p class="fs-6"><span class="fw-bold">Director</span>: ${detail.Director}</p>
                                    <p class="fs-6"><span class="fw-bold">Actors</span>: ${detail.Actors}</p>
                                    <p class="fs-6"><span class="fw-bold">Plot</span>: ${detail.Plot}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(info);
            } else {
                alert("Error, cant get movie detail!");
            }
        })
        .catch(error => {
            console.log(error);
        });
    });
}

function createMovieCard(m, card) {
    card.classList.add(`card`);
    card.classList.add(`m-2`);
    card.classList.add(`pt-2`);
    card.classList.add(`animate__animated`);
    card.classList.add(`animate__backInUp`);
    card.style.width = `15rem`;
    if(m.Poster == "N/A"){
        card.innerHTML = `
            <div class="card-img-top" style="object-fit: cover; height: 300px; width: 100%; background-color: #f8f9fa; text-align: center; line-height: 275px;">Image not available</div>
            <div class="card-body text-center">
                <h5 class="card-title">${m.Title}</h5>
                <p class="card-text">${m.Year}</p>
                <p class="card-text"><small class="text-muted">${m.Type.slice(0,1).toUpperCase() + m.Type.slice(1)}</small></p>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalFilm${m.imdbID}">Detail</button>
            </div>
        `;
    } else {
        card.innerHTML = `
        <img src="${m.Poster}" class="card-img-top" alt="Movie Poster" style="object-fit: cover;">
        <div class="card-body text-center">
            <h5 class="card-title">${m.Title}</h5>
            <p class="card-text"><small class="text-muted">${m.Year}</small></p>
            <p class="card-text"><small class="text-muted">${m.Type.slice(0,1).toUpperCase() + m.Type.slice(1)}</small></p>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalFilm${m.imdbID}">Detail</button>
        </div>`;
    }
}

//Switch Theme
const switchInput = document.querySelector('.switch .input');

// Load saved theme from localStorage
if (localStorage.getItem('theme') === 'gelap') {
    document.body.classList.add('gelap');
    switchInput.checked = true;
} else {
    document.body.classList.add('terang');
}

switchInput.addEventListener('change', function() {
    document.body.classList.toggle('terang');
    document.body.classList.toggle('gelap');
    
    // Save the current theme to localStorage
    if (document.body.classList.contains('gelap')) {
        localStorage.setItem('theme', 'gelap');
    } else {
        localStorage.setItem('theme', 'terang');
    }
});