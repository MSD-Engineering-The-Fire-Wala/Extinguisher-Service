 const hamburger = document.getElementById("hamburger");
const navlinks = document.getElementById("navlinks");

if (hamburger && navlinks) {

    hamburger.addEventListener("click", function () {

        navlinks.classList.toggle("show");
        hamburger.classList.toggle("active");

        const isOpen = navlinks.classList.contains("show");

        hamburger.setAttribute("aria-expanded", isOpen);

        hamburger.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

    });

    navlinks.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            navlinks.classList.remove("show");
            hamburger.classList.remove("active");

            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute("aria-label", "Open navigation menu");

        });

    });

    const mobileBook = navlinks.querySelector(".mobile-book");

    if (mobileBook) {
        mobileBook.addEventListener("click", function () {

            navlinks.classList.remove("show");
            hamburger.classList.remove("active");

            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute("aria-label", "Open navigation menu");

        });
    }
}
// Close menu when clicking Book a service
navlinks.querySelector(".mobile-book").addEventListener(
    "click",
    function () {

        navlinks.classList.remove("show");
        hamburger.classList.remove("active");

        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
    }
);

function openModal() {
  const modal = document.getElementById("modal");
  const formBox = document.getElementById("formBox");
  const success = document.getElementById("success");

  if (!modal) {
    console.error("Modal container not found!");
    return;
  }

  // Show form again whenever modal opens
  if (formBox) formBox.style.display = "block";
  if (success) success.style.display = "none";

  modal.classList.add("show");
}

function closeModal() {
  const modal = document.getElementById("modal");

  if (modal) {
    modal.classList.remove("show");
  }
}

// Close modal when clicking outside the form box
const modal = document.getElementById("modal");

if (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });
}
/* =========================================
   FORM SUBMISSION
========================================= */

// GOOGLE SHEET RECEIVER (Google Apps Script web app)
// Paste the Apps Script "Web app URL" (ends with /exec) below.
const SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwasN-crY9yuP1QWLOzz1gcKA2aRIO8TUJEIk8DYoUa6uRTnnpFn1OlgFveo3s_P5lkHg/exec";

const SUCCESS_MESSAGE =
  "Thank you! Aapka form mil gaya hai. Hamari team jald hi aapse contact karegi.";

// Common function: send form data to the Google Sheet
async function sendServiceRequest(form) {
  const formData = new FormData(form);

  const phone = (formData.get("phone") || "").trim();
  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new Error("Please enter a valid 10-digit mobile number.");
  }

  const requestData = {
    client_name: (formData.get("clientName") || "").trim(),
    phone: phone,
    email: (formData.get("email") || "").trim(),
    company_name: (formData.get("company") || "").trim(),
    service_type: formData.get("serviceType") || "",
    extinguisher_quantity: formData.get("quantity") || "",
    form_id: form.id,
    page: window.location.href,
    website: formData.get("website") || "" // honeypot
  };

  if (SHEET_WEBAPP_URL.indexOf("https://") !== 0) {
    throw new Error("Form abhi setup ho raha hai. Kripya WhatsApp 77720 78610 par message karein.");
  }

  // text/plain avoids a CORS preflight; Apps Script reads the raw body
  await fetch(SHEET_WEBAPP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(requestData)
  });

  return { success: true };
}

function showFormSuccess(form) {
  let box = form.parentNode.querySelector(".form-success-msg");
  if (!box) {
    box = document.createElement("div");
    box.className = "form-success-msg";
    box.setAttribute("role", "status");
    form.parentNode.insertBefore(box, form.nextSibling);
  }
  box.textContent = "✓ " + SUCCESS_MESSAGE;
  box.style.display = "block";
}


// =========================================
// 1. HERO FORM
// =========================================

const heroForm = document.getElementById("quoteForm");

if (heroForm) {
  heroForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitButton = heroForm.querySelector(
      'button[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    try {
      await sendServiceRequest(heroForm);
      tfwTrack("lead_form_submit", { form_id: "hero" });
      heroForm.reset();
      showFormSuccess(heroForm);

    } catch (error) {
      console.error("Hero form error:", error);

      alert(
        error.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit your quote";
      }
    }
  });
}


