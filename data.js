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

// function getAllProductsInTier2(custID, pmin, pmax) {
// 	//given a customer and price return # of products
// 	let maxCount = 0;
// 	for (let i = 0; i < companies.length; i++) {
// 		for (let j = 0; j < companies[i].products.length; j++) {
// 			let prod = companies[i].products[j];
// 			if (prod.customer == custID && prod.status == 'ACTIVE' && prod.price >= pmin && prod.price <= pmax) {
// 				maxCount++;
// 			}
// 		}
// 	}
// 	return maxCount;
// }

function getAllProductsInTier(custID, pmin, pmax) {
	let activeSet = getAllActiveProducts();
	let custSet = activeSet.filter(x => (x.customer == custID && x.price >= pmin && x.price <= pmax));
	return custSet.length;
}

function getPriceTierRange() {
	return getMaxPrice() - getMinPrice();
}

function getAllActiveProducts(){
	let productSet = [];
	for (c of companies) {
		productSet = productSet.concat(c.products)
	}
	return productSet.filter(x => x.status == 'ACTIVE');
}

function getMaxPrice() {
	return getAllActiveProducts().reduce(function(max, cur) {
	  if (Number(cur.price) > Number(max.price)) return cur;
	  else return max;
	}).price
}

function getMinPrice() {
	return getAllActiveProducts().reduce(function(min, cur) {
	  if (Number(cur.price) < Number(min.price)) return cur;
	  else return min;
	}).price
}
