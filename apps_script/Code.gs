/** HACOLED Apps Script — giai đoạn 1.
 * Chỉ đọc từ bản Google Sheets chuyển đổi trực tiếp từ file Excel gốc do người dùng cung cấp.
 * KHÔNG tự kết nối các file Drive/Sheet khác và KHÔNG sửa sheet/công thức gốc.
 */
const HACOLED = Object.freeze({
  SOURCE_PROPERTY: 'HACOLED_SOURCE_SPREADSHEET_ID',
  SOURCE_SPREADSHEET_ID: '1fjU0OFK1pYMH7-66tbiHNPf4LZf4maHcpco52iMZMyI',
  CATALOG: 'DANH MUC',
  BOM: 'DINH MUC LINH KIEN',
  PRICING: 'TRA GIA',
  COMPONENTS: 'TINH LINH KIEN',
  MODE: Object.freeze({
    PARTS: 'linh-kien',
    RETAIL: 'khach-thuong',
    TENDER: 'du-an-thau',
    DEALER: 'dai-ly-doi-tac'
  })
});

/** BAT BUOC: Web App goi ham nay khi mo duong dan /exec hoac /dev.
 * Khong bam Run doGet de xem giao dien; dung Deploy > Test deployments.
 */
function doGet(e) {
  return taoGiaoDienHacoled_();
}

function taoGiaoDienHacoled_() {
  // Nhan dien ro file HTML nao bi thieu, thay vi hien trang trong.
  ['Index', 'Styles', 'Scripts'].forEach(function (name) {
    try { HtmlService.createHtmlOutputFromFile(name); }
    catch (err) { throw new Error('Thieu file HTML ' + name + '. Hay tao file ' + name + '.html trong cung du an Apps Script. Chi tai file len Drive la chua du. Chi tiet: ' + err.message); }
  });
  // Lay du lieu truoc khi trang duoc tra ve: tranh treo o trang thai 'Dang ket noi'.
  // Loi doc du lieu hien thi tren giao dien, khong che giau.
  const template = HtmlService.createTemplateFromFile('Index');
  let bootstrap;
  try {
    bootstrap = {ok: true, data: danhSachKhoiTao()};
  } catch (err) {
    bootstrap = {ok: false, error: (err && err.message) ? err.message : String(err)};
  }
  template.bootstrapJson = JSON.stringify(bootstrap)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
  return template.evaluate()
    .setTitle('HACOLED | He thong bao gia')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Chay ham nay trong Apps Script editor de kiem tra tat ca file + du lieu. */
function kiemTraWebApp() {
  const names = ['Index', 'Styles', 'Scripts'];
  const htmlFiles = names.map(function(name) {
    try { HtmlService.createHtmlOutputFromFile(name); return name + '.html: OK'; }
    catch (e) { return name + '.html: THIEU - ' + e.message; }
  });
  const view = taoGiaoDienHacoled_(); // Kiem tra co evaluate duoc template
  const initial = danhSachKhoiTao();
  return {
    doGet: typeof doGet === 'function',
    htmlFiles: htmlFiles,
    renderedHtmlLength: view.getContent().length,
    productCount: initial.products.length,
    brandCount: initial.brands.length,
    brands: initial.brands,
    sourceSpreadsheetId: sourceSpreadsheet_().getId(),
    note: 'Neu chay ham nay thanh cong, trien khai lai Web App bang New version va mo URL /exec.'
  };
}

function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

/** Chạy thủ công một lần sau khi chuyển đổi CHÍNH FILE GỐC sang Google Sheets. */
function caiDatNguonFileGoc(spreadsheetId) {
  if (typeof spreadsheetId !== 'string' || !/^[a-zA-Z0-9_-]{15,}$/.test(spreadsheetId.trim())) {
    throw new Error('Cần ID Google Sheet đã chuyển đổi từ đúng file Excel gốc.');
  }
  const ss = SpreadsheetApp.openById(spreadsheetId.trim());
  [HACOLED.CATALOG, HACOLED.BOM, HACOLED.PRICING, HACOLED.COMPONENTS].forEach(name => {
    if (!ss.getSheetByName(name)) throw new Error('File không có sheet bắt buộc: ' + name);
  });
  PropertiesService.getScriptProperties().setProperty(HACOLED.SOURCE_PROPERTY, ss.getId());
  return 'Đã kết nối đúng file gốc: ' + ss.getName();
}

function sourceSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty(HACOLED.SOURCE_PROPERTY) || HACOLED.SOURCE_SPREADSHEET_ID;
  if (!id) throw new Error('Chưa cài đặt nguồn. Cần chạy caiDatNguonFileGoc(ID) trước.');
  return SpreadsheetApp.openById(id);
}

