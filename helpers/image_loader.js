/*
* Image Loader Helper
* @return: object - image loader object with multiple helper functions
* @params: Ti reference
*/
function initImageLoader( t )
{
	// Private Data
	var loResPath = 'images/';
	var hiResPath = 'images/hires/';
	var tmpImage = '';
	
	// Public Interface
	var imgFace = {
		// load image (hi res or lo res)
		loadImage: function( image_to_load )
		{
			// break up image parts
			tmpImage = priFace._seperateFileParts( image_to_load );
			
			// build image path to image
			if( priFace._isHighRes() ){
				tmpImage = hiResPath + tmpImage.file + '@2x' + tmpImage.ext;
			}
			else{
				tmpImage = loResPath + tmpImage.file + tmpImage.ext;
			}
				
			// return complete image path
			return tmpImage;
		}
	};
	
	// Privae Interface
	var priFace = {
		// Return file name and extension seperate
		_seperateFileParts: function( file )
		{
			// detect "."
			var dot = file.lastIndexOf( "." );
			
			// return early if no dot
			if( dot == -1 ){ return false; }
			
			// do the seperation
			var filename = file.substr( 0, dot );
			var extension = file.substr( dot, file.length );
			
			// return
			return { file:filename, ext:extension };
		},
		
		// Detect iphone version (3g (or earlier) or 4)
		_isHighRes: function()
		{
			return Ti.Platform.displayCaps.density == "high";
		}
	};
	
	// Return interface
	return imgFace;
};

// create image loader
var imageLoader = initImageLoader( Ti );