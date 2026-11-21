// Year-End Offer page only (year-end-offer.html). Not loaded by the live index page.
// Rate: Rs.100 per kg/L + GST. Extra 10% off: ABC above 4 kg, CO2 above 4.5 kg.
(function () {
  const type = document.getElementById("yeCalcType");
  const size = document.getElementById("yeCalcSize");
  const qty = document.getElementById("yeCalcQty");
  const out = document.getElementById("yeCalcOut");
  const wa = document.getElementById("yeCalcWa");
  if (!type || !size || !qty || !out || !wa) return;

  const RATE = 100, GST = 0.18;
  const TYPES = {
    ABC: { unit: "kg", list: [1, 2, 4, 6, 9, 12], def: 6, discAbove: 4 },
    CO2: { unit: "kg", list: [2, 4.5, 6, 9], def: 4.5, discAbove: 4.5 },
    Foam: { unit: "L", list: [9], def: 9, discAbove: null },
    Water: { unit: "L", list: [9], def: 9, discAbove: null }
  };

  function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
  function cfg() { return TYPES[type.value] || TYPES.ABC; }

  function fillSizes() {
    const c = cfg();
    size.innerHTML = c.list.map(function (v) {
      return '<option value="' + v + '"' + (v === c.def ? " selected" : "") + ">" + v + " " + c.unit + "</option>";
    }).join("");
  }

  function update() {
    const c = cfg();
    const cap = Number(size.value) || 0;
    const n = Math.max(1, Math.min(500, Math.floor(Number(qty.value) || 1)));
    const disc = c.discAbove !== null && cap > c.discAbove ? 0.10 : 0;
    const list = cap * RATE;
    const per = list * (1 - disc);
    const total = per * n;
    const saved = (list - per) * n;

    let html = "<div class='yc-line'>Per cylinder: " + cap + " " + c.unit + " × ₹100 = " +
      (disc ? "<s>" + inr(list) + "</s> <b>" + inr(per) + "</b> <span class='off'>10% off</span>" : "<b>" + inr(per) + "</b>") + "</div>";
    html += "<div class='yc-total'>" + n + " cylinder" + (n > 1 ? "s" : "") + ": <b>" + inr(total) + "</b> + GST</div>";
    if (saved > 0) html += "<div class='yc-save'>🎉 Aap bacha rahe hain <b>" + inr(saved) + "</b></div>";
    html += "<div class='yc-msg'>Sirf <b>" + inr(total) + "</b> mein aapke " + n + " extinguisher" + (n > 1 ? "s" : "") +
      " phir se emergency-ready — aapka fire safety investment kaam ka bana rahega.</div>";
    html += "<div class='yc-pick'>" + (n >= 4 ? "✅ FREE pickup &amp; drop included*" : "Add " + (4 - n) + " more cylinder" + (4 - n > 1 ? "s" : "") + " for FREE pickup &amp; drop*") + "</div>";
    out.innerHTML = html;

    const msg = "Hello The Fire Wala, Year-End offer quote chahiye: " + n + " x " + cap + " " + c.unit + " " + type.value +
      " (estimate " + inr(total) + " + GST).";
    wa.href = "https://wa.me/917772078610?text=" + encodeURIComponent(msg);
  }

  type.addEventListener("change", function () { fillSizes(); update(); });
  size.addEventListener("change", update);
  qty.addEventListener("input", update);
  wa.addEventListener("click", function () {
    if (typeof tfwTrack === "function") tfwTrack("whatsapp_click", { location: "ye_calculator" });
  });
  fillSizes();
  update();
})();
