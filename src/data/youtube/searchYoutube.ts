//USE APIKEY FOR SEARCH
export const searchYoutube = async (query: string, apiKey: string) => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=12`;

  const res = await fetch(url);
  const data = await res.json();

  return data.items.map((item: any) => ({
  videoId: item.id.videoId,
  title: item.snippet.title,
  thumbnail: `https://i.ytimg.com/vi/${item.id.videoId}/mqdefault.jpg`, // ✅ más confiable
}));

};
 
export const getVideoStats = async (videoIds: string, apiKey: string) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.items.map((item: any) => ({
    videoId: item.id,
    viewCount: item.statistics.viewCount,
    likeCount: item.statistics.likeCount,
  }));
};
