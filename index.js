{
	'use strict';

	for(const element of window.elements) {
		if(element.outer === 1)
			document.write('<br>');
		document.write(element.name, '\t', element.valence, '\n');
	}
}