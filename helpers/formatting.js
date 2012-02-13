// Formatting Helper Functions

// format number to currency format
function formatCurrency( num )
{
	// add '$' sign
	num = num.toString().replace(/\$|\,/g,'');
	
	// if not a number, convert to 0
	if( isNaN( num ) ){
		num = "0";
	}
	
	// add positive/negative sign
	sign = ( num == ( num = Math.abs( num ) ) );
	
	// begin calculations
	num = Math.floor( num * 100 + 0.50000000001 );
	cents = num % 100;
	num = Math.floor( num / 100 ).toString();
	
	// add cents, if needed
	if( cents < 10 ){
		cents = "0" + cents;
	}
	
	// add commas as needed
	for( var i = 0; i < Math.floor( ( num.length - ( 1 + i ) ) / 3 ); i++ ){
		num = num.substring( 0, num.length - ( 4 * i + 3 ) ) + ',' + num.substring( num.length - ( 4 * i + 3 ) );
	}
	
	// return formated number
	return ( ( ( sign ) ? '' : '-' ) + '$' + num + '.' + cents );
}