/*--------
This is the board object and associated functions
there is generally only one board per game
--------*/
//TODO:create a way to adjust the boundaries of the prices to zoom in and out of field

class Board {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		//shift the grid within the bounding box above
		this.gridleft = this.x + 50; //offset for row labels
		this.gridtop = this.y; //offset for column labels
		this.gridright = this.x + this.w;
		this.gridbottom = this.h + this.y;

		//this.maxPrice = Number(getMaxPrice()) + 10; //max price will default to 10 as side affect if get price is null
		this.maxPrice = 10;
		this.minPrice = 0;

		//TODO: get rid of magic number 10 put in config file
		this.rows = 10; //delineations of price tiers
	}
	
	gridWidth() {
		return this.gridright - this.gridleft;
	}

	gridHeight() {
		return this.gridbottom - this.gridtop;
	}

	display() {
		//translate params for conveneient drawing within the canvas
		const colwidth = (this.gridWidth()) / customers.length;
		const rowheight = (this.gridHeight()) / this.rows;
		const priceInc = (this.maxPrice - this.minPrice) / this.rows;

		//draw the price labels and customer labels
		textSize(TXTSIZE);
		noStroke();
		fill('#91AA9D');
		textStyle(NORMAL);
		for (let i = 0; i < this.rows + 1; i++) {
			let label = String("$" + (this.maxPrice - priceInc * i).toFixed(2));
			text(label, this.gridleft - textWidth(label) - 5, rowheight * i + this.gridtop + 4);
		}
		for (let i = 0; i < customers.length; i++) {
			text(customers[i].getName(), this.gridleft + (i * colwidth) + 5, this.gridtop - 25);
			text("size: " + customers[i].getSize(), this.gridleft + (i * colwidth) + 5, this.gridtop - 10);
		}

		//draw the field
		stroke('#91AA9D');
		strokeWeight(1);
		fill(FIELDCOLOR);
		rectMode(CORNERS);
		for (let i = 0; i < this.rows + 1; i++) {
			line(this.gridleft, (rowheight * i) + this.gridtop, this.gridright, (rowheight * i) + this.gridtop);
		}
		for (let i = 0; i < customers.length + 1; i++) {
			line((colwidth * i) + this.gridleft, this.gridtop, (colwidth * i) + this.gridleft, this.gridbottom);
		}

	}
	
	setPriceRange(){
		this.maxPrice = Number(getMaxPrice()) + 10; //max price will default to 10 as side affect if get price is null
		this.minPrice = 0; //default for now.
		console.log("setting price range ", this.maxPrice, this.minPrice);
	}

	priceToPixels(pd) {
		return map(pd.price, this.minPrice, this.maxPrice, this.gridbottom, this.gridtop);
	}

	pixelsToPrice(pd) {
		let tmp = map(pd.yLoc, this.gridbottom, this.gridtop, this.minPrice, this.maxPrice);
		return tmp.toFixed(2);
	}

	pixelsToCustomer(pd) {
		let tmp = map(pd.xLoc, this.gridright, this.gridleft, customers.length + 1, 1);
		return floor(tmp);
	}

	customerToPixels(pd) {
		let tmp = this.gridWidth() / customers.length;
		let skh = (tmp * pd.customer) - tmp / 2; //find the center of the column
		return skh + this.gridleft; //offset for x value
	}

}
