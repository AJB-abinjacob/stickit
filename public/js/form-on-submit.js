const form = document.querySelector("#form");
const loading = document.querySelector("#loading");

const formSubmitHandler = (e) => {
  loading.classList.replace("hidden", "flex");
};

form.addEventListener("submit", formSubmitHandler);
