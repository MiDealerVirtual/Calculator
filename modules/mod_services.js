// Attach this module to our core
core.registerModule( 'mdvServices', function( sb )
{
/* Private Data */

	var mod_variables = null;
	var system_variables = null;
	var mod_ui = null;
	
/* Private Method Interface */
	var priFace = {
		
		// initialize all module variables
		_initModVariables: function()
		{
			// init variables object
			mod_variables = {};
			
			// window names
			mod_variables.window_names = [ 'mdv_service_1', 'mdv_service_2', 'mdv_service_3' ];
			
			// component names
			mod_variables.component_names = [ 'level_1', 'level_2', 'level_3' ];
		},
		
		// create & populate tab & window
		_buildModInterface: function()
		{
			// create window
			mod_ui.window = sb.ui.getWindow(
			{  
				title:'MDV',
				backgroundColor:'#fff',
				orientationModes:[Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
				barColor:'#000',
				titleImage:'images/icons/icon_title_bar_logo_small.png'
			} );
			
			// create tab
			mod_ui.tab = sb.ui.getTab(
			{  
				icon:'images/icons/icon_tabbar_soluciones.png',
				title:'Soluciones Virtuales',
				window:mod_ui.window
			} );
			
			// create nav bar buttons
			mod_ui.nav_bar_buttons =
			[
				{ title:'Inventario', value:mod_variables.window_names[0] },
				{ title:'Web', value:mod_variables.window_names[1] },
				{ title:'Sync', value:mod_variables.window_names[2] }
			];
			
			// create nav bar
			mod_ui.nav_bar = sb.ui.getTabbedBar(
			{
				labels:mod_ui.nav_bar_buttons,
				backgroundColor:'#ccc',
				backgroundSelectedColor:'red',
				top:26,
				right:27,
				height:43,
				width:300,
				index:0
			} );
				
				// modify style 
				mod_ui.nav_bar.style = Titanium.UI.iPhone.SystemButtonStyle.PLAIN;
			
				// add event handler to nav bar
				mod_ui.nav_bar.addEventListener( 'click', function( e )
				{
					priFace._showWindow( e.index );
				} );
			
			// initiate services object
			mod_ui.services = {};
			
			// create service window 3: MDV Sync
			priFace._buildServiceWindow( mod_variables.window_names[2], { bg_image:'bk_orange.png', service:'sync', component_sizes:[ 159, 99, 129 ], component_content:[ [ 'cnt_sync_lvl1.png', 52 ], [ 'cnt_sync_lvl2.png', 41 ], [ 'cnt_sync_lvl3.png', 35 ] ] } );
			
			// create service window 2: MDV Web
			priFace._buildServiceWindow( mod_variables.window_names[1], { bg_image:'bk_red.png', service:'web', component_sizes:[ 159, 99, 129 ], component_content:[ [ 'cnt_web_lvl1.png', 19 ], [ 'cnt_web_lvl2.png', 21 ], [ 'cnt_web_lvl3.png', 23 ] ] } );
			
			// create service window 1: MDV Inventario
			priFace._buildServiceWindow( mod_variables.window_names[0], { bg_image:'bk_green.png', service:'inventory', component_sizes:[ 129, 129, 129 ], component_content:[ [ 'cnt_inventory_lvl1.png', 56 ], [ 'cnt_inventory_lvl2.png', 58 ], [ 'cnt_inventory_lvl3.png', 58 ] ] } );
			
			// attach nav bar to view :: LAST THING TO ADD
			mod_ui.window.add( mod_ui.nav_bar );
		},
		
		// build sevice windows
		_buildServiceWindow: function( name_of_window, config )
		{
			// init service window obj
			mod_ui.services[name_of_window] = {};
			
			// init sub window obj
			mod_ui.services[name_of_window].components = {};
			
			// create view with rounded corners
			mod_ui.services[name_of_window].view = sb.ui.getView(
			{
				top:0,
				left:0,
				backgroundImage:'images/bgs/' + config.bg_image
			} );
			
			// create image view for service icon logo
			mod_ui.services[name_of_window].icon_logo = sb.ui.getImageView(
			{
				top:2,
				left:17,
				width:500,
				height:90,
				image:'images/icons/icon_' + config.service + '.png'
			} );
			
			// attach logo to view
			mod_ui.services[name_of_window].view.add( mod_ui.services[name_of_window].icon_logo );
			
			// pre calculate paddings
			var pre_padding = {};
			pre_padding[0] = 90;
			pre_padding[1] = priFace._calculateTop( { prev_height:config.component_sizes[0], prev_padding:pre_padding[0] } );
			pre_padding[2] = priFace._calculateTop( { prev_height:config.component_sizes[1], prev_padding:pre_padding[1] } );
			
			// create & attach sub components
			priFace._buildSubComponent( name_of_window, mod_variables.component_names[0], { service:config.service, lvl:1, window_top:pre_padding[0], content_height:config.component_sizes[0], button_title:'Escoger', content:config.component_content[0] } );
			priFace._buildSubComponent( name_of_window, mod_variables.component_names[1], { service:config.service, lvl:2, window_top:pre_padding[1], content_height:config.component_sizes[1], button_title:'Escoger', content:config.component_content[1] } );
			priFace._buildSubComponent( name_of_window, mod_variables.component_names[2], { service:config.service, lvl:3, window_top:pre_padding[2], content_height:config.component_sizes[2], button_title:'Escoger', content:config.component_content[2] } );
			
			// attach view to window
			mod_ui.window.add( mod_ui.services[name_of_window].view );
		},
		
			// hide other and only show current
			_showWindow: function( index )
			{
				// create name of window using index
				name_of_window = 'mdv_service_' + ( index + 1 );
				
				// loop thru windows
				for( var i = 0; i < mod_variables.window_names.length; i++ )
				{
					// hide/show windows
					mod_ui.services[mod_variables.window_names[i]].view.animate( { opacity:( ( mod_variables.window_names[i] == name_of_window ) ? 1 : 0 ) } );
				}
			},
		
		// build sub component view
		_buildSubComponent: function( name_of_window, name_of_component, config )
		{
			// initiate component object
			mod_ui.services[name_of_window].components[name_of_component] = {};
			
			// create window
			mod_ui.services[name_of_window].components[name_of_component].window = sb.ui.getView(
			{  
				height:'auto',
				width:985,
				top:config.window_top,
				left:19
			} );
			
			// create titlebar
			mod_ui.services[name_of_window].components[name_of_component].titlebar = sb.ui.getView(
			{  
				backgroundImage:'images/bgs/bk_bar_med.png',
				height:44,
				width:985,
				top:0,
				left:0
			} );
			
				// create title
				mod_ui.services[name_of_window].components[name_of_component].title = sb.ui.getLabel(
				{
					top:10,
					left:10,
					color:'#fff',
					text:'Nivel ' + config.lvl,
					font:{ fontSize:20, fontFamily:'Helvetica Neue', fontWeight:'bold' },
					height:'auto'
				} );
				
				// create image view for title green check icon
				mod_ui.services[name_of_window].components[name_of_component].green_check = sb.ui.getImageView(
				{
					/*top:250,*/
					right:10,
					width:29,
					height:29,
					image:'images/icons/icon_check_green.png',
					visible:false
				} );
				
				// create title button
				mod_ui.services[name_of_window].components[name_of_component].title_button = sb.ui.getButton(
				{
					title:config.button_title,
					font:{ fontSize:13, fontFamily:'Helvetica Neue', fontWeight:100 },
					right:10,
					width:90,
					height:29,
					backgroundImage:'images/bgs/bk_btn_dark_gray.png',
					value:[name_of_window, name_of_component, config.service, config.lvl]
				} );
				
					// add event listener to title button
					mod_ui.services[name_of_window].components[name_of_component].title_button.addEventListener( 'click', function( e )
					{
						// show/hide checks/buttons
						priFace._selectLevel( e.source.value[0], e.source.value[1], e.source.value[2], e.source.value[3] );
						
						// notify system that a service level has changed
						sb.publish( /*service*/ e.source.value[2] + '_change', { service:e.source.value[2]/*service*/, value:e.source.value[3]/*level*/, name_of_window:e.source.value[0]/*window*/, component:e.source.value[1]/*component*/, source_mod:'mod_services' } );
						
						// determine next step in wizard
						if( mod_ui.nav_bar.index < 2 /* max number of buttons */ )
						{
							// move to next service
							setTimeout( function()
							{
								mod_ui.nav_bar.index++;
								priFace._showWindow( mod_ui.nav_bar.index );
							}, 350 );
						}
						else
						{
							// switch tabs
							setTimeout( function()
							{
								// notify system that tabs
								sb.publish( 'tab_change', { tab_to_open:'calculator' } );
							}, 400 );
						}
					} );
				
				// attach title & title button to titlebar
				mod_ui.services[name_of_window].components[name_of_component].titlebar.add( mod_ui.services[name_of_window].components[name_of_component].title );
				mod_ui.services[name_of_window].components[name_of_component].titlebar.add( mod_ui.services[name_of_window].components[name_of_component].title_button );
				mod_ui.services[name_of_window].components[name_of_component].titlebar.add( mod_ui.services[name_of_window].components[name_of_component].green_check );
			
			// create components content space
			mod_ui.services[name_of_window].components[name_of_component].content = sb.ui.getView(
			{  
				height:config.content_height,
				width:985,
				top:44,
				left:0,
				backgroundColor:'#fff'
			} );
			
				// create content image view
				mod_ui.services[name_of_window].components[name_of_component].content_image = sb.ui.getImageView(
				{
					top:config.content[1],
					left:18,
					width:'auto',
					height:'auto',
					image:'images/content/' + config.content[0]
				} );
			
			// create components footer
			mod_ui.services[name_of_window].components[name_of_component].footer = sb.ui.getView(
			{  
				backgroundImage:'images/bgs/bk_white_round_bottom.png',
				height:6,
				width:985,
				top:44 + config.content_height,
				left:0
			} );
			
			// attach content image to content view
			mod_ui.services[name_of_window].components[name_of_component].content.add( mod_ui.services[name_of_window].components[name_of_component].content_image );
			
			// attach all sub components parts
			mod_ui.services[name_of_window].components[name_of_component].window.add( mod_ui.services[name_of_window].components[name_of_component].titlebar );
			mod_ui.services[name_of_window].components[name_of_component].window.add( mod_ui.services[name_of_window].components[name_of_component].content );
			mod_ui.services[name_of_window].components[name_of_component].window.add( mod_ui.services[name_of_window].components[name_of_component].footer );
			
			// attach sub component to view
			mod_ui.services[name_of_window].view.add( mod_ui.services[name_of_window].components[name_of_component].window );
		},
			
			// calculate next sub components
			_calculateTop: function( config )
			{
				// dimensions of header and footer
				var dimensions = { titlebar:44, footer:6, padding:10 };
				
				// calculate previous components total height
				var total_height = config.prev_height + dimensions.titlebar + dimensions.footer;
				
				// calculate new padding
				var new_padding = config.prev_padding + total_height + dimensions.padding;
				
				// return
				return new_padding;
			},
			
			// process event of selecting level
			_selectLevel: function( window, component, service, level )
			{
				// loop thru all components
				for( var i = 0; i < mod_variables.component_names.length; i++ )
				{
					// check
					if( mod_variables.component_names[i] == component )
					{
						mod_ui.services[window].components[mod_variables.component_names[i]].title_button.hide();	// hide button
						mod_ui.services[window].components[mod_variables.component_names[i]].green_check.show();	// show check
					}
					// uncheck
					else
					{
						mod_ui.services[window].components[mod_variables.component_names[i]].title_button.show();	// show button
						mod_ui.services[window].components[mod_variables.component_names[i]].green_check.hide();	// hide check
					}
				}
			},
		
		// subscribe to important system events
		_subscribeSystemEvents: function()
		{
			// register each
			core.subscribe( 'inventory_change', priFace._handleSubPub );
			core.subscribe( 'web_change', priFace._handleSubPub );
			core.subscribe( 'sync_change', priFace._handleSubPub );	
		},
		
		// handle modules subpub
		_handleSubPub: function( e_data )
		{
			// only process if system notification isnt' coming from self
			if( e_data.source_mod == 'mod_calculator' )
			{
				// call mod's event handler
				priFace._selectLevel( e_data.name_of_window, 'level_' + e_data.value, e_data.service, e_data.value );
			}
		}
			
	};
	
/* Public Methods Interface */
	var pubFace = {
		
		// Initialize Mod
		initMod: function( variables )
		{
			// save system variables
			system_variables = variables;
			
			// initialize module variables
			priFace._initModVariables();
			
			// initialize module ui object
			mod_ui = {};
			
			// create ui
			priFace._buildModInterface();
			
			// subscribe system events
			priFace._subscribeSystemEvents();
			
		},
		
		// Get Mod Tab
		getModTab: function()
		{
			// return tab ui object
			return mod_ui.tab;	
		}
	};
	
/* Return Public Interface */
	return pubFace;
	
} );