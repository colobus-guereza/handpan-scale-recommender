
const urls = [
    "https://youtu.be/aGKx4zLFvRo",
    "https://youtu.be/2peCXnJP2U0?si=bVePs8DvAlPEwI7v",
    "https://youtu.be/u9dsmUSd_SY?si=rMBMQOFvj5Yec7vs",
    "https://youtu.be/mY-Uvw-VKO4?si=Ail972LckjNWKp8S",
    "https://youtu.be/Z3bVZYykphA?si=zJAD4lmQPxMQ0xq8",
    "https://youtu.be/61g8qreUeJk?si=NgBTdfaU51SV__5O"
];

const getVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

urls.forEach(url => {
    console.log(`URL: ${url} -> ID: ${getVideoId(url)}`);
});
