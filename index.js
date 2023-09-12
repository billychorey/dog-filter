document.addEventListener("DOMContentLoaded", (event) => {
    let contentList = document.getElementById('contentList');
    let infoContainer = document.getElementById('more-info');
    let fetchUrl = 'https://dog.ceo/api/breeds/list/all';
    let fetchDogInfo = 'https://dogapi.dog/api/v2/breeds';
    let dogFacts = []
    let dogBreeds = [];
    const breedInput = document.getElementById('input');

    
    function populateBreedList() {
        fetch(fetchUrl)
        .then(res => res.json())
        .then(data => {
            dogBreeds = Object.keys(data.message); 
            
            dogBreeds.forEach(dogBreed => {
                let breedItem = document.createElement('li');
                let breedLink = document.createElement('a');
                breedLink.href = "javascript:;";
                breedLink.textContent = dogBreed;
                breedItem.id = dogBreed.toLowerCase();

                contentList.appendChild(breedItem); 
                breedItem.appendChild(breedLink);

                breedLink.addEventListener('click', handleImageDisplay);

                function handleImageDisplay(e) {
                    e.preventDefault();
                    displayImageModal(dogBreed);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
    populateBreedList();


    function displayImageModal(dogBreed) {
        const modal = document.createElement('div');
        let url;
        modal.classList.add('modal');
    
        modal.innerHTML = 
            `<div class="modal-content">
                <a href="javascript:;" class="close-modal" tabindex="0">Close</a>
                <h3>${dogBreed}</h3>
                <img src="" alt="${dogBreed}" id="modal-image">
            </div>`;
    
        const modalImage = modal.querySelector('#modal-image');
        
        fetchRandomDogImage(dogBreed);
        function fetchRandomDogImage(dogBreed) {
            const fetchImageUrl = `https://dog.ceo/api/breed/${dogBreed}/images/random`;
    
            fetch(fetchImageUrl)
            .then(res => res.json())
            .then(data => {
                url = data.message;
                modalImage.src = url;
            })
            .catch(error => {
                console.error(`Error fetching image for ${dogBreed}:`, error);
                return null;
            });
        }
    
    
        const closeModalButton = modal.querySelector('.close-modal');
        closeModalButton.addEventListener('click', () => {
            modal.style.display = 'none';
            breedInput.focus();
        });
    
        document.body.appendChild(modal);
    }  

    breedInput.addEventListener('input', handleFilter);   
    function handleFilter() {
        const searchText = breedInput.value.toLowerCase();

        const breedItems = Array.from(contentList.children);
        breedItems.forEach(breedItem => {
            const dogBreed = breedItem.querySelector('a').textContent.toLowerCase();

            if (dogBreed.includes(searchText)) {
                breedItem.style.display = 'block';
            } else {
                breedItem.style.display = 'none';
            }
        });
    }


    breedInput.addEventListener('mouseover', mouseOver);
    breedInput.addEventListener('mouseout', mouseOut);
    function mouseOver() {
        breedInput.classList.add('hover');
    }
    function mouseOut() {
        breedInput.classList.remove('hover');
    }


    function dogInformation() {
        fetch(fetchDogInfo)
        .then(res => res.json())
        .then(data => {
           
            dogFacts = data.data;

            const breedSelect = document.createElement('select');
            const placeholderOption = document.createElement('option');
            placeholderOption.textContent = 'Select a breed for more information.';
            breedSelect.appendChild(placeholderOption);

            let dogBreed;
            let description;
            let hypoallergenic;

            dogFacts.forEach(dogFact => {
                dogBreed = dogFact.attributes.name;
                description = dogFact.attributes.description;
                hypoallergenic = dogFact.attributes.hypoallergenic;

                const option = document.createElement('option');
                option.value = dogBreed;
                option.textContent = dogBreed;
                breedSelect.appendChild(option);

            });

            infoContainer.appendChild(breedSelect);

            breedSelect.addEventListener('change', handleInfoSelect);

            function handleInfoSelect() {
                const selectedOption = breedSelect.options[breedSelect.selectedIndex];
                const selectedBreed = selectedOption.value;
            
                const selectedDogFact = dogFacts.find(dogFact => dogFact.attributes.name === selectedBreed);
            
                if (selectedDogFact) {
                    dogBreed = selectedDogFact.attributes.name;
                    description = selectedDogFact.attributes.description;
                    hypoallergenic = selectedDogFact.attributes.hypoallergenic;
            
                    let hypoallergenicText;
            
                    if (hypoallergenic) {
                        hypoallergenicText = 'is';
                    } else {
                        hypoallergenicText = 'is not';
                    }
            
                    let additionalInformation = document.createElement('div');
                    additionalInformation.innerHTML =
                        `
                             <a href="javascript:;" id="close-info" tabindex="0">Close</a>
                             <p>${description}</p>
                             <p>The ${dogBreed} ${hypoallergenicText} hypoallergenic.</p>
                         `;
            
                    infoContainer.innerHTML = '';
            
                    infoContainer.appendChild(additionalInformation);
                    
                    let closeButton = document.getElementById('close-info');
                    closeButton.addEventListener('click', () => {
                        infoContainer.removeChild(additionalInformation);
                        infoContainer.appendChild(breedSelect);
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
    dogInformation();

    const toTop = document.getElementById('backToTop');
    toTop.addEventListener('click', handleScroll);
    function handleScroll() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