// =========================================
// 2. MODAL FORM
// =========================================

const modalForm = document.getElementById("modalQuoteForm");

if (modalForm) {
  modalForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitButton = modalForm.querySelector(
      'button[type="submit"]'
    );

    const formBox = document.getElementById("formBox");
    const success = document.getElementById("success");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    try {
      await sendServiceRequest(modalForm);
      tfwTrack("lead_form_submit", { form_id: "modal" });

      if (formBox) formBox.style.display = "none";
      if (success) success.style.display = "block";

      modalForm.reset();


    } catch (error) {
      console.error("Modal form error:", error);

      alert(
        error.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Request";
      }
    }
  });
}

/*RISK SELECTOR*/

function risk(el) {

    if (!el) {
        return;
    }

    const risks = document.querySelectorAll('.risk');

    risks.forEach(function (item) {
        item.classList.remove('active');
    });

    el.classList.add('active');
}


/*FAQ ACCORDION*/

const faqQuestions = document.querySelectorAll('.faq-q');

faqQuestions.forEach(function (question) {

    question.addEventListener('click', function () {

        const parent = question.parentElement;

        if (parent) {
            parent.classList.toggle('open');
        }

    });

});


/*PROCESS SECTION*/

const steps = document.querySelectorAll('.step');
const processImg = document.getElementById('processImg');


steps.forEach(function (step) {

    step.addEventListener('click', function () {

        /* Remove active class from all steps */

        steps.forEach(function (item) {
            item.classList.remove('active');
        });
        /* Add active class to clicked step */

        step.classList.add('active');
        /* Make sure process image exists */
        if (!processImg) {
            return;
        }


        /* Get image path from data-img */

        let imagePath = step.dataset.img;
        if (!imagePath) {
            return;
        }
        imagePath = imagePath.replace(/\\/g, '/');
        /* Fade image out */

        processImg.style.opacity = '0';


        /* Change image after short delay */

        setTimeout(function () {
            processImg.src = imagePath;
            processImg.onload = function () {
                processImg.style.opacity = '1';
            };
            processImg.onerror = function () {
                processImg.style.opacity = '1';
                console.warn('Process image could not be loaded:', imagePath);
            };
        }, 180);
    });
});


/*INITIAL PROCESS IMAGE*/

if (processImg) {
    processImg.style.transition = 'opacity 180ms ease';
}
document.addEventListener("DOMContentLoaded", function () {

    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".slider-dot");

    if (!slides.length || !dots.length) return;

    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        currentIndex = index;
    }

    // Automatic slider: changes every 3 seconds
    setInterval(function () {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }, 6000);

    // Allow users to click dots
    dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

});


const quantityInput = document.getElementById("quantity");

if (quantityInput) {
    quantityInput.addEventListener("input", function () {

        const quantity = Number(this.value);

        if (this.value === "") {
            this.setCustomValidity("");

        } else if (!Number.isInteger(quantity)) {
            this.setCustomValidity(
                "Please enter a whole number."
            );

        } else if (quantity < 1) {
            this.setCustomValidity(
                "Minimum quantity should be 1."
            );

        } else if (quantity > 100) {
            this.setCustomValidity(
                "Maximum quantity allowed is 100."
            );

        } else {
            this.setCustomValidity("");
        }

    });
}

// visual step number and progress bar

