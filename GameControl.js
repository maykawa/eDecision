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
		this.button.mousePressed(this.moveCompanyForward);

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

	moveCompanyForward() {
		//submit update for this company
	    companyInFocus.updateAllProductsToDatabase();
		
		//disable button, replace with "waiting for others to submit"
		

		//check to see if we are ready to calculate revenue
		
		
		//if so pull down latest info and make our calculations
		// updateCompanies();???
	

		//if we are ready, with all companies having same round, then calculate revenue		
		// calculateRevenueForAll();
		// calculateSpendForAll();

		//if this company round and global round agree, enable submit button
	}
	
	advanceRound(company){
		company.turn++;
	}

}


/*--------
Temp game mechanics functions
--------*/




function initializeXY() {	
	field.setPriceRange(); //needs to be set prior to updating product coordinates
	for (c of companies){
		c.initializeProducts(field);  //update coordinates for products on all companies
	}
	
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
	for (let i = 0; i < companies.length; i++) {
		companies[i].updateBooks();
		companies[i].updateDatabase();
	}
}

function calculateRevenueForAll() {
	//go through each player and count revenue for each active product
	for (let i = 0; i < companies.length; i++) {
		companies[i].calculateTotalProductRevenue();
		console.log(companies[i].name + " make " + companies[i].recentRevenue);
	}
}

function calculateSpendForAll() {
	//go through each player and count the spend for each product
	for (let i = 0; i < companies.length; i++) {
		companies[i].calculateTotalProductSpend();
		console.log(companies[i].name + " spend " + companies[i].recentSpend);
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


