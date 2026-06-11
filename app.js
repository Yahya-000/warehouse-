// دالة إعادة الترقيم التسلسلي للخانات وتحديث العداد في الشاشة
function reorderRows() {
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach((row, index) => {
    row.querySelector(".row-number").innerText = index + 1;
  });
  document.getElementById("itemsCounter").innerText = rows.length + " أصناف";
}

// إضافة صنف جديد
function addNewRow() {
  const tbody = document.getElementById("tableBody");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td class="row-number"></td>
        <td><input type="text" class="comp-name" required placeholder="اسم الشركة"></td>
        <td><input type="text" class="prod-name" required placeholder=" المنتج / الون "></td>
        <td><input type="text" class="prod-size" required placeholder="المقاس"></td>
        <td><input type="number" class="prod-qty" min="1" required placeholder="0"></td>
        <td class="delete-col"><button type="button" class="btn btn-danger" onclick="deleteRow(this)">حذف</button></td>
    `;
  tbody.appendChild(newRow);
  reorderRows();
}

// حذف صنف
function deleteRow(button) {
  const row = button.parentNode.parentNode;
  const tbody = document.getElementById("tableBody");
  if (tbody.rows.length > 1) {
    row.remove();
    reorderRows();
  } else {
    alert("يجب أن تحتوي الطلبية على صنف واحد على الأثل.");
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
});

function enableEditing() {
  toggleInputs(false);
  document.getElementById("submitBtn").style.display = "block";
  document.getElementById("addRowBtn").style.display = "inline-block";
  document.getElementById("editBtn").style.display = "none";
  document.getElementById("actionButtons").style.display = "none";
  document.getElementById("metaHeader").style.display = "none";
}

function toggleInputs(disable) {
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => (input.disabled = disable));
}

// ========================================================
// توليد PDF من عنصر مستقل بدون لمس الصفحة الحالية
// ========================================================
function shareAsPDF() {
  const branchName = document.getElementById("branchLocation").value || "عام";
  const employeeName = document.getElementById("employeeName").value || "";
  const timeText = document.getElementById("orderTimestamp").innerHTML;
  const fileName = `طلبية_مستودع_${branchName}.pdf`;

  // بناء صفوف الجدول من البيانات المدخلة
  let rowsHTML = "";
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach((row, index) => {
    const comp = row.querySelector(".comp-name").value;
    const prod = row.querySelector(".prod-name").value;
    const size = row.querySelector(".prod-size").value;
    const qty = row.querySelector(".prod-qty").value;
    rowsHTML += `
      <tr style="background:${index % 2 === 0 ? "#ffffff" : "#f8f9fa"};">
        <td style="padding:9px 6px; border:1px solid #ddd; text-align:center; font-weight:bold;">${index + 1}</td>
        <td style="padding:9px 6px; border:1px solid #ddd; text-align:center;">${comp}</td>
        <td style="padding:9px 6px; border:1px solid #ddd; text-align:center;">${prod}</td>
        <td style="padding:9px 6px; border:1px solid #ddd; text-align:center;">${size}</td>
        <td style="padding:9px 6px; border:1px solid #ddd; text-align:center; font-weight:bold;">${qty}</td>
      </tr>`;
  });

  // HTML نظيف ومستقل للـ PDF — لا يتأثر بأي CSS أو media query للصفحة
  const pdfHTML = `
  <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    direction: rtl;
    padding: 30px;
    color: #1a1a1a;
    width: 720px;
    background: #fff;
  ">
    <!-- الترويسة الرسمية -->
    <div style="text-align:center; border-bottom:3px double #2c3e50; padding-bottom:18px; margin-bottom:22px;">
      <h1 style="font-size:20px; color:#2c3e50; margin:0 0 6px 0;">مستند طلب توريد بضائع من مستودع الفصوص</h1>
      <p style="font-size:12px; color:#666; margin:0;">وثيقة صادرة إلكترونياً من نظام تسجيل طلبات للفروع الداخلية</p>
    </div>

    <!-- شريط الوقت -->
    <div style="
      background:#ecf0f1;
      padding:12px 16px;
      border-radius:6px;
      text-align:center;
      font-weight:bold;
      color:#2c3e50;
      margin-bottom:22px;
      border-right:5px solid #2c3e50;
      border-left:5px solid #2c3e50;
      font-size:13px;
    ">${timeText}</div>

    <!-- الفرع والموظف -->
    <div style="display:flex; justify-content:space-around; margin-bottom:25px; gap:20px;">
      <div style="text-align:center; flex:1; background:#f8f9fa; padding:12px; border-radius:6px;">
        <div style="font-weight:bold; color:#2c3e50; margin-bottom:6px; font-size:13px;">📍 موقع الفرع</div>
        <div style="font-size:16px; font-weight:bold; color:#000;">${branchName}</div>
      </div>
      <div style="text-align:center; flex:1; background:#f8f9fa; padding:12px; border-radius:6px;">
        <div style="font-weight:bold; color:#2c3e50; margin-bottom:6px; font-size:13px;">👤 اسم الموظف</div>
        <div style="font-size:16px; font-weight:bold; color:#000;">${employeeName}</div>
      </div>
    </div>

    <!-- عنوان الجدول -->
    <div style="font-size:15px; font-weight:bold; color:#2c3e50; margin-bottom:12px; padding-bottom:8px; border-bottom:2px solid #ecf0f1;">
      📦 تفاصيل الأصناف
    </div>

    <!-- الجدول -->
    <table style="width:100%; border-collapse:collapse; table-layout:fixed;">
      <thead>
        <tr style="background:#2c3e50; color:#fff;">
          <th style="padding:10px 6px; border:1px solid #ddd; text-align:center; width:45px; font-size:13px;">الرقم</th>
          <th style="padding:10px 6px; border:1px solid #ddd; text-align:center; width:25%; font-size:13px;">اسم الشركة</th>
          <th style="padding:10px 6px; border:1px solid #ddd; text-align:center; width:30%; font-size:13px;">المنتج / الون</th>
          <th style="padding:10px 6px; border:1px solid #ddd; text-align:center; width:15%; font-size:13px;">المقاس</th>
          <th style="padding:10px 6px; border:1px solid #ddd; text-align:center; width:15%; font-size:13px;">العدد</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>
  </div>`;

  // إنشاء عنصر مؤقت خارج نطاق الشاشة
  const tempDiv = document.createElement("div");
  tempDiv.style.cssText = "position:fixed; left:-9999px; top:0; z-index:-1;";
  tempDiv.innerHTML = pdfHTML;
  document.body.appendChild(tempDiv);

  const opt = {
    margin: 10,
    filename: fileName,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf()
    .set(opt)
    .from(tempDiv.firstElementChild)
    .outputPdf("blob")
    .then((pdfBlob) => {
      document.body.removeChild(tempDiv);

      const pdfFile = new File([pdfBlob], fileName, {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        navigator
          .share({
            files: [pdfFile],
            title: "ملف طلبية المستودع",
            text: `مرفق لكم مستند الطلبية الرسمي لفرع (${branchName}).`,
          })
          .catch((error) => console.error("خطأ أثناء المشاركة:", error));
      } else {
        html2pdf()
          .set(opt)
          .from(tempDiv.firstElementChild)
          .save()
          .catch(() => {
            // نسخة احتياطية إذا فشل الحفظ
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
          });
      }
    });
}

// تصدير ملف الاكسل
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
    ["م", "اسم الشركة", "اسم المنتج", "المقاس", "العدد"],
  ];

  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach((row, index) => {
    const comp = row.querySelector(".comp-name").value;
    const prod = row.querySelector(".prod-name").value;
    const size = row.querySelector(".prod-size").value;
    const qty = row.querySelector(".prod-qty").value;
    data.push([index + 1, comp, prod, size, qty]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "تفاصيل الطلب");
  XLSX.writeFile(wb, `طلبية_مستودع_${branch}.xlsx`);
}