document.addEventListener("DOMContentLoaded", function () {

    const steps = document.querySelectorAll(".step");
    const processImg = document.getElementById("processImg");
    const processTitle = document.getElementById("processTitle");
    const processDescription =
        document.getElementById("processDescription");
    const visualStepNumber =
        document.getElementById("visualStepNumber");
    const processProgress =
        document.getElementById("processProgress");
    const progressText =
        document.getElementById("progressText");

    if (!steps.length || !processImg) return;

    function activateStep(step, index) {

        // Update active step
        steps.forEach(item => item.classList.remove("active"));
        step.classList.add("active");

        // Read selected step details
        const image = step.dataset.img;
        const title = step.dataset.title;
        const description = step.dataset.description;

        // Update image immediately
        if (image) {
            processImg.src = image;
        }

        processImg.alt = title || "Fire extinguisher servicing process";

        // Update title and description
        if (processTitle) {
            processTitle.textContent = title || "";
        }

        if (processDescription) {
            processDescription.textContent = description || "";
        }

        // Update step number
        const number = String(index + 1).padStart(2, "0");

        if (visualStepNumber) {
            visualStepNumber.textContent = `STEP ${number} / 08`;
        }

        // Update progress bar
        if (processProgress) {
            processProgress.style.width =
                `${((index + 1) / steps.length) * 100}%`;
        }

        if (progressText) {
            progressText.textContent =
                `${index + 1} of ${steps.length} steps`;
        }
    }

    // Click handler
    steps.forEach((step, index) => {
        step.addEventListener("click", function () {
            activateStep(step, index);
        });
    });
    // IMPORTANT: Initialize the active step on page refresh
    const initialStep =
        document.querySelector(".step.active") || steps[0];
    const initialIndex = Array.from(steps).indexOf(initialStep);
    activateStep(initialStep, initialIndex);
});

/*OUR CLIENTS CAROUSEL*/

document.addEventListener("DOMContentLoaded", function () {

    const track = document.querySelector(".clients-track");
    const cards = document.querySelectorAll(".client-card");
    const prevButton = document.querySelector(".client-prev");
    const nextButton = document.querySelector(".client-next");
    const dotsContainer = document.querySelector(".client-dots");

    if (
        !track ||
        !cards.length ||
        !prevButton ||
        !nextButton ||
        !dotsContainer
    ) {
        return;
    }
    let currentPage = 0;
    let autoSlide;


    /*CARDS PER VIEW*/

    function getCardsPerView() {
        if (window.innerWidth <= 700) {
            return 1;
        }
        if (window.innerWidth <= 1100) {
            return 3;
        }
        return 5;
    }


    /*TOTAL PAGES*/
    function getTotalPages() {
        const cardsPerView = getCardsPerView();
        return Math.ceil(
            cards.length / cardsPerView
        );
    }


    /*CREATE DOTS*/

    function createDots() {
        dotsContainer.innerHTML = "";
        const totalPages = getTotalPages();
        for (let i = 0; i < totalPages; i++) {
            const dot =
                document.createElement("button");
            dot.className = "client-dot";
            dot.type = "button";
            dot.setAttribute(
                "aria-label",
                `Show client group ${i + 1}`
            );
            dot.addEventListener(
                "click",
                function () {
                    currentPage = i;
                    updateCarousel();
                    restartAutoSlide();
                }
            );
            dotsContainer.appendChild(dot);
        }
    }


    /*UPDATE CAROUSEL*/

    function updateCarousel() {
        const cardsPerView = getCardsPerView();
        const totalPages = getTotalPages();
        if (currentPage >= totalPages) {
            currentPage = 0;
        }
        if (currentPage < 0) {
            currentPage = totalPages - 1;
        }
        const cardWidth =
            cards[0].offsetWidth;
        const gap =
            parseFloat(
                getComputedStyle(track).gap
            ) || 0;
        const moveAmount =
            currentPage *
            cardsPerView *
            (cardWidth + gap);
        track.style.transform =
            `translateX(-${moveAmount}px)`;
        /* Update dots */
        const dots =
            dotsContainer.querySelectorAll(
                ".client-dot"
            );
        dots.forEach(function (dot, index) {
            dot.classList.toggle(
                "active",
                index === currentPage
            );
        });
    }


    /*NEXT*/

    nextButton.addEventListener(
        "click",
        function () {
            currentPage++;
            if (
                currentPage >=
                getTotalPages()
            ) {
                currentPage = 0;
            }
            updateCarousel();
            restartAutoSlide();
        });

   /*PREVIOUS*/

    prevButton.addEventListener(
        "click",
        function () {
            currentPage--;
            if (currentPage < 0) {
                currentPage =
                    getTotalPages() - 1;
            }
            updateCarousel();
            restartAutoSlide();
        });


    /* =========================================
       AUTO SLIDE
    ========================================= */

    function startAutoSlide() {

        autoSlide = setInterval(
            function () {

                currentPage++;

                if (
                    currentPage >=
                    getTotalPages()
                ) {
                    currentPage = 0;
                }

                updateCarousel();

            },
            6000
        );

    }


    function restartAutoSlide() {

        clearInterval(autoSlide);

        startAutoSlide();

    }


    /*PAUSE ON HOVER*/

    const carousel =
        document.querySelector(
            ".clients-carousel"
        );

    if (carousel) {

        carousel.addEventListener(
            "mouseenter",
            function () {

                clearInterval(autoSlide);

            }
        );


        carousel.addEventListener(
            "mouseleave",
            function () {

                startAutoSlide();

            }
        );

    }


    /*RESPONSIVE*/

    window.addEventListener(
        "resize",
        function () {

            currentPage = 0;

            createDots();

            updateCarousel();

            restartAutoSlide();

        }
    );


    /*INITIALIZE*/

    createDots();

    updateCarousel();

    startAutoSlide();

});


