/* =========================================================
   SETTINGS
========================================================= */

/*
    ضع رقم واتساب المدرس هنا.

    مثال:
    01012345678

    سيصبح:
    201012345678
*/

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
    ".method-grid, .video-grid, .values-list"
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

    /*
        نستخدم youtube-nocookie
        لتقليل مشاكل الخصوصية والـ cookies.
    */

    const embedUrl =
        `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

    videoFrame.src = embedUrl;

    videoModal.classList.add("active");

    document.body.classList.add("modal-open");

}


function closeVideo() {

    videoModal.classList.remove("active");

    document.body.classList.remove("modal-open");

    /*
        إيقاف الفيديو تمامًا
        عند إغلاق النافذة.
    */

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


/*
    إغلاق الفيديو بزر ESC
*/

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