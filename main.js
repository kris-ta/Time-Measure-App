// Отримуємо DOM елементи
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const presetSelect = document.querySelector("#preset");
const optionSelect = document.querySelector("#options");
const unitsSelect = document.querySelector("#units");
const calculateButton = document.querySelector(".calculate-button");
const result = document.querySelector(".calculation-result");

// startDateInput.addEventListener("change", handleStartDateChange);
// endDateInput.addEventListener("change", handleEndDateChange);
calculateButton.addEventListener("click", handleCalculate);

presetSelect.addEventListener("change", handlePresetChange);

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
}

// коли користувач вибирає дату в одному з інпутів, перевіряю, чи була вибрана дата в обох інпутах, чи є друга дата не меншою за першу. Якщо друга дата менша за першу - помилка, забороняю розрахунок, поки не буде введена правильна дата.

function handleStartDateChange() {
  const startDate = new Date(startDateInput.value);
  if (endDate && startDate > endDate) {
    alert("Помилка: друга дата повинна бути більшою або рівною першій даті.");
    endDateInput.value = "";
    endDate = null;
  }
}

function handleEndDateChange() {
  endDate = new Date(endDateInput.value);
  if (startDate && startDate > endDate) {
    alert("Помилка: друга дата повинна бути більшою або рівною першій даті.");
    endDateInput.value = "";
    endDate = null;
  }
}

// Обробник події для кнопки

function handleCalculate() {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  const timeUnits = unitsSelect.value;
  const daysOption = optionSelect.value;

  // перевірка чи були введені дати та чи є вони коректні

  if (!startDate || !endDate) {
    alert("Помилка: будь ласка, введіть обидві дати.");
    return;
  }

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    alert("Помилка: Введіть коректні дати.");
    return;
  }

  if (startDate > endDate) {
    alert("Помилка: друга дата повинна бути більшою або рівною першій даті.");
    return;
  }

  const timeDiff = calculateDateDifference(
    startDate,
    endDate,
    timeUnits,
    daysOption
  );

  result.textContent = timeDiff;
}

function calculateDateDifference(startDate, endDate, timeUnits, daysOption) {
  //  різниця між двома датами в мілісекундах
  const diffInMs = Math.abs(endDate - startDate);

  //  кількість днів з цієї різниці
  const totalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // лічильники будніх та вихідних днів
  let weekdays = 0;
  let weekends = 0;

  // проходжу по кожному дню між датами
  for (let i = 0; i < totalDays; i++) {
    // отримую поточну дату
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);

    // перевіряю, чи є поточний день буднім або вихідним

    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      weekends++;
    } else {
      weekdays++;
    }
  }

  let finalDiffInDays;

  if (daysOption === "weekdays") {
    finalDiffInDays = weekdays;
  } else if (daysOption === "weekends") {
    finalDiffInDays = weekends;
  } else {
    finalDiffInDays = totalDays;
  }

  switch (timeUnits.toLowerCase()) {
    case "seconds":
      return finalDiffInDays * 24 * 60 * 60;
    case "minutes":
      return finalDiffInDays * 24 * 60;
    case "hours":
      return finalDiffInDays * 24;
    default:
      return finalDiffInDays;
  }
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
