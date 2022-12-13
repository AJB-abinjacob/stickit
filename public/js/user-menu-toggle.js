// hamburger menu
const menuBtn = document.querySelector("#menuBtn");
const mobileMenu = document.querySelector("#mobileMenu");
// mobile category
const mobileCategoryListBtn = document.querySelector("#mobileCategoryListBtn");
const mobileCategoryList = document.querySelector("#mobileCategoryList");
// desktop category
const categoryListBtn = document.querySelector("#categoryListBtn");
const categoryList = document.querySelector("#categoryList");
// search
const searchBtn = document.querySelector("#searchBtn");
const searchModal = document.querySelector("#searchModal");
const searchModalCancelBtn = document.querySelector("#searchModalCancelBtn");

const menuBtnHandler = () => {
  if (mobileMenu.classList.contains("hidden")) {
    return mobileMenu.classList.remove("hidden");
  }
  mobileMenu.classList.add("hidden");
};
const mobileCategoryListHandler = () => {
  if (mobileCategoryList.classList.contains("hidden")) {
    return mobileCategoryList.classList.remove("hidden");
  }
  mobileCategoryList.classList.add("hidden");
};
const categoryListHandler = () => {
  if (categoryList.classList.contains("hidden")) {
    return categoryList.classList.replace("hidden", "flex");
  }
  categoryList.classList.replace("flex", "hidden");
};
const searchBtnHandler = () => {
  if (searchModal.classList.contains("hidden")) {
    searchModal.classList.replace("hidden", "flex");
  }
};
const modalClickHandler = () => {
  if (searchModal.classList.contains("flex")) {
    searchModal.classList.replace("flex", "hidden");
  }
};

menuBtn.addEventListener("click", menuBtnHandler);
mobileCategoryListBtn.addEventListener("click", mobileCategoryListHandler);
categoryListBtn.addEventListener("click", categoryListHandler);
searchBtn.addEventListener("click", searchBtnHandler);
searchModalCancelBtn.addEventListener("click", modalClickHandler);
