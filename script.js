// 商家後台新密碼
const ADMIN_PASSWORD = "wuid98741@WRG"; 
let isAdminAuthenticated = false;

// 4 款蘭花商品
const PRODUCTS = [
  {
    id: "p1",
    name: "素雅白蘭花籃",
    price: 3200,
    desc: "雙株特級白花大蝴蝶蘭，象徵聖潔純真與深沉敬意。",
    img: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p2",
    name: "典雅蝴蝶蘭",
    price: 3800,
    desc: "精選粉白蝴蝶蘭，花型典雅端莊，表達無盡懷念。",
    img: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p3",
    name: "尊榮紫蘭花籃",
    price: 4500,
    desc: "高貴紫色蝴蝶蘭組合，氣場尊榮肅穆，致敬德高望重者。",
    img: "https://images.unsplash.com/photo-1534885320675-b08ab131e5e3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p4",
    name: "嚴選特級大蝴蝶蘭",
    price: 6000,
    desc: "多株豪華蘭花典雅設計，大方氣派，展現至高無上的追思。",
    img: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=600&q=80"
  }
];

const DEFAULT_CASES = [
  { id: "c1", date: "2026-03-25", deceased: "故 張公勝 先生", obituaryImg: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80" },
  { id: "c2", date: "2026-03-28", deceased: "故 林母陳老夫人", obituaryImg: "" },
  { id: "c3", date: "2026-04-02", deceased: "故 李老先生", obituaryImg: "" }
];

const DEFAULT_ORDERS = [
  {
    id: "LY-20260320-01",
    productId: "p2",
    productName: "典雅蝴蝶蘭",
    price: 3800,
    custName: "王大明",
    custPhone: "0912345678",
    custAddress: "基隆市信義區東明路100號",
    custEmail: "wang@example.com",
    funeralDate: "2026-03-25",
    deceasedName: "故 張公勝 先生",
    obituaryImg: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=400&q=80",
    needReceipt: "是",
    status: "已完成佈置",
    createdAt: "2026-03-20 10:30",
    setupPhotos: [
      "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

let appCases = [];
let appOrders = [];
let selectedProductId = "p1";
let tempObituaryBase64 = "";
let currentPresetObituary = "";

document.addEventListener("DOMContentLoaded", () => {
  const yrEl = document.getElementById("current-year");
  if (yrEl) yrEl.textContent = new Date().getFullYear();

  loadData();

  if (document.getElementById("product-list")) {
    renderProducts();
    populateDropdowns();
    selectProduct("p1");
  }

  if (document.getElementById("admin-cases-list")) {
    renderAdminCases();
    renderAdminOrders();
  }
});

function loadData() {
  const savedCases = localStorage.getItem("ly_cases");
  appCases = savedCases ? JSON.parse(savedCases) : DEFAULT_CASES;

  const savedOrders = localStorage.getItem("ly_orders");
  appOrders = savedOrders ? JSON.parse(savedOrders) : DEFAULT_ORDERS;
}

function saveData() {
  localStorage.setItem("ly_cases", JSON.stringify(appCases));
  localStorage.setItem("ly_orders", JSON.stringify(appOrders));
}

function switchTab(tab) {
  document.querySelectorAll("main > section").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));

  document.getElementById(`view-${tab}`).classList.remove("hidden");
  document.getElementById(`nav-${tab}`).classList.add("active");

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (tab === 'track') searchOrders();
}

function openInfoModal() {
  document.getElementById("info-modal").classList.remove("hidden");
}

function closeInfoModal() {
  document.getElementById("info-modal").classList.add("hidden");
}

// 賣家後台登入驗證
function verifyAdminPassword() {
  const inputPass = document.getElementById("admin-pass-input").value;
  if (inputPass === ADMIN_PASSWORD) {
    isAdminAuthenticated = true;
    document.getElementById("auth-modal").classList.add("hidden");
    showToast("成功登入商家後台");
  } else {
    alert("密碼錯誤，無法存取商家後台！");
  }
}

function adminLogout() {
  window.location.href = "index.html";
}

function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = PRODUCTS.map(p => `
    <div id="product-card-${p.id}" onclick="selectProduct('${p.id}')"
      class="product-card cursor-pointer bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700 hover:border-amber-500/70 transition duration-300 flex flex-col justify-between group shadow-lg">
      <div>
        <div class="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
          <img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          <div class="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 font-bold px-3 py-1 rounded-full text-xs">
            NT$ ${p.price.toLocaleString()}
          </div>
        </div>
        <div class="p-5 space-y-2">
          <h3 class="font-serif font-bold text-lg text-slate-100 group-hover:text-amber-300 transition">${p.name}</h3>
          <p class="text-xs text-slate-400 leading-relaxed">${p.desc}</p>
        </div>
      </div>
      <div class="p-5 pt-0">
        <button type="button" class="select-btn w-full py-2.5 rounded-lg border border-slate-600 text-slate-300 text-sm font-medium group-hover:border-amber-500 group-hover:bg-amber-600 group-hover:text-slate-950 transition flex items-center justify-center gap-2">
          <span>選擇此款式</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </button>
      </div>
    </div>
  `).join("");
}

function selectProduct(id) {
  selectedProductId = id;
  const inputEl = document.getElementById("form-product-id");
  if (inputEl) inputEl.value = id;

  const product = PRODUCTS.find(p => p.id === id);
  if (product && document.getElementById("selected-product-name")) {
    document.getElementById("selected-product-name").innerText = `${product.name} (NT$ ${product.price.toLocaleString()})`;
  }

  PRODUCTS.forEach(p => {
    const card = document.getElementById(`product-card-${p.id}`);
    if (card) {
      const btn = card.querySelector('.select-btn');
      if (p.id === id) {
        card.classList.add("border-amber-500", "ring-2", "ring-amber-500/30", "bg-slate-800");
        btn.classList.add("bg-amber-600", "text-slate-950", "border-amber-500");
        btn.innerHTML = `<i class="fa-solid fa-check"></i> 已選擇`;
      } else {
        card.classList.remove("border-amber-500", "ring-2", "ring-amber-500/30", "bg-slate-800");
        btn.classList.remove("bg-amber-600", "text-slate-950", "border-amber-500");
        btn.innerHTML = `<span>選擇此款式</span> <i class="fa-solid fa-arrow-right text-xs"></i>`;
      }
    }
  });
}

function populateDropdowns() {
  const dateSelect = document.getElementById("select-date-option");
  const deceasedSelect = document.getElementById("select-deceased-option");
  if (!dateSelect || !deceasedSelect) return;

  let dateOptions = appCases.map(c => `<option value="${c.date}" data-case-id="${c.id}">${c.date} (目前承接案件)</option>`);
  dateOptions.push(`<option value="OTHER">其他 (自行填寫日期)</option>`);
  dateSelect.innerHTML = dateOptions.join("");

  let deceasedOptions = appCases.map(c => `<option value="${c.deceased}" data-case-id="${c.id}">${c.deceased} (目前承接案件)</option>`);
  deceasedOptions.push(`<option value="OTHER">其他 (自行填寫亡者姓名)</option>`);
  deceasedSelect.innerHTML = deceasedOptions.join("");

  handleCaseSelection('date');
}

function handleCaseSelection(type) {
  const dateSelect = document.getElementById("select-date-option");
  const deceasedSelect = document.getElementById("select-deceased-option");
  
  if (type === 'date' && dateSelect && deceasedSelect) {
    const selectedIdx = dateSelect.selectedIndex;
    if (deceasedSelect.options[selectedIdx]) {
      deceasedSelect.selectedIndex = selectedIdx;
    }
  } else if (type === 'deceased' && dateSelect && deceasedSelect) {
    const selectedIdx = deceasedSelect.selectedIndex;
    if (dateSelect.options[selectedIdx]) {
      dateSelect.selectedIndex = selectedIdx;
    }
  }

  const isDateOther = dateSelect.value === 'OTHER';
  const isDeceasedOther = deceasedSelect.value === 'OTHER';

  const dateCustom = document.getElementById("custom-date-container");
  const deceasedCustom = document.getElementById("custom-deceased-container");

  if (isDateOther) {
    dateCustom.classList.remove("hidden");
    document.getElementById("cust-date-custom").required = true;
  } else {
    dateCustom.classList.add("hidden");
    document.getElementById("cust-date-custom").required = false;
  }

  if (isDeceasedOther) {
    deceasedCustom.classList.remove("hidden");
    document.getElementById("cust-deceased-custom").required = true;
  } else {
    deceasedCustom.classList.add("hidden");
    document.getElementById("cust-deceased-custom").required = false;
  }

  const uploadSec = document.getElementById("obituary-upload-section");
  const presetSec = document.getElementById("obituary-preset-section");

  if (isDateOther || isDeceasedOther) {
    uploadSec.classList.remove("hidden");
    presetSec.classList.add("hidden");
    currentPresetObituary = "";
  } else {
    const selectedOption = dateSelect.options[dateSelect.selectedIndex];
    const caseId = selectedOption.getAttribute("data-case-id");
    const targetCase = appCases.find(c => c.id === caseId);

    if (targetCase && targetCase.obituaryImg) {
      uploadSec.classList.add("hidden");
      presetSec.classList.remove("hidden");
      currentPresetObituary = targetCase.obituaryImg;
      document.getElementById("obituary-preset-img").src = targetCase.obituaryImg;
    } else {
      uploadSec.classList.remove("hidden");
      presetSec.classList.add("hidden");
      currentPresetObituary = "";
    }
  }
}

function openPresetObituaryModal() {
  if (currentPresetObituary) {
    openImageModal(currentPresetObituary, "商家建檔案件 - 預設訃聞圖檔 (二次確認)");
  }
}

function previewObituaryImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      tempObituaryBase64 = e.target.result;
      document.getElementById("obituary-preview-img").src = tempObituaryBase64;
      document.getElementById("obituary-preview-box").classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
}

