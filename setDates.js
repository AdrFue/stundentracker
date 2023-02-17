let studyweeks = [];
let allweeks = [];

function sd(req) {
  let set; // for removing duplicates
  let qry = 'INSERT INTO wochenstunden (w_jahr, w_woche, w_soll_stunden) VALUES ';

  // first all weeks are calculated, then the study weeks are calculated
  // because in study weeks there will be less work
  // based on the (amount of) study weeks the hours will be higher or lower

  // All weeks of the degree
  allweeks = [];
  getAllWeeks(req.start, req.ende);
  // remove duplicates: a date is picked, but only each week is needed
  set  = new Set(allweeks.map(JSON.stringify)); 
  allweeks = Array.from(set).map(JSON.parse);

  // Study weeks of the degree
  studyweeks = [];
  getStudyWeeks(req.vb1, req.ve1, req.fb1, req.fe1);
  getStudyWeeks(req.vb2, req.ve2, req.fb2, req.fe2);
  getStudyWeeks(req.vb3, req.ve3, req.fb3, req.fe3);
  getStudyWeeks(req.vb4, req.ve4, req.fb4, req.fe4);
  // remove duplicates: a date is picked, but only each week is needed
  set  = new Set(studyweeks.map(JSON.stringify)); 
  studyweeks = Array.from(set).map(JSON.parse);

  let nonStudyWorkHours = getWorkHours(req);

  // create the insert query
  // if the week is in the study weeks, the hours are lower
  let curHour;
  for (let i = 0; i < allweeks.length; i++) { 
    if (isArrInArr(studyweeks, allweeks[i])) curHour = req.tagesstunden
    else curHour = nonStudyWorkHours;
    qry += '(' + allweeks[i][1] + ', ' + allweeks[i][0] + ', ' + curHour + '), ';
  }
  qry = qry.slice(0, -2);
  qry += ';';

  return qry;
};

function getAllWeeks(start, ende) {

  let s = new Date(start);
  let e = new Date(ende);
  while (s < e) {
    allweeks.push([]);
    allweeks[allweeks.length-1].push(date2week(s));
    allweeks[allweeks.length-1].push(s.getFullYear());

    s.setDate(s.getDate() + 1);
  }
}

function getStudyWeeks(vb, ve, fb, fe) {
  
    let end = new Date(ve);
    let startVac = new Date(fb);
    let endVac = new Date(fe);
    let cur = new Date(vb);
    // Loop until the end date is reached
    while (cur <= end) {

      // Skip, when holiday or weekend
      if (cur >= startVac && cur <= endVac || cur.getDay() === 0 || cur.getDay() === 6) {
        cur.setDate(cur.getDate() + 1);
        continue;
      }

      studyweeks.push([]);
      studyweeks[studyweeks.length-1].push(date2week(cur));
      studyweeks[studyweeks.length-1].push(cur.getFullYear());
      cur.setDate(cur.getDate() + 1);
    }
}

function getWorkHours(req) {
  let awAnz = allweeks.length; // all weeks
  let swAnz = studyweeks.length; // study weeks
  let wwAnz = awAnz - swAnz; // work weeks or non-study weeks
  let gesH = req.wochenstunden * awAnz; // total work hours
  let studyH = req.tagesstunden * swAnz; // total study hours
  let workWs = Math.round((gesH - studyH) / wwAnz * 100) / 100; // total non-study work hours per week
  return workWs;
}

function date2week(date) {
  let onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}

function isArrInArr(arr, item) {
  let item_as_string = JSON.stringify(item);
  let contains = arr.some(function(elem){
    return JSON.stringify(elem) === item_as_string;
  });
  return contains
}

module.exports = {
  sd
};