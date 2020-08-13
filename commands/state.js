const fetch = require('node-fetch');
const Discord = require('discord.js');
const { toIndianFormat, checkValidState } = require('../tools.js');
require('dotenv').config();

module.exports = {
	name: 'state',
	description: 'Statewise COVID-19 cases in India.',
	usage: '[statecode]',
	args: true,
	execute: async function (message, args) {
		const nationalData = await fetch('https://api.covid19india.org/data.json')
			.then(response => response.json())
			.catch(error => console.error(error));

		const state = args[0].toUpperCase();
		let index = checkValidState(state, nationalData);

		if (index == -1) {
			message.channel.send('Not a valid statecode, use ' + process.env.PREFIX + 'state-list to see a list of statecodes');
			return;
		}

		const casesEmbed = new Discord.MessageEmbed()
			.setTitle('COVID-19 Cases in ' + nationalData['statewise'][index]['state'] + ', India')
			.addFields(
				{
					name: 'Confirmed',
					value: toIndianFormat(nationalData['statewise'][index]['confirmed']),
					inline: true
				},
				{
					name: 'Active',
					value: toIndianFormat(nationalData['statewise'][index]['active']),
					inline: true
				},
				{
					name: 'Recovered',
					value: toIndianFormat(nationalData['statewise'][index]['recovered']),
					inline: true
				},
				{
					name: 'Deaths',
					value: toIndianFormat(nationalData['statewise'][index]['deaths']),
					inline: true
				},
				{
					name: 'Last Updated On:',
					value: nationalData['statewise'][index]['lastupdatedtime']
				}
			);

		message.channel.send(casesEmbed);
	},
};
