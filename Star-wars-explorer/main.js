
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
        console.warn(error.message);
        return null;

    }
}

const getCharacters = async () => {
    const characters = [];
    let url = 'https://swapi.dev/api/people/';

    try {
        while (url) {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch characters');
            }
            const data = await response.json();

            // Fetch and process details for each character concurrently
            await Promise.all(data.results.map(async (character) => {
                const homeworldData = await getHomeworld(character.homeworld);
                character.homeworld_name = homeworldData ? homeworldData.name : 'Unknown';

                character.starships_names = [];
                await Promise.all(character.starships.map(async (starshipUrl) => {
                    const starshipData = await getStarShip(starshipUrl);
                    if (starshipData) {
                        character.starships_names.push(starshipData.name);
                    }
                }));

                characters.push(character);
            }));

            url = data.next; // Move to the next page, if available
        }
    } catch (error) {
        console.error('Error fetching characters:', error);
    }

    return characters;
};


const getHomeworld = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch homeworld from ${url}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error fetching homeworld:`, error);
        return null;
    }
};

const getStarShip = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch Starship from ${url}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error fetching Starship:`, error);
        return null;
    }
};



const renderCard = (listElement, character, isSearched = false) => {


    const li = document.createElement('li');

    const img = document.createElement('img');
    img.src = characterImage(character.url.split('/')[5]);
    img.alt = character.name;
    img.classList.add('character-image');

    const pName = document.createElement('p');
    pName.textContent = `Name: ${character.name}`;

    const pHeight = document.createElement('p');
    pHeight.textContent = `Height: ${character.height}`;

    const pBirth = document.createElement('p');
    pBirth.textContent = `Birth Year: ${character.birth_year}`;

    const pGender = document.createElement('p');
    pGender.textContent = `Gender: ${character.gender.toUpperCase()}`;

    const pPlanet = document.createElement('p');
    pPlanet.textContent = `Planet: ${character.homeworld_name}`;

    const pStarship = document.createElement('p');
    pStarship.textContent = `Starships: ${character.starships_names}`

    // adding button for more info. 
    const moreInfoButton = document.createElement('button')
    moreInfoButton.textContent = `Click here for more info`
    moreInfoButton.id = ('more-info-button')

    pHeight.classList.toggle('hidden')
    pBirth.classList.toggle('hidden')
    pGender.classList.toggle('hidden')

    moreInfoButton.addEventListener('click', () => {
        pHeight.classList.toggle('hidden')
        pBirth.classList.toggle('hidden')
        pGender.classList.toggle('hidden')

    })

    const deleteButton = document.createElement('button')
    deleteButton.setAttribute('class', 'delete-btn')
    deleteButton.textContent = 'Delete this Card'


    li.append(img, pName, pPlanet, pStarship, deleteButton);
    // a  seperate li for more info
    li.append(moreInfoButton, pGender, pHeight, pBirth)
    listElement.appendChild(li);
}

// Function to render fetched characters to the page
const renderChar = (chars) => {
    const listElement = document.getElementById("default-data-list");

    listElement.innerHTML = '';

    const RandomizeButton = document.createElement('button')
    RandomizeButton.textContent = `Learn about a random Star Wars Character`
    RandomizeButton.id = ('random-button')

    RandomizeButton.addEventListener('click', async () => {
        const randomCharacter = await getRandomStarWarsChar();
        if (randomCharacter) {
            renderCard(listElement, randomCharacter);
        }

    });

    listElement.append(RandomizeButton);


    for (let i = 0; i < 3 && i < chars.length; i++) {
        renderCard(listElement, chars[i]);
    }
}

export const handleDeletePalette = (event) => {
    if (!event.target.matches(".delete-btn")) {
        return;
    }

    const currentPaletteLI = event.target.closest("li");
    currentPaletteLI.remove();
};

// Function to initiate character fetching and rendering
const displayCharacters = async () => {
    try {
        const characters = await getCharacters();
        renderChar(characters);
    } catch (error) {
        console.error('Failed to fetch and render characters:', error);
    }
};


const randomStarWarsId = () => {
    // made this function because there are 83 characters (IDs) within the API/
    return Math.floor(Math.random() * 83) + 1;
}

const getRandomStarWarsChar = async () => {
    // fetches the characters from the starwars API but grabbing any random character from 0 to 83 
    const randomId = randomStarWarsId();
    const characterUrl = `https://swapi.dev/api/people/${randomId}/`;

    try {
        const response = await fetch(characterUrl);
        if (!response.ok) {
            throw new Error('Cannot fetch random ID from API');
        }
        const characterData = await response.json();

        if (characterData.homeworld) {
            const homeworldData = await getHomeworld(characterData.homeworld);
            characterData.homeworld_name = homeworldData.name;
        } else {
            characterData.homeworld_name = 'Unknown';
        }

        // Fetch starships
        characterData.starships_names = [];
        if (characterData.starships.length > 0) {
            for (let starshipUrl of characterData.starships) {
                const starshipData = await getStarShip(starshipUrl);
                if (starshipData) {
                    characterData.starships_names.push(starshipData.name);
                }
            }
        } else {
            characterData.starships_names.push('None');
        }
        console.log(characterData);
        return characterData;
    } catch (error) {
        console.warn(error.message);
        return null;
    }
}

const searchForCharacter = async (e) => {
    e.preventDefault();

    const form = e.target;
    const characterName = form.querySelector('#search-input').value;

    if (!characterName) {
        console.error('Please enter a character name');
        return;
    }

    try {
        const allCharacters = await getCharacters();

        const matchedCharacters = allCharacters.filter(character =>
            character.name.toLowerCase().includes(characterName.toLowerCase())
        );

        if (matchedCharacters.length > 0) {
            const listElement = document.getElementById('search-results-list');
            listElement.innerHTML = ''

            // Render each matched character
            matchedCharacters.forEach(async character => {
                const homeworldData = await getHomeworld(character.homeworld);
                character.homeworld_name = homeworldData ? homeworldData.name : 'Unknown';

                character.starships_names = [];
                for (let starshipUrl of character.starships) {
                    const starshipData = await getStarShip(starshipUrl);
                    if (starshipData) {
                        character.starships_names.push(starshipData.name);
                    }
                }


                renderCard(listElement, character, true);
            });
        } else {
            console.error(`No characters found with name '${characterName}'`);
        }
    } catch (error) {
        console.error('Error fetching characters:', error);
    }

    form.reset();
};


const main = async () => {
    const images = await getStarWarsInfo()
    console.log("https://swapi.dev/api/people/")
    console.log(images)
    displayCharacters();
    const form = document.querySelector('#search-form');
    form.addEventListener('submit', searchForCharacter);
    document.querySelector('#default-data-list').addEventListener('click', handleDeletePalette);
    document.querySelector('#search-results-list').addEventListener('click', handleDeletePalette);
}

main()