function safeString_(x) { return x === null || x === undefined ? '' : String(x).trim(); }
function numeric_(x) {
  if (typeof x === 'number') return Number.isFinite(x) ? x : NaN;
  if (typeof x === 'string') {
    const normalized = x.trim().replace(/\s/g, '').replace(',', '.');
    if (/^-?\d+(?:\.\d+)?$/.test(normalized)) return Number(normalized);
  }
  return NaN;
}
function productKey_(brand, model) { return brand + '\u241f' + model; }

/** Đọc chính DANH MUC!J:P. Không thay tên/model, không đoán mã SKU. */
function danhMucSanPham() {
  const sheet = sourceSpreadsheet_().getSheetByName(HACOLED.CATALOG);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const vals = sheet.getRange(2, 10, lastRow - 1, 7).getValues();
  const result = [];
  vals.forEach((r, idx) => {
    const brand = safeString_(r[0]);
    const model = safeString_(r[1]);
    if (!brand || !model) return;
    result.push({
      key: productKey_(brand, model), brand, model,
      sourceRow: numeric_(r[2]), widthMm: numeric_(r[3]), heightMm: numeric_(r[4]),
      group: safeString_(r[5]), formulaReady: r[6] === true,
      catalogRow: idx + 2
    });
  });
  return result;
}

/** Đọc định mức đúng theo mã chọn chứa 'Hãng | model' ở cột A. */
function dinhMucLinhKien_() {
  const sh = sourceSpreadsheet_().getSheetByName(HACOLED.BOM);
  const last = sh.getLastRow();
  if (last < 6) return new Map();
  const data = sh.getRange(6, 1, last - 5, 14).getValues();
  const map = new Map();
  data.forEach(r => {
    const key = safeString_(r[0]);
    if (!key) return;
    map.set(key, {
      name: key,
      modulesPerPower: numeric_(r[6]), modulesPerCard: numeric_(r[7]),
      receiveCard: safeString_(r[8]), powerModel: safeString_(r[9]),
      status: safeString_(r[10]), notes: safeString_(r[12]), source: safeString_(r[13])
    });
  });
  return map;
}

function createBomKey_(p) {
  return p.brand + ' | ' + p.model.split(' | ').join(' | ');
}

function danhSachKhoiTao() {
  const products = danhMucSanPham();
  const ss = sourceSpreadsheet_();
  const sheetLink = name => ss.getUrl() + '#gid=' + ss.getSheetByName(name).getSheetId();
  return {
    products,
    brands: [...new Set(products.map(x => x.brand))].sort(),
    modes: [
      {id: HACOLED.MODE.PARTS, label: 'Báo giá bán linh kiện'},
      {id: HACOLED.MODE.RETAIL, label: 'Báo giá khách hàng thông thường'},
      {id: HACOLED.MODE.TENDER, label: 'Báo giá dự án / đấu thầu'},
      {id: HACOLED.MODE.DEALER, label: 'Báo giá đại lý / đối tác'}
    ],
    priceStatus: 'CHƯA KẾT NỐI GIÁ BÁN ĐƯỢC DUYỆT',
    originalSheets: {pricing: HACOLED.PRICING, components: HACOLED.COMPONENTS},
    originalSheetLinks: {pricing: sheetLink(HACOLED.PRICING), components: sheetLink(HACOLED.COMPONENTS)}
  };
}

