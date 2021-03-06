/* Node app to remap IDs from v1 game to v2
 *
 * - Run migrate. Get the response JSON and save it to a file.
 * - Run getQuestsForGame and save it to a file.
 * - Run this app to translate to v2 ids in javascript/json files.
 * - Replace instances of playerId, webPageId, gameId, displayname with user_id, web_page_id, game_id, display_name
 * - Deploy to hosted repo.
 * - Run getWebPagesForGame, point all web page urls to new instance of javascript (hosted/mhs)
 * - Update webpages and quests using autocrud with new versions.
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
	"sod_house/index.php"
];

// The only keys important to MHS
var remappers = [
	{"key": "webpages", "regex": /exitToWebpage\((\d+)\)/g},
	{"key": "webpages", "regex": /webPageId\((\d+)\)/g},

	{"key": "dialogs", "regex": /exitToCharacter\((\d+)\)/g},
	{"key": "dialogs", "regex": /npcId\((\d+)\)/g},

	{"key": "items", "regex": /itemId\((\d+)\)/g},
];

var dryrun = false;

var Remapper = function()
{
	// Load the json mapping from the import and then remap all files

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


	// Loop through all files, run them through the remapper and save the result.

	this.remap_files = function(game_map_json)
	{
		var mapper = this;

		files_to_remap.forEach(function(remapping_file)
		{
			var filename = path.join(__dirname, remapping_file);
			fs.readFile(filename, 'utf8', function(error, file_string)
			{
				if (error) throw error;
				var remapped_string = mapper.remap_string(file_string, game_map_json);

				if(!dryrun)
				{
					fs.writeFile(filename, remapped_string, function(error)
					{
						if (error) throw error;
						console.log("[!] Remapped", remapping_file);
					});
				}
				else
				{
					console.log("[?] Dryrun Remapped", remapping_file);
				}
			});
		});
	};


	// Run all regex mappers on a string replacing the matches with values from json

	this.remap_string = function(string, game_map_json)
	{
		var remapped_string = string;

		var replace_count = 0;

		remappers.forEach(function(remapper)
		{
			remapped_string = remapped_string.replace(remapper["regex"], function(match, capture1)
			{
				var replace_value = game_map_json.data.migration_maps[remapper["key"]][capture1];

				if(replace_value === undefined) throw "Missing entry in mapping values: " + remapper["key"] + "->" + capture1

				replace_count++;
				return match.replace(capture1, replace_value);
			});
		});

		console.log("[-] Replaced", replace_count, "instances");

		return remapped_string;
	};
};

new Remapper().run();
