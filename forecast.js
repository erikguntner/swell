class Forecast {
    constructor() {
        this.apiKey = 'd4dd3bfe8a008a99719d342f0e683095';
        this.apiSecret = '5d4bb02569ab43cf3a45dd3b3f4dc080'; 
    }

    async getSpot(spotId) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const forecastResponse = await fetch(proxyUrl + `http://magicseaweed.com/api/${this.apiKey}/forecast/?spot_id=${spotId}`);
        const forecast = await forecastResponse.json();
        
        return {forecast};
    }
}