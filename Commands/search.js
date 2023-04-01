const { google } = require('googleapis');
const config = require('../config.json');

module.exports = async interaction => {
    const query = interaction.options.get('query').value;

    const youtube = google.youtube({
        version: 'v3',
        auth: config.youtubeApiKey
    });

    const { data } = await youtube.search.list({
        part: 'id,snippet',
        q: query,
        type: 'video'
    });

    const videos = data.items.map(item => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    const results = videos.map(video => `${video.title}: ${video.url}`).join('\n');

    await interaction.reply(`Results for "${query}":\n${results}`);
};
