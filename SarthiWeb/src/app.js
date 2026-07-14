/* ===================================================
   SARTHI EXIM INDIA — FRONT-END LOGIC
   All data below is placeholder copy for a static build.
   Where a real backend exists, replace the marked stubs
   (search "BACKEND HOOK") with real fetch() calls — see
   the matching API endpoints in the full-stack prompt.
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- LOADER ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => document.getElementById("loader").classList.add("done"), 500);
  });

  /* ---------- HERO ANIMATIONS & PARALLAX ---------- */
  const headline = document.getElementById("hero-headline");
  if(headline) {
    const words = headline.innerHTML.split(/(\s+|<br>)/);
    let html = "";
    let delay = 0;
    words.forEach(word => {
      if(word.trim() === "" || word === "<br>") {
        html += word;
      } else {
        html += `<span class="word" style="animation-delay: ${delay}s">${word}</span>`;
        delay += 0.06;
      }
    });
    headline.innerHTML = html;
  }

  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  window.addEventListener('mousemove', (e) => {
    if(!parallaxLayers.length) return;
    const x = (e.clientX - window.innerWidth / 2);
    const y = (e.clientY - window.innerHeight / 2);
    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-speed')) || 0.05;
      layer.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });

  /* ---------- MAGNETIC BUTTONS ---------- */
  document.querySelectorAll('.btn:not(.btn-text)').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  /* ---------- 3D TILT ENGINE ---------- */
  window.applyTilt = (selector) => {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-4px)`;
        card.style.transition = 'none';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = ``;
        card.style.transition = 'transform .5s var(--ease), box-shadow .5s var(--ease)';
      });
    });
  };

  /* ---------- SCROLL PROGRESS + NAVBAR + BACK TO TOP ---------- */
  const progress = document.getElementById("scroll-progress");
  const navbar = document.getElementById("navbar");
  const backTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = pct + "%";
    navbar.classList.toggle("scrolled", h.scrollTop > 40);
    backTop.classList.toggle("show", h.scrollTop > 600);
  }, { passive: true });
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- CUSTOM CURSOR ---------- */
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (matchMedia("(hover:hover)").matches) {
    window.addEventListener("mousemove", (e) => {
      dot.style.left = ring.style.left = e.clientX + "px";
      dot.style.top = ring.style.top = e.clientY + "px";
    });
    document.querySelectorAll("a,button").forEach(el => {
      el.addEventListener("mouseenter", () => { ring.style.width = "48px"; ring.style.height = "48px"; ring.style.opacity = "0.35"; });
      el.addEventListener("mouseleave", () => { ring.style.width = "32px"; ring.style.height = "32px"; ring.style.opacity = "0.6"; });
    });
  }

  /* ---------- MOBILE NAV ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

  /* ---------- ACTIVE LINK HIGHLIGHT ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navMap = {};
  document.querySelectorAll(".nav-link").forEach(a => navMap[a.getAttribute("href").slice(1)] = a);
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = navMap[entry.target.id];
      if (!link) return;
      if (entry.isIntersecting) {
        document.querySelectorAll(".nav-link").forEach(a => a.style.opacity = "0.85");
        link.style.opacity = "1";
      }
    });
  }, { rootMargin: "-40% 0px -50% 0px" });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- SCROLL REVEAL ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll("[data-reveal]").forEach((el, i) => {
    el.style.setProperty("--d", i % 6);
    revealObserver.observe(el);
  });

  /* ---------- COOKIE BANNER ---------- */
  const cookieBanner = document.getElementById("cookie-banner");
  if (!sessionStorage.getItem("sei_cookie_choice")) {
    setTimeout(() => cookieBanner.classList.add("show"), 1200);
  }
  const hideCookie = (choice) => {
    sessionStorage.setItem("sei_cookie_choice", choice);
    cookieBanner.classList.remove("show");
  };
  document.getElementById("cookie-accept").addEventListener("click", () => hideCookie("accepted"));
  document.getElementById("cookie-decline").addEventListener("click", () => hideCookie("declined"));

  /* =========================================================
     DATA — replace with real API responses (GET /api/products,
     /api/certificates, /api/gallery, /api/testimonials) once
     the backend from the full-stack prompt is wired up.
  ========================================================= */
  const PRODUCTS = [
    { id:"chilli", name:"Dry Red Chilli (Teja S17)", swatch:"sw-chilli",
      desc:"High-pungency dried red chilli, sun-cured and stemmed for consistent colour and heat.",
      specs:{ Grade:"Teja S17, Grade A", Moisture:"≤ 10%", Pungency:"55,000–75,000 SHU",
        Packaging:"25kg PP / jute bags, custom sizes on request", MOQ:"1 metric ton (LCL) / 1 FCL (25MT)",
        Applications:"Spice blends, sauces, oleoresin extraction", "Export markets":"Middle East, Sri Lanka, Bangladesh" } },
    { id:"turmeric", name:"Turmeric Finger", swatch:"sw-turmeric",
      desc:"Whole turmeric finger with high curcumin content, cleaned and polished for export.",
      specs:{ Grade:"Salem / Erode finger, Grade A", Curcumin:"≥ 3.5%", Moisture:"≤ 10%",
        Packaging:"25kg / 50kg PP bags", MOQ:"1 metric ton (LCL) / 1 FCL (25MT)",
        Applications:"Food colouring, spice powder, nutraceuticals", "Export markets":"UAE, UK, USA, Japan" } },
    { id:"pepper", name:"Black Pepper", swatch:"sw-pepper",
      desc:"Malabar-grade black pepper, machine-cleaned and graded for uniform size and oil content.",
      specs:{ Grade:"MG1 / 500 GL", "Bulk density":"500–550 g/l", Moisture:"≤ 11%",
        Packaging:"25kg PP bags with liner", MOQ:"500kg (sample/LCL) / 1 FCL",
        Applications:"Whole spice trade, oleoresin, food processing", "Export markets":"Europe, USA, Middle East" } },
    { id:"cardamom", name:"Green Cardamom", swatch:"sw-cardamom",
      desc:"Bold, aromatic green cardamom pods sorted by size for premium retail and bulk buyers.",
      specs:{ Grade:"8mm Bold / AGEB", Moisture:"≤ 10%", Colour:"Natural green, sun/AC dried",
        Packaging:"5kg / 10kg vacuum-sealed cartons", MOQ:"250kg (sample) / 1MT+",
        Applications:"Retail spice, chai blends, confectionery", "Export markets":"Middle East, Central Asia" } },
    { id:"garlic", name:"Garlic", swatch:"sw-garlic",
      desc:"Fresh and dehydrated garlic bulbs, sized and cured for long-distance shipping.",
      specs:{ Grade:"4.5cm–6cm+ bulbs", Moisture:"Fresh: natural / Dehydrated: ≤ 6%",
        Packaging:"10kg mesh bags / cartons", MOQ:"1 metric ton (LCL) / 1 FCL",
        Applications:"Fresh produce trade, dehydrated garlic flakes/powder", "Export markets":"Gulf, Southeast Asia" } },
    { id:"onion", name:"Onion", swatch:"sw-onion",
      desc:"Export-grade fresh red onions, size-sorted and cured for storage stability in transit.",
      specs:{ Grade:"40mm–80mm, Grade A", Moisture:"Natural, cured", "Shelf life":"45–60 days from loading",
        Packaging:"25kg / 50kg mesh bags", MOQ:"1 FCL (approx. 27MT)",
        Applications:"Fresh produce trade, retail and food service", "Export markets":"Malaysia, UAE, Sri Lanka" } },
  ];

  const CERTIFICATES = [
    { code:"IEC", name:"Importer Exporter Code", note:"DGFT-issued code authorising cross-border trade." },
    { code:"GST", name:"GST Registration", note:"Registered under India's Goods & Services Tax." },
    { code:"FSSAI", name:"FSSAI License", note:"Food safety licence for handling export produce." },
    { code:"MSME", name:"MSME / Udyam", note:"Registered micro, small & medium enterprise." },
    { code:"RCMC", name:"Spices Board RCMC", note:"Registration-cum-Membership Certificate for spice exports." },
    { code:"FIEO", name:"FIEO Membership", note:"Federation of Indian Export Organisations member." },
  ];

  const GALLERY = {
    "Red Chilli":3, "Turmeric":3, "Black Pepper":2, "Green Cardamom":2, "Garlic":2, "Onion":2,
    "Warehouse":2, "Packing":2, "Container Loading":2, "Quality Inspection":2
  };

  const PROCESS = [
    { t:"Sourcing", d:"Produce sourced directly from growers and regional mandis in-season." },
    { t:"Quality check", d:"Incoming lots tested for moisture, purity and pesticide residue." },
    { t:"Cleaning", d:"Mechanical cleaning and grading to remove foreign matter." },
    { t:"Packaging", d:"Packed to buyer spec — jute, PP, vacuum or mesh, by product." },
    { t:"Documentation", d:"Invoice, packing list, COO, phytosanitary and quality certs prepared." },
    { t:"Container loading", d:"Loaded and sealed under supervision with loading photos shared." },
    { t:"Shipping", d:"Booked with vetted freight forwarders on FCL or LCL terms." },
    { t:"Global delivery", d:"Tracked through to port of discharge and buyer confirmation." },
  ];

  const GLOBAL_STATS = [
    { num:18, suffix:"+", label:"Countries served" },
    { num:120, suffix:"+", label:"Active buyers" },
    { num:340, suffix:"+", label:"Containers exported" },
    { num:6, suffix:"", label:"Years of experience" },
  ];

  const ROUTES = [
    { from:"🇮🇳 Nhava Sheva", to:"🇦🇪 Jebel Ali", route:"Sea · FCL", transit:"9–11 days" },
    { from:"🇮🇳 Mundra", to:"🇸🇦 Jeddah", route:"Sea · FCL", transit:"12–15 days" },
    { from:"🇮🇳 Nhava Sheva", to:"🇱🇰 Colombo", route:"Sea · LCL/FCL", transit:"4–6 days" },
    { from:"🇮🇳 Mundra", to:"🇬🇧 Felixstowe", route:"Sea · FCL", transit:"24–28 days" },
    { from:"🇮🇳 Chennai", to:"🇲🇾 Port Klang", route:"Sea · LCL/FCL", transit:"7–9 days" },
  ];

  const TESTIMONIALS = [
    { quote:"Documentation was clean and the chilli grade matched the sample exactly — made customs clearance painless on our end.", who:"Procurement Manager, Foodstuff Trading Co.", flag:"🇦🇪" },
    { quote:"We've reordered turmeric three seasons running. Consistent moisture content and on-time loading every time.", who:"Buyer, Spice Import House", flag:"🇬🇧" },
    { quote:"Good communication throughout — from RFQ to bill of lading, we always knew where the container stood.", who:"Director, General Trading LLC", flag:"🇸🇦" },
  ];

  /* ---------- TRUST STRIP ---------- */
  const trustItems = ["Export Quality","Worldwide Shipping","Lab Tested","ISO Packaging","Secure Payment","Merchant Exporter","Fast Delivery","Quality Assurance","Global Logistics","Competitive Pricing"];
  const trustInner = document.getElementById("trust-track-inner");
  trustInner.innerHTML = [...trustItems, ...trustItems].map(t => `<span>${t}</span>`).join("<span>·</span>");

  /* ---------- RENDER PRODUCTS ---------- */
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card" data-id="${p.id}" tabindex="0">
      <div class="product-swatch ${p.swatch}">
        <img src="/images/products/${p.id}.png" alt="${p.name}" class="product-image" loading="lazy">
        <span class="badge">Export Quality</span>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <span class="product-view">View details</span>
      </div>
    </article>`).join("");

  const modal = document.getElementById("product-modal");
  const modalBody = document.getElementById("modal-body");
  function openProduct(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    modalBody.innerHTML = `
      <div class="detail-head">
        <div class="detail-swatch ${p.swatch}" style="position: relative; overflow: hidden;">
          <img src="/images/products/${p.id}.png" alt="${p.name}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">
        </div>
        <div><p class="eyebrow" style="margin-bottom:4px;">PRODUCT DETAIL</p><h3 style="font-family:var(--font-display);font-size:1.5rem;">${p.name}</h3></div>
      </div>
      <p style="color:var(--ink-70);">${p.desc}</p>
      <div class="detail-spec-grid">
        ${Object.entries(p.specs).map(([k,v]) => `<div><span class="k">${k}</span><span>${v}</span></div>`).join("")}
      </div>
      <div class="detail-actions">
        <a href="#rfq" class="btn btn-gold" data-close>Inquire about this product</a>
        <a href="#" class="btn btn-outline" data-download-spec>Download Specification PDF</a>
      </div>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
  productGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    if (card) openProduct(card.dataset.id);
  });
  productGrid.addEventListener("keypress", (e) => {
    if (e.key === "Enter") { const card = e.target.closest(".product-card"); if (card) openProduct(card.dataset.id); }
  });

  /* ---------- MODAL CLOSE HANDLING (shared) ---------- */
  document.querySelectorAll(".modal").forEach(m => {
    m.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-close")) {
        m.classList.remove("open");
        m.setAttribute("aria-hidden", "true");
      }
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.querySelectorAll(".modal.open").forEach(m => { m.classList.remove("open"); m.setAttribute("aria-hidden","true"); });
  });

  /* ---------- CERTIFICATES ---------- */
  document.getElementById("cert-grid").innerHTML = CERTIFICATES.map(c => `
    <div class="cert-card" data-reveal>
      <div class="cert-stamp">${c.code}</div>
      <h4>${c.name}</h4>
      <p>${c.note}</p>
    </div>`).join("");
  document.querySelectorAll("#cert-grid [data-reveal]").forEach((el,i) => { el.style.setProperty("--d", i % 6); revealObserver.observe(el); });

  /* ---------- GALLERY ---------- */
  const galleryTabs = document.getElementById("gallery-tabs");
  const galleryGrid = document.getElementById("gallery-grid");
  const categories = Object.keys(GALLERY);
  const swatchCycle = ["sw-chilli","sw-turmeric","sw-pepper","sw-cardamom","sw-garlic","sw-onion"];
  galleryTabs.innerHTML = categories.map((c,i) => `<button class="gallery-tab ${i===0?'active':''}" data-cat="${c}">${c}</button>`).join("");
  const galleryImages = {
    "Red Chilli": "/images/products/chilli.png",
    "Turmeric": "/images/products/turmeric.png",
    "Black Pepper": "/images/products/pepper.png",
    "Green Cardamom": "/images/products/cardamom.png",
    "Garlic": "/images/products/garlic.png",
    "Onion": "/images/products/onion.png",
    "Warehouse": "/images/gallery/warehouse.png",
    "Packing": "/images/gallery/packing.png",
    "Container Loading": "/images/gallery/loading.png",
    "Quality Inspection": "/images/gallery/quality.png"
  };
  function renderGallery(cat) {
    const count = GALLERY[cat];
    const imgSrc = galleryImages[cat];
    galleryGrid.innerHTML = Array.from({length:count}).map((_,i) => `
      <div class="gallery-item">
        <img src="${imgSrc}" alt="${cat} ${i+1}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .5s var(--ease); z-index:0;">
        <span>${cat} ${i+1}</span>
      </div>`).join("");
  }
  renderGallery(categories[0]);
  galleryTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".gallery-tab");
    if (!btn) return;
    galleryTabs.querySelectorAll(".gallery-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderGallery(btn.dataset.cat);
  });

  /* ---------- PROCESS ---------- */
  document.getElementById("process-track").innerHTML = PROCESS.map((s,i) => `
    <li class="process-step" data-reveal><span class="p-num">${String(i+1).padStart(2,"0")}</span><h4>${s.t}</h4><p>${s.d}</p></li>`).join("");
  document.querySelectorAll(".process-step[data-reveal]").forEach((el,i) => { el.style.setProperty("--d", i % 6); revealObserver.observe(el); });

  /* ---------- GLOBAL STATS (animated counters) ---------- */
  const statsWrap = document.getElementById("global-stats");
  statsWrap.innerHTML = GLOBAL_STATS.map(s => `
    <div class="stat-card" data-reveal>
      <span class="stat-num" data-target="${s.num}">0<span class="suffix">${s.suffix}</span></span>
      <span class="stat-label">${s.label}</span>
    </div>`).join("");
  document.querySelectorAll("#global-stats [data-reveal]").forEach(el => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffixEl = el.querySelector(".suffix");
      const suffix = suffixEl ? suffixEl.outerHTML : "";
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const tick = () => {
        cur = Math.min(target, cur + step);
        el.innerHTML = cur + suffix;
        if (cur < target) requestAnimationFrame(tick);
      };
      tick();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-num").forEach(el => counterObserver.observe(el));

  /* ---------- LEDGER (shipment routes) ---------- */
  document.getElementById("ledger-rows").innerHTML = ROUTES.map(r => `
    <div class="ledger-row"><span>${r.from}</span><span>${r.to}</span><span>${r.route}</span><span>${r.transit}</span></div>`).join("");

  /* ---------- TESTIMONIALS SLIDER ---------- */
  const testiTrack = document.getElementById("testi-track");
  const testiDots = document.getElementById("testi-dots");
  testiTrack.innerHTML = TESTIMONIALS.map(t => `
    <div class="testi-card">
      <p class="testi-quote">"${t.quote}"</p>
      <div class="testi-who"><span class="testi-flag">${t.flag}</span><span>${t.who}</span></div>
    </div>`).join("");
  testiDots.innerHTML = TESTIMONIALS.map((_,i) => `<span class="${i===0?'active':''}" data-i="${i}"></span>`).join("");
  let testiIndex = 0;
  function goTesti(i) {
    testiIndex = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
    testiTrack.style.transform = `translateX(-${testiIndex * 100}%)`;
    testiDots.querySelectorAll("span").forEach((d,j) => d.classList.toggle("active", j === testiIndex));
  }
  document.getElementById("testi-prev").addEventListener("click", () => goTesti(testiIndex - 1));
  document.getElementById("testi-next").addEventListener("click", () => goTesti(testiIndex + 1));
  testiDots.addEventListener("click", (e) => { const d = e.target.closest("span"); if (d) goTesti(parseInt(d.dataset.i,10)); });
  let testiTimer = setInterval(() => goTesti(testiIndex + 1), 6000);
  document.getElementById("testi-slider").addEventListener("mouseenter", () => clearInterval(testiTimer));
  document.getElementById("testi-slider").addEventListener("mouseleave", () => { testiTimer = setInterval(() => goTesti(testiIndex + 1), 6000); });

  /* ---------- RFQ FORM VALIDATION + SUBMIT ---------- */
  const rfqForm = document.getElementById("rfq-form");
  rfqForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    rfqForm.querySelectorAll(".field").forEach(field => {
      field.classList.remove("invalid");
      const errorEl = field.querySelector(".field-error");
      if (errorEl) errorEl.textContent = "";
    });

    rfqForm.querySelectorAll("[required]").forEach(input => {
      const field = input.closest(".field");
      const errorEl = field.querySelector(".field-error");
      let msg = "";
      if (!input.value.trim()) msg = "This field is required.";
      else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) msg = "Enter a valid email address.";
      
      if (msg) {
        field.classList.add("invalid");
        if (errorEl) errorEl.textContent = msg;
        valid = false;
      }
    });
    if (!valid) return;

    const submitBtn = rfqForm.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    fetch("https://formsubmit.co/ajax/gaurviverma0108@gmail.com", {
      method: "POST",
      body: new FormData(rfqForm)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Form submission failed");
        }
        return response.json();
      })
      .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        showThankYou();
        rfqForm.reset();
      })
      .catch(error => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        alert("There was an error sending your quote request. Please try again or email us directly at gaurviverma0108@gmail.com.");
        console.error("FormSubmit Error:", error);
      });
  });

  function showThankYou() {
    const ty = document.getElementById("thankyou");
    ty.classList.add("open");
    ty.setAttribute("aria-hidden", "false");
  }

  /* ---------- NEWSLETTER ---------- */
  document.getElementById("newsletter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("newsletter-email");
    if (!input.value.trim()) return;
    // BACKEND HOOK: fetch('/api/newsletter/subscribe', { method:'POST', body: JSON.stringify({email: input.value}) })
    input.value = "";
    input.placeholder = "Subscribed — thank you!";
  });

  /* ---------- DOWNLOAD PROFILE / SPEC STUBS ---------- */
  document.getElementById("download-profile").addEventListener("click", (e) => {
    e.preventDefault();
    alert("Hook this button up to your hosted Company Profile PDF (e.g. /files/company-profile.pdf).");
  });
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-download-spec]")) {
      e.preventDefault();
      alert("Hook this button up to the product's hosted specification PDF.");
    }
  });

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- INIT 3D TILT EFFECT ---------- */
  if(window.applyTilt) {
    window.applyTilt('.product-card, .why-card, .cert-card, .gallery-item, .contact-card, .testi-card');
  }

});
