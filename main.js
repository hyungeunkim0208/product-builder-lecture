const imageInput = document.getElementById('image-input');
const previewImage = document.getElementById('preview-image');
const uploadArea = document.getElementById('upload-area');
const loading = document.getElementById('loading');
const resultArea = document.getElementById('result-area');
const labelContainer = document.getElementById('label-container');
const restartBtn = document.getElementById('restart-btn');
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

const tabUpload = document.getElementById('tab-upload');
const tabWebcam = document.getElementById('tab-webcam');
const uploadSection = document.getElementById('upload-section');
const webcamSection = document.getElementById('webcam-section');
const webcamStartBtn = document.getElementById('webcam-start-btn');
const webcamContainer = document.getElementById('webcam-container');

const URL = "https://teachablemachine.withgoogle.com/models/CkLRrk1yA/";
let model, maxPredictions, webcam, animationId;

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

// Tab Switching Logic
tabUpload.addEventListener('click', () => {
    tabUpload.classList.add('active');
    tabWebcam.classList.remove('active');
    uploadSection.style.display = 'block';
    webcamSection.style.display = 'none';
    stopWebcam();
});

tabWebcam.addEventListener('click', () => {
    tabWebcam.classList.add('active');
    tabUpload.classList.remove('active');
    webcamSection.style.display = 'block';
    uploadSection.style.display = 'none';
    resultArea.style.display = 'none';
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
    if (file) {
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
});

// Webcam Logic
webcamStartBtn.addEventListener('click', async () => {
    webcamStartBtn.style.display = 'none';
    loading.style.display = 'block';
    
    await initModel();
    
    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup();
    await webcam.play();
    
    loading.style.display = 'none';
    resultArea.style.display = 'block';
    webcamContainer.appendChild(webcam.canvas);
    
    animationId = window.requestAnimationFrame(webcamLoop);
});

async function webcamLoop() {
    webcam.update();
    await predict(webcam.canvas);
    animationId = window.requestAnimationFrame(webcamLoop);
}

function stopWebcam() {
    if (webcam) {
        webcam.stop();
        webcamContainer.innerHTML = '';
        webcam = null;
        if (animationId) window.cancelAnimationFrame(animationId);
        webcamStartBtn.style.display = 'block';
    }
}

// Predict Function (shared between upload and webcam)
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
