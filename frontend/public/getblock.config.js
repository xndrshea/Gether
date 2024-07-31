
class Token {
	constructor(material) {
	  this.material = material;
	}
   
	go() {
	  return `https://go.getblock.io/${this.material}/`;
	}
   
	token() {
	  return this.material;
	}
}

export const getblock = {
	"shared": {
		"ton": {
			"mainnet": {
				"indexerV3": [
					new Token ('7c911aacd9654330a33c13ca92fac71b')
				]
			}
		}
	}
}
