class ProductRetireArea {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	display() {
		textSize(TXTSIZE);
		noFill();
		strokeWeight(1);
		stroke('#91AA9D');
		rect(this.x, this.y, this.w + this.x, this.h + this.y);

		//title bar
		fill('#91AA9D');
		rect(this.x, this.y, this.x + this.w, this.y + 15);
		fill('#3E606F');
		noStroke();
		textStyle(BOLD);
		text("Retired", this.x + 7, this.y + 13);
	}
	
	placeRetiredProducts() {
		for (c of companies) {
			let place = 1;
			for (p of c.products) {
				if (p.status == 'RETIRED') {
					p.xLoc = this.x + 20;
					p.yLoc = this.y + 20 + (20 * place);
					place++;
				}
			}
		}
	}
}
