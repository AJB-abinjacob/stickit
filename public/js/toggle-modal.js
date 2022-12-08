const openModalbtn = document.getElementById("openModalbtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");

const modal = document.getElementById("modal");

const openModalHandler = () => {
  if (modal.classList.contains("hidden")) {
    modal.classList.replace("hidden", "flex");
  }
};

const cancelModalHandler = () => {
  if (modal.classList.contains("flex")) {
    modal.classList.replace("flex", "hidden");
  }
};

openModalbtn.addEventListener("click", openModalHandler);
cancelModalBtn.addEventListener("click", cancelModalHandler);
