import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";

const ffmpeg = ffmpegPath as string;
// if (!ffmpeg) {
//     throw new Error("ffmpeg not found");
// }
const ffprobe = ffprobePath["path"] as string;
// if (!ffprobe) {
//     throw new Error("ffprobe not found");
// }
const root_path = import.meta.url.replace("file://", "").replace("dist/main.js", "");

const video_name = "skate";
const ext = ".webm";
const video = video_name + ext;
const video_dir = root_path + "video/";

const input_file = "input.txt";
const output_file = "out.webm";

const segment_step = 3;
const segment_count = 20;
const segments: string[] = [];
for (let i = 1; i <= segment_count; i++) {
    segments.push("video/" + i.toString().padStart(4, "0") + ext);
}

export {
    ffmpeg,
    ffprobe,
    video,
    video_dir,
    input_file,
    output_file,
    segment_step,
    segment_count,
    segments
}
