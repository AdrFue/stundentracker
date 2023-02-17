function date2week(date) {
  let onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}

// Autofill current week and year in form
document.getElementById('newWeek').value = date2week(new Date());
document.getElementById('newYear').value = new Date().getFullYear();

// calculate remaining hours
let calcShHours = chart.data.datasets[0].data
let calcIsHours = chart.data.datasets[1].data
// remove all null values in calcIsHours
calcIsHours = calcIsHours.filter(function (el) {
  return el != null;
});

let remainingWeeks = calcShHours.length - calcIsHours.length;
let shWorkLoad = calcShHours.reduce((a, b) => a + b, 0);
let isWorkLoad = calcIsHours.reduce((a, b) => a + b, 0);
let remainingWorkLoad = shWorkLoad - isWorkLoad;
let curWorkLoad = Math.round(isWorkLoad / calcIsHours.length * 100) / 100;
let futureWorkLoad = Math.round(remainingWorkLoad / remainingWeeks * 100) / 100;

// calculate remaining hours without study weeks
let calcShHoursRemaining = calcShHours.slice(calcIsHours.length);
let calcHoursRemainingNoStudy = calcShHoursRemaining.filter(function (el) {
  return el != 8;
});
let calcHoursRemainingStudy = calcShHoursRemaining.filter(function (el) {
  return el == 8;
});
let calcHoursRemainingStudySum = calcHoursRemainingStudy.reduce((a, b) => a + b, 0);
let remainingWorkLoadNoStudy = remainingWorkLoad - calcHoursRemainingStudySum;
let remainingWorkLoadNoStudyAvg = Math.round(remainingWorkLoadNoStudy / calcHoursRemainingNoStudy.length * 100) / 100;

document.getElementById('avgHours').innerHTML = curWorkLoad;
document.getElementById('avgHoursLeft').innerHTML = futureWorkLoad;
document.getElementById('avgHoursLeftNonVW').innerHTML = remainingWorkLoadNoStudyAvg;