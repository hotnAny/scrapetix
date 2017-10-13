'use strict';

// module.exports = {
// 	remove: function(elm, compFunc) {
// 		var toRemove = [];
// 		for (var i = this.length - 1; i >= 0; i--) {
// 			var equal = undefined;
// 			if (compFunc != undefined) {
// 				equal = compFunc(elm, this[i]);
// 			} else {
// 				equal = elm == this[i];
// 			}

// 			if (equal) {
// 				toRemove.push(i);
// 			}
// 		}

// 		for (var i = toRemove.length - 1; i >= 0; i--) {
// 			this.splice(toRemove[i], 1);
// 		}
// 	}
// }

Array.prototype.remove = function (elm, compFunc) {
	var toRemove = [];
	for (var i = this.length - 1; i >= 0; i--) {
		var equal = undefined;
		if (compFunc != undefined) {
			equal = compFunc(elm, this[i]);
		} else {
			equal = elm == this[i];
		}

		if (equal) {
			toRemove.push(i);
		}
	}

	for (var i = toRemove.length - 1; i >= 0; i--) {
		this.splice(toRemove[i], 1);
	}
}