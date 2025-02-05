const API_KEY = "WSTlTe6A5EBSG2bciIy5nawCbCvStcPjU8pa3Und"; 
const API_URL = "https://api.nasa.gov/planetary/apod";


const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const imageContainer = document.getElementById("current-image-container");
const apodImage = document.getElementById("apod-image");
const apodTitle = document.getElementById("apod-title");
const apodDescription = document.getElementById("apod-description");
const searchHistoryList = document.getElementById("search-history");


async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    await getImageOfTheDay(currentDate, false);
}


async function getImageOfTheDay(date, saveToHistory = true) {
    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}&date=${date}`);
        const data = await response.json();

        if (data.url) {
            apodImage.src = data.url;
            apodTitle.textContent = data.title;
            apodDescription.textContent = data.explanation;
        }

        if (saveToHistory) {
            saveSearch(date);
            addSearchToHistory(date);
        }
    } catch (error) {
        console.error("Error fetching NASA data:", error);
        apodTitle.textContent = "Failed to load image. Try again later.";
    }
}


function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}


function addSearchToHistory(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    searchHistoryList.innerHTML = "";
    searches.forEach((searchDate) => {
        const listItem = document.createElement("li");
        listItem.textContent = searchDate;
        listItem.addEventListener("click", () => getImageOfTheDay(searchDate, false));
        searchHistoryList.appendChild(listItem);
    });
}


searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedDate = searchInput.value;
    if (selectedDate) {
        getImageOfTheDay(selectedDate);
    }
});


window.addEventListener("load", () => {
    getCurrentImageOfTheDay();
    addSearchToHistory();
});
