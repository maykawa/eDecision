/*--------
This is the customer object and associated functions
the data structure for the customers is a simple array
--------*/

class Customer {
	constructor(nm, sz, id) {
		this.name = nm; //String
		this.size = sz; //Integer
		this.id = id;
	}

	getName() {
		return this.name;
	}
	getSize() {
		return this.size;
	}
	setName(nm) {
		if (typeof nm == "string") {
			this.name = nm;
		}
	}
	setSize(sz) {
		if (typeof sz == "number") {
			this.size = Math.round(sz);
		}
	}
}

/*--------
Customer oriented helper functions
--------*/

function getCustomerIndex(custID) {
	let t = customers.find((obj) => obj.id == custID);
	return companies.indexOf(t); //returns -1 if object not found in array
}

function getCustomerName(custID) {
	if (custID) {
		let t = customers.find((obj) => obj.id == custID);
		return t.getName();
	} else {
		return "unknown";
	}
}

function getCustomerSize(custID) {
	if (custID) {
		let t = customers.find((obj) => obj.id == custID)
		return t.getSize();
	} else {
		return -1;
	}
}

/*--------
Customer initalization functions
--------*/

function setUpCustomers() {
	//TODO:eventually need to get the specific customers from the chosen companies
	let SQLstring = "SELECT * FROM customers";
	return queryDb(SQLstring)
		.then((foundData) => {
			let ca = JSON.parse(foundData);
			customers = []; //customer array is a global variable, so need to empty it
			for (obj of ca) {
				customers.push(new Customer(obj.name, obj.size, obj.id));
			}
		})
		.catch((error) => console.log(error));
}
