/*
* Basic UI Helper
*/

// UI::View Options
core.loadUIComponent( 'View', Ti.UI.createView );

// UI::Window Options
core.loadUIComponent( 'Window', Ti.UI.createWindow );

// UI::NavigationGroup Options
core.loadUIComponent( 'NavGroup', Ti.UI.iPhone.createNavigationGroup );

// UI::TableView Options
core.loadUIComponent( 'TableView', Ti.UI.createTableView );

// UI::TableViewRow Options
core.loadUIComponent( 'TableViewRow', Ti.UI.createTableViewRow );

// UI::Label Options
core.loadUIComponent( 'Label', Ti.UI.createLabel );

// UI::Button Options
core.loadUIComponent( 'Button', Ti.UI.createButton );

// UI::Tab Options
core.loadUIComponent( 'Tab', Ti.UI.createTab );

// UI::TabGroup Options
core.loadUIComponent( 'TabGroup', Ti.UI.createTabGroup );

// UI::MapView Options
core.loadUIComponent( 'MapView', Ti.Map.createView,
	{
		mapType: Ti.Map.STANDARD_TYPE,
		region: {latitude:29.74887863492847, longitude:-95.36201477050782, latitudeDelta:0.04, longitudeDelta:0.04},
		animate:true,
		regionFit:true,
		userLocation:true
	} );

// UI::MapAnnotation Options
core.loadUIComponent( 'MapAnnotation', Ti.Map.createAnnotation );

// UI::ButtonBar Options
core.loadUIComponent( 'ButtonBar', Ti.UI.createButtonBar, 
{
    backgroundColor:'#336699',
    style:(!core.isAndroid) ? Titanium.UI.iPhone.SystemButtonStyle.BAR:null,
    height:25,
	width:150
});

// UI::TabbedBar Options
core.loadUIComponent( 'TabbedBar', Ti.UI.createTabbedBar, 
{
    backgroundColor:'#336699',
    style:(!core.isAndroid) ? Titanium.UI.iPhone.SystemButtonStyle.BAR:null,
    height:25,
	width:150
});

// UI::ScrollableView Options
core.loadUIComponent( 'ScrollableView', Ti.UI.createScrollableView );

// UI:AlertDialog Options
core.loadUIComponent( 'Alert', Ti.UI.createAlertDialog );

// UI:Picker Options
core.loadUIComponent( 'Picker', Ti.UI.createPicker );

	// UI:PickerColumn Options
	core.loadUIComponent( 'PickerColumn', Ti.UI.createPickerColumn );
	
	// UI:PickerRow Options
	core.loadUIComponent( 'PickerRow', Ti.UI.createPickerRow );
	
// UI:Toolbar Options
core.loadUIComponent( 'Toolbar', Ti.UI.createToolbar );

// UI:Slider Options
core.loadUIComponent( 'Slider', Ti.UI.createSlider );

// UI:ImageView Options
core.loadUIComponent( 'ImageView', Ti.UI.createImageView );

// UI:TextField Options
core.loadUIComponent( 'TextField', Ti.UI.createTextField );

// UI:Animation Options
core.loadUIComponent( 'Animation', Ti.UI.createAnimation );

