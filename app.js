// تشغيل الدالة فور تحميل الصفحة لاستعادة البيانات إن وجدت
document.addEventListener("DOMContentLoaded", () => {
  loadDataFromStorage();

  // إضافة مستمعي الأحداث لحفظ اسم الموظف والفرع فور تغييرهم
  document
    .getElementById("branchLocation")
    .addEventListener("change", saveDataToStorage);
  document
    .getElementById("employeeName")
    .addEventListener("input", saveDataToStorage);
});

// قالب كود القائمة المنسدلة للشركات لضمان تطابقها بالكامل في كل العمليات
const companySelectHTML = `
  <select name="comp" class="comp-name" required onchange="handleCompanyChange(this); saveDataToStorage();">
      <option value="">اختر الشركة</option>
      <option value=" عصفور"> عصفور</option>
      <option value=" جيلستون"> جيلستون</option>
      <option value=" سوارفسكي"> سوارفسكي</option>
      <option value=" شيكي"> شيكي</option>
      <option value=" دارونز"> دارونز</option>
      <option value=" دارونز ابو قاعدة"> دارونز ابو قاعدة</option>
  </select>
`;

// دالة للتحكم في نوع خانة "اللون" بناءً على الشركة المختارة
function handleCompanyChange(selectElement) {
  const row = selectElement.closest("tr");
  const colorContainer = row.querySelector(".color-container");

  if (!colorContainer) return;

  const selectedCompany = selectElement.value;

  // الشرط: إذا اختار "شركة دارونز ابو قاعدة" تتحول خانة اللون إلى قائمة منسدلة
  if (selectedCompany === "شركة دارونز ابو قاعدة") {
    colorContainer.innerHTML = `
          <select class="prod-name22" required onchange="saveDataToStorage()">
                  <option value="">اختر اللون...</option>
                  <option value="101">101</option>
                  <option value="102">102</option>
                  <option value="103">103</option>
                  <option value="104">104</option>
                  <option value="105">105</option>
                  <option value="109">109</option>
                  <option value="110">110</option>
                  <option value="111">111</option>
                  <option value="112">112</option>
                  <option value="113">113</option>
                  <option value="114">114</option>
                  <option value="115">115</option>
                  <option value="116">116</option>
                  <option value="117">117</option>
                  <option value="118">118</option>
                  <option value="119">119</option>
                  <option value="120">120</option>
                  <option value="121">121</option>
                  <option value="122">122</option>
                  <option value="123">123</option>
                  <option value="124">124</option>
                  <option value="125">125</option>
                  <option value="126">126</option>
                  <option value="127">127</option>
                  <option value="128">128</option>
                  <option value="129">129</option>
                  <option value="130">130</option>
                  <option value="131">131</option>
                  <option value="134">134</option>
                  <option value="135">135</option>
                  <option value="136">136</option>
                  <option value="138">138</option>
                  <option value="140">140</option>
              </select>
      `;
  } else {
    // إذا اختار أي شركة أخرى، يعود حقل اللون نصياً حراً عادي كما كان
    colorContainer.innerHTML = `<input type="text" class="prod-name22" required placeholder="اللون" oninput="saveDataToStorage()">`;
  }
}

// دالة إعادة الترقيم التسلسلي للخانات وتحديث العداد في الشاشة وحفظ التغييرات
function reorderRows() {
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach((row, index) => {
    row.querySelector(".row-number").innerText = index + 1;
  });
  document.getElementById("itemsCounter").innerText = rows.length;
  saveDataToStorage(); // حفظ التغييرات تلقائياً بعد إعادة الترتيب
}

