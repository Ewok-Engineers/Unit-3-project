const characterImage = (characterId) => `https://starwars-visualguide.com/assets/img/characters/${characterId}.jpg`;

export const getStarWarsInfo = async () => {
    try {
        const url = 'https://swapi.dev/api/';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to get Star Wars info!');
        }

        const data = await response.json();
        console.log('data:', data);
    } catch (error) {
        console.warn(error.message);
        return null;
    }
};

export const getCharacters = async () => {
    const characters = [];
    let url = 'https://swapi.dev/api/people/';

    try {
        while (url) {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch characters');
            }
            const data = await response.json();

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

            url = data.next;
        }
    } catch (error) {
        console.error('Error fetching characters:', error);
    }

    return characters;
};

export const getHomeworld = async (url) => {
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

export const getStarShip = async (url) => {
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

export const getRandomStarWarsChar = async () => {
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
};

const randomStarWarsId = () => {
    return Math.floor(Math.random() * 83) + 1;
};
