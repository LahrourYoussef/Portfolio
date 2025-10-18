const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");

  // NOUVELLE LIGNE INDISPENSABLE :
  // Ajoute/enlève la classe "menu-open" sur le <body>
  // pour bloquer le défilement et afficher le fond grisé.
  document.body.classList.toggle("menu-open");
});
