// 1) تهيئة الخريطة (عدّل الإحداثيات على منطقتك إن رغبت)
 var map = L.map('map').setView([31.45, 34.23], 12);

  // طبقة OpenStreetMap (الخريطة الافتراضية)
  var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  });

  // طبقة القمر الصناعي (من Esri)
  var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
  });

  // إضافة الطبقة الأساسية (OSM)
  osm.addTo(map);

  // أداة التحكم بين الطبقات
  var baseMaps = {
    "الخريطة العادية": osm,
    "القمر الصناعي": satellite
  };

  L.control.layers(baseMaps).addTo(map);
// 3) منطق القائمة المنسدلة
const dropdownBtn  = document.querySelector(".dropdown-btn");
const dropdownMenu = document.querySelector(".dropdown-menu");

if (dropdownBtn && dropdownMenu) {
  dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdownMenu.style.display === "block";
    dropdownMenu.style.display = isOpen ? "none" : "block";
  });

  // إخفاء القائمة عند الضغط خارجها
  document.addEventListener("click", (e) => {
    if (!dropdownMenu.contains(e.target) && !dropdownBtn.contains(e.target)) {
      dropdownMenu.style.display = "none";
    }
  });
}



document.getElementById("btn-add")?.addEventListener("click", () => {
  alert("يجب عليك تسجيل الدخول لتتمكن من اضافة ملك جديد");
});



// طبقة لتجميع القياسات
const measureLayer = L.layerGroup().addTo(map);

// حالة القياس
let measuring = false;
let startLatLng = null;
let tempLine = null;

// تحكم زر القياس
const MeasureControl = L.Control.extend({
  options: { position: "topleft" },
  onAdd: function () {
    const container = L.DomUtil.create("div", "leaflet-bar measure-control");
    const btn = L.DomUtil.create("a", "measure-btn", container);
    btn.href = "#";
    btn.title = "قياس المسافة (اختر نقطتين)";
    btn.innerHTML = "📏";

    // منع انتشار أحداث الزر إلى الخريطة
    L.DomEvent.on(btn, "click", L.DomEvent.stop)
              .on(btn, "click", toggleMeasure);
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    return container;
  }
});

map.addControl(new MeasureControl());

// زر لمسح القياسات
const ClearMeasureControl = L.Control.extend({
  options: { position: "topleft" },
  onAdd: function () {
    const container = L.DomUtil.create("div", "leaflet-bar measure-control");
    const btn = L.DomUtil.create("a", "clear-measure-btn", container);
    btn.href = "#";
    btn.title = "مسح القياسات";
    btn.innerHTML = "❌";

    L.DomEvent.on(btn, "click", L.DomEvent.stop)
              .on(btn, "click", () => {
                measureLayer.clearLayers();
              });
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    return container;
  }
});

map.addControl(new ClearMeasureControl());

// تبديل وضع القياس
function toggleMeasure() {
  measuring = !measuring;

  if (measuring) {
    map.getContainer().classList.add("measuring-cursor");
    map.doubleClickZoom.disable();
    startLatLng = null;
    if (tempLine) { map.removeLayer(tempLine); tempLine = null; }

    map.on("click", onMapClick);
    map.on("mousemove", onMapMouseMove);
  } else {
    map.getContainer().classList.remove("measuring-cursor");
    map.doubleClickZoom.enable();

    map.off("click", onMapClick);
    map.off("mousemove", onMapMouseMove);

    if (tempLine) { map.removeLayer(tempLine); tempLine = null; }
    startLatLng = null;
  }
}

// التقاط النقرتين
function onMapClick(e) {
  if (!startLatLng) {
    // النقطة الأولى
    startLatLng = e.latlng;

    // مؤشر بداية (غير تفاعلي حتى لا يلخبط النقر)
    L.circleMarker(startLatLng, {
      radius: 6, weight: 2, color: "#e11", fillColor: "#fff", fillOpacity: 1, interactive: false
    }).addTo(measureLayer);

  } else {
    // النقطة الثانية + إنهاء
    const endLatLng = e.latlng;
    finalizeMeasure(startLatLng, endLatLng);
    toggleMeasure(); // إيقاف وضع القياس بعد الإنهاء
  }
}

// خط مؤقت أثناء التحريك
function onMapMouseMove(e) {
  if (!startLatLng) return;

  const latlngs = [startLatLng, e.latlng];
  if (!tempLine) {
    tempLine = L.polyline(latlngs, { color: "#e11", weight: 2, opacity: 0.8, dashArray: "6,6" }).addTo(map);
  } else {
    tempLine.setLatLngs(latlngs);
  }
}

// إنشاء الخط النهائي وبطاقة المسافة
function finalizeMeasure(a, b) {
  if (tempLine) { map.removeLayer(tempLine); tempLine = null; }

  const line = L.polyline([a, b], { color: "red", weight: 3 }).addTo(measureLayer);

  const distance = a.distanceTo(b);
  const text = distance >= 1000 ? (distance / 1000).toFixed(2) + " كم" : distance.toFixed(1) + " متر";

  // نقطة منتصف لعرض البطاقة
  const mid = L.latLng((a.lat + b.lat) / 2, (a.lng + b.lng) / 2);

  // بطاقة ثابتة (Tooltip دائم)
  const label = L.tooltip({
    permanent: true,
    direction: "center",
    className: "measure-label"
  })
    .setLatLng(mid)
    .setContent("المسافة: " + text)
    .addTo(map);

  measureLayer.addLayer(line);
  measureLayer.addLayer(label);
}

// إلغاء سريع بالـ ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && measuring) {
    toggleMeasure();
  }
});


// زر تحديد الموقع
const LocateControl = L.Control.extend({
  options: { position: "topleft" },
  onAdd: function () {
    const container = L.DomUtil.create("div", "leaflet-bar locate-control");
    const btn = L.DomUtil.create("a", "locate-btn", container);
    btn.href = "#";
    btn.title = "تحديد موقعي الحالي";
    btn.innerHTML = "📌";

    L.DomEvent.on(btn, "click", L.DomEvent.stop)
              .on(btn, "click", locateUser);
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    return container;
  }
});

map.addControl(new LocateControl());

// المتغيرات للاحتفاظ بالماركر والدائرة
let userMarker = null;
let userCircle = null;

function locateUser() {
  if (!navigator.geolocation) {
    alert("المتصفح لا يدعم تحديد الموقع");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = pos.coords.accuracy;

      // إزالة الماركر القديم والدائرة إن وجدت
      if (userMarker) map.removeLayer(userMarker);
      if (userCircle) map.removeLayer(userCircle);

      // إضافة ماركر للموقع
      userMarker = L.marker([lat, lng]).addTo(map)
        .bindPopup("موقعي الحالي").openPopup();

      // تحريك الخريطة إلى موقع المستخدم
      map.setView([lat, lng], 17);
    },
    (err) => {
      alert("تعذر الحصول على الموقع: " + err.message);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}
