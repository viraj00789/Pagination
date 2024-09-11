const paginationNumbers = document.getElementById("pagination-numbers");
const fetchedData = document.getElementById("data");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const search = document.getElementById("search");
const select = document.getElementById("select-1");
const sort = document.getElementById("sort-btn");
const sortDsc = document.getElementById("sort-btn-2");


let paginationLimit = 10;
let currentPage = 1;
let arr = [];
let filteredData = [];
let val = false;
let orgData = [];
let filData = [];
let sortAsc = true;
let sortDsec = true;

const appendPageNumber = (index) => {
  const button = document.createElement("button");
  button.className = "pagination-number";
  button.innerHTML = index;
  button.setAttribute("page-index", index);
  paginationNumbers.appendChild(button);
};
const appendDots = () => {
  const dots = document.createElement("span");
  dots.className = "span-dots";
  dots.innerHTML = "...";
  paginationNumbers.appendChild(dots);
};
const handleActivePageNumber = (index) => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    button.classList.toggle(
      "active",
      Number(button.getAttribute("page-index")) === index
    );
  });
};
const clickButton = () => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    button.addEventListener("click", () => {
      const pageIndex = Number(button.getAttribute("page-index"));
      if (pageIndex !== currentPage) {
        currentPage = pageIndex;
        renderTable();
        updatePagination();
      }
    });
  });
};
const updatePagination = () => {
  const pages = numberOfPages();
  paginationNumbers.innerHTML = "";

  const appendPageNumbers = (start, end) => {
    for (let i = start; i <= end; i++) appendPageNumber(i);
  };

  if (pages <= 5) {
    appendPageNumbers(1, pages);
  } else {
    if (currentPage <= 3) {
      appendPageNumbers(1, 4);
      appendDots();
      appendPageNumber(pages);
    } else if (currentPage >= pages - 2) {
      appendPageNumber(1);
      appendDots();
      appendPageNumbers(pages - 3, pages);
    } else {
      appendPageNumber(1);
      appendDots();
      appendPageNumbers(currentPage - 1, currentPage + 1);
      appendDots();
      appendPageNumber(pages);
    }
  }

  handleActivePageNumber(currentPage);
  clickButton();
};
const fetchData = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  arr = await response.json();
  filteredData = arr;
  updatePagination();
  renderTable();
};
const renderTable = () => {
  if (!filteredData.length && search.value) {
    fetchedData.innerHTML = "<tr><td colspan='5'>No data found</td></tr>";
    prevButton.disabled = nextButton.disabled = true;
    paginationNumbers.innerHTML = "";
    return;
  }

  const paginatedItems = filteredData.slice(
    (currentPage - 1) * paginationLimit,
    currentPage * paginationLimit
  );
  fetchedData.innerHTML = paginatedItems
    .map(
      (item, index) => `<tr>
      <td>${(currentPage - 1) * paginationLimit + index + 1}</td>
      <td>${item.id}</td>
      <td>${item.userId}</td>
      <td>${item.title.slice(0, 30)}</td>
      <td>${item.body.slice(0, 30)}</td>
    </tr>`
    )
    .join("");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage >= numberOfPages();
};

const sortDataAsc = () => {
  if (!val) {
    orgData = [...arr];
    arr.sort((a, b) =>
      sortAsc ?
      a.title.localeCompare(b.title) :
      b.title.localeCompare(a.title)
    );

    filteredData = arr.filter((item) =>
      item.title.toLowerCase().includes(search.value.toLowerCase())
    );
    sort.innerHTML = "UnsortAsc";
  } else {
    arr = [...orgData];
    filteredData = arr.filter((item) =>
      item.title.toLowerCase().includes(search.value.toLowerCase())
    );
    sort.innerHTML = "SortAsc";
  }
  val = !val;
  sortAsc = !sortAsc;
  renderTable();
};
const sortDataDsc = () => {
  if (!val) {
    orgData = [...arr];
    arr.sort((a, b) =>
      sortDsec ?
      b.title.localeCompare(a.title) :
      a.title.localeCompare(b.title)
    );

    filteredData = arr.filter((item) =>
      item.title.toLowerCase().includes(search.value.toLowerCase())
    );
    sortDsc.innerHTML = "UnsortDsc";
  } else {
    arr = [...orgData];
    filteredData = arr.filter((item) =>
      item.title.toLowerCase().includes(search.value.toLowerCase())
    );
    sortDsc.innerHTML = "SortDsc";
  }
  val = !val;
  sortDsec = !sortDsec;
  renderTable();
};

const numberOfPages = () => Math.ceil(filteredData.length / paginationLimit);
const prev = () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
    updatePagination();
  }
};
const next = () => {
  if (currentPage < numberOfPages()) {
    currentPage++;
    renderTable();
    updatePagination();
  }
};
const filterData = (e) => {
  filteredData = arr.filter((item) =>
    item.title.toLowerCase().includes(e.target.value.toLowerCase())
  );
  currentPage = 1;
  renderTable();
  updatePagination();
};
const selectOption = () => {
  paginationLimit = Number(select.value);
  currentPage = 1;
  renderTable();
  updatePagination();
};

prevButton.addEventListener("click", prev);
nextButton.addEventListener("click", next);
select.addEventListener("change", selectOption);
window.addEventListener("load", fetchData);
search.addEventListener("input", filterData);
sort.addEventListener("click", sortDataAsc);
sortDsc.addEventListener("click", sortDataDsc);

