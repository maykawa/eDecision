//scenario elements
var companyInFocus; //pointer to company object
var customers = [];
var companies = [];
var control;

//GUI elements
var field;
var player;
var canvasElement;
var addArea;
var inputField;
var retireArea;
var ledgerbb = ({});
var fieldbb = ({});
var planbb = ({});
var trashbb = ({});

//preferences
//TODO: move to config file and update for the products, etc;
var TXTCOLOR = '#193441';
var CANVASCOLOR = '#3E606F';
var CANVASTXTCOLOR = '91AA9D';
var FIELDCOLOR = '#DEE0D8';
var TXTSIZE = 13;


function setup() {

	canvasElement = createCanvas(windowWidth, windowHeight - 50);
	setUpGUIAreas(); //bounding boxes for each areas


	//set up the main objects
	inputField = new textFieldInput(50, 500); //input field for small dialogs
	control = new GameControl(ledgerbb.x, ledgerbb.y + ledgerbb.h - 100, ledgerbb.w, 45);
	//FIXME: can we create a field without dependicies?
	field = new Board(fieldbb.x, fieldbb.y, fieldbb.w, fieldbb.h);
	addArea = new ProductAddInput(planbb.x, planbb.y, planbb.w, planbb.h);
	retireArea = new ProductRetireArea(trashbb.x, trashbb.y, trashbb.w, trashbb.h);
	companyInfo = new CompanyArea(ledgerbb.x, ledgerbb.y, ledgerbb.w, ledgerbb.h);


	//set up the data
	let CompanyIDs = [1, 2, 3]; //temp list of company ids to load
	//TODO: pull customers from companies loaded, now we just assume all customers
	setUpCos(CompanyIDs)
		.then(setProds)
		.then(() => setUpCustomers())
		.then(() => initializeXY());


	//god functions	
	createP("");
		
	switchBtn = createButton('switch player');
	switchBtn.mousePressed(switchPlayers);

	switchBtn = createButton('calculate revenue');
	switchBtn.mousePressed(calRev);

}


function setUpCos(companyIDs) {
	let popCo = [];
	for (comp of companyIDs) {
		popCo.push(setUpCompany(comp)); //setUpCompany() returns a promise
	}
	return Promise.all(popCo)
		.catch(error => reject(error));
}

function setProds(companyObjs) {
	let popProd = [];
	for (comp of companyObjs) {
		popProd.push(getProducts(comp)); //getProducts() returns a promise
	}
	return Promise.all(popProd)
		.catch(error => reject(error));
}


/*--------------------
	GUI I/O functions
---------------------*/

//this is to create the reusable text input field
//seems to like it better when the vars are hoisted above all else
function textFieldInput(x, y) {
	//create it only once
	var nameInput = createInput('testing');
	var callingItem;

	nameInput.elt.style.display = "none";
	nameInput.position(x, y);
	nameInput.size(100);
	nameInput.changed(updateInputTextField);

	// nameInput.elt.style.color = "#91AA9D"; //text color
	// nameInput.elt.style.background = "transparent";
	// nameInput.elt.style.borderColor = "#F0CE19";
	// nameInput.elt.style.borderStyle = "dotted";
	//nameInput.elt.style.outline = "none";

	this.callField = function(caller) {
		callingItem = caller;
		nameInput.position(caller.xLoc + 8, caller.yLoc - 10);
		nameInput.value(caller.pname);
		nameInput.elt.style.display = "";
	}

	this.closeField = function() {
		updateInputTextField();
	}

	function updateInputTextField() {
		callingItem.changeName(nameInput.value());
		nameInput.elt.style.display = "none";
	}
}


function draw() {
	background(CANVASCOLOR);

	//big title, temporary for now
	push();
	noStroke();
	textStyle(NORMAL);
	fill('#91AA9D');
	textSize(18);
	text("Executive Decision", 35, 40);
	pop();

	field.display(); //grid board
	addArea.display(); //add field
	retireArea.display(); //trash field
	companyInfo.display(); //ledger field
	control.display();

	//need to draw products last to make sure they are displayed on top	
	for (c of companies){
		for (p of c.products){
			p.display();
		}
	}		
}

function mousePressed() {
	for (p of companyInFocus.products) {
		p.mouseClick(mouseX, mouseY);
	}	
}

function mouseDragged() {
	for (p of companyInFocus.products) {
		p.mouseDrag(mouseX, mouseY);
	}
}

function mouseReleased() {
	for (p of companyInFocus.products) {
		p.mouseRelease();
	}
}

function withinField(x, y, f) {
	//mouse point, x, y and fieldbb to check
	//assumes a field object (x:x, y:y, w:width, h:height)
	return (x > f.x && x < f.w + f.x && y > f.y && y < f.y + f.h)
}

function setUpGUIAreas() {
	//TODO: can make these collapsable at some point
	let ledgerWidth = 200;
	let planWidth = 160;

	let gutter = 30;
	let guitop = 100;
	let guibottom = canvasElement.height - guitop - gutter;

	ledgerbb.x = gutter;
	ledgerbb.y = guitop
	ledgerbb.w = ledgerWidth;
	ledgerbb.h = guibottom;

	planbb.x = canvasElement.width - (planWidth + gutter);
	planbb.y = guitop;
	planbb.w = planWidth;
	planbb.h = (guibottom / 2) - 7;

	trashbb.x = canvasElement.width - (planWidth + gutter);
	trashbb.y = guitop + planbb.h + 14;
	trashbb.w = planWidth;
	trashbb.h = (guibottom / 2) - 7;

	fieldbb.x = ledgerbb.w + ledgerbb.x + 14;
	fieldbb.y = guitop;
	fieldbb.w = (planbb.x - 14) - fieldbb.x;
	fieldbb.h = guibottom;
}
