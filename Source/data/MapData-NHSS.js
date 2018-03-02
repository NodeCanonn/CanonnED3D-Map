var canonnEd3d_nhss = {

	//Define Categories
	systemsData: {
		"categories": {
			"POI systems": {
				"100": {
					"name": "Systems - POI",
					"color": "FF9D00"
				}
			},
			"Non-Human Signal Source - (NHSS)": {
				"1400": {
					"name": "Non-Human Signal Source",
					"color": "442299"
				}
			}
		},
		"systems": [{
				"name": "Sol",
				"coords": {
					"x": "0",
					"y": "0",
					"z": "0"
				},
				"cat": [
					"100"
				]
			}, {
				"name": "Merope",
				"coords": {
					"x": "-78.59375",
					"y": "-149.625",
					"z": "-340.53125"
				},
				"cat": [
					"100"
				]
			}, {
				"name": "HIP 22460",
				"coords": {
					"x": "-41.3125",
					"y": "-58.96875",
					"z": "-354.78125"
				},
				"cat": [
					"100"
				]
			}
		]
	},

	formatNHSS: function (data) {

		//Here you format NHSS JSON to ED3D acceptable object

		// this is assuming data is an array []
		for (var i = 0; i < data.length; i++) {
			if (data[i].system && data[i].system.replace(" ", "").length > 1) {
				var nhssSite = {};
				nhssSite["name"] = data[i].system;
				nhssSite["cat"] = [1400];
				nhssSite["coords"] = {
					"x": parseFloat(data[i].galacticX),
					"y": parseFloat(data[i].galacticY),
					"z": parseFloat(data[i].galacticZ)
				};

				// We can then push the site to the object that stores all systems
				canonnEd3d_nhss.systemsData.systems.push(nhssSite);
			}

		}

	},

	parseData: function (url, callBack, resolvePromise) {
		Papa.parse(url, {
			download: true,
			header: true,
			complete: function (results) {

				callBack(results.data);

				// after we called the callback
				// (which is synchronous, so we know it's safe here)
				// we can resolve the promise

				resolvePromise();
			}
		});
	},

	init: function () {

		//NHSS Sites
		var p1 = new Promise(function (resolve, reject) {
			canonnEd3d_nhss.parseData("data/csvCache/nhssDataCache.csv", canonnEd3d_nhss.formatNHSS, resolve);
			});

		Promise.all([p1]).then(function () {
			Ed3d.init({
				container: 'edmap',
				json: canonnEd3d_nhss.systemsData,
				withFullscreenToggle: false,
				withHudPanel: true,
				hudMultipleSelect: true,
				effectScaleSystem: [50, 10000],
				startAnim: false,
				showGalaxyInfos: true,
				cameraPos: [25, 14100, -12900],
				systemColor: '#FF9D00'
			});
		});
	}
};