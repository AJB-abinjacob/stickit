const forms = document.querySelectorAll(".form");
const loading = document.querySelector("#loading");

const formSubmitHandler = (e) => {
  loading.classList.replace("hidden", "flex");
};

forms.forEach((form) => {
  form.addEventListener("submit", formSubmitHandler);
});
