{
	'use strict';

	const blocks = 'spdf';
	let
		number = 1,
		row = 1;
		_block = 1,
		block = 1,
		outer = 1,
		current = 1,
		aufbau = [[0]];
	
	const Element = function(name, electrons) {
		this.name = name;
		this.number = number++;
		this.outer = outer++;
		this.current = current++;
		block = _block === 1 ? 1 : ~~(row / 2 + 1) - _block + 2;
		this.block = blocks[block - 1];
		this.row = row;
		++aufbau[row - Math.max(0, block - 2) - 1][block - 1];
		this.electrons = aufbau.map(_ => _.slice());

		if(current > block * 4 - 2) {
			current = 1;
			++_block;
		}
		if(_block > ~~(row / 2 + 1)) {
			_block = 1;
			outer = 1;
			++row;
			aufbau.push(Array(row).fill(0));
		}
	};

	Object.defineProperty(Element.prototype, 'valence', {
		get() {
			let res = [], o, s;
			outer: for(o = 0; o < this.electrons.length; ++o) {
				const orbital = this.electrons[o];
				for(s = 0; s < orbital.length; ++s) {
					const sub = orbital[s];
					if(sub && sub !== 4 * s + 2) {
						break outer;
					}
				}
			}
			for(; o < this.electrons.length; ++o) {
				const orbital = this.electrons[o];
				for(; s < orbital.length; ++s) {
					if(orbital[s])
						res.push('' + (o + 1) + blocks[s] + orbital[s]);
				}
				s = 0;
			}
			if(!res.length) {
				console.log(this.name, this.outer, (~~(this.row / 2 + 1)) ** 2 * 2);
				if(this.outer === (~~(this.row / 2 + 1)) ** 2 << 1) {
					this.electrons.forEach((orbital, o) => {
						const s = orbital.reduce(([r, i], v) => v ? [i + 1, i + 1] : [r, i + 1], [0, 0])[0] - 1;
						res.push('' + (o + 1) + blocks[s] + orbital[s]);
					})
				} else {
					const o = this.electrons.length - 1;
					const s = this.electrons[o].reduce(([r, i], v) => v ? [i + 1, i + 1] : [r, i + 1], [0, 0])[0] - 1;
					res.push('' + (o + 1) + blocks[s] + this.electrons[o][s]);
				}
			}
			return res;
		},
		configurable: true, enumerable: true
	});

	const elements =
		'H,He,Li,Be,B,C,N,O,F,Ne,Na,Mg,Al,Si,P,S,Cl,Ar,K,Ca,Sc,Ti,V,Cr,Mn,Fe,Co,Ni,Cu,Zn,Ga,Ge,As,Se,Br,Kr,Rb,Sr,Y,Zr,Nb,Mo,Tc,Ru,Rh,Pd,Ag,Cd,In,Sn,Sb,Te,I,Xe,Cs,Ba,La,Ce,Pr,Nd,Pm,Sm,Eu,Gd,Tb,Dy,Ho,Er,Tm,Yb,Lu,Hf,Ta,W,Re,Os,Ir,Pt,Au,Hg,Tl,Pb,Bi,Po,At,Rn,Fr,Ra,Ac,Th,Pa,U,Np,Pu,Am,Cm,Bk,Cf,Es,Fm,Md,No,Lr,Rf,Db,Sg,Bh,Hs,Mt,Ds,Rg,Cn,Nh,Fl,Mc,Lv,Ts,Og'
		.split(',').map(_ => new Element(_));

	[57, 58, 64, 89, 90, 91, 92, 93, 96].forEach(_ => {
		const element = elements[_ - 1];
		++element.electrons[element.row - 2][2];
		--element.electrons[element.row - 3][3];
	});

	window.elements = elements;
}