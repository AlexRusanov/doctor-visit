let modal = document.getElementById("modal");
let openModal = document.getElementById("create-btn");
let closeModal = document.getElementsByClassName("modal-content-close")[0];
openModal.onclick = function() {
	modal.style.display = "block";
};
closeModal.onclick = function() {
	modal.style.display = "none";
	clearInputs();
};
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
		clearInputs();
	};
};

function clearInputs(){
	let inputs = [cardiologist, dentist, therapist];
	modalForm.elements["visit-date"].value = "";
	modalForm.elements["add-info"].value = "";
	inputs.forEach(function(el){
		el.childNodes.forEach(function(el){
			if(el.localName === "input"){
				// el.removeAttribute("required", "required");
				el.setAttribute("disabled", "disabled");
				el.value = "";
			};
		});
	});
};
function required(doctor){
	doctor.childNodes.forEach(function(el){
		if(el.localName === "input"){
			el.removeAttribute("disabled", "disabled");
			el.setAttribute("required", "required");
		};
	});
};


let doctors = document.getElementById("doctors");
let cardiologist = document.getElementById("cardiologist"),
	dentist = document.getElementById("dentist"),
	therapist = document.getElementById("therapist");
doctors.onchange = function(){
	clearInputs();
	cardiologist.style.display = "none";
	dentist.style.display = "none";
	therapist.style.display = "none";
	switch(doctors.value){
		case "cardiologist":
			cardiologist.style.display = "block";
			required(cardiologist);
			break;
		case "dentist":
			dentist.style.display = "block";
			required(dentist);
			break;
		case "therapist":
			therapist.style.display = "block";
			required(therapist);
			break;
	};
};
let draggableCard;
class Visit{
	constructor(){
		this.visitDate = modalForm.elements["visit-date"].value;
		this.addInfo = modalForm.elements["add-info"].value;
	};
	displayInfo(el){
		this._hiddenInfo.forEach(function(elem){
			let prop = document.createElement("p");
			prop.innerText = elem.placeholder + " : " + elem.value;
			el.appendChild(prop);
		});
	};
};
class Cardiologist extends Visit{
	constructor(){
		super();
		this.purpose = cardiologist.children["purpose"];
		this.pressure = cardiologist.children["pressure"];
		this.mass = cardiologist.children["mass"];
		this.diseases = cardiologist.children["diseases"];
		this.age = cardiologist.children["age"];
		this.fullname = cardiologist.children["name"].value;
		this._hiddenInfo = [this.purpose, this.pressure, this.mass, this.diseases, this.age];
	};
};
class Dentist extends Visit{
	constructor() {
		super();
		this.purpose = dentist.children["purpose"];
		this.fullname = dentist.children["name"].value;
		this.date = dentist.children["date"];
		this._hiddenInfo = [this.purpose, this.date];
	};
};
class Therapist extends Visit{
	constructor() {
		super();
		this.purpose = therapist.children["purpose"];
		this.fullname = therapist.children["name"].value;
		this.age = therapist.children["age"];
		this._hiddenInfo = [this.purpose, this.age];
	};
};

let modalForm = document.getElementById("modal-form");
modalForm.onsubmit = function(evt){
	evt.preventDefault();
	if (doctors.value === "disabled") {
		alert("choose doctor first");
	} else {
		createCard();
	};
};
function createCard(){
	let draggableCard = document.createElement("div");
	draggableCard.classList.add("draggable-card");
	let dragableCardName = document.createElement("p");
	dragableCardName.classList.add("draggable-card-name");
	let dragableCardDoctor = document.createElement("p");
	dragableCardDoctor.classList.add("draggable-card-doctor");
	let draggableCardClose = document.createElement("div");
	draggableCardClose.classList.add("draggable-card-close");
	let draggableCardAditional = document.createElement("p");
	let draggableCardExpand = document.createElement("button");
	draggableCardExpand.classList.add("draggable-card-button");
	let draggableCardReduce = document.createElement("div");
	draggableCardReduce.classList.add("draggable-card-button");
	let draggableCardContains = [dragableCardName, dragableCardDoctor, draggableCardClose, draggableCardExpand];
	draggableCardContains.forEach(function(el){
		draggableCard.appendChild(el);
	});
	document.getElementById("main").appendChild(draggableCard);
    let newCard;
	switch(doctors.value){
		case "cardiologist":
			newCard = new Cardiologist();
			break;
		case "dentist":
			newCard = new Dentist();
			break;
		case "therapist":
			newCard = new Therapist();
			break;
	};
	draggableCardClose.innerText = "x";
	draggableCardClose.addEventListener("click", function(e){
		draggableCard.remove();
	});
	dragableCardName.innerText = newCard.fullname;
	dragableCardDoctor.innerText = doctors.value;
	draggableCardAditional.innerText = newCard.addInfo;
	draggableCardAditional.style.fontWeight = "400";
	draggableCardExpand.innerText = "показать больше";
	draggableCardReduce.innerText = "показать меньше";
	draggableCardReduce.style.fontWeight = "400";
	let hiddenProps = document.createElement("div");
	hiddenProps.style.fontWeight = "400";
	newCard.displayInfo(hiddenProps);
	draggableCardExpand.onclick = function(){
		draggableCard.appendChild(hiddenProps);
		draggableCard.appendChild(draggableCardAditional);
		draggableCardExpand.remove();
		draggableCard.appendChild(draggableCardReduce);
	};
	draggableCardReduce.onclick = function(){
		hiddenProps.remove();
		draggableCardAditional.remove();
		draggableCardReduce.remove();
		draggableCard.appendChild(draggableCardExpand);
	};

	modal.style.display = "none";
	clearInputs();
};