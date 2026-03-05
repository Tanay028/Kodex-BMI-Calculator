const metricBtn = document.getElementById('metricBtn');
const imperialBtn = document.getElementById('imperialBtn');
const metricHeightDiv = document.getElementById('metricHeight');
const imperialHeightDiv = document.getElementById('imperialHeight');
const weightLabel = document.getElementById('weightLabel');

let currentUnit = 'metric';

// Toggle Units
metricBtn.addEventListener('click', () => {
    currentUnit = 'metric';
    metricBtn.classList.add('active');
    imperialBtn.classList.remove('active');
    metricHeightDiv.classList.remove('hidden');
    imperialHeightDiv.classList.add('hidden');
    weightLabel.innerText = "Weight (kg)";
});

imperialBtn.addEventListener('click', () => {
    currentUnit = 'imperial';
    imperialBtn.classList.add('active');
    metricBtn.classList.remove('active');
    metricHeightDiv.classList.add('hidden');
    imperialHeightDiv.classList.remove('hidden');
    weightLabel.innerText = "Weight (lbs)";
});

// BMI Calculation Logic
document.getElementById('calculateBtn').addEventListener('click', () => {
    const name = document.getElementById('userName').value || "Guest";
    const weight = parseFloat(document.getElementById('weight').value);
    let bmi = 0;

    if (currentUnit === 'metric') {
        const heightCm = parseFloat(document.getElementById('heightCm').value);
        if (!weight || !heightCm || weight <= 0 || heightCm <= 0) return alert("Please enter valid positive values");
        
        const heightM = heightCm / 100;
        bmi = weight / (heightM * heightM);
    } else {
        const ft = parseFloat(document.getElementById('heightFt').value) || 0;
        const inch = parseFloat(document.getElementById('heightIn').value) || 0;
        if (!weight || (ft === 0 && inch === 0)) return alert("Please enter valid values");
        
        const totalInches = (ft * 12) + inch;
        bmi = (weight / (totalInches * totalInches)) * 703;
    }

    displayResult(bmi.toFixed(2), name);
});

function displayResult(bmi, name) {
    const resultCard = document.getElementById('resultCard');
    const bmiValEl = document.getElementById('bmiValue');
    const bmiCatEl = document.getElementById('bmiCategory');
    
    let category = "";
    let color = "";

    if (bmi < 18.5) {
        category = "Underweight";
        color = "var(--underweight)";
    } else if (bmi < 25) {
        category = "Normal weight";
        color = "var(--normal)";
    } else if (bmi < 30) {
        category = "Overweight";
        color = "var(--overweight)";
    } else {
        category = "Obese";
        color = "var(--obese)";
    }

    resultCard.classList.remove('hidden');
    resultCard.style.backgroundColor = color;
    bmiValEl.innerText = bmi;
    bmiCatEl.innerText = category;

    saveToHistory(name, bmi, category);
}

function saveToHistory(name, bmi, category) {
    const history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
    history.push({ name, bmi, category, date: new Date().toLocaleDateString() });
    localStorage.setItem('bmiHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
    historyList.innerHTML = history.reverse().map(item => `
        <li>
            <span><strong>${item.name}</strong> (${item.date})</span>
            <span>${item.bmi} - <small>${item.category}</small></span>
        </li>
    `).join('');
}

// Reset Function
document.getElementById('resetBtn').addEventListener('click', () => {
    localStorage.removeItem('bmiHistory');
    location.reload();
});

// Load history on start
renderHistory();