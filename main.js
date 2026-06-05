const imageInput = document.getElementById('image-input');
const previewImage = document.getElementById('preview-image');
const uploadArea = document.getElementById('upload-area');
const loading = document.getElementById('loading');
const resultArea = document.getElementById('result-area');
const labelContainer = document.getElementById('label-container');
const restartBtn = document.getElementById('restart-btn');
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

const URL = "https://teachablemachine.withgoogle.com/models/CkLRrk1yA/";
let model, maxPredictions;

// Theme Toggle Logic
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeBtn.textContent = 'Light Mode';
}

themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    let theme = 'light';
    if (body.classList.contains('dark-mode')) {
        theme = 'dark';
        themeBtn.textContent = 'Light Mode';
    } else {
        themeBtn.textContent = 'Dark Mode';
    }
    localStorage.setItem('theme', theme);
});

// Load the image model
async function initModel() {
    if (model) return;
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// Handle Image Upload
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
});

// Drag and Drop Logic
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => uploadArea.classList.add('highlight'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('highlight'), false);
});

uploadArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    handleFile(file);
}, false);

async function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            previewImage.src = event.target.result;
            previewImage.style.display = 'block';
            document.querySelector('.upload-label').style.display = 'none';
            
            loading.style.display = 'block';
            resultArea.style.display = 'none';
            
            await initModel();
            predict(previewImage);
        };
        reader.readAsDataURL(file);
    }
}

// Predict Function
async function predict(inputElement) {
    const prediction = await model.predict(inputElement);
    labelContainer.innerHTML = '';

    // Sort predictions by probability
    const sortedPredictions = [...prediction].sort((a, b) => b.probability - a.probability);
    
    const topResult = sortedPredictions[0].className;
    document.getElementById('result-title').textContent = `You look like a ${topResult}!`;

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const barWrapper = document.createElement('div');
        barWrapper.classList.add('prediction-item');
        barWrapper.innerHTML = `
            <div class="bar-label-text">${classPrediction}</div>
            <div class="bar-container">
                <div class="bar ${classPrediction}-bar" style="width: ${probability}%"</div>
                <div class="bar-label">${probability}%</div>
            </div>
        `;
        labelContainer.appendChild(barWrapper);
    }
    loading.style.display = 'none';
    resultArea.style.display = 'block';
}

restartBtn.addEventListener('click', () => {
    location.reload();
});