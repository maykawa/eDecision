class CompanyArea {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	display() {
		rectMode(CORNERS);
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
		text("Situation", this.x + 7, this.y + 13);

		//basic stats
		textStyle(NORMAL);
		fill('#E3DA8F');

		if (companyInFocus) {
			this.drawStats(this.x + 7, this.y + 40)
		};
	}

	//TODO: eventually turn this into a table or field
	drawStats(x, y) {
		let tmp = companyInFocus.getCompanyStats();
		for (let i = 0; i < tmp.length; i++) {
			text(tmp[i], x, y + (i * (TXTSIZE * 1.7)));
		}
	}
}
