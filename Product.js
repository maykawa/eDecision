/*--------
This is the product object and associated functions
the data structure for the customers is a simple array
//TODO: Eventually need to separate product data driven by database and product view
--------*/

class Product {
	constructor(nm, pr, cu, co, st, id) {
		this.pname = nm; //string
		this.price = Number(pr); //float
		this.customer = cu; //id of customer
		this.status = st //ACTIVE //PLANNED, RETIRED, ACTIVE
		this.company = co; //pointer to parent "company" object
		this.id = id;
		//this.spend = 0; //needs to be reset on each round increment

		//for display, dynamically calculated
		this.field; //pointer to current "board" object
		this.xLoc = -10;
		this.yLoc = -10;

		//tracking previous states
		this.pxLoc = 0; //previous location
		this.pyLoc = 0; //previous location
		this.pStatus = this.status;
		this.changed = false;

		//UI preferences
		this.selectedColor = '#E3DA8F';
		this.activeColor = '#F0CE19';
		this.plannedColor = '#E3DA8F';
		this.retiredColor = '#91AA9D';
		this.outOfFocusColor = '#91AA9D';
		this.size = 10;
		this.showNames = true;

		//UI states
		this.selected = false;
		this.targetStatus = this.status; //default status
		this.editing = false;

	}

	initializeItem() {
		if (this.status == 'ACTIVE') {
			this.yLoc = this.field.priceToPixels(this);
			this.xLoc = this.field.customerToPixels(this);
		} else if (this.status == 'PLANNED') {
			this.yLoc = addArea.y + 40;
			this.xLoc = addArea.x + 20;
		} else if (this.status == 'RETIRED') {
			this.yLoc = retireArea.y + 40;
			this.xLoc = retireArea.x + 20;
		}

	}

	display() {
		textSize(TXTSIZE);
		if ((!companyInFocus) || (this.company.id != companyInFocus.id)) {
			//if companyInFocus not yet established, scenario has not been initialized
			if (this.status == 'ACTIVE') {
				//only show those products in the field ('ACTIVE')
				fill(this.outOfFocusColor);
				textStyle(ITALIC);
				noStroke();
				ellipseMode(CENTER);
				ellipse(this.xLoc, this.yLoc, this.size);
				if (this.showNames) {
					text(this.pname, this.xLoc + 10, this.yLoc + TXTSIZE / 3);
				}
			}
		} else {
			//draw based on current status
			if (this.status == 'ACTIVE') {
				fill(this.activeColor);
				textStyle(NORMAL);
			} else if (this.status == 'PLANNED') {
				fill(this.plannedColor);
				textStyle(ITALIC);
			} else if (this.status == 'RETIRED') {
				fill(this.retiredColor);
				textStyle(ITALIC);
			}
			noStroke();
			ellipseMode(CENTER);
			ellipse(this.xLoc, this.yLoc, this.size);
			if (this.showNames) {
				text(this.pname, this.xLoc + 10, this.yLoc + TXTSIZE / 3);
				if (this.status == 'RETIRED') {
					//draw strikethrough line in the text
					strokeWeight(1);
					stroke(this.retiredColor);
					line(this.xLoc + 8, this.yLoc - 1, this.xLoc + textWidth(this.pname) + 15, this.yLoc);
				}
			}

			//then overlay selected state on top of status
			if (this.selected) {
				if (this.showWarning()) {
					//show x icon
					stroke('#D61C23');
					strokeWeight(2);
					noFill();
					rectMode(CENTER);
					let t = this.size + 8;
					rect(this.xLoc, this.yLoc, t, t);
					let m = t / 2;
					line(this.xLoc - m, this.yLoc - m, this.xLoc + m, this.yLoc + m);
					line(this.xLoc - m, this.yLoc + m, this.xLoc + m, this.yLoc - m);
				} else {
					//show moving icon
					stroke(this.selectedColor);
					strokeWeight(2);
					noFill();
					ellipseMode(CENTER);
					ellipse(this.xLoc, this.yLoc, TXTSIZE + 10);
				}
			}
		}
	}

