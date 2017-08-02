/*--------
The Control object and associated game mechanics functions
--------*/

class GameControl {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.scenarioID;
		this.scenarioRound;

		this.button = createButton('submit turn');
		this.button.position(this.x + 8, this.y + 22);
		this.button.mousePressed(moveCompanyForward);
	}

	display() {
		fill('#91AA9D');
		noStroke();
		rectMode(CORNER);
		rect(this.x, this.y, this.w, this.h);

		let t = "scenario: " + this.scenarioID + " round: " + this.scenarioRound;
		fill(0);
		text(t, this.x + 10, this.y + 15);
	}
	
	advanceRound(company){
		company.turn++;
	}
	
	disableButton(){
		this.button.elt.innerHTML = "waiting for others...";
		this.button.elt.disabled = "true";

	}
	
	enableButton(){
		this.button.elt.innerHTML = "submit turn";
		this.button.elt.disabled = "false";
	}

}


function moveCompanyForward() {
	//submit update for this company
    companyInFocus.updateAllProductsToDatabase();

	//disable button, replace with "waiting for others to submit"
	control.disableButton();


	//check to see if we are ready to calculate revenue


	//if so pull down latest info and make our calculations
	// updateCompanies();???


	//if we are ready, with all companies having same round, then calculate revenue		
	// calculateRevenueForAll();
	// calculateSpendForAll();

	//if this company round and global round agree, enable submit button
}



/*--------
Temp game mechanics functions
--------*/


function initializeXY() {	
	field.setPriceRange(); //needs to be set prior to updating product coordinates
	for (c of companies){
		c.initializeProducts(field);  //update coordinates for products on all companies
	}
	//set cordinates for products outside of the field
	addArea.placePlannedProducts();
	retireArea.placeRetiredProducts();
	
	//TODO: refactor initialization from game state and ownership
	//value set on first screen
	let tmp = parseInt(window.sessionStorage.getItem("eDecision.currentCompany"));
	companyInFocus = getCompanyByID(tmp);
	
	//figure out which scenario and round are we in
	control.scenarioID = parseInt(window.sessionStorage.getItem("eDecision.currentScenario"));
	control.scenarioRound = parseInt(window.sessionStorage.getItem("eDecision.currentRound"));
	companyInFocus.turn = control.scenarioRound;
}

function switchPlayers() {
	let tmp = getCompanyIndex(companyInFocus.id) + 1;
	if (tmp > companies.length - 1) tmp = 0; 
	companyInFocus = companies[tmp];
}

function updateCompanies() {
	for (c of companies){
		c.updateBooks();
		c.updateDatabase();
	}
}

function calculateRevenueForAll() {
	for (c of companies){
		c.calculateTotalProductRevenue();
		console.log(c.name + " make " + c.recentRevenue);
	}
}

function calculateSpendForAll() {
	for (c of companies){
		c.calculateTotalProductSpend();
		console.log(c.name + " spend " + c.recentSpend);
	}
}

//temp function to push all companies forward for testing
function moveGameForward() {
	//update all of the other companies's turns
	//get this companies round
	let t = companyInFocus.turn;
	for (c of companies){
		if (c.turn != t) c.turn = t;	
	}
}

function calRev(){
	companyInFocus.calculateTotalProductRevenue();
	companyInFocus.updateBooks();
}


