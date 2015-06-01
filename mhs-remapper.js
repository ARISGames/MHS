/* Node app to remap IDs from v1 game to v2
 *
 * - Run migrate. Get the response JSON and save it to a file.
 * - Run getQuestsForGame and save it to a file.
 * - Run this to translate to v2 ids in javascript/json files.
 * - Point all v2 game web page urls to new instance of javascript.
 * - Update quests to new versions.
 */

/* Important files
 *
 * ack -l "\w+Id\(\d+?\)"
 * ack -l "exitTo\w+\(\d+\)"
 */

var fs   = require('fs');
var path = require('path');

var json_mapping_file = "mhs-ptp-migration-map-game.json";

var files_to_remap = [
	"mhs-ptp-quest.json",
	"fur_trade/model.js",
	"iron_mine/helpers/ironminemodel.js",
	"iron_mine/index.php",
	"sod_house/index.html"
];


var Remapper = function()
{
	this.run = function()
	{
		var mapper = this;
		var filename = path.join(__dirname, json_mapping_file);

		fs.readFile(filename, 'utf8', function(error, data)
		{
			if (error) throw error;
			mapper.remap_files(JSON.parse(data));
		});
	};


	this.remap_files = function(game_map_json)
	{
		var mapper = this;

		files_to_remap.forEach(function(remapping_file)
		{
			var filename = path.join(__dirname, remapping_file);
			fs.readFile(filename, 'utf8', function(error, data)
			{
				if (error) throw error;
				var remapped_string = mapper.remap_string(data);

				fs.writeFile(filename, remapped_string, function(error)
				{
					if (error) throw error;
					console.log("Remapped", remapping_file);
				});
			});
		});
	};


	this.remap_string = function(string)
	{
		var remapped_string = string;

		return remapped_string;
	};
};

new Remapper().run();
