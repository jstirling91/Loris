/*global self: false, Blob: false */
self.addEventListener('message', function (e) {
    "use strict";
    var i = 0,
        data = e.data.data, //$("#data").dataTable().fnGetData(),
        headers = e.data.headers, //$("#data thead th"),
        identifiers = e.data.identifiers,
        row = [],
        content = '', //new Blob(),
        escapeQuote = function (val) {
            if (val && typeof val == "string") {
                // Only need to escape string values
                return val.replace(/"/g, '""');
            } else if (val && typeof val === "object" && val.type === 'a') {
                return val.props.children;
            }
            return val;
        },
        fs,
        contentBlob;

    row = (identifiers) ? ["Identifiers"] : [];
    row = row.concat(headers);
    row = row.map(function (val) {
        if (val) {
            return val.replace('"', '""');
        }
        return val;
    });
    content += '"' + row.join('","') + '"' + "\r\n";
    for (i = 0; i < data.length; i += 1) {
        row = (identifiers) ? [identifiers[i]] : [];
        row = row.concat(
                data[i].map(escapeQuote)
        );
        content += '"' + row.join('","') + '"' + "\r\n";
    }
    contentBlob = new Blob([content], { type: "text/csv" });
    //fs = saveAs(contentBlob, "data.csv");
    //fs = new FileSaverSync(contentBlob, "data.csv");
    self.postMessage({ cmd: 'SaveCSV', message: contentBlob});

});
