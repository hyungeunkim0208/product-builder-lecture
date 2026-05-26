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
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// Handle Image Upload
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            previewImage.src = event.target.result;
            previewImage.style.display = 'block';
            document.querySelector('.upload-label').style.display = 'none';
            
            loading.style.display = 'block';
            resultArea.style.display = 'none';
            
            if (!model) await init();
            predict();
        };
        reader.readAsDataURL(file);
    }
});

// Predict the image
async function predict() {
    const prediction = await model.predict(previewImage);
    loading.style.display = 'none';
    resultArea.style.display = 'block';
    labelContainer.innerHTML = '';

    // Sort predictions by probability
    prediction.sort((a, b) => b.probability - a.probability);
    
    const topResult = prediction[0].className;
    document.getElementById('result-title').textContent = `You look like a ${topResult}!`;

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const barWrapper = document.createElement('div');
        barWrapper.innerHTML = `
            <div class="bar-label-text">${classPrediction}</div>
            <div class="bar-container">
                <div class="bar ${classPrediction}-bar" style="width: ${probability}%"></div>
                <div class="bar-label">${probability}%</div>
            </div>
        `;
        labelContainer.appendChild(barWrapper);
    }
}

restartBtn.addEventListener('click', () => {
    location.reload();
});
