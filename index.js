{
	'use strict';

	const width = window.elements.reduce((res, _) => Math.max(_.outer, res), 0);

	const $article = document.getElementsByTagName('article')[0];

	for(const element of window.elements) {
		const $block = document.createElement('div');
		const $name = document.createElement('div');
		$name.innerText = element.name;
		$block.appendChild($name);
		$block.classList.add('element');
		const column = $block.style.gridColumn = element.outer <= 2 ?
			width + element.outer - 2 :
			element.outer - 2 * Math.pow((element.period >> 1) + 1, 2) + 30;
		if(column === 31) {
			$block.classList.add('akali');
		}
		if(!element.aufbau) {
			$block.classList.add('non-aufbau');
			const $valency = document.createElement('span');
			$valency.innerHTML = element.valency.map(_ => (
				([shell, sub, n]) => `${shell}${'spdf'[sub]}<sup>${n}</sup>`
			)(_)).join('');
			$valency.classList.add('valency');
			$block.appendChild($valency);
		}
		$block.style.gridRow = element.period + 2;
		$article.appendChild($block);
	}

	function resize() {
		document.documentElement.style.fontSize =
			0.015 * Math.max(innerWidth, innerHeight) + 'px';
		document.body.style.height = innerHeight + 'px';
	}
	document.addEventListener('DOMContentLoaded', resize);
	window.addEventListener('resize', resize);
}