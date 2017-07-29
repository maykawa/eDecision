/*--------
The Control object and associated game mechanics fucntions
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

		//TODO:clean up for unintialized data on launch, currently handled with initialize button
		let t = "scenario: " + this.scenarioID + " round: " + this.scenarioRound;

		fill(0);
		text(t, this.x + 10, this.y + 15);
	}

	moveCompanyForward(comp) {
		// update database with my changes
		//if successful move current company to next round
	    companyInFocus.updateAllProductsToDatabase();



		
		//check to see if everyone has posted
		//manually??
		
		
		//if so pull down latest info and make our calculations
		
		
		
		
		//disable button, replace with "waiting for others to submit"


		//pull down new changes from other companies, yikes!!
		// updateCompanies();???
	
	

		//if we are ready, with all companies having same round, then calculate revenue		
		// calculateRevenueForAll();
		// calculateSpendForAll();




		//if this company round and global round agree, enable submit button


		console.log('moving company forward');
	}
	
	advanceRound(company){
		company.turn++;
	}

}


/*--------
Temp game mechanics fucntions
--------*/


function updateDatabase(){
	companyInFocus.updateAllProductsToDatabase();
	control.advanceRound(companyInFocus);
}

function initializeXY() {	
	//update the board price range
	field.setPriceRange();
	
	//figure out which company this user wants to be
	//value set in first screen
	let tmp = parseInt(window.sessionStorage.getItem("eDecision.currentCompany"));
	companyInFocus = getCompanyByID(tmp);
	
	// //figure out which scenario and round are we in
	// control.scenarioID = parseInt(window.sessionStorage.getItem("eDecision.currentScenario"));
// 	control.scenarioRound = parseInt(window.sessionStorage.getItem("eDecision.currentRound"));
// 	companyInFocus.turn = control.scenarioRound;
// 	//
	//
	
	//update pixel locations for all products on all companies
	for (let i = 0; i < companies.length; i++) {
		companies[i].initializeProducts(field);
	}

}

function switchPlayers() {
	console.log('hit switch buttons');
	//cycle through the companies array for now
	let tmp = getCompanyIndex(companyInFocus.id) + 1;
	if (tmp > companies.length - 1) {
		tmp = 0;
	}
	companyInFocus = companies[tmp];
}

function moveGameForward() {
	//update all of the other companies's turns
	//get this companies round
	let t = companyInFocus.turn;
	for (let i = 0; i < companies.length; i++){
		if (companies[i].turn != t){
			companies[i].turn = t;	
		}
	}
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


