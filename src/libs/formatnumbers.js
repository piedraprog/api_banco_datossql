export const  numericFormat = (stringValue, digitGroupSeparator, decimalCharacter, fixedLen) =>{
	
	stringValue = new String(''+stringValue);

	let isNegative = stringValue.indexOf('-'); 

	if(isNegative >= 0) stringValue = stringValue.substring(1);

	let monto = stringValue.split('.'), 
		decimal = '',
		rest = '',
		j = 0;
	
	
	for (let i = monto[0].length - 1; i >= 0; i--, j++){
		decimal = monto[0].charAt(i) + ((j > 0) && (j % 3 == 0)? digitGroupSeparator: '') + decimal; 
	}

	if(monto.length >= 2) rest = monto[1];

	for(let k = rest.length; k < fixedLen; k++){
		rest = rest + '0';
	}

	if (rest.length > fixedLen ){
		rest = rest[0] + rest[1];
	}

	let resp = decimal + decimalCharacter + rest;
	if (isNegative >= 0) resp = '-' + resp;
	return resp;


};