/*NEW CYLINDER DELIVERY CAROUSEL*/
document.addEventListener("DOMContentLoaded",function(){
const slides=document.querySelectorAll(".cylinder-slide");
const dots=document.querySelectorAll(".cylinder-dot");
const prev=document.querySelector(".cylinder-prev");
const next=document.querySelector(".cylinder-next");

if(!slides.length)return;

let current=0;
let autoSlide;

function showSlide(index){
current=(index+slides.length)%slides.length;

slides.forEach((slide,i)=>{
slide.classList.toggle("active",i===current);
});

dots.forEach((dot,i)=>{
dot.classList.toggle("active",i===current);
});
}

function nextSlide(){
showSlide(current+1);
}

function startAutoSlide(){
clearInterval(autoSlide);
autoSlide=setInterval(nextSlide,4000);
}

function resetAutoSlide(){
startAutoSlide();
}

next.addEventListener("click",function(){
nextSlide();
resetAutoSlide();
});

prev.addEventListener("click",function(){
showSlide(current-1);
resetAutoSlide();
});

dots.forEach((dot,index)=>{
dot.addEventListener("click",function(){
showSlide(index);
resetAutoSlide();
});
});

showSlide(0);
startAutoSlide();
});

/* =========================================
FORM INPUT RESTRICTIONS
========================================= */

const clientNameInput = document.getElementById("clientName");
const phoneInput = document.getElementById("phone");
const companyInput = document.getElementById("company");

if (clientNameInput) {
  clientNameInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-z ]/g, "").slice(0, 50);
  });
}

if (phoneInput) {
  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
  });
}

if (companyInput) {
  companyInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-z ]/g, "").slice(0, 100);
  });
}

// =========================================
// CONVERSION TRACKING (GTM dataLayer events)
// whatsapp_click, call_click, lead_form_submit
// =========================================

function tfwTrack(eventName, extra) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: eventName }, extra || {}));
}

document.addEventListener("click", function (e) {
  const link = e.target.closest && e.target.closest("a[href]");
  if (!link) return;
  const href = link.getAttribute("href") || "";
  if (href.indexOf("wa.me/") !== -1 || href.indexOf("api.whatsapp.com") !== -1) {
    tfwTrack("whatsapp_click", { link_location: link.className || "link" });
  } else if (href.indexOf("tel:") === 0) {
    tfwTrack("call_click", { link_location: link.className || "link" });
  }
});


