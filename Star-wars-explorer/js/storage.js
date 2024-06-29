// Function to save data to local storage
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving to local storage: ${error}`);
    }
};

// Function to retrieve data from local storage
export const getFromLocalStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error retrieving from local storage: ${error}`);
        return null;
    }
};



// Function to delete data from local storage
export const deleteFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error deleting from local storage: ${error}`);
    }
};
