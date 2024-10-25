const goToSearchBtn = document.getElementById("go-to-search")

goToSearchBtn.addEventListener("click", function() {
    window.location.href = "index.html"
})

document.addEventListener("DOMContentLoaded", () => {
    const watchlistContainer = document.getElementById('watchlist-container')
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || []
    
    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = "<p>Your Watchlist is empty.</p>"
    } else {
        watchlistContainer.innerHTML = watchlist.map(movie => `
            <div class="watchlist-item">
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title} movie poster" />
                <h2>${movie.Title} <i>(${movie.Year})</i></h2>
                <span>${movie.imdbRating}</span>
                <span>${movie.Runtime} | ${movie.Genre}</span>
                <p>${movie.Plot}</p>
            </div>
        `).join('')
    }
})