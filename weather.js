class Weather {
    constructor() {
        this.apiKey = '3afc1865369e6622';
        // this.city = city;
        // this.state = state;
    }

    //Fetch weather from API
    async getWeather(state, city) {
        const response = await fetch(`http://api.wunderground.com/api/${this.apiKey}/conditions/q/${state}/${city}.json`)
    
        const responseData = await response.json();

        return responseData.current_observation;        
    }

    // Change weather location
    changeLocation(city, state) {
        this.city = city;
        this.state = state;
    }
}