/** Ước tính số lượng vật tư; KHÔNG suy ra giá bán hay xác nhận tải/cấu hình. */
function uocTinhLinhKien(request) {
  if (!request || typeof request !== 'object') throw new Error('Thiếu thông tin cấu hình.');
  const products = danhMucSanPham();
  const product = products.find(p => p.key === request.key);
  if (!product) throw new Error('Model không thuộc danh mục file gốc.');
  const width = numeric_(request.screenWidthMm);
  const height = numeric_(request.screenHeightMm);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error('Chiều rộng và chiều cao màn hình phải lớn hơn 0.');
  }
  if (!Number.isFinite(product.widthMm) || !Number.isFinite(product.heightMm) || product.widthMm <= 0 || product.heightMm <= 0) {
    throw new Error('Model không có kích thước module hợp lệ trong file gốc.');
  }
  const countX = Math.floor(width / product.widthMm);
  const countY = Math.floor(height / product.heightMm);
  if (countX < 1 || countY < 1) throw new Error('Kích thước màn hình nhỏ hơn module.');
  const modules = countX * countY;
  const bom = dinhMucLinhKien_().get(createBomKey_(product));
  const warnings = [];
  if (countX * product.widthMm !== width || countY * product.heightMm !== height) {
    warnings.push('Kích thước lắp thực tế đã làm tròn xuống bội số module.');
  }
  if (!bom) warnings.push('Chưa tìm thấy định mức phù hợp theo mã chọn chính xác.');
  if (bom && (/CHƯA|THAM CHIẾU|CHỜ/i.test(bom.status) || /CHƯA/i.test(bom.receiveCard))) {
    warnings.push('Định mức hoặc card nhận đang ở trạng thái tham chiếu/chờ xác minh trong file gốc.');
  }
  return {
    product, countX, countY, modules,
    actualWidthMm: countX * product.widthMm,
    actualHeightMm: countY * product.heightMm,
    actualAreaM2: countX * product.widthMm * countY * product.heightMm / 1000000,
    estimatedPowerCount: bom && bom.modulesPerPower > 0 ? Math.ceil(modules / bom.modulesPerPower) : null,
    estimatedCardCount: bom && bom.modulesPerCard > 0 ? Math.ceil(modules / bom.modulesPerCard) : null,
    receiveCard: bom ? bom.receiveCard : '', powerModel: bom ? bom.powerModel : '',
    sourceStatus: bom ? bom.status : 'KHÔNG CÓ ĐỊNH MỨC',
    warnings: [...warnings, 'Kết quả chỉ phục vụ lập cấu hình dự thảo; cần kỹ thuật kiểm tra card, nguồn, scan và tải pixel.']
  };
}

/** Không phát hành giá khi chưa có nguồn giá bán được phê duyệt.
 * Giá nhập thủ công do người thao tác gõ chỉ để lập dự thảo, không dùng như giá hệ thống.
 */
function taoBanNhapBaoGia(req) {
  if (!req || !Object.values(HACOLED.MODE).includes(req.mode)) throw new Error('Chưa chọn hình thức báo giá hợp lệ.');
  const customer = safeString_(req.customer);
  if (!customer) throw new Error('Cần tên khách hàng/đơn vị.');
  const products = danhMucSanPham();
  const p = products.find(x => x.key === req.key);
  if (!p) throw new Error('Sản phẩm không tồn tại trong danh mục gốc.');
  const quantity = numeric_(req.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(quantity)) throw new Error('Số lượng phải là số nguyên dương.');
  const ref = safeString_(req.reference);
  const note = safeString_(req.note);
  return {
    draft: true,
    status: 'DỰ THẢO - CHƯA CÓ GIÁ ĐƯỢC DUYỆT',
    createdAt: new Date().toISOString(),
    mode: req.mode, customer: customer.slice(0, 160),
    brand: p.brand, model: p.model,
    quantity, reference: ref.slice(0, 160), note: note.slice(0, 1000),
    items: [{name: p.brand + ' | ' + p.model, quantity, unitPrice: null, lineTotal: null}],
    total: null,
    warnings: ['Chưa kết nối nguồn giá bán đã được phê duyệt. Không được phát hành báo giá chính thức.', 'Bảng giá và công thức file gốc không bị thay đổi.']
  };
}

