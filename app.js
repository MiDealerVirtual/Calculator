// Include App Core
Ti.include( 'core/core.js' );

// Include Helpers
Ti.include( 'helpers/basic_ui.js' );		// Basic UI
Ti.include( 'helpers/ipad_ui.js' );			// iPad UI
Ti.include( 'helpers/image_loader.js' );	// High Retina Display Image Loader

// Include Modules
Ti.include( 'modules/mod_app_variables.js' );	// MDV App Variables
Ti.include( 'modules/mod_main_tab_nav.js' );	// MDV Master Tab Group
Ti.include( 'modules/mod_calculator.js' );		// MDV Calculator
Ti.include( 'modules/mod_services.js' );		// MDV Services

// Init variables
var system_variables = { size_of_inventory:0, inventory_limit:0, inventory_level:0, web_level:0, sync_level:0 };

// Init mods
core.appVariables.initMod();
core.masterTabGroup.initMod();
core.mdvServices.initMod( system_variables );
core.mdvCalculator.initMod( system_variables );

// Add Mod Tabs
core.masterTabGroup.addTabs( [ core.mdvServices.getModTab(), core.mdvCalculator.getModTab() ] );

// Open Tab Group
core.masterTabGroup.openTabs();

// Testing SB Subscribe ( for future use )
//core.subscribe( 'inventory_change', testSubPub );
//core.subscribe( 'web_change', testSubPub );
//core.subscribe( 'sync_change', testSubPub );