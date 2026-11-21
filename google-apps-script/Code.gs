/**
 * The Fire Wala – Website lead receiver (Google Apps Script)
 *
 * Setup (one time, ~5 minutes):
 * 1. Open the Google Sheet "TFW Website Leads (thefirewala.in)".
 * 2. Extensions → Apps Script. Delete any code there and paste this whole file.
 * 3. Click Deploy → New deployment → type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Authorize when asked, then copy the "Web app URL" (ends with /exec).
 * 5. Put that URL in client/script.js → SHEET_WEBAPP_URL.
 *
 * Every form submission becomes one new row in the first sheet tab.
 */

const MAX_LEN = 200;

function clean_(v) {
  if (v === undefined || v === null) return "";
  let s = String(v).trim().slice(0, MAX_LEN);
  // Stop spreadsheet formula injection (=, +, -, @ at the start of a cell)
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Hidden honeypot field: bots fill it, humans don't
    if (data.website) {
      return json_({ success: true });
    }

    const phone = String(data.phone || "").replace(/\D/g, "").slice(-10);
    if (!clean_(data.client_name) || !/^[6-9]\d{9}$/.test(phone)) {
      return json_({ success: false, message: "Name and a valid 10-digit phone are required." });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([
      new Date(),
      clean_(data.client_name),
      "'" + phone,
      clean_(data.email),
      clean_(data.company_name),
      clean_(data.service_type),
      clean_(data.extinguisher_quantity),
      clean_(data.form_id),
      clean_(data.page),
      "", "", "", "New"
    ]);

    return json_({ success: true });
  } catch (err) {
    return json_({ success: false, message: "Server error" });
  }
}

function doGet() {
  return json_({ ok: true, service: "TFW website leads" });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
