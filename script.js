//Get element
const input = document.getElementById('search-input');
const search = document.getElementById('search-button');
const hasilCari = document.getElementById(`movie-container`);

//Proses search
search.addEventListener('click', function() {
    hasilCari.innerHTML = ``;
    
    // Show loading image
    const loadingImage = document.createElement('img');
    loadingImage.src = 'asset/loading.gif'; // Replace with your loading image path
    loadingImage.alt = 'Loading...';
    loadingImage.classList.add('loading-image');
    hasilCari.appendChild(loadingImage);

    $.ajax({
        url: `http://www.omdbapi.com/?s=${input.value}&apikey=665ddef7`,
        success: function(result) {
            // Remove loading image
            hasilCari.removeChild(loadingImage);

            const movies = result.Search;
            if (movies == undefined) {
                const notFound = document.createElement(`figure`);
                notFound.classList.add(`col-12`);
                notFound.classList.add(`col-sm-6`);
                notFound.innerHTML = `
                    <img src="asset/notFound.gif" alt="Not Found" class="img-fluid"/>
                    <figcaption class="text-center">Movie not found</figcaption>
                `;
                hasilCari.appendChild(notFound);
                return;
            }
            movies.forEach(m => {
                const movie = document.createElement(`div`);
                movie.classList.add(`card`);
                movie.classList.add(`m-2`);
                movie.classList.add(`pt-2`);
                movie.classList.add(`animate__animated`);
                movie.classList.add(`animate__backInUp`);
                movie.style.width = `15rem`;
                movie.innerHTML = `
                <img src="${m.Poster}" class="card-img-top" alt="Movie Poster" style="object-fit: cover;">
                <div class="card-body text-center">
                    <h5 class="card-title">${m.Title}</h5>
                    <p class="card-text"><small class="text-muted">${m.Year}</small></p>
                    <p class="card-text"><small class="text-muted">${m.Type}</small></p>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalFilm${m.imdbID}">Detail</button>
                </div>`;
                hasilCari.appendChild(movie);

                //Detail
                $.ajax({
                    url: `http://www.omdbapi.com/?i=${m.imdbID}&apikey=665ddef7`,
                    success: function(detail) {
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
                                                <p class="fs-6">Released: ${detail.Released}</p>
                                                <p class="fs-6">Genre: ${detail.Genre}</p>
                                                <p class="fs-6">Director: ${detail.Director}</p>
                                                <p class="fs-6">Actors: ${detail.Actors}</p>
                                                <p class="fs-6">Plot: ${detail.Plot}</p>
                                            </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        document.body.appendChild(info);
                    },
                    error: function(detail) {
                        console.log(detail);
                    }
                });
            });
        },
        error: function(result) {
            console.log(result);
        }
    });
});