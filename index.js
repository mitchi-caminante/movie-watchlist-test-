// OMDb API: https://www.omdbapi.com/
// API key: apikey=184d348a
let movieId
let movies = []

const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const movieCardDisp = document.getElementById("movie-card-disp")
const goToWatchlistBtn = document.getElementById("go-to-watchlist")

// event listeners
searchBtn.addEventListener("click", handleSearchClick)

searchInput.addEventListener("keydown", function(e) {
    if (e.key === 'Enter') {
        handleSearchClick(e)
    }
})

goToWatchlistBtn.addEventListener("click", function() {
    window.location.href = "watchlist.html"
})


async function handleSearchClick(e) {
    e.preventDefault()
    
    const movieName = searchInput.value.trim()
    if (!movieName) {
        movieCardDisp.innerHTML = `<p>Oops! You need to enter a movie name!</p>`
        return
    }
    
    searchInput.value = ""
    movieCardDisp.innerHTML = "loading...."
    // First API call to search for the movies
    const res = await fetch(`https://www.omdbapi.com/?apikey=184d348a&s=${movieName}&type=movie`)
    const data = await res.json()
    
    if (data.Response === "False") {
        movieCardDisp.innerHTML = `<p>Uh-oh! No movies found for "${movieName}". Please try a different search.</p>`
        return
    }
    
    // Get the array of movies from the search results
    movies = data.Search
    
    // Second API call using the IMDb ID the first call received
    const fetchMovieDetails = movies.map(async (movie) => {
        const res = await fetch(`https://www.omdbapi.com/?apikey=184d348a&i=${movie.imdbID}`)
        return res.json()
    })
    
    // Wait for all of the movie details to be fetched
    const movieDetails = await Promise.all(fetchMovieDetails)
    
    renderMovieCards(movieDetails)
}

function renderMovieCards(movies) {
    movieCardDisp.innerHTML = movies.map(movie => `
        <ul class="movie-card-container" id="movie-card-container">
            <li class="movie-card" id="movie-card">
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title} movie poster" />
                <h2>${movie.Title} <i>(${movie.Year})</i></h2>
                <span>${movie.imdbRating}</span>
                <span>${movie.Runtime} | ${movie.Genre}</span>
                <span>Director: ${movie.Director} | Writer: ${movie.Writer} | Language: ${movie.Language}</span>
                <p>${movie.Plot}</p>
                <button id="add-to-watchlist-btn" data-imdb-id="${movie.imdbID}">+ Add to Watchlist</button>
                <span class="watchlist-message" style="display: none;">Added to Watchlist</span>
            </li>
        </ul>
    `).join('')
    
    addEventListenersToWatchlistBtns()
}

//function to add eventlisteners to add to watchlist buttons to make the code a little cleaner
function addEventListenersToWatchlistBtns() {
    document.querySelectorAll('.add-to-watchlist-btn').forEach(button => {
        button.addEventListener("click", function() {
            const imdbID = this.getAttribute('data-imdb-id')
            addToWatchlist(imdbID, this)
        })
    })
}

function addToWatchlist(imdbID, buttonElement) {
    const movieDetails = movies.find(movie => movie.imdbID === imdbID)
    
    if (movieDetails) {
        // check if it's already in the watchlist
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []
        
        if (!watchlist.some(movie => movie.imdbID === imdbID)) {
            watchlist.push(movieDetails)
            localStorage.setItem('watchlist', JSON.stringify(watchlist))
            
            buttonElement.style.display = 'none'
            const messageSpan = buttonElement.nextElementSibling
            messageSpan.style.display = 'inline'
        } else {
            buttonElement.style.display = 'none'
            const messageSpan = buttonElement.nextElementSibling
            messageSpan.style.display = 'inline'
            messageSpan.textContent = 'Already in Watchlist'
        }
    }
}
