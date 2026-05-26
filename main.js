const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers');
const themeBtn = document.getElementById('theme-btn');
const body = document.body;

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

// Lotto Number Generation Logic
generateBtn.addEventListener('click', () => {
    numbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
        const circle = document.createElement('div');
        circle.classList.add('number');
        let color;
        if (number <= 10) {
            color = '#f4b22c'; // Yellow
        } else if (number <= 20) {
            color = '#3b79c3'; // Blue
        } else if (number <= 30) {
            color = '#e55c5c'; // Red
        } else if (number <= 40) {
            color = '#9b9b9b'; // Gray
        } else {
            color = '#4caf50'; // Green
        }
        circle.style.backgroundColor = color;
        circle.textContent = number;
        numbersContainer.appendChild(circle);
    });
});
