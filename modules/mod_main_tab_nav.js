// Attach this module to our core
core.registerModule( 'masterTabGroup', function( sb )
{
/* Private Data */
	
	var masterTabGroup = null;
	
/* Private Method Interface */
	var priFace = {
		
		// Add Tabs to Tab Group
		_processAddTabs: function( tabs /* array of tab objects */ )
		{
			// only proceed if tabs present
			if( tabs )
			{
				// loop and add all tabs to master tab group
				for( var i = 0, len = tabs.length; i < len; ++i )
				{
					masterTabGroup.addTab( tabs[i] );		// adding tabs
				}
			}
		},
		
		// handle modules subpub
		_handleSubPub: function( e_data )
		{
			// only process if `tab_to_open` is present
			if( e_data.tab_to_open )
			{
				masterTabGroup.setActiveTab( 1 );
			}
		}
		
	};
	
/* Public Methods Interface */
	var pubFace = {
		
		// Initialize Mod
		initMod: function()
		{
			// create master tab group
			masterTabGroup = core.ui.getTabGroup();
			
			// register tab change
			sb.subscribe( 'tab_change', priFace._handleSubPub );
		},
		
		// Interface for _processAddTabs()
		addTabs: function( tabs /* array of tab objects */ )
		{
			// call private method to process addition of tabs
			priFace._processAddTabs( tabs );
		},
		
		// Open Master Tab Group
		openTabs: function()
		{
			// call native `open` method
			masterTabGroup.open();
		}
	};
	
/* Return Public Interface */
	return pubFace;
	
} );