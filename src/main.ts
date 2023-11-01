import { $, execa } from 'execa';
import {
	ffmpeg,
	video_dir,
	video,
	input_file
} from "./constants";
import {
	get_keyframe,
	write_file,
	string_sum
} from "./util";
import { Frame } from './types';
import { log } from 'console';

const step = 5;
const interval = 3;

const cut = async(video_path: string, start: string, end: string, output_file_path: string) => {
	const res = await $`${ffmpeg} -i ${video_path} -ss ${start} -to ${end} -c copy ${output_file_path}`;
	return res['stdout']
}

const concat = async(output_file_path: string = "out.webm") => {
	const input = "file '1.webm'\nfile '2.webm'";
	await write_file(input_file, input);
	const res = await $`${ffmpeg} -f concat -i ${input_file} -c copy ${output_file_path}`;
	return res['stdout']
};

const edit_with_keyframe = async(next_keyframe: string) => {
	// remove only 2.webm
	await execa("rm", ["-rf", "2.webm", "out.webm"]);
	await cut(video_dir + video, string_sum(`${step + interval}`, next_keyframe), `${2 * step + interval}`, "2.webm");
}

const init = async() => {
	await execa("rm", ["-rf", "1.webm", "2.webm", "out.webm"]);
};

(async() => {
	// log(import.meta.url);
	// log(video_path);
	// log(segments);
	// await basic_routine();
	// await clean();

	await init();
	await cut(video_dir + video, "0", `${step}`, "1.webm");
	await cut(video_dir + video, `${step + interval}`, `${2 * step + interval}`, "2.webm");

	const res = await get_keyframe("2.webm");
	const frames: Frame[] = JSON.parse(res)['frames'];
	let next_keyframe = undefined;
	for(let i = 0; i < frames.length; i++) {
		if (frames[i]['key_frame'] === 1) {
			next_keyframe = frames[i]['pkt_pts_time'];
			break;
		}
	};
	log(next_keyframe);
	await edit_with_keyframe(next_keyframe!);
	await concat();
})();
