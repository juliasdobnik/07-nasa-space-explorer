// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Find the button and gallery elements
const getImagesButton = document.querySelector('button');
const gallery = document.getElementById('gallery');

// NASA API key (use 'DEMO_KEY' for demo purposes)
const NASA_API_KEY = 'd7XyeUKSwzXVX0QJjebPRmx494zUQ9WW0vDGsFYa';

// Function to fetch images from NASA's APOD API
async function fetchNasaImages(startDate, endDate) {
  // Build the API URL with the selected date range
  const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  // Fetch data from NASA
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Function to show images in the gallery
function showImages(images) {
  // Clear the gallery first
  gallery.innerHTML = '';

  // If there are no images, show a message
  if (!images || images.length === 0) {
    gallery.innerHTML = '<p>No images found for this date range.</p>';
    return;
  }

  // Loop through each image and add it to the gallery
  images.forEach(image => {
    let itemDiv = document.createElement('div');
    itemDiv.className = 'apod-image';
    // Only show images (not videos)
    if (image.media_type === 'image') {
      itemDiv.innerHTML = `
        <img src="${image.url}" alt="${image.title}" />
        <p><strong>${image.title}</strong></p>
        <p>${image.date}</p>
      `;
      // Add click event to open modal
      itemDiv.addEventListener('click', () => {
        openModal(image);
      });
      gallery.appendChild(itemDiv);
    }
  });
}

// Function to create and show a modal window
function openModal(image) {
  // Create modal background
  const modalBg = document.createElement('div');
  modalBg.className = 'modal-bg';
  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'modal';
  let modalContent = `
    <span class="modal-close">&times;</span>
    <h2>${image.title}</h2>
    <p><strong>Date:</strong> ${image.date}</p>
    <p>${image.explanation}</p>
  `;
  if (image.media_type === 'image') {
    modalContent = `
      <span class="modal-close">&times;</span>
      <img src="${image.hdurl || image.url}" alt="${image.title}" class="modal-img" />
      <h2>${image.title}</h2>
      <p><strong>Date:</strong> ${image.date}</p>
      <p>${image.explanation}</p>
    `;
  }
  modal.innerHTML = modalContent;
  modalBg.appendChild(modal);
  document.body.appendChild(modalBg);

  // Close modal on click of close button or background
  modalBg.addEventListener('click', (e) => {
    if (e.target === modalBg || e.target.classList.contains('modal-close')) {
      document.body.removeChild(modalBg);
    }
  });
}

// Fun space facts array
const spaceFacts = [
  "A day on Venus is longer than a year on Venus!",
  "Neutron stars can spin at a rate of 600 rotations per second.",
  "There are more trees on Earth than stars in the Milky Way.",
  "The footprints on the Moon will be there for millions of years.",
  "One million Earths could fit inside the Sun.",
  "A spoonful of a neutron star weighs about a billion tons.",
  "Jupiter has 95 known moons!",
  "Space is completely silent—there's no air for sound to travel.",
  "The hottest planet in our solar system is Venus.",
  "Saturn could float in water because it’s mostly gas!"
];

// Pick a random fact
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

// Create and insert the fact section above the gallery
const factSection = document.createElement('section');
factSection.className = 'space-fact';
factSection.innerHTML = `<strong>Did you Know?</strong> ${randomFact}`;
const container = document.querySelector('.container');
container.insertBefore(factSection, gallery);

// When the button is clicked, fetch and show images
getImagesButton.addEventListener('click', async () => {
  // Get the selected dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Show a NASA-styled loading spinner before fetching
  gallery.innerHTML = `
    <div class="nasa-spinner-container">
      <div class="nasa-spinner"></div>
      <p class="nasa-loading-text">Loading space photos…</p>
    </div>
  `;

  // Fetch images from NASA
  const images = await fetchNasaImages(startDate, endDate);

  // Show the images in the gallery
  showImages(images);
});
