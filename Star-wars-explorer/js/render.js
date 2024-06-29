// render.js

import { getHomeworld, getStarShip, getRandomStarWarsChar } from './fetch.js';
import { saveToLocalStorage, getFromLocalStorage } from './storage.js';

export const renderCard = (listElement, character, isSearched = false) => {
    const li = document.createElement('li');
    li.classList.add('grid-item');

    const img = document.createElement('img');
    img.src = `https://starwars-visualguide.com/assets/img/characters/${character.url.split('/')[5]}.jpg`;
    img.alt = character.name;
    img.classList.add('character-image');

    const pName = document.createElement('p');
    pName.textContent = `Name: ${character.name}`;

    const pPlanet = document.createElement('p');
    pPlanet.textContent = `Planet: ${character.homeworld_name}`;

    const pStarship = document.createElement('p');
    pStarship.textContent = `Starships: ${character.starships_names.join(', ')}`;

    const moreInfoButton = document.createElement('button');
    moreInfoButton.textContent = `Click here for more info`;
    moreInfoButton.classList.add('more-info-button');

    moreInfoButton.addEventListener('click', () => {
        li.classList.toggle('show-details');
    });

    const pHeight = document.createElement('p');
    pHeight.textContent = `Height: ${character.height}`;
    pHeight.classList.add('hidden');

    const pBirth = document.createElement('p');
    pBirth.textContent = `Birth Year: ${character.birth_year}`;
    pBirth.classList.add('hidden');

    const pGender = document.createElement('p');
    pGender.textContent = `Gender: ${character.gender.toUpperCase()}`;
    pGender.classList.add('hidden');

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'delete-btn');
    deleteButton.textContent = 'Delete this Card';

    deleteButton.addEventListener('click', handleDeletePalette);

    li.append(img, pName, pPlanet, pStarship, moreInfoButton, deleteButton, pHeight, pBirth, pGender);
    listElement.appendChild(li);

    moreInfoButton.addEventListener('click', () => {
        pHeight.classList.toggle('hidden');
        pBirth.classList.toggle('hidden');
        pGender.classList.toggle('hidden');
    });
};

export const renderChar = (chars) => {
    const listElement = document.getElementById("default-data-list");
    listElement.innerHTML = '';

    const RandomizeButton = document.createElement('button');
    RandomizeButton.textContent = `Learn about a random Star Wars Character`;
    RandomizeButton.id = 'random-button';

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
};

export const handleDeletePalette = (event) => {
    if (!event.target.matches('.delete-btn')) {
        return;
    }

    const currentPaletteLI = event.target.closest('li');
    currentPaletteLI.remove();

    const storedCharacters = JSON.parse(localStorage.getItem('searchedCharacters')) || [];
    const updatedCharacters = storedCharacters.filter(character => {
        return character.name !== currentPaletteLI.querySelector('p').textContent.split(': ')[1];
    });
    localStorage.setItem('searchedCharacters', JSON.stringify(updatedCharacters));
};
