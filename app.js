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
// توليد PDF من عنصر مستقل بنفس تنسيق الكمبيوتر تماماً على الجوال
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
        <td style="padding:10px 6px; border:1px solid #ddd; text-align:center; font-weight:bold; font-size:13px;">${index + 1}</td>
        <td style="padding:10px 6px; border:1px solid #ddd; text-align:center; font-size:13px; word-break:break-word;">${comp}</td>
        <td style="padding:10px 6px; border:1px solid #ddd; text-align:center; font-size:13px; word-break:break-word;">${prod}</td>
        <td style="padding:10px 6px; border:1px solid #ddd; text-align:center; font-size:13px; word-break:break-word;">${size}</td>
        <td style="padding:10px 6px; border:1px solid #ddd; text-align:center; font-weight:bold; font-size:13px;">${qty}</td>
      </tr>`;
  });

  // الـ HTML الموسط والنظيف للـ PDF (ثابت العرض 750px ليناسب مقاس الـ A4 تماماً)
  const pdfHTML = `
  <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    direction: rtl;
    padding: 40px 30px;
    color: #1a1a1a;
    width: 750px;
    box-sizing: border-box;
    background: #fff;
  ">
    <div style="text-align:center; border-bottom:3px double #2c3e50; padding-bottom:18px; margin-bottom:22px;">
      <h1 style="font-size:22px; color:#2c3e50; margin:0 0 8px 0; font-weight:bold;">مستند طلب توريد بضائع من مستودع الفصوص</h1>
      <p style="font-size:13px; color:#666; margin:0;">وثيقة صادرة إلكترونياً من نظام تسجيل طلبات للفروع الداخلية</p>
    </div>

    <div style="
      background:#ecf0f1;
      padding:12px 16px;
      border-radius:6px;
      text-align:center;
      font-weight:bold;
      color:#2c3e50;
      margin-bottom:25px;
      border-right:5px solid #2c3e50;
      border-left:5px solid #2c3e50;
      font-size:14px;
    ">${timeText}</div>

    <div style="display:table; width:100%; margin-bottom:25px; border-collapse:separate; border-spacing:15px 0;">
      <div style="display:table-cell; width:50%; text-align:center; background:#f8f9fa; padding:15px; border-radius:6px; border:1px solid #eaeaea;">
        <div style="font-weight:bold; color:#2c3e50; margin-bottom:6px; font-size:13px;">📍 موقع الفرع</div>
        <div style="font-size:16px; font-weight:bold; color:#000;">${branchName}</div>
      </div>
      <div style="display:table-cell; width:50%; text-align:center; background:#f8f9fa; padding:15px; border-radius:6px; border:1px solid #eaeaea;">
        <div style="font-weight:bold; color:#2c3e50; margin-bottom:6px; font-size:13px;">👤 اسم الموظف</div>
        <div style="font-size:16px; font-weight:bold; color:#000;">${employeeName}</div>
      </div>
    </div>

    <div style="font-size:16px; font-weight:bold; color:#2c3e50; margin-bottom:15px; padding-bottom:8px; border-bottom:2px solid #ecf0f1;">
      📦 تفاصيل الأصناف
    </div>

    <table style="width:100%; border-collapse:collapse; table-layout:fixed; box-sizing:border-box;">
      <thead>
        <tr style="background:#2c3e50; color:#fff;">
          <th style="padding:12px 6px; border:1px solid #ddd; text-align:center; width:50px; font-size:13px; font-weight:bold;">الرقم</th>
          <th style="padding:12px 6px; border:1px solid #ddd; text-align:center; width:200px; font-size:13px; font-weight:bold;">اسم الشركة</th>
          <th style="padding:12px 6px; border:1px solid #ddd; text-align:center; width:260px; font-size:13px; font-weight:bold;">المنتج / الون</th>
          <th style="padding:12px 6px; border:1px solid #ddd; text-align:center; width:120px; font-size:13px; font-weight:bold;">المقاس</th>
          <th style="padding:12px 6px; border:1px solid #ddd; text-align:center; width:120px; font-size:13px; font-weight:bold;">العدد</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>
  </div>`;

  // إنشاء العنصر المؤقت وإبقائه مرئياً للمحرك مع نقله بعيداً عن عين المستخدم فقط لضمان حساب أبعاده الكاملة
  const tempDiv = document.createElement("div");
  tempDiv.style.cssText = "position:absolute; top:0; left:-2000px; width:750px; z-index:-9999; overflow:hidden;";
  tempDiv.innerHTML = pdfHTML;
  document.body.appendChild(tempDiv);

  // الخدعة البرمجية: إجبار الجوال على محاكاة شاشة عرض كمبيوتر واسعة أثناء الالتقاط
  const opt = {
    margin: 10,
    filename: fileName,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      width: 750,        // قفل العرض على نفس حجم الـ div الرئيسي لضمان عدم الانكماش
      windowWidth: 750   // جعل المتصفح يلتقط الصورة وكأنه كمبيوتر بعرض 750px تماماً
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf()
    .set(opt)
    .from(tempDiv)
    .outputPdf("blob")
    .then((pdfBlob) => {
      document.body.removeChild(tempDiv); // حذف العنصر المؤقت بعد الانتهاء فوراً

      const pdfFile = new File([pdfBlob], fileName, {
        type: "application/pdf",
      });

      // 1️⃣ التنزيل والمشاركة التلقائية معاً في نفس الوقت
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 2️⃣ إطلاق نافذة المشاركة الحقيقية للملف الفعلي على الجوال
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        setTimeout(() => {
          navigator.share({
            files: [pdfFile],
            title: "ملف طلبية المستودع",
            text: `مرفق لكم مستند الطلبية الرسمي لفرع (${branchName}).`,
          }).catch((error) => console.error("خطأ أثناء المشاركة:", error));
        }, 500); // تأخير بسيط جداً لعدم تداخل التنزيل مع نافذة المشاركة
      } else {
        // إذا كان المتصفح لا يدعم المشاركة المباشرة نفتح الرابط في صفحة جديدة كخيار احتياطي موسط ونظيف
        window.open(url, '_blank');
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
