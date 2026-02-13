// OpenWeatherMap API Configuration
const API_KEY = '8ac5c4d57ba6a47d2197b3d11f71101d'; // Replace with your actual API key
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const errorMessage = document.getElementById('error-message');
const loadingIndicator = document.getElementById('loading-indicator');
const weatherContent = document.getElementById('weather-content');

const cityNameEl = document.getElementById('city-name');
const dateEl = document.getElementById('current-date');
const tempEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('weather-description');
const iconEl = document.getElementById('weather-icon');

// Set current date
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateEl.innerText = new Date().toLocaleDateString('en-US', options);

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (validateInput(city)) {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (validateInput(city)) {
            fetchWeather(city);
        }
    }
});

// Input Validation
function validateInput(city) {
    if (!city) {
        showError('Please enter a city name.');
        return false;
    }
    return true;
}

// Fetch Weather Data (Async/Await)
async function fetchWeather(city) {
    showLoading();
    errorMessage.classList.add('hidden'); // Clear previous errors

    try {
        const url = `${API_BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        
        updateUI(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        if (error.response && error.response.status === 404) {
            showError('City not found. Please check the spelling.');
        } else if (error.response && error.response.status === 401) {
             showError('Invalid API Key. Please check your configuration.');
        } else {
            showError('Something went wrong. Please try again later.');
        }
        // Hide weather content on error
        weatherContent.classList.add('hidden');
    } finally {
        hideLoading();
    }
}

// Update UI
function updateUI(data) {
    const { name, main, weather } = data;
    const { temp } = main;
    const { description, icon } = weather[0];

    cityNameEl.innerText = name;
    tempEl.innerText = `${Math.round(temp)}°C`;
    descriptionEl.innerText = description;
    
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    iconEl.src = iconUrl;
    iconEl.alt = description;
    iconEl.classList.remove('hidden');

    weatherContent.classList.remove('hidden');
}

// Loading State Management
function showLoading() {
    loadingIndicator.classList.remove('hidden');
    weatherContent.classList.add('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

// Error Handling
function showError(message) {
    errorMessage.innerText = message;
    errorMessage.classList.remove('hidden');
}

// Initial Load
fetchWeather('London');
