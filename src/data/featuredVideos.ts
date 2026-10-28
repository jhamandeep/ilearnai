import { videos } from './videos'
// Editorial selections, not a ranking by views. Verified against original video pages.
export const featuredVideoIds = ['LCEmiRjPEtQ', '7xTGNNLPyMI', '9vM4p9NN0Ts']
export const featuredVideos = featuredVideoIds.map(id => videos.find(video => video.id === id)).filter(video => video !== undefined)
