const fetch = require('node-fetch');
const {errorMessage} = require("../tools");

module.exports = {
	name: 'state-list',
	description: 'List of valid states and statecodes in India.',
	usage: ' ',
	execute: async function (message) {
		const nationalData = await fetch('https://api.covid19india.org/data.json')
			.then(response => response.json())
			.catch(error => {
				console.error(error);
				errorMessage(message);
			});

		let states = '**Here\'s a list of statecodes: **\n';

		for (let i = 0; i < nationalData['statewise'].length; i++) {
			states = states.concat(`\n${nationalData['statewise'][i]['statecode']}: ${nationalData['statewise'][i]['state']}`);
		}

		message.author.send(states)
			.then(() => {
				if (message.channel.type === 'dm') return;
				message.reply('A DM has been sent to you with a list of states.');
			});
	},
};
