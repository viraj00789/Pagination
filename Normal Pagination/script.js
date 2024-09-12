const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedList = document.getElementById("paginated-list");
const listItems = paginatedList.querySelectorAll("li");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

const fetchData = async () => 
{
  const data =  await fetch("https://jsonplaceholder.typicode.com/posts");
  const json =  await data.json();
  console.log(json)
}

const paginationLimit = 10;
const pageCount = Math.ceil(listItems.length / paginationLimit);
console.log(pageCount);
let currentPage = 1;

const disableButton = (button) => {
  button.classList.add("disabled");
  button.setAttribute("disabled", true);
};

const enableButton = (button) => {
  button.classList.remove("disabled");
  button.removeAttribute("disabled");
};

const handlePageButton = () => {
  if (currentPage === 1) {
    disableButton(prevButton);
  } else {
    enableButton(prevButton);
  }
  if (pageCount === currentPage) {
    disableButton(nextButton);
  } else {
    enableButton(nextButton);
  }
};

const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "pagination-number";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.setAttribute("aria-label", "Page " + index);
  console.log(pageNumber.value);

  paginationNumbers.appendChild(pageNumber);
};

const appendDots = () => {
  const dots = document.createElement("span");
  dots.className = "span-dots";
  dots.innerHTML = "...";
  paginationNumbers.appendChild(dots);
};

const arr = [];
let temp = pageCount;
for (let i = 0; i < 3; i++) {
  arr.push(temp);
  temp--;
}
arr.reverse();

const getPaginationNumbers = () => {
  for (let i = 1; i <= Math.ceil(pageCount / 3); i++) {
    appendPageNumber(i);
  }
  appendDots();
  for (let i = 0; i < arr.length; i++) {
    appendPageNumber(arr[i]);
  }
};

const handleActivePageNumber = () => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    button.classList.remove("active");
    const pageIndex = Number(button.getAttribute("page-index"));
    if (pageIndex == currentPage) {
      button.classList.add("active");
    }
  });
};

const setCurrentPage = (pageNum) => {
  currentPage = pageNum;
  handleActivePageNumber();
  handlePageButton();
  //for start index
  const prevRange = (pageNum - 1) * paginationLimit;
  // for last index
  const currRange = pageNum * paginationLimit;

  //hide the all that are out of range
  listItems.forEach((item, index) => {
    item.classList.add("hidden");
    if (index >= prevRange && index < currRange) {
      item.classList.remove("hidden");
    }
  });
};

window.addEventListener("load", () => {
  getPaginationNumbers();
  setCurrentPage(1);
  fetchData();

  prevButton.addEventListener("click", () => {
    if (currentPage === 1) {
      button.classList.add("disabled");
      button.setAttribute("disabled", true);
    }
    setCurrentPage(currentPage - 1);
  });

  nextButton.addEventListener("click", () => {
    if (currentPage === pageCount) {
      button.classList.remove("disabled");
      button.removeAttribute("disabled");
    }
    setCurrentPage(currentPage + 1);
  });

  document.querySelectorAll(".pagination-number").forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));

    if (pageIndex) {
      button.addEventListener("click", () => {
        setCurrentPage(pageIndex);
      });
    }
  });
});
