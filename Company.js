/*--------
This is the company object and associated functions
the data structure for the company is a simple array
--------*/

class Company {
	constructor(id, nm) {
		this.id = id;
		this.name = nm;
		this.products = [];
		this.balance = 0;
		this.recentRevenue = 0;
		this.recentSpend = 0;
		this.turn = 0;
	}
	getName() {
		return this.name;
	}
	getId() {
		return this.id;
	}
	getBalance() {
		return this.balance.toFixed(2);
	}

	getNumberOfActiveProducts() {
		return this.products.filter(x => x.status == 'ACTIVE').length
	}

	calculateTotalProductRevenue() {
		let currentTake = 0;
		let prodSet = this.products.filter(x => x.status == 'ACTIVE');
		for (p of prodSet) {
			let tmp = p.calculateRevenue();
			currentTake += tmp;
			console.log("rev ", p.price, tmp, currentTake);
		}
		this.recentRevenue = currentTake;
	}

	calculateTotalProductSpend() {
		this.recentSpend = 0;
		for (let i = 0; i < this.products.length; i++) {
			this.recentSpend += this.products[i].calculateSpend();
			//need to update product for next round, assumes we are moving to next round after this call
			this.products[i].pStatus = this.products[i].status;
			this.products[i].changed = false;
		}
	}

	updateBooks() {
		this.balance += (this.recentRevenue - this.recentSpend);
	}

	getCompanyStats() {
		let stats = [];
		stats.push("company: " + this.name);
		stats.push("active products: " + this.getNumberOfActiveProducts());
		stats.push("prior revenue: " + this.recentRevenue.toFixed(2));
		stats.push("prior spend: " + this.recentSpend.toFixed(2));
		stats.push("-----");
		stats.push("current balance: " + this.balance.toFixed(2));
		stats.push("-----");
		stats.push("turn: " + this.turn);
		return stats;
	}

	// !!don't call unless field is created
	//TODO: figure out a way to eliminate dependencies
	initializeProducts(targetField) {
		if (targetField) {
			for (p of this.products) {
				p.field = targetField;
				p.initializeItem();
			}
		} else {
			console.log("error - field is not set up for initialization");
		}
	}

	//called from advancing round
	updateAllProductsToDatabase() {
		for (this.pd of this.products) {
			let pd = this.pd; //silly javascript...
			let SQLstring;
			if (pd.customer) {
				SQLstring = "UPDATE products SET name = '" + pd.pname +
					"', price='" + pd.price +
					"', customer_id ='" + pd.customer +
					"', status = '" + pd.status +
					"' WHERE id ='" + pd.id + "'";
			} else {
				//small patch to deal with NULL value in SQL string
				SQLstring = "UPDATE products SET name = '" + pd.pname +
					"', price='" + pd.price +
					"', customer_id = NULL" +
					", status = '" + pd.status +
					"' WHERE id ='" + pd.id + "'";
			}
			queryModifyDb(SQLstring)
				.then(x => console.log('updated: ' + pd.pname))
				.catch((error) => console.log(error));
		}
	}

	addProductToDatabase(pd) {
		//database has a cost which is not supported in object, putting '0' as default cost.
		//database does not accept a customer id that is out of bounds of key indexes, passing NULL for planned products
		//FIXME: need to accomodate null values if we add product a different way that through the ProductAddInput buttons

		let SQLstring = "INSERT INTO products (name, price, cost, status, customer_id, company_id) VALUES ('" +
			pd.pname + "', '" + pd.price + "', '0', '" + pd.status + "', NULL, '" + this.id + "')";

		queryModifyDb(SQLstring)
			.then(companyInFocus.getProductIdFromDatabase(pd))
			.catch((error) => console.log(error));
	}

	getProductIdFromDatabase(prod) {
		let SQLstring = "SELECT id FROM products WHERE name = '" + prod.pname + "' AND company_id = '" + this.id + "'";
		queryDb(SQLstring)
			.then((foundData) => {
				let tmp = JSON.parse(foundData);
				//FIXME: it is possible this search returns multiple items
				prod.id = tmp[0].id; //assign the id directly
				console.log("added: " + prod.pname + ", ID: " + prod.id);
			})
			.catch((error) => console.log(error));
	}
}

/*--------
Company oriented helper functions
--------*/

function getCompanyByID(targetID) {
	return companies.find((obj) => obj.id == targetID);
}

function getCompanyIndex(targetID) {
	let t = getCompanyByID(targetID);
	return companies.indexOf(t);
}

/*--------
Company initalization functions
--------*/

function setUpCompany(compID) {
	let SQLstring = "SELECT * FROM companies WHERE id = " + compID;
	return queryDb(SQLstring)
		.then((foundData) => {
			let found = JSON.parse(foundData);
			let newco = new Company(found[0].id, found[0].name); //assumes one company returned
			companies.push(newco);
			return newco;
		})
}

function getProducts(newco) {
	let SQLstring = "SELECT * FROM products WHERE company_id = " + newco.id;
	return queryDb(SQLstring)
		.then((foundData) => {
			let pdArray = JSON.parse(foundData);
			for (p of pdArray) {
				let tmp = new Product(p.name, p.price, p.customer_id, newco, p.status, p.id);
				newco.products.push(tmp);
			}
			return newco;
		})
}
