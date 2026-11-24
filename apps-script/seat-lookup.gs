/**
 * 座位查詢 API(Google Apps Script,綁定在座位試算表)
 *
 * 試算表第一個工作表,第 1 列為標題,依標題名稱讀取:
 *   姓名、桌號(必要);座位、備註(選填)
 * 親友可另列一筆,姓名填「男方大舅公」「女方大舅公」這類稱呼。
 *
 * 部署:
 *   1. 試算表 → 擴充功能 → Apps Script,貼上本檔內容
 *   2. 部署 → 新增部署作業 → 類型「網頁應用程式」
 *      執行身分:我;存取權:所有人
 *   3. 複製「網頁應用程式網址」(結尾 /exec),貼到 js/seat.js 的 apiUrl
 *   4. 之後改程式要「管理部署作業 → 編輯 → 新版本」,網址才不會變
 */
function doGet(e) {
  var p = (e && e.parameter) || {};
  var cb = p.callback;
  var out;

  if (cb && !/^[A-Za-z0-9_$.]+$/.test(cb)) {
    return ContentService.createTextOutput('invalid callback');
  }

  try {
    out = lookup_(String(p.name || ''));
  } catch (err) {
    out = { success: false, message: '系統忙碌中，請稍後再試' };
  }

  var json = JSON.stringify(out);
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function normalize_(s) {
  return String(s == null ? '' : s).replace(/\s+/g, '').toLowerCase();
}

function lookup_(name) {
  var key = normalize_(name);
  if (!key) return { success: false, message: '請輸入姓名' };

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var rows = sheet.getDataRange().getDisplayValues();

  // 依標題找欄位,欄位順序可任意調整
  var head = rows[0].map(normalize_);
  var cName = head.indexOf('姓名');
  var cTable = head.indexOf('桌號');
  var cSeat = head.indexOf('座位');
  var cNote = head.indexOf('備註');
  if (cName < 0 || cTable < 0) return { success: false, message: '系統設定錯誤' };

  for (var i = 1; i < rows.length; i++) {
    if (normalize_(rows[i][cName]) === key) {
      return {
        success: true,
        data: {
          name: rows[i][cName],
          table: rows[i][cTable],
          seat: cSeat >= 0 ? rows[i][cSeat] : '',
          note: cNote >= 0 ? rows[i][cNote] : ''
        }
      };
    }
  }
  return { success: false, message: '查無此姓名，請重新輸入' };
}
