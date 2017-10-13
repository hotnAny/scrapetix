////////////////////////////////////////////////////////////////////////////////////
//
//	incomplete library of javascript array extension
//
//	by xiangchen@acm.org, v0.0, 10/2017
//
////////////////////////////////////////////////////////////////////////////////////

'use strict';

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