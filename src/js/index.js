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
	constructor(visitDate = modalForm.elements["visit-date"].value, addInfo = modalForm.elements["add-info"].value){
		this.visitDate = visitDate;
		this.addInfo = addInfo;
	};

	displayInfo(el){
		this._hiddenInfo.forEach(function(elem){
			let prop = document.createElement("p");
			prop.innerText = elem.placeholder + " : " + elem.value;
			el.appendChild(prop);
		});
	};

	displayInfoFromLocale(el) {
	    for (let property in this) {
	        if (property === "visitDate" || property === "addInfo" || property === "_hiddenInfo" || property === "fullname") continue;
            let prop = document.createElement("p");
            prop.innerText = property + " : " + this[property];
            el.appendChild(prop);
        }
    }

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
        let visitList = JSON.parse(localStorage.getItem('visits'));

        if (visitList !== null && visitList.length > 0) {
            for (let elem of visitList) {
                createCard(elem);
                toggleNoItemAdded();
            }
        }
    }
}

class Cardiologist extends Visit{
	constructor(visitDate, addInfo, purpose = cardiologist.children["purpose"].value, pressure = cardiologist.children["pressure"].value, mass = cardiologist.children["mass"].value, diseases = cardiologist.children["diseases"].value, age = cardiologist.children["age"].value, fullname = cardiologist.children["name"].value){
		super(visitDate, addInfo);
		this.purpose = purpose;
		this.pressure = pressure;
		this.mass = mass;
		this.diseases = diseases;
		this.age = age;
		this.fullname = fullname;
		this._hiddenInfo = [cardiologist.children["purpose"], cardiologist.children["pressure"], cardiologist.children["mass"], cardiologist.children["diseases"], cardiologist.children["age"]];
	};
}

class Dentist extends Visit{
	constructor(visitDate, addInfo, purpose = dentist.children["purpose"].value, fullname = dentist.children["name"].value, date = dentist.children["date"].value) {
		super(visitDate, addInfo);
		this.purpose = purpose;
		this.fullname = fullname;
		this.date = date;
		this._hiddenInfo = [dentist.children["purpose"], dentist.children["date"]];
	};
}

class Therapist extends Visit{
	constructor(visitDate, addInfo, purpose = therapist.children["purpose"].value, fullname = therapist.children["name"].value, age = therapist.children["age"].value) {
		super(visitDate, addInfo);
		this.purpose = purpose;
		this.fullname = fullname;
		this.age = age;
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

function createCard(localeStorageData){
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

    let hiddenProps = document.createElement("div");
    hiddenProps.style.fontWeight = "400";

    if (localeStorageData !== undefined) {
        switch(localeStorageData.doctor){
            case "cardiologist":
                newCard = new Cardiologist(localeStorageData.visitDate, localeStorageData.addInfo, localeStorageData.purpose, localeStorageData.pressure, localeStorageData.mass, localeStorageData.diseases, localeStorageData.age, localeStorageData.fullname);
                break;
            case "dentist":
                newCard = new Dentist(localeStorageData.visitDate, localeStorageData.addInfo, localeStorageData.purpose, localeStorageData.fullname, localeStorageData.date);
                break;
            case "therapist":
                newCard = new Therapist(localeStorageData.visitDate, localeStorageData.addInfo, localeStorageData.purpose, localeStorageData.fullname, localeStorageData.age);
                break;
        }

        dragableCardDoctor.innerText = localeStorageData.doctor;
        newCard.displayInfoFromLocale(hiddenProps);
    } else {
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

        dragableCardDoctor.innerText = doctors.value;
        newCard.displayInfo(hiddenProps);
        Visit.saveVisitToLocaleStorage(newCard, doctors.value);
    }

	draggableCardClose.innerText = "x";
	main.addEventListener("click", function(){
	    if (event.target === draggableCardClose) {
            Visit.deleteVisitFromLocaleStorage(draggableCard);
            draggableCard.remove();
            toggleNoItemAdded();
        }
	});

	dragableCardName.innerText = newCard.fullname;
	draggableCardAditional.innerText = newCard.addInfo;
	draggableCardAditional.style.fontWeight = "400";
	draggableCardExpand.innerText = "показать больше";
	draggableCardReduce.innerText = "показать меньше";
	draggableCardReduce.style.fontWeight = "400";

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

window.onload = Visit.retrieveVisitsFromLocaleStorage;
