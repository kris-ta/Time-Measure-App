// Отримуємо DOM елементи
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const presetSelect = document.querySelector("#preset");
const optionSelect = document.querySelector("#options");
const unitsSelect = document.querySelector("#units");
const calculateButton = document.querySelector(".calculate-button");
const result = document.querySelector(".calculation-result");

startDateInput.addEventListener("change", handleStartDateChange);
endDateInput.addEventListener("change", handleEndDateChange);
calculateButton.addEventListener("click", handleCalculate);
presetSelect.addEventListener("change", handlePresetChange);

displayHistoryTable();

// Обмежуємо можливості вибору інпутів
function handleStartDateChange() {
  endDateInput.min = startDateInput.value;
}
function handleEndDateChange() {
  startDateInput.max = endDateInput.value;
}

// Обробник події для кнопки
function handleCalculate() {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  const timeUnits = unitsSelect.value;
  const daysOption = optionSelect.value;

  // перевірка чи були введені дати та чи є вони коректні
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    alert("Помилка: Введіть коректні дати.");
    return;
  }

  const timeDiff = calculateDateDifference(
    startDate,
    endDate,
    timeUnits,
    daysOption
  );

  result.textContent = timeDiff;

  // Отримуємо останні 10 результатів з локального сховища
  addToLocalStorageHistory(startDate, endDate, timeDiff);
  displayHistoryTable();
}

// функція на зміну пресетів міс або тиждень
function handlePresetChange() {
  const selectedPreset = presetSelect.value;

  const startDate = startDateInput.value
    ? new Date(startDateInput.value)
    : new Date();
  const endDate = new Date(startDate);

  if (selectedPreset === "week") {
    endDate.setDate(startDate.getDate() + 7);
  } else if (selectedPreset === "month") {
    endDate.setMonth(startDate.getMonth() + 1);
  }

  const startDateString = formatDate(startDate);
  const endDateString = formatDate(endDate);

  startDateInput.value = startDateString;
  endDateInput.value = endDateString;

  handleStartDateChange();
  handleEndDateChange();
}

function addToLocalStorageHistory(startDate, endDate, timeDiff) {
  let resultsHistory = JSON.parse(localStorage.getItem("results")) || [];

  // Додаємо поточний результат до історії результатів
  resultsHistory.unshift({
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    result: timeDiff,
  });

  if (resultsHistory.length >= 10) {
    // Обмежуємо кількість елементів до 10
    resultsHistory = resultsHistory.slice(0, 10);
  } else {
    return;
  }

  // Зберігаємо історію результатів в локальне сховище
  localStorage.setItem("results", JSON.stringify(resultsHistory));
}

// виведення 10 результатів в таблицю
function displayHistoryTable() {
  // Отримуємо останні 10 результатів з локального сховища
  const resultsHistory = JSON.parse(localStorage.getItem("results")) || [];

  // Отримуємо елемент таблиці з HTML
  const tableBody = document.querySelector("#results-history tbody");

  // Очищаємо таблицю перед додаванням нових даних
  tableBody.innerHTML = "";

  // Додаємо рядки таблиці з даними про кожен результат
  for (let item of resultsHistory) {
    const row = document.createElement("tr");
    const startDateCell = document.createElement("td");
    const endDateCell = document.createElement("td");
    const resultCell = document.createElement("td");

    startDateCell.textContent = item.startDate;
    endDateCell.textContent = item.endDate;
    resultCell.textContent = item.result;

    row.appendChild(startDateCell);
    row.appendChild(endDateCell);
    row.appendChild(resultCell);

    tableBody.appendChild(row);
  }
}

const msInADay = 1000 * 60 * 60 * 24;

function countDays(startDate, endDate, daysOption) {
  const diffInMs = Math.abs(endDate - startDate);
  const totalDays = Math.floor(diffInMs / msInADay);

  if (daysOption === "all") {
    return totalDays;
  }

  let days = 0;

  // проходжу по кожному дню між датами
  for (let i = 0; i < totalDays; i++) {
    // отримую поточну дату
    const currentDate = new Date(startDate.getTime() + i * msInADay);

    // перевіряю, чи є поточний день буднім або вихідним
    if (
      (currentDate.getDay() === 0 || currentDate.getDay() === 6) &&
      daysOption === "weekends"
    ) {
      days++;
    } else if (daysOption === "weekdays") {
      days++;
    }
  }

  return days;
}

function calculateDateDifference(startDate, endDate, timeUnits, daysOption) {
  const finalDiffInDays = countDays(startDate, endDate, daysOption);

  switch (timeUnits.toLowerCase()) {
    case "seconds":
      return `${finalDiffInDays * 24 * 60 * 60} ${timeUnits}`;
    case "minutes":
      return `${finalDiffInDays * 24 * 60} ${timeUnits}`;
    case "hours":
      return `${finalDiffInDays * 24} ${timeUnits}`;
    default:
      return `${finalDiffInDays} ${timeUnits}`;
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
