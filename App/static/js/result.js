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
  
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    // Use D3 to make the POST request
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
document.getElementById('image-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
        document.getElementById('fruit-image').src = e.target.result;
        document.getElementById('file-name').textContent = file.name;
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        document.getElementById('fruit-image').src = "";
        document.getElementById('file-name').textContent = "No file selected";
    }
});





  