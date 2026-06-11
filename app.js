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
  document.getElementById("metaHeader").style.display = "flex"; // إظهار شريط الوقت الموسط

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

// توليد ملف PDF موسط بالكامل وإرساله كمستند مرفق حقيقي عبر الواتساب أو البريد
    function shareAsPDF() {
        const element = document.getElementById("invoiceContainer");

        // تفعيل وضع مظهر الـ PDF الموسط المخصص
        element.classList.add("pdf-mode");

        const branchName = document.getElementById("branchLocation").value || "عام";
        const fileName = `طلبية_مستودع_${branchName}.pdf`;

        const opt = {
            margin:       15,
            filename:     fileName,
            image:        { type: "jpeg", quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" },
        };

        // تشغيل التحويل والحصول على الـ Blob للمشاركة المباشرة للملف الفعلي
        html2pdf()
            .set(opt)
            .from(element)
            .outputPdf("blob")
            .then((pdfBlob) => {
                element.classList.remove("pdf-mode"); // إعادة مظهر واجهة الموقع المتجاوبة

                // تحويل بيانات الـ Blob لملف حقيقي جاهز للإرسال والمشاركة الفورية
                const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

                // التحقق من صلاحية مشاركة الملفات على بيئة الهاتف الحالية
                if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
                    navigator.share({
                        files: [pdfFile], 
                        title: "ملف طلبية المستودع الموسط PDF",
                        text: `مرفق لكم مستند الطلبية الرسمي لفرع (${branchName}).`
                    })
                    .catch((error) => console.error("خطأ أثناء الارسال أو المشاركة:", error));
                } else {
                    // حل بديل فوري للمتصفحات التي لا تدعم مشاركة الملفات مباشرة كأجهزة الكمبيوتر
                    alert("المشاركة المباشرة للملفات غير مدعومة بالمتصفح الحالي، سيتم تحميل مستند الـ PDF الموسط على جهازك مباشرة.");
                    html2pdf().set(opt).from(element).save();
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
