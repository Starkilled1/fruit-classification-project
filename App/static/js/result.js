document.getElementById('identify-fruit').addEventListener('click', () => {
  const image = document.getElementById('image-upload').files[0];
  if (!image) {
    alert('Please select an image first.');
    return;
  }

  const formData = new FormData();
  formData.append('file', image);

  fetch('/predict', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.className = 'alert alert-success mt-3';
    resultDiv.innerHTML = `The predicted class of the image is: <strong>${data.prediction}</strong>`;
  })
  .catch(error => {
    console.error('Error:', error);
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.className = 'alert alert-danger mt-3';
    resultDiv.innerHTML = `Error: ${error.message}`;
  });
});

const imageUpload = document.getElementById('image-upload');
const fruitImage = document.getElementById('fruit-image');
const fileName = document.getElementById('file-name');

imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    fruitImage.src = e.target.result;
    fileName.textContent = file.name;
  }

  if (file) {
    reader.readAsDataURL(file);
  } else {
    fruitImage.src = "";
    fileName.textContent = "No file selected";
  }
});


  