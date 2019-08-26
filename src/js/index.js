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
	if (event.target === modal) {
		modal.style.display = "none";
		clearInputs();
	}
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
			}
		});
	});
}

function required(doctor){
	doctor.childNodes.forEach(function(el){
		if(el.localName === "input"){
			el.removeAttribute("disabled", "disabled");
			el.setAttribute("required", "required");
		}
	});
}


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
	}
};

// let draggableCard;
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

    static saveVisitToLocaleStorage(visit, doctor) {
        let temp = {};

        for (let key in visit) {
            if (key === "_hiddenInfo") continue;
            temp[key] = visit[key];
        }

        temp.doctor = doctor;

        let result = [];

        if (localStorage.getItem('visits') !== null) {
            result = JSON.parse(localStorage.getItem('visits'));
        }

        result.push(temp);

        localStorage.setItem("visits", JSON.stringify(result));
    }

    static deleteVisitFromLocaleStorage(card) {
        let visitList = JSON.parse(localStorage.getItem('visits'));

        console.dir(visitList);

        let cardData = Array.from(card.children).map(function(elem) {
            return elem.innerText;
        });

        for (let i = 0; i < visitList.length; i++) {
            if (visitList[i].fullname === cardData[0] && visitList[i].doctor === cardData[1]) {
                visitList.splice(i, 1);
            }
        }

        localStorage.setItem("visits", JSON.stringify(visitList));
    }

    static retrieveVisitsFromLocaleStorage() {
        // let visitList = JSON.parse(localStorage.getItem('visits'));
    }
}

class Cardiologist extends Visit{
	constructor(){
		super();
		this.purpose = cardiologist.children["purpose"].value;
		this.pressure = cardiologist.children["pressure"].value;
		this.mass = cardiologist.children["mass"].value;
		this.diseases = cardiologist.children["diseases"].value;
		this.age = cardiologist.children["age"].value;
		this.fullname = cardiologist.children["name"].value;
		this._hiddenInfo = [cardiologist.children["purpose"], cardiologist.children["pressure"], cardiologist.children["mass"], cardiologist.children["diseases"], cardiologist.children["age"]];
	};
}

class Dentist extends Visit{
	constructor() {
		super();
		this.purpose = dentist.children["purpose"].value;
		this.fullname = dentist.children["name"].value;
		this.date = dentist.children["date"].value;
		this._hiddenInfo = [dentist.children["purpose"], dentist.children["date"]];
	};
}

class Therapist extends Visit{
	constructor() {
		super();
		this.purpose = therapist.children["purpose"].value;
		this.fullname = therapist.children["name"].value;
		this.age = therapist.children["age"].value;
		this._hiddenInfo = [therapist.children["purpose"], therapist.children["age"]];
	};
}

let modalForm = document.getElementById("modal-form");
modalForm.onsubmit = function(evt){
	evt.preventDefault();
	if (doctors.value === "disabled") {
		alert("choose doctor first");
	} else {
		createCard();
        toggleNoItemAdded();
	}
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
	}

	draggableCardClose.innerText = "x";
	draggableCardClose.addEventListener("click", function(){
	    Visit.deleteVisitFromLocaleStorage(draggableCard);
		draggableCard.remove();
        toggleNoItemAdded();
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

	Visit.saveVisitToLocaleStorage(newCard, doctors.value);

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
}

function toggleNoItemAdded() {
    if (document.getElementById("main").children.length === 2) {
        document.getElementById("no-items").style.display = "none";
    } else if (document.getElementById("main").children.length === 1) {
        document.getElementById("no-items").style.display = "block";
    }
}
