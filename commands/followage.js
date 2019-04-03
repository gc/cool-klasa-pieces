const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Shows the followage of a given user from a given twitch channel.',
			usage: '<user:str> <channel:str>',
			usageDelim: ' '
		});
		this.error = `That user isn't following that channel, or it is banned, or doesn't exist at all.`;
	}

	async run(msg, [user, channel]) {
		const url = new URL(`https://api.twitch.tv/kraken/users/${encodeURIComponent(user)}/follows/channels/${channel}`);
		url.search = new URLSearchParams([['client_id', this.client.twitchClientID]]);

		const body = await fetch(url)
			.then(response => response.json())
			.catch(() => { throw this.error; });

		const days = this.differenceDays(new Date(body.created_at), new Date());

		if (!body.channel) throw this.error;

		const embed = new MessageEmbed()
			.setColor(6570406)
			.setAuthor(`${user} has been following ${channel} for ${days} days.`, body.channel.logo);

		return msg.send(embed);
	}

	differenceDays(first, second) {
		return Math.floor((second - first) / (1000 * 60 * 60 * 24));
	}

};
