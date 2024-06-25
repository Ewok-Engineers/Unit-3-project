import './style.css'

const characterImage = (characterId) => `https://starwars-visualguide.com/assets/img/characters/${characterId}.jpg`


export const getStarWarsInfo = async () => {
    try {
        // Define the URL for fetching fantasy books
        const url = 'https://swapi.dev/api/';


        // Send the fetch request and await the response
        const response = await fetch(url);

        // Check if the response is not OK (status code outside the 200-299 range)
        if (!response.ok) {
            // Throw an error with a specific message if the response is not OK
            throw new Error('Failed to get Star Wars info!');
        }

        const data = await response.json()
        console.log('data:', data);

    } catch (error) {
        // Log a warning message to the console if an error occurs
        console.warn(error.message);

        // Resolve the promise to null in case of an error

        return null; // async makes this function return a promise 

    }
}
