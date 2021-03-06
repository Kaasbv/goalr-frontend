window.addEventListener("load", init);

let goals = [];
let type = "day";
let startDate;

function init(){
  startDate = dayjs().startOf('day');
  addEvents();
  getGoals();
}

function getGoals(){
  let startDateIso = startDate.format("YYYY-MM-DD HH:mm:ss");
  let endDateIso = startDate.add(1, type).format("YYYY-MM-DD HH:mm:ss");
  $.getJSON(`/api/goal/list.php?type=${type}&min_end_date=${startDateIso}&max_end_date=${endDateIso}`, function( data ) {
    goals = data;
    render();
  }).fail(function(){
    window.location.replace("/auth.php");
  });
}

function addEvents(){
  document.querySelector("#datecontrols > .backicon").addEventListener("click", back);
  document.querySelector("#datecontrols > .nexticon").addEventListener("click", next);
  document.querySelector("#controls .selecticon").addEventListener("click", toggleMenu);

  let typeElements = Array.from(document.querySelectorAll("#controls .options > span"));
  for(let typeElement of typeElements){
    typeElement.addEventListener("click", switchTypeEvent);
  }
}

function switchTypeEvent(event){
  let element = event.currentTarget;
  let elementType = element.dataset.type;
  type = elementType;
  startDate = startDate.startOf(type);

  toggleMenu();
  getGoals();
}

function toggleMenu(){
  document.querySelector("#controls .options").classList.toggle("open");
  document.querySelector("#controls .selecticon").classList.toggle("active");
}

function back(){
  startDate = startDate.subtract(1, type);
  getGoals();
}

function next(){
  startDate = startDate.add(1, type);
  getGoals();
}

function render(){
  renderDate();
  renderGoals();
}

function renderDate(){
  let element = document.querySelector("#datecontrols > span");
  element.innerHTML = grabDateValue(type, startDate);
}

function renderGoals(){
  let goalContainer = document.querySelector("#goals");
  let html = "";
  for(let goal of goals){
    html += `
    <div id="goalBox" data-id =${goal.id} onclick="clickgoal(event)">
      <span class ="goalName">${goal.name}</span>
    </div>
    `
  }

  goalContainer.innerHTML = html;
}