var  url = require('url')
	,path = require('path')
	,fs = require('fs')
	,crypto = require('crypto')
;

//chronicle

var  basepath = __dirname
	,cache = {}
;

/**
 * Chronicle:
 *
 * Does stuff.
 *
 * Options:
 *
 *   - `basepath`  
 *   - `regex`  Regex for modifying the 
 *   
 */
module.exports = {
	setup: function(options) {
		if ('object' == typeof options) {
			options = options || {};
		} else if (options) {
			options = { basepath: options };
		} else {
			options = {};
		}
		
		basepath = options.basepath;
	},

	middleware: function(req, res, next) {
		req.url = req.url.replace(/^(.*)(\/~[^\/]+)(.*)$/g, '$1$3');
		
		next();
	},
	
	chronicle: function chronicle(orig_url)
	{
		orig_url = orig_url.toString();

		if (cache[orig_url]) {
			return cache[orig_url]
			
		} else {
			var  u = url.parse(orig_url)
				,filepath = path.join(basepath, u.path)
				,version = '~'
				,new_url = ''
				,pos = orig_url.lastIndexOf('/')
			;
			

			if (fs.existsSync(filepath)) {
				var stats = fs.statSync(filepath);
			} else {
				throw new Exception("Chronicle could not find '" + filepath + "'. Did you set the correct basepath?");
			}
			
			var shasum = crypto.createHash('sha1');
			shasum.update(filepath + stats.mtime.toString());
			version += shasum.digest('hex').substr(0, 8);
			
			if (pos !== -1) {
				new_url = orig_url.substring(0, pos) + '/' + version + orig_url.substring(pos);
			} else {
				new_url = version + '/' + orig_url;
			}
			
			cache[orig_url] = new_url; //cache it
			
			return new_url;
		}
	},
	
	clearCache: function(regex)
	{
		if (regex) {
			//TODO: Implement this. If regex
			throw new Exception('Not implemented. Too lazy.');
		} else {
			cache = {};
		}
	}
};


