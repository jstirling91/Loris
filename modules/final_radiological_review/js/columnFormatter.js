!function(e){function a(t){if(r[t])return r[t].exports;var n=r[t]={exports:{},id:t,loaded:!1};return e[t].call(n.exports,n,n.exports,a),n.loaded=!0,n.exports}var r={};return a.m=e,a.c=r,a.p="",a(0)}([function(e,a){"use strict";function r(e,a,r,t){if(loris.hiddenHeaders.indexOf(e)>-1)return null;var n={};t.forEach(function(e,a){n[e]=r[a]},this);var i,l,s,c,o;if("PSCID"===e)return i=loris.BaseURL+"/final_radiological_review/final_radiological_review/?identifier="+n.CommentID,React.createElement("td",null,React.createElement("a",{href:i},a));if("Review Done"===e)return l="No","yes"!==n["Review Done"]&&"Yes"!==n["Review Done"]||(l="Yes"),React.createElement("td",null,l);if("SAS"===e){switch(n.SAS){case"0":c="None";break;case"1":c="Minimal";break;case"2":c="Mild";break;case"3":c="Moderate";break;case"4":c="Marked";break;default:c="Not Answered"}return React.createElement("td",null,c)}if("PVS"===e){switch(n.PVS){case"0":o="None";break;case"1":o="Minimal";break;case"2":o="Mild";break;case"3":o="Moderate";break;case"4":o="Marked";break;default:o="Not Answered"}return React.createElement("td",null,o)}return"Finalized"===e?(s="No","yes"!==n.Finalized&&"Yes"!==n.Finalized||(s="Yes"),React.createElement("td",null,s)):"T1 Inserted"===e&&"Yes"===n["T1 Inserted"]?(i=loris.BaseURL+"/imaging_browser/viewSession/?sessionID="+n.SessionID,React.createElement("td",null,React.createElement("a",{href:i},a))):React.createElement("td",null,a)}Object.defineProperty(a,"__esModule",{value:!0}),window.formatColumn=r,a.default=r}]);
//# sourceMappingURL=columnFormatter.js.map
