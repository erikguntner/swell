class UI {
    constructor() {
        const forecastsList = document.getElementById('forecastsList');
    }

    // Combine Star Ratings
    createStarRating(solidRating, fadedRating) {
        let rating = [];
        // Loop the solid rating on a single forecast object.
        for (var i = 0; i < solidRating; i++) {
            rating.push('<img src="http://cdnimages.magicseaweed.com/star_filled.png" />');
        }
        // Loop the faded rating on a single forecast object.
        for (var i = 0; i < fadedRating; i++) {
            rating.push('<img src="http://cdnimages.magicseaweed.com/star_empty.png" />');
        }
        let finalRating = rating.join(" ");
        return finalRating;
    }

    windSpeedColor(windSpeed) {
        if(windSpeed.firstChild.textContent > 9) {
            windSpeed.nextElementSibling.style.backgroundColor = "#e67e22";
        } if(windSpeed.firstChild.textContent > 15) {
            windSpeed.nextElementSibling.style.backgroundColor = "#e74c3c";
        } 
    }


}