// إضافة صنف جديد للجدول
function addNewRow() {
  const tbody = document.getElementById("tableBody");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
            <td class="row-number"></td>
            <td>${companySelectHTML}</td>
            <td><input type="text" class="prod-name" required placeholder="الصنف" oninput="saveDataToStorage()"></td>
            <td class="color-container"><input type="text" class="prod-name22" required placeholder="اللون" oninput="saveDataToStorage()"></td>
            <td><input type="text" class="prod-size" required placeholder="المقاس" oninput="saveDataToStorage()"></td>
            <td><input type="number" class="prod-qty" min="1" required placeholder="العدد" oninput="saveDataToStorage()"></td>
            <td class="delete-col"><button type="button" class="btn btn-danger" onclick="deleteRow(this)">حذف</button></td>
        `;
  tbody.appendChild(newRow);
  reorderRows();
}

// حذف صنف من الجدول
function deleteRow(button) {
  const row = button.parentNode.parentNode;
  const tbody = document.getElementById("tableBody");
  if (tbody.rows.length > 1) {
    row.remove();
    reorderRows();
  } else {
    alert("يجب أن تحتوي الطلبية على صنف واحد على الأقل.");
  }
}

// اعتماد الطلبية وتثبيت التوقيت بالأعلى
document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const now = new Date();
  const timeString = now.toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  document.getElementById("orderTimestamp").innerHTML =
    `⏰ <b>وقت إنشاء الطلب:</b> ${timeString}`;
  document.getElementById("metaHeader").style.display = "flex";

  toggleInputs(true);

  document.getElementById("submitBtn").style.display = "none";
  document.getElementById("addRowBtn").style.display = "none";
  document.getElementById("editBtn").style.display = "block";
  document.getElementById("actionButtons").style.display = "flex";

  saveDataToStorage(); // حفظ حالة الاعتماد والتوقيت
});

// تفعيل وضع التعديل وإلغاء قفل الحقول
function enableEditing() {
  toggleInputs(false);
  document.getElementById("submitBtn").style.display = "block";
  document.getElementById("addRowBtn").style.display = "inline-block";
  document.getElementById("editBtn").style.display = "none";
  document.getElementById("actionButtons").style.display = "none";
  document.getElementById("metaHeader").style.display = "none";
  saveDataToStorage(); // حفظ حالة التعديل الجديدة
}

// دالة قفل أو فتح حقول الإدخال
function toggleInputs(disable) {
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => (input.disabled = disable));
}

// ========================================================
// 💾 وظائف الحفظ التلقائي والاسترجاع من الذاكرة المحلية (Local Storage)
// ========================================================

function saveDataToStorage() {
  const branch = document.getElementById("branchLocation").value;
  const employee = document.getElementById("employeeName").value;
  const isSubmitted =
    document.getElementById("submitBtn").style.display === "none";
  const timestamp = document.getElementById("orderTimestamp").innerHTML;

  const items = [];
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach((row) => {
    const compElem = row.querySelector(".comp-name");
    const prodElem = row.querySelector(".prod-name");
    const colorElem = row.querySelector(".prod-name22");
    const sizeElem = row.querySelector(".prod-size");
    const qtyElem = row.querySelector(".prod-qty");

    if (compElem && prodElem && colorElem && sizeElem && qtyElem) {
      items.push({
        comp: compElem.value,
        prod: prodElem.value,
        color: colorElem.value,
        isColorSelect: colorElem.tagName === "SELECT", // حفظ طبيعة حقل اللون إذا كان select أو text
        size: sizeElem.value,
        qty: qtyElem.value,
      });
    }
  });

  const orderData = { branch, employee, isSubmitted, timestamp, items };
  localStorage.setItem("savedOrderData", JSON.stringify(orderData));
}

function loadDataFromStorage() {
  const savedData = localStorage.getItem("savedOrderData");
  if (!savedData) {
    return;
  }

  const data = JSON.parse(savedData);

  document.getElementById("branchLocation").value = data.branch || "";
  document.getElementById("employeeName").value = data.employee || "";

  if (data.items && data.items.length > 0) {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    data.items.forEach((item) => {
      const newRow = document.createElement("tr");

      newRow.innerHTML = `
                <td class="row-number"></td>
                <td>${companySelectHTML}</td>
                <td><input type="text" class="prod-name" required placeholder="مثال:  6883" value="${item.prod}" oninput="saveDataToStorage()"></td>
                <td class="color-container"></td>
                <td><input type="text" class="prod-size" required placeholder="مثال: SS10 / mm18" value="${item.size}" oninput="saveDataToStorage()"></td>
                <td><input type="number" class="prod-qty" min="1" required placeholder="0" value="${item.qty}" oninput="saveDataToStorage()"></td>
                <td class="delete-col"><button type="button" class="btn btn-danger" onclick="deleteRow(this)">حذف</button></td>
            `;

      tbody.appendChild(newRow);
      newRow.querySelector(".comp-name").value = item.comp;

      // إعادة بناء حقل اللون بناءً على نوعه المحفوظ في الذاكرة
      const colorContainer = newRow.querySelector(".color-container");
      if (item.isColorSelect) {
        colorContainer.innerHTML = `
              <select class="prod-name22" required onchange="saveDataToStorage()">
                  <option value="">اختر اللون...</option>
                  <option value="101">101</option>
                  <option value="102">102</option>
                  <option value="103">103</option>
                  <option value="104">104</option>
                  <option value="105">105</option>
                  <option value="109">109</option>
                  <option value="110">110</option>
                  <option value="111">111</option>
                  <option value="112">112</option>
                  <option value="113">113</option>
                  <option value="114">114</option>
                  <option value="115">115</option>
                  <option value="116">116</option>
                  <option value="117">117</option>
                  <option value="118">118</option>
                  <option value="119">119</option>
                  <option value="120">120</option>
                  <option value="121">121</option>
                  <option value="122">122</option>
                  <option value="123">123</option>
                  <option value="124">124</option>
                  <option value="125">125</option>
                  <option value="126">126</option>
                  <option value="127">127</option>
                  <option value="128">128</option>
                  <option value="129">129</option>
                  <option value="130">130</option>
                  <option value="131">131</option>
                  <option value="134">134</option>
                  <option value="135">135</option>
                  <option value="136">136</option>
                  <option value="138">138</option>
                  <option value="140">140</option>
              </select>
          `;
      } else {
        colorContainer.innerHTML = `<input type="text" class="prod-name22" required placeholder="اللون" oninput="saveDataToStorage()">`;
      }

      // تعيين قيمة اللون المختارة أو المكتوبة
      colorContainer.querySelector(".prod-name22").value = item.color || "";
    });

    const rows = document.querySelectorAll("#tableBody tr");
    rows.forEach((row, index) => {
      row.querySelector(".row-number").innerText = index + 1;
    });
    document.getElementById("itemsCounter").innerText = rows.length;
  }

  if (data.isSubmitted) {
    document.getElementById("orderTimestamp").innerHTML = data.timestamp;
    document.getElementById("metaHeader").style.display = "flex";
    toggleInputs(true);
    document.getElementById("submitBtn").style.display = "none";
    document.getElementById("addRowBtn").style.display = "none";
    document.getElementById("editBtn").style.display = "block";
    document.getElementById("actionButtons").style.display = "flex";
  }
}

// تصفير الجدول بالكامل لبدء فاتورة جديدة ومسح الذاكرة
function createNewInvoice() {
  if (confirm("هل أنت متأكد من رغبتك في تصفير الجدول وإنشاء فاتورة جديدة؟")) {
    localStorage.removeItem("savedOrderData");
    location.reload();
  }
}

// توليد ملف PDF احترافي عبر محرك طباعة المتصفح
function shareAsPDF() {
  const inputs = document.querySelectorAll(
    "#invoiceContainer input, #invoiceContainer select",
  );
  inputs.forEach((input) => {
    input.setAttribute("value", input.value);

    if (input.tagName === "SELECT") {
      const selectedOption = input.options[input.selectedIndex];
      if (selectedOption) {
        for (let i = 0; i < input.options.length; i++) {
          if (i === input.selectedIndex) {
            input.options[i].setAttribute("selected", "selected");
          } else {
            input.options[i].removeAttribute("selected");
          }
        }
      }
    }
  });

  window.print();
}

// تصدير البيانات بالكامل إلى ملف Excel منظم
function exportToExcel() {
  const branch = document.getElementById("branchLocation").value;
  const employee = document.getElementById("employeeName").value;
  const timeText = document.getElementById("orderTimestamp").innerText;

  const data = [
    ["نظام طلبيات المستودع المركزي المرقوم والموسط"],
    [timeText],
    ["موقع الفرع:", branch],
    ["اسم الموظف المسجل:", employee],
    [],
    ["م", "اسم الشركة", "الصنف", "اللون", "المقاس", "العدد"],
  ];

  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach((row, index) => {
    const comp = row.querySelector(".comp-name").value;
    const prod = row.querySelector(".prod-name").value;
    const color = row.querySelector(".prod-name22").value;
    const size = row.querySelector(".prod-size").value;
    const qty = row.querySelector(".prod-qty").value;
    data.push([index + 1, comp, prod, color, size, qty]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "تفاصيل الطلب");
  XLSX.writeFile(wb, `طلبية_مستودع_${branch}.xlsx`);
}
