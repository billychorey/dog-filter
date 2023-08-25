document.addEventListener("DOMContentLoaded", (event) => {
    let contentList = document.getElementById('contentList'); // Parent ul element
    let fetchUrl = 'https://dog.ceo/api/breeds/list/all';
    let dogBreeds = []; // Array to put all of the dog breeds in
    const breedInput = document.getElementById('input'); // Global

    // Function to fetch and populate the initial breed list
    function populateBreedList() {
        fetch(fetchUrl)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                dogBreeds = Object.keys(data.message); // Extract breed names as an array

                // Loop through the breed names
                dogBreeds.forEach(breedName => {
                    let breedItem = document.createElement('li'); // Create an li for the list
                    let breedLink = document.createElement('a'); // Something to click and users can tab to
                    breedLink.href = "javascript:;";
                    breedLink.textContent = breedName;
                    breedItem.id = breedName.toLowerCase(); // Set the ID to lowercase to match later
                    contentList.appendChild(breedItem); 
                    breedItem.appendChild(breedLink);

                    breedLink.addEventListener('click', function (e) {
                        e.preventDefault();
                        displayImageModal(breedName); // New function below to show image
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    populateBreedList();

    // Function to fetch a random dog image for a breed and set it in the img element
    // It won't show until we run the display function
    function fetchRandomDogImage(breedName) {
        const imageUrl = `https://dog.ceo/api/breed/${breedName}/images/random`;

        return fetch(imageUrl)
        .then(res => res.json())
        .then(data => {
            return data.message; // Return the image URL
        })
        .catch(error => {
            console.error(`Error fetching image for ${breedName}:`, error);
            return null;
        });
    }

    // Function to display the image in a modal
    function displayImageModal(breedName) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = 
            `<div class="modal-content">
                <a href="javascript:;" class="close-modal" tabindex="0">Close</a>
                <img src="" alt="${breedName}" id="modal-image">
            </div>`
        ;
    
        const closeModalButton = modal.querySelector('.close-modal');
        const modalImage = modal.querySelector('#modal-image');
    
        closeModalButton.addEventListener('click', () => {
            modal.style.display = 'none';

            // return focus to the imput after closing modal
            breedInput.focus();
        });

        // Here's where the image comes in
        fetchRandomDogImage(breedName)
            .then(imageUrl => {
                if (imageUrl) {
                    modalImage.src = imageUrl;
                    modal.style.display = 'block';
    
                    // Set focus to the close button when the modal appears
                    closeModalButton.focus();
                } else {
                    alert('Failed to load image.');
                }
            });
        document.body.appendChild(modal);
    }
    
    // Event handler for filtering as the user types
    function handleFilter() {
        const searchText = breedInput.value.toLowerCase();

        // Loop through the breed names and filter breeds based on the searchText.
        const breedItems = Array.from(contentList.children); // Make an array
        breedItems.forEach(breedItem => {
            const breedName = breedItem.querySelector('a').textContent.toLowerCase();

            if (breedName.includes(searchText)) {
                breedItem.style.display = 'block'; // Show the breed if it includes the input string.
            } else {
                breedItem.style.display = 'none'; // Hide the breed.
            }
        });
    }

    // Add event listener to the input field for "input" event
    breedInput.addEventListener('input', handleFilter);

    // Add another event listener type for giggles
    breedInput.addEventListener('mouseover', mouseOver);
    breedInput.addEventListener('mouseout', mouseOut);
    function mouseOver() {
        breedInput.classList.add('hover');
    }
    function mouseOut() {
        breedInput.classList.remove('hover');
    }

    // Another click event listener
    const toTop = document.getElementById('backToTop');
    toTop.addEventListener('click', handleScroll);
    function handleScroll() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});
