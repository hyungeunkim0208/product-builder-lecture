const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers');

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
