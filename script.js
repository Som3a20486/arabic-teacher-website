/* =========================================================
   SETTINGS
========================================================= */

const WHATSAPP_NUMBER = "201029564663";

const WHATSAPP_MESSAGE =
    "السلام عليكم، أرغب في الاستفسار عن دروس اللغة العربية.";


/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.classList.add("hide");
    }, 900);

});


/* =========================================================
   NAVBAR
========================================================= */

const navbar = document.querySelector(".navbar");

function handleNavbar() {

    if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

}

window.addEventListener("scroll", handleNavbar);

handleNavbar();


/* =========================================================
   HAMBURGER MENU
========================================================= */

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const mobileOverlay = document.getElementById("mobileOverlay");

function toggleMenu() {

    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    mobileOverlay.classList.toggle("active");
    document.body.classList.toggle("modal-open");

}

function closeMenu() {

    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.classList.remove("modal-open");

}

hamburger.addEventListener("click", toggleMenu);
mobileOverlay.addEventListener("click", closeMenu);

navLinks.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", closeMenu);

});


/* =========================================================
   REVEAL ON SCROLL
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach((element) => {

    revealObserver.observe(element);

});


/* =========================================================
   STAGGER ANIMATION
========================================================= */

const grids = document.querySelectorAll(
    ".method-grid, .video-grid, .values-list, .achievements-grid"
);

grids.forEach((grid) => {

    const children =
        grid.querySelectorAll(".reveal");

    children.forEach((child, index) => {

        child.style.transitionDelay =
            `${index * 0.12}s`;

    });

});


/* =========================================================
   VIDEO MODAL
========================================================= */

const videoCards =
    document.querySelectorAll(".video-card");

const videoModal =
    document.getElementById("videoModal");

const videoFrame =
    document.getElementById("videoFrame");

const modalClose =
    document.getElementById("modalClose");

const modalOverlay =
    document.querySelector(".modal-overlay");


