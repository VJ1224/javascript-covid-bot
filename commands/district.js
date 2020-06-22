const fetch = require('node-fetch');
const Discord = require('discord.js');
require('dotenv').config()

module.exports = {
	name: 'district',
	description: "Districtwise COVID-19 number's in India.",
  usage: '[statecode] [districtname]',
  args: true,
	async execute(message, args) {
    const stateCode = args[0].toUpperCase();
    const stateData = await fetch('https://api.covid19india.org/state_district_wise.json').then(response => response.json());
    const nationalData = await fetch('https://api.covid19india.org/data.json').then(response => response.json());
    var state;
    var found = false;

    for (var i in nationalData['statewise']) {
      var temp = nationalData['statewise'][i]['statecode']
      if (temp === stateCode) {
        state = nationalData['statewise'][i]['state']
        found = true;
        break;
      }
    }

    if (!found) {
      message.channel.send("Not a valid statecode, use " + process.env.PREFIX + "state-list to see a list of statecodes");
      return;
    }

    found = false;
    var district = "";
    args = args.splice(1);
    district = args.join(" ");

    for (var i in stateData[state]["districtData"]) {
      if (i === district) {
        found = true;
        break;
      }
    }

    if (!found) {
      message.channel.send("Not a valid district, use " + process.env.PREFIX + "district-list [statecode] to see a list of districts");
      return;
    }

    const casesEmbed = new Discord.MessageEmbed()
		.setColor('#f38181')
		.setTitle('COVID-19 Cases in ' + district + ", " +  state + ', India')
		.addFields(
			{ name: 'Confirmed', value: stateData[state]["districtData"][district]['confirmed'], inline: true },
			{ name: 'Active', value: stateData[state]["districtData"][district]['active'], inline: true },
			{ name: 'Recovered', value: stateData[state]["districtData"][district]['recovered'], inline: true },
			{ name: 'Deaths', value: stateData[state]["districtData"][district]['deceased'], inline: true },
		)
		.setTimestamp();

		message.channel.send(casesEmbed)
	},
};