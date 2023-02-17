function ne(req) {
  return 'UPDATE wochenstunden ' +
    ' SET w_ist_stunden = ' + req.stunden + 
    ' WHERE w_jahr = ' + req.jahr + ' AND ' +
    ' w_woche = ' + req.woche + ';';
};

module.exports = {
  ne
};