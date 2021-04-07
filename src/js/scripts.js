"use strict";


window.addEventListener("DOMContentLoaded", start);


let allArticles;

let currentList;

let pageList = new Array();

let currentPage = 1;

let numberPerPage = 3;

let numberOfPages = 1;


function start() {

  console.log("ready");

  loadJSON("js/articles.json");

  setCarousel();

}


function loadJSON(url) {

    fetch(url)

        .then((res) => res.json())

        .then(handleData);

}

  

function handleData(articles) {

    allArticles = articles;

    currentList = allArticles;

    pagination();

    search();

}

// Carousel random start

function setCarousel(){

    const carouselItems = document.querySelectorAll(".carousel-item");

    const randomItem = carouselItems[Math.floor(Math.random() * carouselItems.length)];

    randomItem.classList.add("active");

}


//Pagination


function pagination() {

    numberOfPages = getNumberOfPages();

    loadList();

    document.querySelectorAll(".page-number").forEach(btn => btn.remove());

    

    for(let i = 1; i <=numberOfPages; i++){

        createPaginationButtons(i);

    }

}




function getNumberOfPages() {

    return Math.ceil(currentList.length / numberPerPage);

}


//Slice all json data for each page and load

function loadList() {

    var begin = ((currentPage - 1) * numberPerPage);

    var end = begin + numberPerPage;


    pageList = currentList.slice(begin, end);


    document.querySelector("main").classList.add("animationFadein");

    setTimeout(function(){

        document.querySelector("main").classList.remove("animationFadein");

    }, 290);


    createList(pageList);

    checkNextPrevButtons();

    updatePageInfo();

    setActiveButton();

    highlightEach();

}


//Clear parent for each page content

function createList(obj) {

    document.querySelector("main").innerHTML = "";

    obj.forEach(showData);

}


//Show date for each page from json

function showData(article) {

    const templateElement = document.querySelector("#template").content;

    const myClone = templateElement.cloneNode(true);

  

    myClone.querySelector(".article-title").innerHTML = article.title;

    myClone.querySelector(".article-year").innerHTML = article.year;

    myClone.querySelector(".article-content").innerHTML = article.content;

    myClone.querySelector(".article-img").style.backgroundImage = `url('${article.image}')`;

    myClone.querySelector(".read-more").addEventListener("click", passInfoToModal);


    function passInfoToModal(){

        showModal(article);

    }


    document.querySelector("main").appendChild(myClone);

}


function showModal(article) {

    document.querySelector(".modal-img").style.backgroundImage = `url('${article.image}')`;

    document.querySelector(".modal-title").innerHTML = article.title;

    document.querySelector(".modal-year").innerHTML = article.year;

    document.querySelector(".modal-description").innerHTML = article.content;

}


//Disable and enable needed buttons

function checkNextPrevButtons() {

    if(currentPage == numberOfPages){

        document.querySelector(".next").classList.add("disabled");

        document.querySelector(".next").removeEventListener("click", nextPage);

    }else {

        document.querySelector(".next").classList.remove("disabled");

        document.querySelector(".next").addEventListener("click", nextPage);

    }


    if(currentPage == 1){

        document.querySelector(".prev").classList.add("disabled");

        document.querySelector(".prev").removeEventListener("click", previousPage);

    }else {

        document.querySelector(".prev").classList.remove("disabled");

        document.querySelector(".prev").addEventListener("click", previousPage);

    }

}


function nextPage() {

    currentPage += 1;

    loadList();

}


function previousPage() {

    currentPage -= 1;

    loadList();

}


//Create pagination buttons

function createPaginationButtons(page){

    const a = document.createElement("a");

    a.classList.add("page-link");

    a.setAttribute("href", "#");

    a.innerHTML = page;

    const li = document.createElement("li");

    li.classList.add("page-item");

    li.classList.add("page-number");

    if(page == 1){

        li.classList.add("active");

    };

    li.addEventListener("click", function(){

        currentPage=page;

        loadList();

    });

    li.appendChild(a);


    document.querySelector(".pagination").insertBefore(li, document.querySelector(".next"));

}


//Set buttons to active

function setActiveButton(){

    const pageBtn = document.querySelectorAll(".page-number");

    pageBtn.forEach(checkIfActive);

}


function checkIfActive(button){

    if(button.textContent == currentPage){

        button.classList.add("active");

    }else{

        button.classList.remove("active");

    }

}


//Set additional info about pages

function updatePageInfo(){

    document.querySelector(".current-page").innerHTML = currentPage;

    document.querySelector(".all-pages").innerHTML = numberOfPages;

}


//Search


function search(){

    const searchInput = document.querySelector(".searchInput");

    const searchButton = document.querySelector(".searchButton");


    //Input Filter event

    searchInput.addEventListener("input", searchFilter);

    //Input Enter button keyup event

    searchInput.addEventListener("keyup", function(event){

        if(event.code === "Enter"){

            document.querySelector(".searchButton").click();

        }

    });


    //Search Button  click event

    searchButton.addEventListener("click", function(event){

        document.querySelector(".content").scrollIntoView();

    });


}


function searchFilter(event){

    const searchString = event.target.value.toLowerCase();

    const filteredCharacters = allArticles.filter(article => {

        const articleTitle = article.title;

        const articleContent = article.content;

        const articleYear = article.year;

        return (

            articleTitle.includes(searchString) ||

            articleTitle.toLowerCase().includes(searchString) ||

            articleContent.includes(searchString) ||

            articleContent.toLowerCase().includes(searchString) ||

            articleYear.includes(searchString) ||

            articleYear.toLowerCase().includes(searchString)

          );

    });

    currentList = filteredCharacters;

    currentPage = 1;  

    pagination();

    noResult();

}


// //If no results of search

function noResult(){

    if(document.querySelector("main").innerHTML == ""){

        const result = document.createElement("h1");

        result.classList.add("no-result");

        result.innerHTML = "No results found.";

        document.querySelector("main").appendChild(result);

    }

}


//Highlight in text

function highlightEach(){

    const text = document.querySelector(".searchInput").value.toLowerCase();

    if(text !== "") {

        const articleTitles = document.querySelectorAll(".article-title");

        const articleContent = document.querySelectorAll(".article-content");

        const articleYear = document.querySelectorAll(".article-year");


        articleTitles.forEach(title=>highlight(title, text));

        articleContent.forEach(title=>highlight(title, text));

        articleYear.forEach(title=>highlight(title, text));

    }

}


function highlight(element, text) {

    let elementText = element;

    let elementHTML = elementText.innerHTML;

    let lowerCaseContent = elementHTML.toLowerCase();

    let index = lowerCaseContent.indexOf(text);

    if (index >= 0) { 

        elementHTML = elementHTML.substring(0,index) + "<span class=highlighter>" + elementHTML.substring(index,index+text.length) + "</span>" + elementHTML.substring(index + text.length);

     elementText.innerHTML = elementHTML;

    }

  }