function openVideo(videoId) {

    const embedUrl =
        `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

    videoFrame.src = embedUrl;

    videoModal.classList.add("active");

    document.body.classList.add("modal-open");

}


function closeVideo() {

    videoModal.classList.remove("active");

    document.body.classList.remove("modal-open");

    setTimeout(() => {

        videoFrame.src = "";

    }, 400);

}


videoCards.forEach((card) => {

    card.addEventListener("click", () => {

        const videoId =
            card.dataset.video;

        if (!videoId) return;

        openVideo(videoId);

    });

});


modalClose.addEventListener(
    "click",
    closeVideo
);

modalOverlay.addEventListener(
    "click",
    closeVideo
);


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            videoModal.classList.contains("active")
        ) {

            closeVideo();

        }

    }
);


/* =========================================================
   WHATSAPP
========================================================= */

function openWhatsApp(event) {

    event.preventDefault();

    if (
        !WHATSAPP_NUMBER ||
        WHATSAPP_NUMBER.includes("X")
    ) {

        alert(
            "من فضلك ضع رقم واتساب المدرس داخل ملف script.js أولًا."
        );

        return;

    }

    const encodedMessage =
        encodeURIComponent(
            WHATSAPP_MESSAGE
        );

    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


const whatsappButton =
    document.getElementById(
        "whatsappButton"
    );

const contactWhatsapp =
    document.getElementById(
        "contactWhatsapp"
    );


whatsappButton.addEventListener(
    "click",
    openWhatsApp
);

contactWhatsapp.addEventListener(
    "click",
    openWhatsApp
);


/* =========================================================
   BACK TO TOP
========================================================= */

const backTop =
    document.getElementById("backTop");


function handleBackTop() {

    if (window.scrollY > 700) {

        backTop.classList.add("visible");

    } else {

        backTop.classList.remove("visible");

    }

}


window.addEventListener(
    "scroll",
    handleBackTop
);


backTop.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor =
    document.querySelector(".cursor");

const follower =
    document.querySelector(
        ".cursor-follower"
    );


let mouseX = 0;
let mouseY = 0;

let followerX = 0;
let followerY = 0;


document.addEventListener(
    "mousemove",
    (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        cursor.style.left =
            `${mouseX}px`;

        cursor.style.top =
            `${mouseY}px`;

    }
);


function animateCursor() {

    followerX +=
        (mouseX - followerX) * .12;

    followerY +=
        (mouseY - followerY) * .12;

    follower.style.left =
        `${followerX}px`;

    follower.style.top =
        `${followerY}px`;

    requestAnimationFrame(
        animateCursor
    );

}


animateCursor();


/* =========================================================
   CURSOR HOVER EFFECT
========================================================= */

const interactiveElements =
    document.querySelectorAll(
        "a, button, .video-card, .method-card"
    );


interactiveElements.forEach((element) => {

    element.addEventListener(
        "mouseenter",
        () => {

            cursor.classList.add("hover");

            follower.classList.add(
                "hover"
            );

        }
    );

    element.addEventListener(
        "mouseleave",
        () => {

            cursor.classList.remove(
                "hover"
            );

            follower.classList.remove(
                "hover"
            );

        }
    );

});


/* =========================================================
   PARALLAX EFFECT
========================================================= */

const heroImage =
    document.querySelector(
        ".hero-image-wrapper"
    );


document.addEventListener(
    "mousemove",
    (event) => {

        if (
            !heroImage ||
            window.innerWidth < 900
        ) {
            return;
        }

        const x =
            (event.clientX / window.innerWidth - .5) * 12;

        const y =
            (event.clientY / window.innerHeight - .5) * 12;

        heroImage.style.transform =
            `translate(${x}px, ${y}px)`;

    }
);


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach((link) => {

    link.addEventListener(
        "click",
        function (event) {

            const targetId =
                this.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(
                    targetId
                );

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

});


/* =========================================================
   TEXT MOUSE EFFECT
========================================================= */

const heroTitle =
    document.querySelector(
        ".title-main"
    );


if (heroTitle) {

    heroTitle.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                heroTitle.getBoundingClientRect();

            const x =
                (event.clientX - rect.left)
                / rect.width;

            const y =
                (event.clientY - rect.top)
                / rect.height;

            const moveX =
                (x - .5) * 10;

            const moveY =
                (y - .5) * 10;

            heroTitle.style.transform =
                `translate(${moveX}px, ${moveY}px)`;

        }
    );


    heroTitle.addEventListener(
        "mouseleave",
        () => {

            heroTitle.style.transform =
                "translate(0,0)";

        }
    );

}


/* =========================================================
   TESTIMONIALS SLIDER
========================================================= */

const testimonialsTrack =
    document.getElementById("testimonialsTrack");

const testimonialPrev =
    document.getElementById("testimonialPrev");

const testimonialNext =
    document.getElementById("testimonialNext");

const testimonialDots =
    document.getElementById("testimonialDots");

let currentTestimonial = 0;
let testimonialAutoPlay;


function getTestimonialsPerView() {

    if (window.innerWidth <= 650) return 1;
    if (window.innerWidth <= 1000) return 2;
    return 3;

}


function getTotalTestimonialPages() {

    const cards =
        testimonialsTrack
            .querySelectorAll(".testimonial-card");

    const perView =
        getTestimonialsPerView();

    return Math.max(
        1,
        cards.length - perView + 1
    );

}


function createTestimonialDots() {

    testimonialDots.innerHTML = "";

    const total =
        getTotalTestimonialPages();

    for (let i = 0; i < total; i++) {

        const dot =
            document.createElement("div");

        dot.classList.add(
            "testimonial-dot"
        );

        if (i === 0) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {

            goToTestimonial(i);

        });

        testimonialDots.appendChild(dot);

    }

}


function goToTestimonial(index) {

    const total =
        getTotalTestimonialPages();

    currentTestimonial = index;

    if (currentTestimonial >= total) {
        currentTestimonial = 0;
    }

    if (currentTestimonial < 0) {
        currentTestimonial = total - 1;
    }

    const card =
        testimonialsTrack
            .querySelector(".testimonial-card");

    if (!card) return;

    const cardWidth =
        card.offsetWidth + 25;

    testimonialsTrack.style.transform =
        `translateX(${currentTestimonial * cardWidth}px)`;

    updateTestimonialDots();

}


function updateTestimonialDots() {

    const dots =
        testimonialDots
            .querySelectorAll(".testimonial-dot");

    dots.forEach((dot, i) => {

        dot.classList.toggle(
            "active",
            i === currentTestimonial
        );

    });

}


function nextTestimonial() {

    goToTestimonial(
        currentTestimonial + 1
    );

}


function prevTestimonial() {

    goToTestimonial(
        currentTestimonial - 1
    );

}


testimonialNext.addEventListener(
    "click",
    nextTestimonial
);

testimonialPrev.addEventListener(
    "click",
    prevTestimonial
);


function startTestimonialAutoplay() {

    testimonialAutoPlay = setInterval(
        nextTestimonial,
        5000
    );

}


function stopTestimonialAutoplay() {

    clearInterval(testimonialAutoPlay);

}


const testimonialsContainer =
    document.querySelector(
        ".testimonials-container"
    );

if (testimonialsContainer) {

    testimonialsContainer.addEventListener(
        "mouseenter",
        stopTestimonialAutoplay
    );

    testimonialsContainer.addEventListener(
        "mouseleave",
        startTestimonialAutoplay
    );

}


createTestimonialDots();
startTestimonialAutoplay();

window.addEventListener("resize", () => {

    createTestimonialDots();
    goToTestimonial(0);

});


/* =========================================================
   FAQ ACCORDION
========================================================= */

const faqItems =
    document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {

    const question =
        item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        const isActive =
            item.classList.contains("active");

        faqItems.forEach((otherItem) => {

            otherItem.classList.remove("active");

            otherItem
                .querySelector(".faq-question")
                .setAttribute(
                    "aria-expanded",
                    "false"
                );

        });

        if (!isActive) {

            item.classList.add("active");

            question.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

});


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "%c Arabic Portfolio ",
    "color:#e7cb7b;font-size:20px;font-weight:bold;"
);

console.log(
    "%c Designed with Arabic identity.",
    "color:#999;font-size:12px;"
);