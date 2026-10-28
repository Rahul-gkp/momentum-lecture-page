// ---- Momentum lecture page ----
// Shared "Videos to Arrange" counts are stored in Script Properties,
// so every teacher who opens the page sees the same numbers.

var TEACHERS = [
  'Sudhanshu Sir', 'Subodh Sir', 'Aditya Sir', 'Durgesh Sir', 'Nitish Sir',
  'Ashwani Sir', 'CP Sir', 'Pankaj Sir', 'Vikash Sir'
];

// Starting values, used until a teacher's count is changed for the first time.
var DEFAULTS = {
  'Sudhanshu Sir': 4, 'Subodh Sir': 7, 'Aditya Sir': 13, 'Durgesh Sir': 3,
  'Nitish Sir': 6, 'Ashwani Sir': 10, 'CP Sir': 7, 'Pankaj Sir': 11, 'Vikash Sir': 0
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Momentum Lecture Entry')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getCounts() {
  var saved = PropertiesService.getScriptProperties().getProperties();
  var out = {};
  TEACHERS.forEach(function (t) {
    var v = saved['count:' + t];
    out[t] = (v !== undefined) ? parseInt(v, 10) : (DEFAULTS[t] || 0);
  });
  return out;
}

// Adds delta (can be negative) to one teacher's count and returns the new value.
function changeCount(teacher, delta) {
  if (TEACHERS.indexOf(teacher) < 0) throw new Error('Unknown teacher');
  delta = Math.max(-100, Math.min(100, parseInt(delta, 10) || 0));
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var next = Math.max(0, getCounts()[teacher] + delta);
    PropertiesService.getScriptProperties().setProperty('count:' + teacher, String(next));
    return next;
  } finally {
    lock.releaseLock();
  }
}
