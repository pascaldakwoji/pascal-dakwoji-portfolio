const progress = document.querySelector(".progress");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");
const magneticItems = document.querySelectorAll(".magnetic");
const parallaxItems = document.querySelectorAll(".parallax");
const prototypeScreens = document.querySelectorAll(".prototype-screen");
const prototypeSteps = document.querySelectorAll(".prototype-step");
const savoraPrototype = document.querySelector("[data-savora-prototype]");

document.getElementById("year").textContent = new Date().getFullYear();

function updateProgress() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progressWidth = height > 0 ? (scrollTop / height) * 100 : 0;

  if (progress) {
    progress.style.width = `${progressWidth}%`;
  }

  parallaxItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) * 0.035;

    item.style.transform =
      `translateY(${Math.max(-18, Math.min(26, offset))}px)`;
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay =
    `${Math.min(index * 35, 220)}ms`;

  observer.observe(item);
});

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    navToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      navLinks.classList.remove("open");

      navToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  });
}

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left -
      rect.width / 2;

    const y =
      event.clientY -
      rect.top -
      rect.height / 2;

    item.style.transform =
      `translate(${x * 0.12}px, ${y * 0.2}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});


/* =========================================
   GENERAL PROTOTYPE
========================================= */

function setPrototypeStep(step) {
  if (!prototypeScreens.length) return;

  prototypeScreens.forEach((screen) => {
    screen.hidden =
      screen.dataset.screen !== String(step);
  });

  prototypeSteps.forEach((button) => {
    const isActive =
      button.dataset.prototypeStep ===
      String(Math.min(step, 3));

    button.classList.toggle(
      "active",
      isActive
    );
  });
}

prototypeSteps.forEach((button) => {
  button.addEventListener("click", () => {
    setPrototypeStep(
      Number(button.dataset.prototypeStep)
    );
  });
});

document
  .querySelectorAll("[data-next-step]")
  .forEach((button) => {

    button.addEventListener("click", () => {

      const current =
        [...prototypeScreens].find(
          (screen) => !screen.hidden
        );

      const next =
        current
          ? Number(current.dataset.screen) + 1
          : 0;

      setPrototypeStep(
        Math.min(next, 3)
      );
    });
  });

document
  .querySelectorAll("[data-set-step]")
  .forEach((button) => {

    button.addEventListener("click", () => {

      setPrototypeStep(
        Number(button.dataset.setStep)
      );
    });
  });

setPrototypeStep(0);


/* =========================================
   SAVORA INTERACTIVE PROTOTYPE
========================================= */

if (savoraPrototype) {

  const savoraStates = [

    {
      title: "Home",
      src: "savora/HOME PAGE.png",
      note: "User selects a meal/category."
    },

    {
      title: "Meals",
      src: "savora/MENU PAGE.png",
      note: "User browses available meals."
    },

    {
      title: "Meal Details",
      src: "savora/PLACE YOUR ORDER.png",
      note: "User views the selected meal."
    },

    {
      title: "Your Order",
      src: "savora/YOUR ORDER.png",
      note: "User reviews the order."
    },

    {
      title: "Delivery Address",
      src: "savora/DELIVERY ADDRESS.png",
      note: "User confirms delivery details."
    },

    {
      title: "Payment",
      src: "savora/PAYMENT PAGE.png",
      note: "User selects payment method."
    },

    {
      title: "Order Confirmation",
      src: "savora/CONFIRMATION PAGE.png",
      note: "Your order has been successfully confirmed."
    },

    {
      title: "Order Tracking",
      src: "savora/ORDER TRACKING PAGE.png",
      note: "Show the current order tracking state."
    },

    {
      title: "Out for Delivery",
      src: "savora/ORDER TRACKING PAGE 2.png",
      note: "Show the rider on the way tracking screen."
    },

    {
      title: "Delivered",
      src: "savora/ORDER TRACKING PAGE 3.png",
      note: "Show the final delivered order state."
    }

  ];


  let savoraIndex = 0;


  const screen =
    savoraPrototype.querySelector(
      "[data-savora-screen]"
    );

  const title =
    savoraPrototype.querySelector(
      "[data-savora-title]"
    );

  const note =
    savoraPrototype.querySelector(
      "[data-savora-note]"
    );

  const count =
    savoraPrototype.querySelector(
      "[data-savora-count]"
    );

  const screenButton =
    savoraPrototype.querySelector(
      ".savora-prototype-screen"
    );


  function setSavoraState(index) {

    savoraIndex =
      (index + savoraStates.length) %
      savoraStates.length;

    const state =
      savoraStates[savoraIndex];


    screenButton.classList.add(
      "is-changing"
    );


    window.setTimeout(() => {

      screen.src = state.src;

      screen.alt =
        `Savora prototype ${state.title} screen`;

      title.textContent =
        state.title;

      note.textContent =
        state.note;

      count.textContent =
        `State ${String(
          savoraIndex + 1
        ).padStart(2, "0")}`;


      /*
       * Keep every Savora screenshot
       * at the same visual scale.
       *
       * No special scaling is applied
       * to Confirmation or any other screen.
       */

      screen.style.transform = "";
      screen.style.transformOrigin = "";


      screenButton.classList.remove(
        "is-changing"
      );

    }, 140);
  }


  /* NEXT */

  savoraPrototype
    .querySelectorAll("[data-savora-next]")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {
          setSavoraState(
            savoraIndex + 1
          );
        }
      );

    });


  /* PREVIOUS */

  const previousButton =
    savoraPrototype.querySelector(
      "[data-savora-prev]"
    );

  if (previousButton) {

    previousButton.addEventListener(
      "click",
      () => {
        setSavoraState(
          savoraIndex - 1
        );
      }
    );

  }


  /* RESTART */

  const restartButton =
    savoraPrototype.querySelector(
      "[data-savora-restart]"
    );

  if (restartButton) {

    restartButton.addEventListener(
      "click",
      () => {
        setSavoraState(0);
      }
    );

  }


  /* START AT HOME */

  setSavoraState(0);
}


/* =========================================
   PAGE EVENTS
========================================= */

window.addEventListener(
  "scroll",
  updateProgress,
  { passive: true }
);

window.addEventListener(
  "resize",
  updateProgress
);

updateProgress();
