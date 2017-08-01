/*--------
Functions for the product planning area
--------*/

function ProductAddInput(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	//add create button
	this.button = createButton('+');
	this.button.position((this.x + this.w) - 20, this.y);
	this.button.mousePressed(newDevProd);

	function newDevProd() {
		//product constructor(nm, pr, cu, co <pointer>, st, id)
		let newProd = new Product('untitled', 0, 0, companyInFocus, 'PLANNED');
		newProd.field = field; //buggy part of product, it needs to have a reference to the field to figure out the customer??
		companyInFocus.products.push(newProd);

		//update local locations of planned products into a list
		//TODO: not sure if this is necessary
		resetPlannedProductList();
		
		//add new product to the database now rather than in overall update, this sets the id for the product asap
		companyInFocus.addProductToDatabase(newProd);
	}

	this.display = function() {
		textSize(TXTSIZE);
		noFill();
		strokeWeight(1);
		stroke('#91AA9D');
		rect(this.x, this.y, this.x + this.w, this.y + this.h);

		//title bar
		fill('#91AA9D');
		rect(this.x, this.y, this.x + this.w, this.y + 15);
		fill('#3E606F');
		noStroke();
		textStyle(BOLD);
		text("Planned", this.x + 7, this.y + 13);
	}
}

function resetPlannedProductList(){
	let place = 1;
	for (p of companyInFocus.products){
		if (p.status == 'PLANNED') {
			p.xLoc = addArea.x + 20;
			p.yLoc = addArea.y + 20 + (20 * place);
			place++;
		}
	}
}

