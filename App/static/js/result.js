document.getElementById('identify-fruit').addEventListener('click', async () => {
  const fileInput = document.getElementById('image-upload');
  const resultDiv = document.getElementById('result');
  
  if (fileInput.files.length === 0) {
      resultDiv.textContent = 'Please select an image file.';
      resultDiv.style.display = 'block';
      return;
  }
  
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
      const response = await fetch('/predict', {
          method: 'POST',
          body: formData
      });

      const data = await response.json();
      if (response.ok) {
          resultDiv.textContent = `The predicted fruit is: ${data.prediction}`;
      } else {
          resultDiv.textContent = `Error: ${data.error}`;
      }
  } catch (error) {
      resultDiv.textContent = `Error: ${error.message}`;
  }

  resultDiv.style.display = 'block';
});

// Code to handle file input and display the image
document.getElementById('image-upload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = (e) => {
      document.getElementById('fruit-image').src = e.target.result;
      document.getElementById('file-name').textContent = file.name;
  }

  if (file) {
      reader.readAsDataURL(file);
  } else {
      document.getElementById('fruit-image').src = "";
      document.getElementById('file-name').textContent = "No file selected";
  }
});



  