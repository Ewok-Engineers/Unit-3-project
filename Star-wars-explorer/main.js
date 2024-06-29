import './style.css';
import { getCharacters, getRandomStarWarsChar, getHomeworld, getStarWarsInfo, getStarShip} from './js/fetch.js';
import { renderCard, renderChar, handleDeletePalette } from './js/render.js';
import { getFromLocalStorage, saveToLocalStorage } from './js/storage.js';

const displayCharacters = async () => {
    try {
        const characters = await getCharacters();
        renderChar(characters);
    } catch (error) {
        console.error('Failed to fetch and render characters:', error);
    }
};

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
            listElement.innerHTML = '';

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

                const storedCharacters = getFromLocalStorage('searchedCharacters') || [];
                storedCharacters.push(character);
                saveToLocalStorage('searchedCharacters', storedCharacters);
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
    displayCharacters();

    const storedCharacters = JSON.parse(localStorage.getItem('searchedCharacters')) || [];
    const listElement = document.getElementById('search-results-list');
    storedCharacters.forEach(character => {
        renderCard(listElement, character, true);
    });

    const form = document.querySelector('#search-form');
    form.addEventListener('submit', searchForCharacter);
    document.querySelector('#default-data-list').addEventListener('click', handleDeletePalette);
    document.querySelector('#search-results-list').addEventListener('click', handleDeletePalette);
};

main();
