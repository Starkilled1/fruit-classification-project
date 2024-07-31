// Event listener for the "Identify Fruit" button click
document.getElementById('identify-fruit').addEventListener('click', () => {
    const fileInput = document.getElementById('image-upload');
    const resultDiv = document.getElementById('result');
  
    // Check if a file is selected
    if (fileInput.files.length === 0) {
        resultDiv.textContent = 'Please select an image file.';
        resultDiv.style.display = 'block';
        return;
    }
  
    // This section is a wey of formmating the data in a way that can be send in the POST method
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    // Use D3 to make the POST request, Once the Post is done the response from the app.py gives the prediction or error 
    // any of those cases will be displayed and modify the index html so we can see the response on the page
    d3.json('/predict', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.prediction) {
            resultDiv.textContent = `The predicted fruit is: ${response.prediction}`;
        } else {
            resultDiv.textContent = `Error: ${response.error}`;
        }
        resultDiv.style.display = 'block';
    }).catch(error => {
        resultDiv.textContent = `Error: ${error.message}`;
        resultDiv.style.display = 'block';
    });
});

// Handle file input change to display the image
// If anything on the image-upload changes the new fruit image is going to be displayed on the page in this section
document.getElementById('image-upload').addEventListener('change', (event) => {

    // This section creates an object reader to read the file and also a variable file getting the file
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
        // This part Changes the html so the image upload to the page is displayed and also the name of the file
        document.getElementById('fruit-image').src = e.target.result;
        document.getElementById('file-name').textContent = file.name;
    };

    // if there is a file the reader reads the file information and the triggers the onload section
    if (file) {
        reader.readAsDataURL(file);
    } else {
        document.getElementById('fruit-image').src = "";
        document.getElementById('file-name').textContent = "No file selected";
    }
});





  