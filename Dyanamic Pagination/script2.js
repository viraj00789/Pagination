const paginationNumbers = document.getElementById("pagination-numbers");
const fetchedData = document.getElementById("data");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const search = document.getElementById("search");
const select = document.getElementById("select-1");
const sortButton = document.getElementById("sort-btn");
let paginationLimit = 10, currentPage = 1, arr = [],  filteredData = [],  orgData = [],  sortState = "none" ;
const numberOfPages = () => Math.ceil(filteredData.length / paginationLimit);

const handleAppend = (index) => {
  const element = document.createElement(index ? "button" : "span");
  element.className = index ? "pagination-number" : "span-dots";
  element.innerHTML = index || "...";
  index && element.setAttribute("page-index", index);
  paginationNumbers.appendChild(element);
};

const handleClicksActives = (index) => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
  button.classList.toggle("active",Number(button.getAttribute("page-index")) === index);
    button.addEventListener("click", () => {const pageIndex = Number(button.getAttribute("page-index"));
      pageIndex !== currentPage ? ((currentPage = pageIndex), renderTableAndUpdatePagination()) : "";});
  });
};

const appendPageNumbers = (start, end) => {for (let i = start; i <= end; i++) handleAppend(i);};
const addPages = (...pageNumbers) => pageNumbers.forEach(page => page === '...' ? handleAppend() : handleAppend(page));
const renderTableAndUpdatePagination = () => {
  const pages = numberOfPages();
  paginationNumbers.innerHTML = "";  
  if (pages <= 5) appendPageNumbers(1, pages);
  else if (currentPage <= 3) addPages(1, 2, 3, 4, '...', pages);
  else if (currentPage >= pages - 2) addPages(1, '...', pages - 3, pages - 2, pages - 1, pages);
  else addPages(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', pages);
  handleClicksActives(currentPage);
  if (!filteredData.length && search.value) {
    fetchedData.innerHTML = "<tr><td colspan='5'>No data found</td></tr>";
    prevButton.disabled = nextButton.disabled = true;
    return;
  }
  const paginatedItems = filteredData.slice((currentPage - 1) * paginationLimit, currentPage * paginationLimit);
  fetchedData.innerHTML = paginatedItems.map((item) => `<tr>
      <td>${(currentPage - 1) * paginationLimit + 1}</td>
      <td>${item.id}</td>
      <td>${item.userId}</td>
      <td>${item.title.slice(0, 30)}</td>
      <td>${item.body.slice(0, 30)}</td>
    </tr>`).join("");
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage >= numberOfPages();
};

const sortData = () => {
  if (sortState === "none") (sortState = "asc",sortButton.innerHTML = "Sort Desc");
  else if (sortState === "asc") (sortState = "desc",sortButton.innerHTML = "Sort Normal");
  else (sortState = "none",sortButton.innerHTML = "Sort Asc",arr = [...orgData]); 


  if (sortState === "asc") arr.sort((a, b) => a.title.localeCompare(b.title));  
  else if (sortState === "desc")arr.sort((a, b) => b.title.localeCompare(a.title));
  filteredData = arr.filter((item) => item.title.toLowerCase().includes(search.value.toLowerCase()));
  renderTableAndUpdatePagination();
};
const fetchData = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  arr = await response.json();
  orgData = [...arr];
  filteredData = arr;
  renderTableAndUpdatePagination();
};
const handleNextPrevBtn = (btnState) => (currentPage > 1 && btnState === "prev" ? currentPage-- : currentPage++,  renderTableAndUpdatePagination());
const filterData = (e) => (filteredData = arr.filter((item) =>item.title.toLowerCase().includes(e.target.value.toLowerCase())),currentPage = 1,renderTableAndUpdatePagination());
const selectOption = () => (paginationLimit = Number(select.value),currentPage = 1,renderTableAndUpdatePagination());
prevButton.addEventListener("click", () => handleNextPrevBtn("prev"));
nextButton.addEventListener("click", () => handleNextPrevBtn("next"));
sortButton.addEventListener("click", sortData);
search.addEventListener("input", filterData);
select.addEventListener("change", selectOption);
window.addEventListener("load", fetchData);