/** Kiem tra ket noi doc (khong ghi du lieu). */
function kiemTraHeThong() {
  const ss = sourceSpreadsheet_();
  const required = [HACOLED.PRICING, HACOLED.COMPONENTS, HACOLED.CATALOG, HACOLED.BOM, 'DANH SACH CHON'];
  const missing = required.filter(n => !ss.getSheetByName(n));
  if (missing.length) throw new Error('Thieu sheet goc: ' + missing.join(', '));
  const products = danhMucSanPham();
  if (!products.length) throw new Error('Danh muc san pham dang rong.');
  const brands = [...new Set(products.map(p => p.brand))];
  const pricing = ss.getSheetByName(HACOLED.PRICING);
  const components = ss.getSheetByName(HACOLED.COMPONENTS);
  const priceModel = safeString_(pricing.getRange('D6').getDisplayValue());
  const componentModel = safeString_(components.getRange('E8').getDisplayValue());
  const priceBrand = safeString_(pricing.getRange('D5').getDisplayValue());
  const componentBrand = safeString_(components.getRange('E4').getDisplayValue());
  return {
    ok: true,
    sourceId: ss.getId(),
    spreadsheetName: ss.getName(),
    productCount: products.length,
    brandCount: brands.length,
    priceModelMatched: products.some(p => p.brand === priceBrand && p.model === priceModel),
    componentModelMatched: componentModel.startsWith(componentBrand + ' | '),
    sheets: required,
    note: 'Kiem tra ket noi va model hien tai, khong xac nhan toan bo gia ban.'
  };
}

/** Test không ghi dữ liệu: dùng trong trình chỉnh sửa Apps Script để xác nhận hai nút gọi được. */
function kiemTraHaiChucNang() {
  const data=danhSachKhoiTao();
  if(!data.products.length) throw new Error('Danh mục trống');
  const p=data.products.find(x=>Number(x.widthMm)>0&&Number(x.heightMm)>0);
  if(!p) throw new Error('Không có sản phẩm đủ kích thước module để kiểm tra');
  const bom=uocTinhLinhKien({key:p.key,screenWidthMm:p.widthMm*4,screenHeightMm:p.heightMm*3});
  const draft=taoBanNhapBaoGia({mode:HACOLED.MODE.PARTS,customer:'KIỂM TRA NỘI BỘ - KHÔNG PHÁT HÀNH',key:p.key,quantity:1});
  if(bom.modules!==12||!draft.draft) throw new Error('Hai chức năng không trả kết quả mong đợi');
  return {ok:true,doGet:typeof doGet==='function',products:data.products.length,model:p.brand+' | '+p.model,bomModules:bom.modules,quoteStatus:draft.status,note:'Không ghi dữ liệu hoặc phát hành báo giá.'};
}

/** Menu tien ich khi script duoc gan voi Google Sheet. */
function onOpen() {
  try {
    SpreadsheetApp.getUi().createMenu('HACOLED App')
      .addItem('Mo giao dien bao gia', 'moGiaoDienBaoGia')
      .addItem('Kiem tra ket noi', 'hienThiKiemTraHeThong')
      .addToUi();
  } catch (e) {
    // onOpen khi chay doc lap khong co Sheets UI, web app van hoat dong.
  }
}
function moGiaoDienBaoGia() {
  SpreadsheetApp.getUi().showModalDialog(taoGiaoDienHacoled_().setWidth(1200).setHeight(800), 'HACOLED | Khong gian bao gia');
}
function hienThiKiemTraHeThong() {
  const s = kiemTraHeThong();
  SpreadsheetApp.getUi().alert('HACOLED: ' + s.productCount + ' san pham, ' + s.brandCount + ' hang.\n' +
    'Model tinh gia: ' + (s.priceModelMatched ? 'Khop' : 'Can kiem tra') + '\n' +
    'Model linh kien: ' + (s.componentModelMatched ? 'Khop' : 'Can kiem tra'));
}
