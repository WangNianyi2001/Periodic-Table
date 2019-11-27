{
	'use strict';

	let number = 1, period = 1, _subshell = 1, subshell = 1, outer = 1, current = 1, aufbau = [[0]];
	
	const Element = function(name) {
		this.name = name;
		this.number = number++;
		this.outer = outer++;
		this.subshell = (subshell = _subshell === 1 ? 1 : ~~(period / 2 + 1) - _subshell + 2) - 1;
		this.period = period;
		++aufbau[period - Math.max(0, subshell - 2) - 1][subshell - 1];
		this.electrons = aufbau.map(_ => _.slice());
		this.aufbau = true;

		if(++current > subshell * 4 - 2) {
			current = 1;
			++_subshell;
		}
		if(_subshell << 1 > period + 2) {
			_subshell = 1;
			outer = 1;
			++period;
			aufbau.push(Array(period).fill(0));
		}
	};

	Object.defineProperty(Element.prototype, 'valency', {
		get() {
			const template = Array(7).fill(0).map((_, i) => i * 4 + 2);
			const res = [];
			let begin = { shell: null, sub: null };
			outer: for(begin.shell = 0; begin.shell < this.electrons.length; ++begin.shell) {
				const shell = this.electrons[begin.shell];
				while(shell.length && !shell[shell.length - 1])
					shell.pop();
				for(let i = shell.length - 1; i >= 0; --i) {
					if(shell[i] !== template[i]) {
						begin.sub = i;
						break outer;
					}
				}
			}
			if(begin.sub === null)
				return [];
			res.push([begin.shell + 1, begin.sub, this.electrons[begin.shell][begin.sub]]);
			for(++begin.shell; begin.shell < this.electrons.length; ++begin.shell, begin.sub = 0) {
				const shell = this.electrons[begin.shell];
				while(shell.length && !shell[shell.length - 1])
					shell.pop();
				res.push([begin.shell + 1, shell.length - 1, shell[shell.length - 1]]);
			}
			return res;
		},
		enumerable: true, configurable: true
	});

	const elements =
		'H,He,Li,Be,B,C,N,O,F,Ne,Na,Mg,Al,Si,P,S,Cl,Ar,K,Ca,Sc,Ti,V,Cr,Mn,Fe,Co,Ni,Cu,Zn,Ga,Ge,As,Se,Br,Kr,Rb,Sr,Y,Zr,Nb,Mo,Tc,Ru,Rh,Pd,Ag,Cd,In,Sn,Sb,Te,I,Xe,Cs,Ba,La,Ce,Pr,Nd,Pm,Sm,Eu,Gd,Tb,Dy,Ho,Er,Tm,Yb,Lu,Hf,Ta,W,Re,Os,Ir,Pt,Au,Hg,Tl,Pb,Bi,Po,At,Rn,Fr,Ra,Ac,Th,Pa,U,Np,Pu,Am,Cm,Bk,Cf,Es,Fm,Md,No,Lr,Rf,Db,Sg,Bh,Hs,Mt,Ds,Rg,Cn,Nh,Fl,Mc,Lv,Ts,Og'
		.split(',').map(_ => new Element(_));

	[57, 58, 64, 89, 90, 91, 92, 93, 96].forEach(_ => {
		const element = elements[_ - 1];
		++element.electrons[element.period - 2][2];
		--element.electrons[element.period - 3][3];
		element.aufbau = false;
	});

	window.elements = elements;
}