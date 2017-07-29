/*--------
Database functions
--------*/

function queryDb(SQLstring) {
	return new Promise(function(resolve, reject) {
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", "QueryDB.php?q=" + SQLstring, true);
		xmlhttp.onload = function() {
			if (this.readyState == 4 && this.status == 200) {
				resolve(xmlhttp.response);
			} else {
				reject({
					status: this.status,
					statusText: xmlhttp.statusText,
					sql: xmlhttp.response
				});
			}
		};
		xmlhttp.onerror = function() {
			reject({
				status: this.status,
				statusText: xmlhttp.statusText,
				sql: xmlhttp.response
			});
		};
		xmlhttp.send();
	});
}


function queryModifyDb(SQLString) {
	return new Promise(function(resolve, reject) {
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", "QueryAddDB.php?q=" + SQLString, true);
		xmlhttp.onload = function() {
			if (this.readyState == 4 && this.status == 200 && xmlhttp.response == "") {
				resolve(xmlhttp.response);
			} else {
				reject({
					status: this.status,
					statusText: xmlhttp.statusText,
					sql: xmlhttp.response
				});
			}
		};
		xmlhttp.onerror = function() {
			reject({
				status: this.status,
				statusText: xmlhttp.statusText,
				sql: xmlhttp.response
			});
		};
		xmlhttp.send();
	});
}




//TODO: change the functions below to work with the database data directly?

function getAllProductsInTier(custID, pmin, pmax) {
	//given a customer and tier return # of products
	let maxCount = 0;
	for (let i = 0; i < companies.length; i++) {
		for (let j = 0; j < companies[i].products.length; j++) {
			let prod = companies[i].products[j];
			if (prod.customer == custID && prod.status == 'ACTIVE' && prod.price >= pmin && prod.price <= pmax) {
				maxCount++;
			}
		}
	}
	return maxCount;
}

function getPriceTierRange() {
	//using a generic range across the entire set
	// let max = getMaxPrice();
	// let min = getMinPrice();
	// let ran = max - min / 10; //magic number alert!! FIXME: should be change to customer specific value??
	// console.log('range',ran);
	// return ran / 2; //this provides upper and lower bound
}

function getMaxPrice() {
	let max = Number.MIN_VALUE;
	for (let i = 0; i < companies.length; i++) {
		for (let j = 0; j < companies[i].products.length; j++) {
			if (companies[i].products[j].status == 'ACTIVE' && companies[i].products[j].price > max) {
				max = companies[i].products[j].price;
				console.log("getting max price ", max);
			}
		}
	}
	return max;
}

function getMinPrice() {
	let min = Number.MAX_VALUE;
	for (let i = 0; i < companies.length; i++) {
		for (let j = 0; j < companies[i].products.length; j++) {
			if (companies[i].products[j].status == 'ACTIVE' && companies[i].products[j].price < min) {
				min = companies[i].products[j].price;
			}
		}
	}
	return min;
}