// =========================================
// HEALTH CHECK QUIZ
// =========================================
(function () {
  const quiz = document.getElementById("hcQuiz");
  const out = document.getElementById("hcResult");
  if (!quiz || !out) return;
  const wa = "https://wa.me/917772078610?text=";
  quiz.addEventListener("submit", function (e) {
    e.preventDefault();
    const fd = new FormData(quiz);
    let score = 0;
    for (const v of fd.values()) score += Number(v) || 0;
    let level, title, text;
    if (score >= 4) {
      level = "high"; title = "🔴 High risk";
      text = "Your extinguisher may not work when needed. Get it inspected and refilled now.";
    } else if (score >= 1) {
      level = "mid"; title = "🟠 Needs attention";
      text = "Some checks failed. A quick inspection and refill is recommended.";
    } else {
      level = "low"; title = "🟢 Looks OK";
      text = "Good! Keep checking monthly. Save our number for your next due date.";
    }
    const msg = encodeURIComponent("Hello The Fire Wala, my extinguisher health check result: " + title.replace(/^\S+\s/, "") + ". Please share refilling quote. Number of cylinders: ");
    out.className = "hc-result show " + level;
    out.innerHTML = "<h3>" + title + "</h3><p>" + text + "</p>" +
      '<a class="btn whatsapp-btn" target="_blank" rel="noopener noreferrer" href="' + wa + msg + '">WhatsApp for refilling ₹100/kg</a>';
    if (typeof tfwTrack === "function") tfwTrack("health_check_result", { risk_level: level });
  });
})();


// =========================================
// PRICE CALCULATOR: Rs.100 per kg/L + GST, size discount (>4: 10%, >=9: 15%)
// =========================================
(function () {
  const type = document.getElementById("calcType");
  const size = document.getElementById("calcSize");
  const qty = document.getElementById("calcQty");
  const out = document.getElementById("calcOut");
  const wa = document.getElementById("calcWa");
  if (!size || !qty || !out || !wa) return;
  const RATE = 100, GST = 0.18;
  const SIZES = {
    ABC: { unit: "kg", list: [1, 2, 4, 6, 9], def: 6 },
    CO2: { unit: "kg", list: [2, 4.5, 6, 9], def: 4.5 },
    Foam: { unit: "L", list: [6, 9, 50], def: 9 },
    Water: { unit: "L", list: [6, 9], def: 9 }
  };
  function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
  function disc(c) { if (!type) return 0; return c >= 9 ? 0.15 : c > 4 ? 0.10 : 0; }
  function cfg() { return SIZES[type ? type.value : "ABC"] || SIZES.ABC; }
  function fillSizes() {
    if (!type) return;
    const c = cfg();
    size.innerHTML = c.list.map(v => '<option value="' + v + '"' + (v === c.def ? " selected" : "") + ">" + v + " " + c.unit + "</option>").join("");
  }
  function update() {
    const c = cfg(), cap = Number(size.value) || 0;
    const n = Math.max(1, Math.min(500, Math.floor(Number(qty.value) || 1)));
    const d = disc(cap), list = cap * RATE, per = list * (1 - d), base = per * n;
    out.innerHTML =
      "Per cylinder: " + cap + " " + c.unit + " × ₹100 = " + inr(list) +
      (d ? " → <b>" + inr(per) + "</b> after " + (d * 100) + "% size discount" : " → <b>" + inr(per) + "</b>") +
      "<br>" + n + " cylinder(s): <b>" + inr(base) + "</b> + GST (" + inr(base * (1 + GST)) + " incl. 18% GST)<br>" +
      (n >= 4 ? "✅ FREE pickup &amp; drop included" : "Add " + (4 - n) + " more cylinder(s) for FREE pickup &amp; drop");
    const t = type ? type.value : "ABC";
    const msg = "Hello The Fire Wala, I want refilling quote: " + n + " x " + cap + " " + c.unit + " " + t + " (estimate " + inr(base) + " + GST).";
    wa.href = "https://wa.me/917772078610?text=" + encodeURIComponent(msg);
  }
  if (type) type.addEventListener("change", function () { fillSizes(); update(); });
  size.addEventListener("change", update);
  qty.addEventListener("input", update);
  fillSizes();
  update();
})();