function removeObituaryPreview() {
  tempObituaryBase64 = "";
  document.getElementById("obituary-file").value = "";
  document.getElementById("obituary-preview-box").classList.add("hidden");
}

function handleOrderSubmit(e) {
  e.preventDefault();

  const product = PRODUCTS.find(p => p.id === selectedProductId);
  const dateOpt = document.getElementById("select-date-option").value;
  const finalDate = dateOpt === 'OTHER' ? document.getElementById("cust-date-custom").value : dateOpt;

  const deceasedOpt = document.getElementById("select-deceased-option").value;
  const finalDeceased = deceasedOpt === 'OTHER' ? document.getElementById("cust-deceased-custom").value : deceasedOpt;

  const receiptVal = document.querySelector('input[name="need-receipt"]:checked').value;
  const finalObituary = currentPresetObituary ? currentPresetObituary : tempObituaryBase64;

  const newOrder = {
    id: "LY-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-" + Math.floor(1000 + Math.random() * 9000),
    productId: product.id,
    productName: product.name,
    price: product.price,
    custName: document.getElementById("cust-name").value.trim(),
    custPhone: document.getElementById("cust-phone").value.trim(),
    custAddress: document.getElementById("cust-address").value.trim(),
    custEmail: document.getElementById("cust-email").value.trim(),
    funeralDate: finalDate,
    deceasedName: finalDeceased,
    obituaryImg: finalObituary,
    needReceipt: receiptVal,
    status: "訂單處理中",
    createdAt: new Date().toLocaleString("zh-TW", { hour12: false }),
    setupPhotos: []
  };

  appOrders.unshift(newOrder);
  saveData();

  document.getElementById("order-form").reset();
  removeObituaryPreview();

  showToast(`訂單建立成功！您的訂單編號為：${newOrder.id}`);

  setTimeout(() => {
    switchTab('track');
    document.getElementById("track-search-input").value = newOrder.id;
    searchOrders();
  }, 1200);
}

