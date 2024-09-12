const paginationNumbers = document.getElementById("pagination-numbers");
const fetchedData = document.getElementById("data");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const search = document.getElementById("search");
const select = document.getElementById("select-1");

let paginationLimit = 10;
let currentPage = 1;
let arr = [];
let pageCount;
let filteredData = [];
let cnt = 0;

const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "pagination-number";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.setAttribute("aria-label", "Page " + index);
  paginationNumbers.appendChild(pageNumber);
};

const appendDots = () => {
  const dots = document.createElement("span");
  dots.className = "span-dots";
  dots.innerHTML = "...";
  paginationNumbers.appendChild(dots);
};

const handleActivePageNumber = (index) => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));
    button.classList.remove("active");
    if (pageIndex === index) {
      button.classList.add("active");
    }
  });
};

const clickButton = () => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    button.addEventListener("click", () => {
      const pageIndex = Number(button.getAttribute("page-index"));
      console.log(pageIndex);
      if (pageIndex !== currentPage) {
        currentPage = pageIndex;
        renderTable();
        getPaginationNumbers(numberOfPages());
      }
    });
  });
};

const getPaginationNumbers = (pages) => {
  paginationNumbers.innerHTML = "";
  if (pages <= 5) {
    for (let i = 1; i <= pages; i++) {
      appendPageNumber(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        appendPageNumber(i);
      }
      appendDots();
      appendPageNumber(pages);
    } else if (currentPage >= pages - 2) {
      appendPageNumber(1);
      appendDots();
      for (let i = pages - 3; i <= pages; i++) {
        appendPageNumber(i);
      }
    } else {
      appendPageNumber(1);
      appendDots();
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        appendPageNumber(i);
      }
      appendDots();
      appendPageNumber(pages);
    }
  }
  handleActivePageNumber(currentPage);
  clickButton();
};

const fetchData = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    arr = data;
    filteredData = arr;
    pageCount = Math.ceil(arr.length / paginationLimit);
    getPaginationNumbers(pageCount);
    renderTable();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const getIndex = (itemIndex) => {
  let num = (currentPage - 1) * paginationLimit + itemIndex + 1; 
  return num;
};

const renderTable = () => {
  if (filteredData.length === 0 && search.value) {
    fetchedData.innerHTML = "<tr><td colspan='4'>No data found</td></tr>";
    prevButton.disabled = true;
    nextButton.disabled = true;
    paginationNumbers.innerHTML = "";
    return;
  }

  const start = (currentPage - 1) * paginationLimit;
  const end = currentPage * paginationLimit;
  const paginatedItems = filteredData.slice(start, end);

  let renderData = "";
  paginatedItems.forEach((item, index) => {
    renderData += "<tr>";
    renderData += `<td>${getIndex(index)}</td>`;
    renderData += `<td>${item.id}</td>`;
    renderData += `<td>${item.userId}</td>`;
    renderData += `<td>${item.title.slice(0, 30)}</td>`;
    renderData += `<td>${item.body.slice(0, 30)}</td>`;
    renderData += "</tr>";
  });

  fetchedData.innerHTML = renderData;
  const totalPageCount = numberOfPages();
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage >= totalPageCount;
};

const numberOfPages = () => {
  return Math.ceil((filteredData.length || arr.length) / paginationLimit);
};

const prev = () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
    getPaginationNumbers(numberOfPages());
  }
};

const next = () => {
  if (currentPage < numberOfPages()) {
    currentPage++;
    renderTable();
    getPaginationNumbers(numberOfPages());
  }
};

const filterData = (e) => {
  const query = e.target.value.toLowerCase();
  filteredData = query
    ? arr.filter((item) => item.title.toLowerCase().includes(query))
    : arr;
  pageCount = Math.ceil(filteredData.length / paginationLimit);
  getPaginationNumbers(pageCount);
  currentPage = 1;
  handleActivePageNumber(currentPage);
  renderTable();
};
const selectOption = () => 
{
  const num = Number(select.value)
  paginationLimit = num;
  currentPage = 1;
  renderTable();
  clickButton()
  getPaginationNumbers(numberOfPages())
  handleActivePageNumber(currentPage);
}

prevButton.addEventListener("click", () => {
  prev();
  handleActivePageNumber(currentPage);
});

nextButton.addEventListener("click", () => {
  next();
  handleActivePageNumber(currentPage);
});

window.addEventListener("load", () => {
  fetchData();
});

select.addEventListener("change",() => 
{
 selectOption();
})
search.addEventListener("input", (e) => {
  filterData(e);
  getIndex();
});
