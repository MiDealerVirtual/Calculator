// Load module dependent files
Ti.include( '../helpers/formatting.js' );	// Format helper
Ti.include( '../helpers/form.js' );			// Form helper

// Attach this module to our core
core.registerModule( 'mdvCalculator', function( sb )
{
/* Private Data */
	
	var system_variables = null;
	var app_variables = null;
	var mod_ui = null;
	var inventory_size_brackets = null;
	
/* Private Method Interface */
	var priFace = {
		
		// create & populate tab & window
		_buildModInterface: function()
		{
			// create window
			mod_ui.window = sb.ui.getWindow(
			{  
				title:'MDV',
				backgroundColor:'#fff',
				backgroundImage:'images/bgs/bk_grey.png',
				orientationModes:[Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT],
				barColor:'#000',
				titleImage:'images/icons/icon_title_bar_logo_small.png'
			} );
			
			// create tab
			mod_ui.tab = sb.ui.getTab(
			{  
				icon:'images/icons/icon_tabbar_calculador.png',
				title:'Calculador',
				window:mod_ui.window
			} );
			
			// add inventory size components to window
			priFace._buildInventorySizeComponents();
			
			// add services components to window
			priFace._buildServicesComponents();
			
			// add results panel to window
			priFace._buildResultsPanel();
			
		},
		
		// build top inventory components
		_buildInventorySizeComponents: function()
		{
			// initiate inventory_size
			mod_ui.inventory_size = {};
			
			// create view with rounded corners
			mod_ui.inventory_size.view = sb.ui.getView(
			{
				top:19,
				left:19,
				height:112,
				width:986,
				backgroundColor:'white',
				borderColor:'white',
				borderRadius:5
			} );
			
			// create header
			mod_ui.inventory_size.header = sb.ui.getLabel(
			{
				top:32,
				left:30,
				color:'#000',
				text:'Volumen de Venta:'/*'Tamaño de Inventario:'*/,
				font:{ fontSize:30, fontFamily:'Helvetica Neue', fontWeight:'bold' },
				height:'auto'
			} );
			
			// create sub header
			mod_ui.inventory_size.sub_header = sb.ui.getLabel(
			{
				top:69,
				left:35,
				color:'#b4b4b4',
				text:'0-30, 30-60, 60-100, 100-150, 150-200, 200-300, 300-400, 400-500',
				font:{ fontSize:10, fontFamily:'Arial', fontWeight:'bold' },
				height:'auto'
			} );
			
			// create green slider label
			mod_ui.inventory_size.slider_value = sb.ui.getLabel(
			{
				top:20,
				left:400,
				color:'#37b34a',
				font:{ fontSize:61, fontFamily:'Arial', fontWeight:'bold' },
				height:'auto',
				width:270,
				text:'100-150',
				textAlign:'center'
			} );
			
			// set initial inventory size & upper limit variable
			system_variables.size_of_inventory = 4;
			system_variables.inventory_limit = 150;
			
			// create slider
			mod_ui.inventory_size.slider = sb.ui.getSlider(
			{
				min:1,
				max:8,
				width:215,
				height:'auto',
				right:50,
				value:system_variables.size_of_inventory,
				thumbImage:'images/icons/icon_car.png',
				highlightedThumbImage:'images/icons/icon_car_selected.png'
			} );
			
				// add event handler for slider
				mod_ui.inventory_size.slider.addEventListener( 'change', function( e )
				{
					// update slider label value
					priFace._determineSliderValueBracket( Math.round( e.value ) );
				} );
				
				// add event handler for slider
				mod_ui.inventory_size.slider.addEventListener( 'touchend', function( e )
				{
					// update slider label value
					priFace._determineSliderValueBracket( Math.round( e.value ) );
					
					// update total amount
					priFace._updateTotalAmount();
				} );
			
			// add header & sub header to view
			mod_ui.inventory_size.view.add( mod_ui.inventory_size.header );
			mod_ui.inventory_size.view.add( mod_ui.inventory_size.sub_header );
			
			// add slider & slider value to view
			mod_ui.inventory_size.view.add( mod_ui.inventory_size.slider );
			mod_ui.inventory_size.view.add( mod_ui.inventory_size.slider_value );
			
			// add to mod window
			mod_ui.window.add( mod_ui.inventory_size.view );
		},
			
			// determine slider value bracket
			_determineSliderValueBracket: function( value )
			{
				// only change if value is a number from 1 - 8
				if( value > 0 && value <= 8 )
				{
					// modify label value
					mod_ui.inventory_size.slider_value.text = inventory_size_brackets[value];
					
					// update system variables
					system_variables.size_of_inventory = value;
					system_variables.inventory_limit = parseInt( inventory_size_brackets[value].split( '-' )[1], 10 );
				}
			},
		
		// build top services components
		_buildServicesComponents: function()
		{
			// initiate services
			mod_ui.services = {};
			
			// create view with rounded corners
			mod_ui.services.view = sb.ui.getView(
			{
				top:131,
				left:19,
				height:350,
				width:986
			} );
			
			// add to mod window
			mod_ui.window.add( mod_ui.services.view );
			
			// create title
			mod_ui.services.title = sb.ui.getLabel(
			{
				top:4,
				left:0,
				color:'#000',
				text:'Soluciones Virtuales',
				font:{ fontSize:30, fontFamily:'Helvetica Neue', fontWeight:'bold' },
				height:'auto'
			} );
			
			// add title to view
			mod_ui.services.view.add( mod_ui.services.title );
			
			// create sub window 1: MDV Inventario
			priFace._buildSubWindow( 'mdv_service_1', { window_title:'MDV Inventario', button_title:'Personalizar', sub_window_count:0, service:'inventory' } );
			
			// create sub window 2: MDV Web
			priFace._buildSubWindow( 'mdv_service_2', { window_title:'MDV Web', button_title:'Personalizar', sub_window_count:1, service:'web' } );
			
			// create sub window 3: MDV Sync
			priFace._buildSubWindow( 'mdv_service_3', { window_title:'MDV Sync', button_title:'Personalizar', sub_window_count:2, service:'sync' } );
			
		},
		
			// create sub window
			_buildSubWindow: function( name_of_window, config )
			{
				// init sub window obj
				mod_ui.services[name_of_window] = {};
				
				// create window
				mod_ui.services[name_of_window].window = sb.ui.getView(
				{  
					backgroundImage:'images/bgs/bk_sub_window.png',
					barColor:'#000',
					height:300,
					width:320,
					bottom:0,
					left:( config.sub_window_count * 333 )
				} );
				
				// create titlebar
				mod_ui.services[name_of_window].titlebar = sb.ui.getView(
				{  
					height:44,
					width:320,
					top:0,
					left:0
				} );
					
				// create title
				mod_ui.services[name_of_window].title = sb.ui.getLabel(
				{
					top:10,
					left:10,
					color:'#fff',
					text:config.window_title,
					font:{ fontSize:20, fontFamily:'Helvetica Neue', fontWeight:'bold' },
					height:'auto'
				} );
				
				// create title button
				mod_ui.services[name_of_window].title_button = sb.ui.getButton(
				{
					title:config.button_title,
					font:{ fontSize:13, fontFamily:'Helvetica Neue', fontWeight:100 },
					right:10,
					width:90,
					height:29,
					backgroundImage:'images/bgs/bk_btn_dark_gray.png'
				} );
				
					// title button event handler
					mod_ui.services[name_of_window].title_button.addEventListener('click', function( e )
					{
						mod_ui.services[name_of_window].popover.show(
						{
							view:mod_ui.services[name_of_window].title_button,
							animated:true
						} );
					} );
				
				// create popover
				mod_ui.services[name_of_window].popover = sb.ui.getPopover(
				{ 
					width:250, 
					height:132,
					title:config.window_title,
					arrowDirection:Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP,
					backgroundColor:'white'
				} );

				// create table with popover data
				mod_ui.services[name_of_window].popover_table_data = [
					sb.ui.getTableViewRow( {title:'Nivel 1', value:1 } ),
					sb.ui.getTableViewRow( {title:'Nivel 2', value:2 } ),
					sb.ui.getTableViewRow( {title:'Nivel 3', value:3 } )
				];
				
				// create table with popover table
				mod_ui.services[name_of_window].popover_table = sb.ui.getTableView(
				{
					data:mod_ui.services[name_of_window].popover_table_data,
					height:133,
					top:0
				} );
					
					// create event handler for popover table
					mod_ui.services[name_of_window].popover_table.addEventListener( 'click', function( e )
					{
						// process event
						priFace._processModLevelChange( name_of_window, config.service, e.row.value );
						
						// notify system that a service level has changed
						sb.publish( config.service + '_change', { service:config.service, value:e.row.value, name_of_window:name_of_window, source_mod:'mod_calculator' } );
					} );
					
				// create image view for big service icon
				mod_ui.services[name_of_window].icon_big = sb.ui.getImageView(
				{
					top:52,
					width:220,
					height:180,
					image:'images/icons/icon_big_' + config.service + '.png'
				} );
				
				// create image view for red check icon
				mod_ui.services[name_of_window].red_check = sb.ui.getImageView(
				{
					top:250,
					width:29,
					height:29,
					image:'images/icons/icon_check_red.png'
				} );
				
				// create image view for green check icon
				mod_ui.services[name_of_window].green_check = sb.ui.getImageView(
				{
					top:250,
					left:119,
					width:29,
					height:29,
					image:'images/icons/icon_check_green.png',
					visible:false
				} );
				
				// create selected level label
				mod_ui.services[name_of_window].selected_level = sb.ui.getLabel(
				{
					top:252,
					left:154,
					color:'#666666',
					text:'Nivel 1',
					font:{ fontSize:16, fontFamily:'Helvetica Neue', fontWeight:'100' },
					height:'auto',
					visible:false
				} );
				
				// attach table to popover
				mod_ui.services[name_of_window].popover.add( mod_ui.services[name_of_window].popover_table );
								
				// attach title & button
				mod_ui.services[name_of_window].titlebar.add( mod_ui.services[name_of_window].title );
				mod_ui.services[name_of_window].titlebar.add( mod_ui.services[name_of_window].title_button );
				
				// attach titlebar
				mod_ui.services[name_of_window].window.add( mod_ui.services[name_of_window].titlebar );
				
				// attach big service icon, red check, green check and selecte level label
				mod_ui.services[name_of_window].window.add( mod_ui.services[name_of_window].icon_big );
				mod_ui.services[name_of_window].window.add( mod_ui.services[name_of_window].red_check );
				mod_ui.services[name_of_window].window.add( mod_ui.services[name_of_window].green_check );
				mod_ui.services[name_of_window].window.add( mod_ui.services[name_of_window].selected_level );
				
				// attach to main mod window
				mod_ui.services.view.add( mod_ui.services[name_of_window].window );
			},
			
				// process event handler externally (in order to use sub pub)
				_processModLevelChange: function( window_name, service_name, value )
				{
					// loop thru each row and make sure only one row is selected
					for( var i = 0; i < mod_ui.services[window_name].popover_table_data.length; i++ )
					{
						if( i != ( value - 1 ) ){
							// hide check mark
							mod_ui.services[window_name].popover_table_data[i].hasCheck = false;
						}
						else{
							// show check mark on selected row
							priFace._showCheckMark( mod_ui.services[window_name].popover_table_data[i], mod_ui.services[window_name].popover );
						}	
					}
					
					// update outter check marks & label
					mod_ui.services[window_name].red_check.visible = false;						// hide red check
					mod_ui.services[window_name].selected_level.text = 'Nivel ' + value;	// change level text
					mod_ui.services[window_name].selected_level.visible = true;					// show text
					mod_ui.services[window_name].green_check.visible = true;						// show green check
					
					// update system variables
					system_variables[service_name + '_level'] = value;
					
					// update total amount
					priFace._updateTotalAmount();
			},
			
				// determine what popove option was selected
				_showCheckMark: function( row, popover )
				{
					// set a .20 of a second timeout
					setTimeout( function()
					{
						// show check
						row.hasCheck = true;
					}, 200 );
					
					// set a .30 of a second timeout
					setTimeout( function()
					{
						// hide popover
						popover.hide( { animated:true } );
					}, 300 );
				},
			
		// create bottom part of module window
		_buildResultsPanel: function()
		{
			// initiate results & settings object
			mod_ui.results = {};
			mod_ui.settings = {};
			
			// create view with rounded corners
			mod_ui.results.view_left = sb.ui.getView(
			{
				top:501,
				left:19,
				height:133,
				width:320,
				backgroundColor:'#f2f2f2',
				borderColor:'#f2f2f2',
				borderRadius:5
			} );	
			
			// create view with rounded corners
			mod_ui.results.view_right = sb.ui.getView(
			{
				top:501,
				left:/* NEW LEFT:*/ 19, // OLD LEFT: ( 19 + 320 + 13 ),
				height:133,
				width:653 /* NEW */ + ( 320 + 13 ),
				backgroundColor:'#f2f2f2',
				borderColor:'#f2f2f2',
				borderRadius:5
			} );
			
			// create total label
			mod_ui.results.total_label = sb.ui.getLabel(
			{
				top:39,
				left:49,
				color:'#000',
				text:'Total:',
				font:{ fontSize:48, fontFamily:'Arial', fontWeight:'bold' },
				height:'auto'
			} );
			
			// create total amount
			mod_ui.results.total_amount = sb.ui.getLabel(
			{
				top:39,
				left:215,
				width:350,
				height:'auto',
				color:'#37b34a',
				text:'$0',
				font:{ fontSize:48, fontFamily:'Arial', fontWeight:'bold' },
				textAlign:'left'
			} );
			
			// create settings panel
			priFace._buildSettingsPanel();
			
			// create settings button
			mod_ui.results.settings_button = sb.ui.getButton(
			{
				width:20,
				height:20,
				bottom:8,
				right:8,
				backgroundImage:'images/icons/icon_settings.png'
			} );
				
				// settings button event handler
				mod_ui.results.settings_button.addEventListener( 'click', function( e )
				{
					// ensure height is correct					
					// mod_ui.settings.animation.height = 704;
					mod_ui.settings.animation.opacity = 1;
					
					// open window
					mod_ui.settings.window.open( mod_ui.settings.animation );
				} );
				
			// create discounts button
			mod_ui.results.discounts_button = sb.ui.getButton(
			{
				width:20,
				height:20,
				bottom:8,
				right:8 + 20 + 20,
				backgroundImage:'images/icons/icon_discounts.png'
			} );
			
				// discounts button event handler
				mod_ui.results.discounts_button.addEventListener('click', function( e )
				{
					// select correct value
					for( var i = 0, len = mod_ui.results.discounts_popover_picker_data.length; i < len; i++ )
					{
						if( mod_ui.results.discounts_popover_picker_data[i].custom_value == mod_ui.results.current_discount_set )
						{
							// select row
							mod_ui.results.discounts_popover_picker.setSelectedRow( 0, i, false );
						}
					}
					
					// show popover
					mod_ui.results.discounts_popover.show(
					{
						view:mod_ui.results.discounts_button,
						animated:true
					} );
				} );
			
			// create discount popover
			mod_ui.results.discounts_popover = sb.ui.getPopover(
			{ 
				width:250, 
				height:110,
				title:'Promos',
				arrowDirection:Ti.UI.iPad.POPOVER_ARROW_DIRECTION_DOWN,
				backgroundColor:'white'
			} );
			
				// populate discount popover
				mod_ui.results.discounts_popover_picker = sb.ui.getPicker( { selectionIndicator:true } );
				mod_ui.results.discounts_popover_picker_data =
				[	sb.ui.getPickerRow( { title:'Ninguno', custom_value:'none' } ),
					sb.ui.getPickerRow( {
											title:'MDV_A'/*'Descuento A: ' + ( app_variables.discountA * 100 ).toString() + '%'*/,
											custom_value:app_variables.discountA
										} ),
					sb.ui.getPickerRow( {
											title:'MDV_B' /*'Descuento B: ' + ( app_variables.discountB * 100 ).toString() + '%'*/,
											custom_value:app_variables.discountB
										} ) ];
				mod_ui.results.discounts_popover_picker.add( mod_ui.results.discounts_popover_picker_data );
				mod_ui.results.discounts_popover.add( mod_ui.results.discounts_popover_picker );
				
				// add event handler to discount popover 
				mod_ui.results.discounts_popover_picker.addEventListener( 'change', function( e )
				{
					// update current discount
					mod_ui.results.current_discount_set = e.row.custom_value;
					
					// update price
					priFace._updateTotalAmount();
				} );
				
				// save the current discount
				mod_ui.results.current_discount_set = 'none';
			
			// create promo input field
			mod_ui.results.promo_field = sb.ui.getTextField(
			{
				borderRadius:5,
				borderColor:'#b0b0b0',
				borderWidth:3,
				backgroundColor:'#fff',
				width:140,
				height:53,
				top:41,
				left:15,
				enabled:true,
				suppressReturn:true,
				rightButtonPadding:10,
				leftButtonPadding:10,
				font:{ fontSize:25, fontFamily:'Arial', fontWeight:'bold' }
			} );
			
			// create recalculate button
			mod_ui.results.promo_button = sb.ui.getButton(
			{
				width:135,
				height:51,
				top:42,
				right:16,
				backgroundImage:'images/btns/btn_recalculate.png'
			} );
			
			// add total label and value to view right
			mod_ui.results.view_right.add( mod_ui.results.total_label );
			mod_ui.results.view_right.add( mod_ui.results.total_amount );
			mod_ui.results.view_right.add( mod_ui.results.settings_button );
			mod_ui.results.view_right.add( mod_ui.results.discounts_button );
			
			// add total label and value to view left
			mod_ui.results.view_left.add( mod_ui.results.promo_field );
			mod_ui.results.view_left.add( mod_ui.results.promo_button );
			
			// add to mod window
			// mod_ui.window.add( mod_ui.results.view_left );
			mod_ui.window.add( mod_ui.results.view_right );
		},
		
		// build settings window form
		_buildSettingsPanel: function()
		{
			// create local form config
			var form_helper_config = {};
			
			// initiate labels & text fields objects
			mod_ui.settings.labels = {};
			mod_ui.settings.text_fields = {};
			
			// create settings window
			mod_ui.settings.window = sb.ui.getWindow(
			{
				height:704,
				width:'100%',
				backgroundColor:'#737373',
				bottom:0,
				opacity:0
			} );
			
			// create window open animation
			mod_ui.settings.animation = sb.ui.getAnimation();
			mod_ui.settings.animation.duration = 300;
		
			// create a button to save window
			mod_ui.settings.save_btn = sb.ui.getButton(
			{
				//title:'Guardar',
				backgroundImage:'images/btns/btn_sm_save.png',
				height:57,
				width:61,
				left:860,
				bottom:60
			} );
			
			// create a button to close window
			mod_ui.settings.close_btn = sb.ui.getButton(
			{
				//title:'Cerrar',
				backgroundImage:'images/btns/btn_sm_close.png',
				height:57,
				width:61,
				left:860 + 71,
				bottom:60
			} );
			
			// add save & close button to settings window
			mod_ui.settings.window.add( mod_ui.settings.save_btn );
			mod_ui.settings.window.add( mod_ui.settings.close_btn );
		
			// settings panel heading
			mod_ui.settings.header = sb.ui.getLabel(
			{
				color:'#fff',
				text:'Configuración',
				top:20,
				left:20,
				width:'100%',
				height:'auto',
				textAlign:'left',
				font:{ fontSize:30, fontFamily:'Helvetica Neue', fontWeight:'bold' }
			} );
			
			// add close button to settings window
			mod_ui.settings.window.add( mod_ui.settings.header );
			
	/* WORKING HERE */
	
			// create reset button
			mod_ui.settings.reset_btn = sb.ui.getButton(
			{
				//title:'Guardar',
				backgroundImage:'images/icons/icon_reset.png',
				height:20,
				width:20,
				left:230,
				top:32
			} );
			
			// add reset button to settings window
			mod_ui.settings.window.add( mod_ui.settings.reset_btn );
			
				// reset button event handler
				mod_ui.settings.reset_btn.addEventListener( 'click', function( e )
				{
					// tell system to reset app variables
					sb.publish( 'settings_reset', { reset_variables:true } );
				} );
	
	/* END WORKING */
			
			// save instance of settings properties
			form_helper_config.window = mod_ui.settings.window;
			form_helper_config.labels = mod_ui.settings.labels;
			form_helper_config.text_fields = mod_ui.settings.text_fields;
			
			// add text fields and labels, column 1
			createInputWithLabel( form_helper_config,
				{ name:'photoWageLabel', text:'Photo Wage/hr:', top:80, left:20 },
				{ name:'photoWage', width:120, top:110, left:20 } );
			
			createInputWithLabel( form_helper_config,
				{ name:'biWeeklyLabel', text:'Bi-Weekly:', top:160, left:20 },
				{ name:'biWeekly', top:190, width:120, left:20 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'weeklyLabel', text:'Weekly:', top:240, left:20 },
				{ name:'weekly', top:270, width:120, left:20} );
				
			createInputWithLabel( form_helper_config,
				{ name:'markupLabel', text:'Markup:', top:320, left:20 },
				{ name:'markup', top:350, width:120, left:20 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'discountALabel', text:'Discount A:', top:400, left:20 },
				{ name:'discountA', top:430, width:120, left:20 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'discountBLabel', text:'Discount B:', top:480, left:20 },
				{ name:'discountB', top:510, width:120, left:20 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'profitMarginsLabel', text:'Profit Margins:', top:560, left:20 },
				{ name:'profitMargins', top:590, width:120, left:20 } );
				
			// Column 2
			
			createInputWithLabel( form_helper_config,
				{ name:'simplePhotosLabel', text:'Simple Photos/hr:', top:80, left:300 },
				{ name:'simplePhotos', top:110, width:120, left:300 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'elitePhotosLabel', text:'Elite Photos/hr:', top:160, left:300 },
				{ name:'elitePhotos', top:190, width:120, left:300 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'photoDriveTimeLabel', text:'Photo Drive Time/hr:', top:240, left:300 },
				{ name:'photoDriveTime', top:270, width:120, left:300 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'optCostLabel', text:'Opt. Cost:', top:320, left:300 },
				{ name:'optCost', top:350, width:120, left:300 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'mdvWebLevel1CoefLabel', text:'MDV Web Level 1 Coef.:', top:400, left:300 },
				{ name:'mdvWebLevel1Coef', top:430, width:120, left:300 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'mdvWebLevel2CoefLabel', text:'MDV Web Level 2 Coef.:', top:480, left:300 },
				{ name:'mdvWebLevel2Coef', top:510, width:120, left:300 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'mdvWebLevel3CoefLabel', text:'MDV Web Level 3 Coef.:', top:560, left:300 },
				{ name:'mdvWebLevel3Coef', top:590, width:120, left:300 } );
			
			// Column 3
			
			createInputWithLabel( form_helper_config,
				{ name:'syncLevel1Label', text:'Sync Level 1/hr:', top:80, left:580 },
				{ name:'syncLevel1', top:110, width:120, left:580 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'syncLevel2Label', text:'Sync Level 2/hr:', top:160, left:580 },
				{ name:'syncLevel2', top:190, width:120, left:580 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'syncLevel3Label', text:'Sync Level 3/hr:', top:240, left:580 },
				{ name:'syncLevel3', top:270, width:120, left:580 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'syncWageLabel', text:'Sync Wage/hr:', top:320, left:580 },
				{ name:'syncWage', top:350, width:120, left:580 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'syncBaseLabel', text:'Sync Base:', top:400, left:580 },
				{ name:'syncBase', top:430, width:120, left:580 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'chatWageLabel', text:'Chat Wage/hr:', top:480, left:580 },
				{ name:'chatWage', top:510, width:120, left:580 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'webLevel1Label', text:'Web Level 1:', top:560, left:580 },
				{ name:'webLevel1', top:590, width:120, left:580 } );
			
			// Column 4
				
			createInputWithLabel( form_helper_config,
				{ name:'webLevel2Label', text:'Web Level 2:', top:80, left:860 },
				{ name:'webLevel2', top:110, width:120, left:860 } );
				
			createInputWithLabel( form_helper_config,
				{ name:'webLevel3Label', text:'Web Level 3:', top:160, left:860 },
				{ name:'webLevel3', top:190, width:120, left:860 } );
				
			// save button event handler
			mod_ui.settings.save_btn.addEventListener( 'click', function()
			{
				// change opacity, and close
				mod_ui.settings.animation.opacity = 0;
				mod_ui.settings.window.close( mod_ui.settings.animation );
				
				// fetch changed values
				var changed_settings_variable_values = priFace._getSettingFieldValues( 'both' );
				
				// notify system that a service level has changed
				sb.publish( 'settings_change', { modified_values:changed_settings_variable_values.array } );
				
				// update local copy of values
				app_variables = changed_settings_variable_values.object;
				
				// update discount popover
				priFace._updateDiscountPopover();
			} );
			
			// close button event handler
			mod_ui.settings.close_btn.addEventListener( 'click', function()
			{
				// change opacity, and close
				mod_ui.settings.animation.opacity = 0;
				mod_ui.settings.window.close( mod_ui.settings.animation );
			} );
			
			// update local copy of app vars
			app_variables = priFace._getSettingFieldValues( 'object' );
		},
		
		// extract values of all setting's text fields
		_getSettingFieldValues: function( what_to_return /* 'both' = array & object in json, 'array' = return array, 'object' = return object */ )
		{
			// create array that holds all values to return
			var temp_field_values = [], temp_field_values_object = {}, i = 0;
			
			// loop thru each value
			for( var f in mod_ui.settings.text_fields )
			{	
				// security check
				if( f != '' && mod_ui.settings.text_fields[f].value != null )
				{
					// create record (array)
					temp_field_values[i] = [ mod_ui.settings.text_fields[f].inputName, mod_ui.settings.text_fields[f].value ];
					
					// create record (object)
					temp_field_values_object[mod_ui.settings.text_fields[f].inputName] = mod_ui.settings.text_fields[f].value;
					
					// increment count
					i++;
				}
			}
			
			// return values
			if( temp_field_values.length > 0 )
			{
				// determin return format
				if( what_to_return == 'both' ){
					return { array:temp_field_values, object:temp_field_values_object };
				}
				else if( what_to_return == 'object' ){
					return temp_field_values_object;
				}
				else{
					return temp_field_values;
				}
			}
			else{
				return false;	
			}
		},
		
		// update the discounts after any change to the app variables
		_updateDiscountPopover: function()
		{
			// update new values
			mod_ui.results.discounts_popover_picker_data[1].custom_value = app_variables.discountA;
			mod_ui.results.discounts_popover_picker_data[2].custom_value = app_variables.discountB;
			
			// update new titles
			// mod_ui.results.discounts_popover_picker_data[1].title = 'Descuento A: ' + ( app_variables.discountA * 100 ).toString() + '%';
			// mod_ui.results.discounts_popover_picker_data[2].title = 'Descuento B: ' + ( app_variables.discountB * 100 ).toString() + '%';
			
			// update selected value
			mod_ui.results.current_discount_set = 'none';
			
			// udpate total amount, remove any discounts
			priFace._updateTotalAmount();
		},
		
		// update total amount after any change
		_updateTotalAmount: function()
		{
			// create shortcut
			var sv = system_variables;
			
			// save new total
			var new_total = 0;
			
			// determine if all variables are present, if so, proceed
			if( sv.size_of_inventory > 0 && sv.inventory_level > 0 && sv.web_level > 0 && sv.sync_level > 0 )
			{
				// IMPORTANT! - calculate MDV  total
				new_total = formulas.calculateTotalFinal( sv, app_variables );
				
				// determine if discount is applicable
				if( mod_ui.results.current_discount_set != 'none' )
				{
					// calculate new price
					new_total = new_total - ( new_total * mod_ui.results.current_discount_set );
				}
							
				// update total
				mod_ui.results.total_amount.text = formatCurrency( new_total );	// convert to currency
			}
		},
		
		// subscribe to important system events
		_subscribeSystemEvents: function()
		{
			// register each service change
			sb.subscribe( 'inventory_change', priFace._handleSubPub );
			sb.subscribe( 'web_change', priFace._handleSubPub );
			sb.subscribe( 'sync_change', priFace._handleSubPub );
			
			// register reset app variable event
			sb.subscribe( 'settings_reset_allow', priFace._handleSubPub );
		},
		
		// handle modules subpub
		_handleSubPub: function( e_data )
		{
			// only process if system notification isnt' coming from self
			if( e_data.source_mod == 'mod_services' )
			{
				// call mod's event handler
				priFace._processModLevelChange( e_data.name_of_window, e_data.service, e_data.value );
			}
			
			// only process if system notification is allowing override to occur
			if( e_data.action == 'variable_override' )
			{
				// overrite each fields value
				var length = e_data.new_values.length;
				for( var i = 0, len = length; i < len; i++ )
				{
					mod_ui.settings.text_fields[e_data.new_values[i][0]].value = e_data.new_values[i][1];
					app_variables[e_data.new_values[i][0]] = e_data.new_values[i][1];
				}
				
				// change opacity, and close
				mod_ui.settings.animation.opacity = 0;
				mod_ui.settings.window.close( mod_ui.settings.animation ); 
				
				// update total amount
				priFace._updateTotalAmount();
			}
		}
	};
	
/* Formula Calculation Interface */
	var formulas = {
		
		// calculate complete price
		calculateTotalFinal: function( sv /* system vars */, ac /* app constants */ )
		{
			return 	formulas._calcInventoryTotal( sv, ac ) +
					formulas._calcWebTotal( sv, ac ) +
					formulas._calcSyncTotal( sv, ac );	
		},
		
		// calulate mdv inventory formula
		_calcInventoryTotal: function( sv /* system vars */, ac /* app constants */ )
		{
			// declare local vars needed
			var costs = 0, price = 0;
			
			// determine which formula to use
			switch( sv.inventory_level )
			{
				case 1:
					costs = ( ( ac.biWeekly * ac.photoDriveTime ) + ( sv.inventory_limit / ac.simplePhotos ) ) * ac.photoWage;
					price = ( costs / ( 1 - ac.profitMargins ) ) * ( 1 + ac.markup );
					break;
				case 2:
					costs = ( ( ac.biWeekly * ac.photoDriveTime ) + ( sv.inventory_limit / ac.elitePhotos ) ) * ac.photoWage;
					price = ( costs / ( 1 - ac.profitMargins ) ) * ( 1 + ac.markup );
					break;
				case 3:
					costs = ( ( ( ac.weekly * ac.photoDriveTime ) + ( sv.inventory_limit / ac.elitePhotos ) ) * ac.photoWage ) * ac.optCost;
					price = ( costs / ( 1 - ac.profitMargins ) ) * ( 1 + ac.markup );
					break;
				default:
					return 0;	
			}
			
			// return mdv inventory final price
			Titanium.API.info( 'mdv inventory: $' + price );
			return price;
		},
		
		// calulate mdv web formula
		_calcWebTotal: function( sv /* system vars */, ac /* app constants */ )
		{
			// declare local vars needed
			var costs = 0, price = 0, prev_price = 0, total = 0;
			
			// determine which formula to use
			switch( sv.web_level )
			{
				case 1:
					price = ( ac.webLevel1 + ( sv.inventory_limit * ac.mdvWebLevel1Coef ) ) * ( 1 + ac.markup );
					total = price;
					break;
				case 2:
					prev_price = ( ac.webLevel1 + ( sv.inventory_limit * ac.mdvWebLevel1Coef ) ) * ( 1 + ac.markup );
					total = ( ac.webLevel2 + ( sv.inventory_limit * ac.mdvWebLevel2Coef ) ) + prev_price;
					break;
				case 3:
					prev_price = ( ac.webLevel2 + ( sv.inventory_limit * ac.mdvWebLevel2Coef ) ) + /* prev price to this one */ ( ( ac.webLevel1 + ( sv.inventory_limit * ac.mdvWebLevel1Coef ) ) * ( 1 + ac.markup ) );
					price = ( ac.webLevel3 + ( sv.inventory_limit * ac.mdvWebLevel3Coef ) );
					total = price + prev_price;
					break;
				default:
					return 0;	
			}
			
			// return mdv web final price
			Titanium.API.info( 'mdv web: $' + total );
			return total;
		},
		
		// calulate mdv sync formula
		_calcSyncTotal: function( sv /* system vars */, ac /* app constants */ )
		{
			// declare local vars needed
			var costs = 0, price = 0;
			
			// determine which formula to use
			switch( sv.sync_level )
			{
				case 1:
					costs = ( ( sv.inventory_limit / ac.syncLevel1 ) * ac.biWeekly ) * ac.syncWage;
					price = ( ac.syncBase + costs ) * ( 1 + ac.markup );
					break;
				case 2:
					costs = ( ( sv.inventory_limit / ac.syncLevel2 ) * ac.biWeekly ) * ac.syncWage;
					price = ( ac.syncBase + costs ) * ( 1 + ac.markup );
					break;
				case 3:
					costs = ( ( ( sv.inventory_limit / ac.syncLevel3 ) * ac.weekly ) * ac.syncWage ) * ac.optCost;
					price = ( ac.syncBase + costs ) * ( 1 + ac.markup );
					break;
				default:
					return 0;	
			}
			
			// return mdv sync final price
			Titanium.API.info( 'mdv sync: $' + price );
			return price;
		}
	};
	
/* Public Methods Interface */
	var pubFace = {
		
		// Initialize Mod
		initMod: function( variables )
		{
			// save system variables
			system_variables = variables;
			
			// initialize local copy of app variables
			app_variables = {};
			
			// initialize module ui object
			mod_ui = {};
			
			// initialize brackets (store possible inventory sizes)
			inventory_size_brackets = [null, '0-30', '30-60', '60-100', '100-150', '150-200', '200-300', '300-400', '400-500'];
			
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