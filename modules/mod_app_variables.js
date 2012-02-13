// Attach this module to our core
core.registerModule( 'appVariables', function( sb )
{
/* Private Data */
	
	var defualt_app_variable_values = null;
	var list_name = null;
	
/* Private Method Interface */
	var priFace = {
		
		// determine if properties have been already added
		_hasProperties: function()
		{
			return Ti.App.Properties.getList( list_name );
		},
		
		// initiate default app variable values
		_initDefaultAppValues: function()
		{
			defualt_app_variable_values = [
				[ 'photoWage', 17 ],
				[ 'biWeekly', 2 ],
				[ 'weekly', 4 ],
				[ 'markup', 0.30 ], /*15 */
				[ 'discountA', 0.10 ],
				[ 'discountB', 0.15 ],
				[ 'profitMargins', 0.75 ],
				[ 'simplePhotos', 60 ],
				[ 'elitePhotos', 25 ],
				[ 'photoDriveTime', 1.5 ],
				[ 'optCost', 1.2 ],
				[ 'mdvWebLevel1Coef', 0.5 ],
				[ 'mdvWebLevel2Coef', 0.75 ],
				[ 'mdvWebLevel3Coef', 1.00 ],
				[ 'syncLevel1', 60 ],
				[ 'syncLevel2', 30 ],
				[ 'syncLevel3', 20 ],
				[ 'syncWage', 6 ],
				[ 'syncBase', 225 ],
				[ 'chatWage', 2 ],
				[ 'webLevel1', 500 ],
				[ 'webLevel2', 200 ],
				[ 'webLevel3', 400 ]
			];
		},
		
		// download persistant variable values
		_initPersistantAppValues: function()
		{
			// initialize empty array
			defualt_app_variable_values = Ti.App.Properties.getList( list_name );
		},
		
		_updatePersistantAppValues: function( new_app_variable_values )
		{
			// re-write vars in app
			Ti.App.Properties.setList( list_name, new_app_variable_values );
			
			// re-write local default values
			defualt_app_variable_values = new_app_variable_values;
		},
		
		// subscribe to important system events
		_subscribeSystemEvents: function()
		{
			// register each
			core.subscribe( 'settings_change', priFace._handleSubPub );
			core.subscribe( 'settings_reset', priFace._handleResetVars );
		},
		
		// handle modules subpub
		_handleSubPub: function( e_data )
		{
			// handle event
			priFace._updatePersistantAppValues( e_data.modified_values );
		},
		
		// handle reseting app variables to default values
		_handleResetVars: function( e_data )
		{
			// load default values
			priFace._initDefaultAppValues();
			
			// register vars in app
			Ti.App.Properties.setList( list_name, defualt_app_variable_values );
			
			// publish permission to calculator
			sb.publish( 'settings_reset_allow', { action:'variable_override', new_values:defualt_app_variable_values } );
		}
	};
	
/* Public Methods Interface */
	var pubFace = {
		
		// initialize mod
		initMod: function()
		{
			// set list name
			list_name = 'mdv_pricing_vars';
			
			// determine if loading default values, or app altered values
			if( priFace._hasProperties() )
			{
				// load persistant app data
				priFace._initPersistantAppValues();
			}
			else
			{
				// load default values
				priFace._initDefaultAppValues();
				
				// register vars in app
				Ti.App.Properties.setList( list_name, defualt_app_variable_values );
			}
			
			// subscribe system events
			priFace._subscribeSystemEvents();
		},
		
		// fetch specific variable value
		fetchVar: function( var_name )
		{
			// loop thru variables until found
			for( var i = 0, len = defualt_app_variable_values.length; i < len; i++ )
			{
				// check for match
				if( defualt_app_variable_values[i][0] == var_name )
				{
					return defualt_app_variable_values[i][1];	// return value
				}
			}	
		}
	};
	
/* Return Public Interface */
	return pubFace;
	
} );