function searchOrders() {
  const query = document.getElementById("track-search-input").value.trim().toLowerCase();
  const container = document.getElementById("track-results-container");

  if (!query) {
    container.innerHTML = `
      <div class="bg-slate-800/50 rounded-xl border border-slate-700/80 p-8 text-center text-slate-400">
        <i class="fa-solid fa-magnifying-glass text-4xl mb-3 text-slate-600 block"></i>
        <p class="text-sm">請輸入您的「訂單編號」或「手機號碼」進行查詢。</p>
      </div>
    `;
    return;
  }

  const filtered = appOrders.filter(o => 
    o.id.toLowerCase().includes(query) || 
    o.custPhone.includes(query)
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-slate-800/50 rounded-xl border border-slate-700/80 p-8 text-center text-slate-400">
        <i class="fa-solid fa-folder-open text-4xl mb-3 text-slate-600 block"></i>
        <p class="text-sm">未找到相關訂單資料。請檢查訂單編號或手機號碼。</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(o => `
    <div class="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
      <div class="bg-slate-900/80 px-6 py-4 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="font-mono text-sm text-amber-400 font-bold">${o.id}</span>
          <span class="text-xs text-slate-400">下單時間：${o.createdAt}</span>
        </div>
        <div>${getStatusBadge(o.status)}</div>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2.5 text-sm text-slate-300">
          <div class="flex items-center justify-between border-b border-slate-700/50 pb-2">
            <span class="text-slate-400">訂購商品：</span>
            <span class="font-bold text-amber-300">${o.productName} (NT$ ${o.price.toLocaleString()})</span>
          </div>
          <div class="flex justify-between"><span class="text-slate-400">訂購人姓名：</span><span>${o.custName}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">聯絡電話：</span><span>${o.custPhone}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">出殯日期：</span><span class="text-slate-100 font-medium">${o.funeralDate}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">亡者姓名：</span><span class="text-slate-100 font-medium">${o.deceasedName}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">是否需要收據：</span><span>${o.needReceipt}</span></div>
        </div>

        <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 flex flex-col justify-between">
          <span class="text-xs text-slate-400 mb-2 block font-medium">已傳送/確認之訃聞圖檔：</span>
          ${o.obituaryImg ? `
            <div class="relative h-28 rounded-lg overflow-hidden border border-slate-700 bg-black cursor-pointer group" onclick="openImageModal('${o.obituaryImg}', '訂單 ${o.id} - 訃聞圖檔')">
              <img src="${o.obituaryImg}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100">
              <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs text-white">
                <i class="fa-solid fa-magnifying-glass-plus text-lg mr-1"></i> 點擊放大預覽
              </div>
            </div>
          ` : `
            <div class="h-28 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-500">
              未上傳訃聞圖檔
            </div>
          `}
        </div>
      </div>

      <div class="bg-slate-950/60 px-6 py-5 border-t border-slate-700/80">
        <h4 class="font-serif text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
          <i class="fa-solid fa-camera"></i> 現場佈置完成照片
        </h4>
        ${o.setupPhotos && o.setupPhotos.length > 0 ? `
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            ${o.setupPhotos.map((img, idx) => `
              <div class="relative h-28 rounded-lg overflow-hidden border border-amber-500/30 bg-black cursor-pointer group shadow-md" onclick="openImageModal('${img}', '${o.deceasedName} - 現場佈置照片 #${idx+1}')">
                <img src="${img}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs text-white">
                  <i class="fa-solid fa-expand text-lg"></i>
                </div>
              </div>
            `).join("")}
          </div>
        ` : `
          <div class="p-4 bg-slate-900/50 rounded-lg text-center text-xs text-slate-400 border border-slate-800">
            <i class="fa-solid fa-hourglass-half text-amber-500/70 mb-1 block text-sm"></i>
            店家尚未上傳現場佈置照片，佈置完成後將第一時間為您更新。
          </div>
        `}
      </div>
    </div>
  `).join("");
}

function getStatusBadge(status) {
  if (status === '已完成佈置') {
    return `<span class="bg-emerald-950 text-emerald-300 border border-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><i class="fa-solid fa-check-double text-emerald-400"></i> 已完成佈置</span>`;
  } else if (status === '佈置中') {
    return `<span class="bg-amber-950 text-amber-300 border border-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><i class="fa-solid fa-person-digging text-amber-400"></i> 現場佈置中</span>`;
  } else {
    return `<span class="bg-slate-800 text-slate-300 border border-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><i class="fa-solid fa-clock text-slate-400"></i> 訂單處理中</span>`;
  }
}

function handleAddCase(e) {
  e.preventDefault();
  const date = document.getElementById("admin-case-date").value;
  const deceased = document.getElementById("admin-case-deceased").value.trim();
  const obitFileInput = document.getElementById("admin-case-obituary");

  if (!date || !deceased) return;

  const saveCaseObj = (obitBase64) => {
    const newCase = {
      id: "c_" + Date.now(),
      date: date,
      deceased: deceased,
      obituaryImg: obitBase64 || ""
    };

    appCases.unshift(newCase);
    saveData();

    document.getElementById("admin-case-date").value = "";
    document.getElementById("admin-case-deceased").value = "";
    if (obitFileInput) obitFileInput.value = "";

    renderAdminCases();
    showToast("成功新增案件至前台選單！");
  };

  if (obitFileInput && obitFileInput.files && obitFileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      saveCaseObj(evt.target.result);
    };
    reader.readAsDataURL(obitFileInput.files[0]);
  } else {
    saveCaseObj("");
  }
}

