// Form Helper Functions

// build a label and text field pair
function createInputWithLabel( config /* misc config */, l_config /* label config */, tf_config /* text field config */ )
{
	// create label
	config.labels[l_config.name] = core.ui.getLabel(
	{
		color:'#fff',
		text:l_config.text,
		top:l_config.top||75,
		left:l_config.left||20,
		width:l_config.width||'auto',
		height:'auto'
	} );
	
	// create text field
	config.text_fields[tf_config.name] = core.ui.getTextField(
	{
		hintText:tf_config.hint_text,
		height:tf_config.height||35,
		top:tf_config.top||100,
		left:tf_config.left||190,
		width:tf_config.width||250,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
		enableReturnKey:true,
		returnKeyType:Titanium.UI.RETURNKEY_DONE,
		inputName:tf_config.name
	} );
	
		// determine if values need loading
		if( true )
		{
			config.text_fields[tf_config.name].value = core.appVariables.fetchVar( tf_config.name );
		}
	
	// attact to window
	config.window.add( config.labels[l_config.name] );
	config.window.add( config.text_fields[tf_config.name] );
}