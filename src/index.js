// Step 1: Display All Ramens
const displayRamens = () => {
  fetch('http://localhost:3000/ramens')
    .then(response => response.json())
    .then(ramens => {
      ramens.forEach(addRamenToMenu);
    })
    .catch(error => console.error('Error fetching ramens:', error));
};

const addRamenToMenu = (ramen) => {
  const menu = document.getElementById('ramen-menu');
  const img = document.createElement('img');
  img.src = ramen.image;

  // Attach click event to show ramen details
  img.addEventListener('click', () => handleClick(ramen));
  menu.appendChild(img);
};

// Step 2: Show Ramen Details on Click
const handleClick = (ramen) => {
  const detail = document.getElementById('ramen-detail');
  detail.querySelector('.name').textContent = ramen.name;
  detail.querySelector('.restaurant').textContent = ramen.restaurant;
  detail.querySelector('img').src = ramen.image;
  document.getElementById('rating-display').textContent = ramen.rating;
  document.getElementById('comment-display').textContent = ramen.comment;

  // Populate edit form with current ramen details
  document.getElementById('new-rating').value = ramen.rating;
  document.getElementById('new-comment').value = ramen.comment;

  // Attach event listener to update ramen details
  addEditListener(ramen);
  const deleteButton = document.getElementById("delete");
  deleteButton.onclick = () => deleteRamen(ramen);
};

// Step 3: Add New Ramen (Form Handling)
const addSubmitListener = () => {
  const form = document.getElementById('new-ramen');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const newRamen = {
      name: form.name.value,
      restaurant: form.restaurant.value,
      image: form.image.value,
      rating: form['new-ramen-rating'].value,
      comment: form['new-ramen-comment'].value,
    };

    // Add new ramen to the menu and persist it
    addRamenToMenu(newRamen);
    persistRamen(newRamen);
    form.reset();
  });
};

// Extra Step: Persist New Ramen with POST Request
const persistRamen = (ramen) => {
  fetch('http://localhost:3000/ramens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ramen),
  });
};

// Advanced Step: Add Edit Listener and Persist Changes (PATCH)
const addEditListener = (ramen) => {
  const editForm = document.getElementById('edit-ramen');

  const newForm = editForm.cloneNode(true);
  editForm.parentNode.replaceChild(newForm, editForm);

  newForm.addEventListener("submit", (event) => {
    event.preventDefault();


    const updatedRamen = {
      rating: editForm['new-rating'].value,
      comment: editForm['new-comment'].value,
    };

    // Update the details on the page
    document.getElementById('rating-display').textContent = updatedRamen.rating;
    document.getElementById('comment-display').textContent = updatedRamen.comment;

    // Persist changes with PATCH request
    fetch(`http://localhost:3000/ramens/${ramen.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRamen),
    });
  });
};

// Extra Step: Add Delete Functionality
const deleteRamen = (ramen) => {
  fetch(`http://localhost:3000/ramens/${ramen.id}`, {
    method: 'DELETE',
  }).then(() => {
    const menu = document.getElementById('ramen-menu');
    menu.innerHTML = ''; // Clear the menu
    displayRamens(); // Reload the ramen list
  });
};

// Main Function to Initialize Logic
const main = () => {
  displayRamens();        // Load all ramen images
  addSubmitListener();    // Listen for new ramen submission
};

main();  // Run the main function

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  addEditListener,
  deleteRamen,
  main,
};