function deleteCase(id) {
  if (confirm("確定要刪除此案件紀錄嗎？")) {
    appCases = appCases.filter(c => c.id !== id);
    saveData();
    renderAdminCases();
    showToast("已刪除該案件");
  }
}

function renderAdminCases() {
  const container = document.getElementById("admin-cases-list");
  if (!container) return;
  document.getElementById("case-count-badge").innerText = `${appCases.length} 筆`;

  if (appCases.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-500 py-2 text-center">目前無案件</p>`;
    return;
  }

  container.innerHTML = appCases.map(c => `
    <div class="bg-slate-900/80 p-3 rounded-lg border border-slate-700/80 flex items-center justify-between text-xs">
      <div>
        <div class="font-bold text-slate-200">${c.deceased} ${c.obituaryImg ? '<span class="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded ml-1">有訃聞</span>' : ''}</div>
        <div class="text-slate-400 mt-0.5"><i class="fa-regular fa-calendar text-amber-500 mr-1"></i>${c.date}</div>
      </div>
      <button onclick="deleteCase('${c.id}')" class="text-slate-500 hover:text-rose-400 p-1.5 transition" title="刪除案件">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join("");
}

function renderAdminOrders() {
  const container = document.getElementById("admin-orders-list");
  if (!container) return;

  if (appOrders.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-500 text-xs">目前尚無訂單記錄</div>`;
    return;
  }

  container.innerHTML = appOrders.map(o => `
    <div class="bg-slate-900/90 rounded-xl border border-slate-700/90 p-5 space-y-4">
      <div class="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div class="space-x-2">
          <span class="font-mono text-xs text-amber-400 font-bold">${o.id}</span>
          <span class="text-xs text-slate-400">(${o.createdAt})</span>
        </div>
        <div class="flex items-center gap-2">
          <select onchange="updateOrderStatus('${o.id}', this.value)" class="bg-slate-800 border border-slate-600 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500">
            <option value="訂單處理中" ${o.status === '訂單處理中' ? 'selected' : ''}>訂單處理中</option>
            <option value="佈置中" ${o.status === '佈置中' ? 'selected' : ''}>佈置中</option>
            <option value="已完成佈置" ${o.status === '已完成佈置' ? 'selected' : ''}>已完成佈置</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
        <div><span class="text-slate-400">商品款式：</span><strong class="text-amber-300">${o.productName}</strong> (NT$ ${o.price.toLocaleString()})</div>
        <div><span class="text-slate-400">訂購人：</span>${o.custName} (${o.custPhone})</div>
        <div><span class="text-slate-400">出殯日期：</span><strong class="text-white">${o.funeralDate}</strong></div>
        <div><span class="text-slate-400">亡者姓名：</span><strong class="text-white">${o.deceasedName}</strong></div>
        <div class="sm:col-span-2"><span class="text-slate-400">配送地址：</span>${o.custAddress}</div>
        <div><span class="text-slate-400">收據需求：</span>${o.needReceipt}</div>
        <div><span class="text-slate-400">電子信箱：</span>${o.custEmail}</div>
      </div>

      <div class="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
        <div class="flex items-center gap-2">
          ${o.obituaryImg ? `
            <button onclick="openImageModal('${o.obituaryImg}', '訃聞備份 - ${o.deceasedName}')" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded border border-slate-600 flex items-center gap-1.5">
              <i class="fa-solid fa-file-invoice text-amber-500"></i> 查看訃聞圖檔
            </button>
          ` : `<span class="text-xs text-slate-500">無上傳訃聞</span>`}
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">已上傳佈置照片：<strong>${o.setupPhotos ? o.setupPhotos.length : 0}</strong> 張</span>
          <button onclick="openUploadModal('${o.id}')" class="text-xs bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded transition flex items-center gap-1.5">
            <i class="fa-solid fa-camera"></i> 回傳現場佈置照片
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function updateOrderStatus(orderId, newStatus) {
  const order = appOrders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveData();
    showToast(`訂單 ${orderId} 狀態已更新為：${newStatus}`);
  }
}

function openImageModal(imgSrc, caption) {
  document.getElementById("modal-img").src = imgSrc;
  document.getElementById("modal-caption").innerText = caption || "";
  document.getElementById("image-modal").classList.remove("hidden");
}

function closeImageModal() {
  document.getElementById("image-modal").classList.add("hidden");
}

function openUploadModal(orderId) {
  document.getElementById("upload-target-order-id").value = orderId;
  document.getElementById("admin-setup-photo-input").value = "";
  document.getElementById("upload-modal").classList.remove("hidden");
}

function closeUploadModal() {
  document.getElementById("upload-modal").classList.add("hidden");
}

function submitSetupPhoto() {
  const orderId = document.getElementById("upload-target-order-id").value;
  const fileInput = document.getElementById("admin-setup-photo-input");
  
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("請選擇照片檔案");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const photoBase64 = e.target.result;
    const order = appOrders.find(o => o.id === orderId);
    if (order) {
      if (!order.setupPhotos) order.setupPhotos = [];
      order.setupPhotos.push(photoBase64);
      order.status = "已完成佈置";
      saveData();
      renderAdminOrders();
      closeUploadModal();
      showToast("現場佈置照片已順利上傳！");
    }
  };
  reader.readAsDataURL(file);
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toast-message").innerText = msg;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}
