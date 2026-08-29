/*************************************************************** 
    Get Mobile Toggle Button And Nav
***************************************************************/
const mobileToggleBtn = document.querySelector(".mobile-toggle-btn");
const nav = document.querySelector("nav");
const toggleIcon = document.querySelector(".mobile-toggle-btn i");


/****************************************************************
  Add Active Class to Nav On Click For Display Nav Links 
****************************************************************/
mobileToggleBtn.onclick = function () {
    nav.classList.toggle("active");
    toggleIcon.classList.toggle("fa-times");
}


/****************************************************************
  Nav Dropdown (Nasza misja) - Click & Hover Intent Support
****************************************************************/
document.querySelectorAll(".nav-dropdown").forEach(function (dropdown) {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    let closeTimer = null;

    function openDropdown() {
        clearTimeout(closeTimer);

        document.querySelectorAll(".nav-dropdown.active").forEach(function (openDropdown) {
            if (openDropdown !== dropdown) {
                openDropdown.classList.remove("active");
            }
        });

        dropdown.classList.add("active");
    }

    function scheduleClose() {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(function () {
            dropdown.classList.remove("active");
        }, 300);
    }

    toggle.addEventListener("click", function (e) {
        e.preventDefault();
        const isActive = dropdown.classList.contains("active");

        document.querySelectorAll(".nav-dropdown.active").forEach(function (openDropdown) {
            openDropdown.classList.remove("active");
        });

        if (!isActive) {
            dropdown.classList.add("active");
        }
    });

    dropdown.addEventListener("mouseenter", openDropdown);
    dropdown.addEventListener("mouseleave", scheduleClose);
});

document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-dropdown")) {
        document.querySelectorAll(".nav-dropdown.active").forEach(function (openDropdown) {
            openDropdown.classList.remove("active");
        });
    }
});

/****************************************************************
  Seminar section navigation highlight
****************************************************************/
const seminarSectionLinks = document.querySelectorAll(".seminar-section-link");
const seminarSections = document.querySelectorAll(".seminar-card[id]");

if (seminarSectionLinks.length && seminarSections.length) {
   const activeSeminarLink = function (id) {
       seminarSectionLinks.forEach(function (link) {
           const isActive = link.getAttribute("href") === "#" + id;
           link.classList.toggle("active", isActive);
       });
   };

   const observer = new IntersectionObserver(function (entries) {
       const visibleEntries = entries.filter(function (entry) {
           return entry.isIntersecting;
       });

       if (visibleEntries.length) {
           visibleEntries.sort(function (a, b) {
               return b.intersectionRatio - a.intersectionRatio;
           });
           activeSeminarLink(visibleEntries[0].target.id);
       }
   }, {
       rootMargin: "-30% 0px -45% 0px",
       threshold: [0.2, 0.4, 0.6]
   });

   seminarSections.forEach(function (section) {
       observer.observe(section);
   });
}


/****************************************************************
  Gallery Modal
****************************************************************/
const galleryModal = document.getElementById("galleryModal");
const galleryLightbox = document.getElementById("galleryLightbox");

if (galleryModal && galleryLightbox) {
    const galleryModalTitle = galleryModal.querySelector(".gallery-modal-title");
    const galleryModalCount = galleryModal.querySelector(".gallery-modal-count");
    const galleryModalGrid = galleryModal.querySelector(".gallery-modal-grid");
    const galleryModalClose = galleryModal.querySelector(".gallery-modal-close");

    const lightboxImage = galleryLightbox.querySelector(".gallery-lightbox-image");
    const lightboxCounter = galleryLightbox.querySelector(".gallery-lightbox-counter");
    const lightboxClose = galleryLightbox.querySelector(".gallery-lightbox-close");
    const lightboxPrev = galleryLightbox.querySelector(".gallery-lightbox-prev");
    const lightboxNext = galleryLightbox.querySelector(".gallery-lightbox-next");

    let currentImages = [];
    let currentTitle = "";
    let currentIndex = 0;

    function openGalleryModal(title, images) {
        currentImages = images;
        currentTitle = title;

        galleryModalTitle.textContent = title;
        galleryModalCount.textContent = images.length + (images.length === 1 ? " zdjęcie" : " zdjęć");
        galleryModalGrid.innerHTML = "";

        images.forEach(function (imgSrc, idx) {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = title + " - zdjęcie " + (idx + 1);
            img.loading = "lazy";
            figure.appendChild(img);
            figure.addEventListener("click", function () {
                openLightbox(idx);
            });
            galleryModalGrid.appendChild(figure);
        });

        galleryModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeGalleryModal() {
        galleryModal.classList.remove("active");
        if (!galleryLightbox.classList.contains("active")) {
            document.body.style.overflow = "";
        }
    }

    function renderLightbox() {
        lightboxImage.classList.remove("show");
        setTimeout(function () {
            lightboxImage.src = currentImages[currentIndex];
            lightboxImage.alt = currentTitle + " - zdjęcie " + (currentIndex + 1);
            requestAnimationFrame(function () {
                lightboxImage.classList.add("show");
            });
        }, 120);

        lightboxCounter.textContent = (currentIndex + 1) + " / " + currentImages.length;
    }

    function openLightbox(index) {
        currentIndex = index;
        renderLightbox();
        galleryLightbox.classList.add("active");
        document.body.style.overflow = "hidden";
        requestAnimationFrame(function () {
            galleryLightbox.classList.add("show");
        });
    }

    function closeLightbox() {
        galleryLightbox.classList.remove("show");
        lightboxImage.classList.remove("show");
        setTimeout(function () {
            galleryLightbox.classList.remove("active");
            if (!galleryModal.classList.contains("active")) {
                document.body.style.overflow = "";
            }
        }, 300);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        renderLightbox();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        renderLightbox();
    }

    document.querySelectorAll(".gallery-box").forEach(function (box) {
        box.addEventListener("click", function () {
            const title = box.getAttribute("data-title") || "Galeria";
            const images = (box.getAttribute("data-images") || "").split(",").filter(Boolean);

            if (images.length) {
                openGalleryModal(title, images);
            }
        });
    });

    galleryModalClose.addEventListener("click", closeGalleryModal);

    galleryModal.addEventListener("click", function (e) {
        if (e.target === galleryModal) {
            closeGalleryModal();
        }
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", showPrev);
    lightboxNext.addEventListener("click", showNext);

    galleryLightbox.addEventListener("click", function (e) {
        if (e.target === galleryLightbox || e.target.classList.contains("gallery-lightbox-stage")) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (galleryLightbox.classList.contains("active")) {
            if (e.key === "Escape") {
                closeLightbox();
            } else if (e.key === "ArrowLeft") {
                showPrev();
            } else if (e.key === "ArrowRight") {
                showNext();
            }
            return;
        }

        if (galleryModal.classList.contains("active") && e.key === "Escape") {
            closeGalleryModal();
        }
    });
}