	showWarning() {
		if (this.status == 'ACTIVE' && this.targetStatus == 'PLANNED') {
			return true;
		}
		if (this.status == 'RETIRED' && (this.targetStatus == 'ACTIVE' || this.targetStatus == 'PLANNED')) {
			return true;
		}
		if (this.targetStatus == 'OFFBOARD') {
			return true;
		}
		return false;
	}

	changeName(txt) {
		if (typeof txt === 'string' && txt != '') {
			this.pname = txt;
			this.modifyNameInDatabase(txt);
		} else console.log("Error - problem with changing the name");
	}

	modifyNameInDatabase(str) {
		let SQLstring = "UPDATE products SET name = '"+ str +"' WHERE id = " + this.id;
		queryModifyDb(SQLstring)
			.catch((error) => console.log(error));
	}

	calculateRevenue() {
		if (this.status == 'ACTIVE') {
			let tmp = getPriceTierRange();
			tmp = tmp / 10; //create default tiers

			//establish upper and lower bounds
			let pmin = this.price - (tmp / 2);
			let pmax = this.price + (tmp / 2);

			//find number of products in this tier and total number of customers available
			let num = getAllProductsInTier(this.customer, pmin, pmax);
			let vol = getCustomerSize(this.customer);

			//calculate revenue ((total customers / number of products in tier) * price)
			//TODO: fix customer share calculation
			//missing step is share of total customers at this tier
			return (vol / num) * this.price;

		} else {
			//this is where we could put revenue and costs for planned or retired products
			return 0;
		}
	}

	calculateSpend() {
		//this will be altered by game mechanics
		if (this.changed) {
			if (this.status == 'ACTIVE' && this.pStatus == 'PLANNED') {
				//we have an addition to the board 50X
				return this.price * 50;
			} else if (this.status == 'ACTIVE' && this.pStatus == 'ACTIVE') {
				//we have a move on the board 20X
				//could make this based on the amount of movement
				return this.price * 20;
			} else if (this.status == 'RETIRED' && this.pStatus == 'ACTIVE') {
				//we have removed a product from the board 10X
				return this.price * 10;
			}
		} else {
			return 0;
		}
	}

	print() {
		return String(this.pname) +
			" pr:" + String(this.price) +
			" cu:" + getCustomerName(this.customer) +
			" st:" + this.status +
			" id:" + this.id
	}

	mouseClick(x, y) {
		if (dist(x, y, this.xLoc, this.yLoc) < 10) {
			this.selected = true;
			this.pxLoc = this.xLoc; //used to snap back if move is illegal
			this.pyLoc = this.yLoc;
			if (keyIsPressed && keyCode == OPTION) {
				inputField.callField(this);
				this.editing = true;
			}
		}
	}

	mouseRelease() {
		if (this.selected) {
			this.selected = false;
			if (this.targetStatus == 'OFFBOARD' ||
				(this.targetStatus == 'PLANNED' && this.status != 'PLANNED') ||
				(this.status == 'RETIRED' && this.targetStatus != 'RETIRED')) {
				//snap back due to illegal move
				this.xLoc = this.pxLoc;
				this.yLoc = this.pyLoc;
				this.targetStatus = this.status; //cleans up small mouseclicks without mousedrags
			} else if (this.targetStatus == 'ACTIVE') {
				this.customer = this.field.pixelsToCustomer(this);
				this.price = this.field.pixelsToPrice(this);
				this.status = 'ACTIVE';
			} else if (this.targetStatus == 'RETIRED') {
				this.status = 'RETIRED';
			} else if (this.targetStatus == 'PLANNED') {
				this.status = 'PLANNED';
			}
			console.log(this.print());
			this.changed = true;
		}
	}

	mouseDrag(x, y) {
		if (this.selected) {
			//"close" editing box by forcing it to update 
			if (this.editing) {
				inputField.closeField();
				this.editing = false;
			}
			//small update
			this.xLoc = x;
			this.yLoc = y;
			if (withinField(x, y, fieldbb)) {
				this.targetStatus = "ACTIVE"
			} else if (withinField(x, y, planbb)) {
				this.targetStatus = 'PLANNED';
			} else if (withinField(x, y, trashbb)) {
				this.targetStatus = 'RETIRED';
			} else {
				this.targetStatus = 'OFFBOARD';
			}
		}
	}
}
