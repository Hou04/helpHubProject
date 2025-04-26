const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}
// Add dropdown toggle for click behavior
document.querySelector('.nav-link').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent default link behavior
  const dropdown = this.nextElementSibling; // Get the next sibling (the dropdown menu)
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
  const isDropdown = event.target.closest('.nav-item');
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if (!isDropdown) menu.style.display = 'none';
  });
});

// Close navbar when link is clicked
const navLink = document.querySelectorAll(".nav-link");


const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

// Event listeners for mobile menu
hamburger.addEventListener("click", mobileMenu);
navLink.forEach((n) => n.addEventListener("click", closeMenu));

// Functions for mobile menu
function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

// Function to switch theme
function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    updateParticleColor("dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    updateParticleColor("light");
  }
}

// Add event listener for theme toggle
toggleSwitch.addEventListener("change", switchTheme, false);

// Save user preference on load
const currentTheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : null;

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
    updateParticleColor("dark");
  } else {
    updateParticleColor("light");
  }
}

// Function to update the particle color based on theme
function updateParticleColor(theme) {
  const particleColor = theme === "dark" ? "#FFFFFF" : "#000000"; // White for dark theme, Black for light theme

  particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 100,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": particleColor
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.3,
          "sync": false
        }
      },
      "size": {
        "value": 2,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 2,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false
      },
      "move": {
        "enable": true,
        "speed": 0.5,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 0
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 100,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 7
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
}

// Initialize date
let myDate = document.querySelector("#datee");
const yes = new Date().getFullYear();
myDate.innerHTML = yes;

// Clickable cards event listeners


// Testimonial carousel
jQuery(document).ready(function($) {
  "use strict";
  $('#customers-testimonials').owlCarousel({
    loop: true,
    center: true,
    items: 3,
    margin: 0,
    autoplay: true,
    dots: true,
    autoplayTimeout: 8500,
    smartSpeed: 450,
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      1170: { items: 3 }
    }
  });
});

function showTimeline(timelineNumber = 1) { // Default to 1
    // Get all timelines and tabs
    const timelines = document.querySelectorAll('.timeline');
    const tabs = document.querySelectorAll('.tab');

    // Hide all timelines and remove 'active' class from tabs
    timelines.forEach(timeline => timeline.classList.remove('active'));
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show the selected timeline and add 'active' class to corresponding tab
    document.getElementById(`timeline${timelineNumber}`).classList.add('active');
    tabs[timelineNumber - 1].classList.add('active');
}

// Call the function with the default value on page load
document.addEventListener('DOMContentLoaded', () => showTimeline());


const texts = [
    "Fondation de Carthage par les Phéniciens",
    "Conquête romaine et apogée antique",
    "Émergence de l'ère arabo-musulmane",
    "Indépendance et modernisation nationale"
];
const speed = 100; // Speed of typing
const pause = 2000; // Pause between texts
let textIndex = 0;
let charIndex = 0;

function typeWriter() {
    if (charIndex < texts[textIndex].length) {
        document.getElementById("typewriter").innerHTML += texts[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, speed);
    } else {
        setTimeout(() => {
            document.getElementById("typewriter").innerHTML = "";
            charIndex = 0;
            textIndex = (textIndex + 1) % texts.length; // Loop through texts
            typeWriter();
        }, pause);
    }
}

typeWriter();

const rotateLogos = () => {
  const logoGroups = document.querySelectorAll('.logo-group');

  logoGroups.forEach((group) => {
    const logos = group.querySelectorAll('.logo');

    // Rotate classes for each group
    logos.forEach((logo) => {
      if (logo.classList.contains('to-top')) {
        logo.classList.remove('to-top');
        logo.classList.add('active');
      } else if (logo.classList.contains('active')) {
        logo.classList.remove('active');
        logo.classList.add('to-bottom');
      } else if (logo.classList.contains('to-bottom')) {
        logo.classList.remove('to-bottom');
        logo.classList.add('to-top');
      }
    });
  });
};

// Rotate logos every 3 seconds (adjust the interval if needed)
setInterval(rotateLogos, 3000);




