document.addEventListener("DOMContentLoaded", (event) => {
    let contentList = document.getElementById('contentList');
    let fetchUrl = 'https://dog.ceo/api/breeds/list/all';
    let dogBreeds = [];
    const breedInput = document.getElementById('input');

    function populateBreedList() {
        fetch(fetchUrl)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                dogBreeds = Object.keys(data.message); 

               
                dogBreeds.forEach(breedName => {
                    let breedItem = document.createElement('li');
                    let breedLink = document.createElement('a');
                    breedLink.href = "javascript:;";
                    breedLink.textContent = breedName;
                    breedItem.id = breedName.toLowerCase();
                    contentList.appendChild(breedItem); 
                    breedItem.appendChild(breedLink);

                    breedLink.addEventListener('click', function (e) {
                        e.preventDefault();
                        displayImageModal(breedName);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    populateBreedList();

    function fetchRandomDogImage(breedName) {
        const imageUrl = `https://dog.ceo/api/breed/${breedName}/images/random`;

        return fetch(imageUrl)
        .then(res => res.json())
        .then(data => {
            return data.message;
        })
        .catch(error => {
            console.error(`Error fetching image for ${breedName}:`, error);
            return null;
        });
    }

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

            breedInput.focus();
        });

        fetchRandomDogImage(breedName)
            .then(imageUrl => {
                if (imageUrl) {
                    modalImage.src = imageUrl;
                    modal.style.display = 'block';
    
                    closeModalButton.focus();
                } else {
                    alert('Failed to load image.');
                }
            });
        document.body.appendChild(modal);
    }
    
    function handleFilter() {
        const searchText = breedInput.value.toLowerCase();

        const breedItems = Array.from(contentList.children);
        breedItems.forEach(breedItem => {
            const breedName = breedItem.querySelector('a').textContent.toLowerCase();

            if (breedName.includes(searchText)) {
                breedItem.style.display = 'block';
            } else {
                breedItem.style.display = 'none';
            }
        });
    }

    breedInput.addEventListener('input', handleFilter);

    breedInput.addEventListener('mouseover', mouseOver);
    breedInput.addEventListener('mouseout', mouseOut);

    function mouseOver() {
        breedInput.classList.add('hover');
    }
    function mouseOut() {
        breedInput.classList.remove('hover');
    }

    const toTop = document.getElementById('backToTop');
    toTop.addEventListener('click', handleScroll);
    function handleScroll() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

