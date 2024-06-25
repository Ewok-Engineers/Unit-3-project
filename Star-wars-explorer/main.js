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

const images = await getStarWarsInfo()
console.log("https://swapi.dev/api/people/")

console.log(images)

// Function to fetch character data from SWAPI
const getCharacter = async (id) => {
  try {
    const response = await fetch(`https://swapi.dev/api/people/${id}/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch character with ID ${id}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching character with ID ${id}:`, error);
    return null;
  }
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


// Function to fetch multiple characters
const getCharacters = async () => {
  try {
    const characterIds = [1, 4, 10,]; // IDs of characters to fetch
    const characters = [];

    for (let id of characterIds) {
      const character = await getCharacter(id);
      if (character) {
        // characters.push(character);

        const homeworldData = await getHomeworld(character.homeworld);
                character.homeworld_name = homeworldData.name; // Add homeworld name to character object


          character.starships_names = [];
            for (let starshipUrl of character.starships) {
              const starshipData = await getStarShip(starshipUrl);
              if (starshipData) {
                character.starships_names.push(starshipData.name);
                  }
                }
        
              characters.push(character);
      } else {
        console.error(`Failed to fetch character with ID ${id}`);
      }
    }

    return characters;
  } catch (error) {
    console.error('Error fetching characters:', error);
    return [];
  }
};

// Function to render fetched characters to the page
const renderChar = (chars) => {
  const listElement = document.getElementById("default-data-list");

  listElement.innerHTML = ''; // Clear existing content

  chars.forEach(character => {
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
    pGender.textContent = `Gender: ${character.gender}`;

    const pPlanet = document.createElement('p');
    pPlanet.textContent = `Planet: ${character.homeworld_name}`;

    const pStarship = document.createElement('p');
    pStarship.textContent = `Starships:${character.starships_names}`


    const deleteButton = document.createElement('button')
    deleteButton.setAttribute('id', 'delete-btn')
    deleteButton.textContent = 'Delete this Card'

    li.append(img, pName, pHeight, pBirth, pGender, pPlanet, pStarship, deleteButton);
    listElement.appendChild(li);
  });
};
export const handleDeletePalette = (event) => {
  if (!event.target.matches("#delete-btn")) {
      return;
  }

  const currentPaletteLI = event.target.closest("li");
  currentPaletteLI.remove();
};

document.querySelector('#default-data-list').addEventListener('click', handleDeletePalette);



// Function to initiate character fetching and rendering
const displayCharacters = async () => {
  try {
    const characters = await getCharacters();
    renderChar(characters);
  } catch (error) {
    console.error('Failed to fetch and render characters:', error);
  }
};

// Initiate the display of characters
displayCharacters();


