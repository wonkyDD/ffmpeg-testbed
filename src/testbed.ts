import { ffmpeg, ffprobe, input_file, output_file, segment_step, segments, video_dir, video } from "./constants";
import { $ } from "execa";
import { clean, get_keyframe, log, string_sum, write_file } from "./util";
import { Frame } from "./types";

const cut_video = async(video_path: string, start: string, end: string, output_file_path: string) => {
	// ffmpeg -i input.mp4 -ss 00:00:50 -to 00:01:00 -c copy output1.mp4
	// ffmpeg -i input.mp4 -ss 00:01:10 -t 00:01:30 -c copy output2.mp4
	const res = await $`${ffmpeg} -i ${video_path} -ss ${start} -to ${end} -c copy ${output_file_path}`;
	return res['stdout']
}

const concat_video = async(output_file_path: string = "out.webm") => {
	// ffmpeg -f concat -i input.txt -c copy output.mp4
	const res = await $`${ffmpeg} -f concat -i ${input_file} -c copy ${output_file_path}`;
	return res['stdout']
}

const not_smooth_cut_and_concat = async() => {
	await clean();
	for (let i = 0; i < segments.length; i++) {
		const start = i * (segment_step + 1);
		const end = start + segment_step;
		await cut_video(video_dir + video, `${start}`, `${end}`, segments[i]);
	}
	const input = segments.map((s) => `file '${s}'`).join("\n");
	await write_file(input_file, input);
	await concat_video(output_file);
};

/** @todo parameter로 전달하는 게 최선인가? */
// const keyframe_map = new Map<number, Array<string>>();
const get_pkt_pts_time_by_id = async(id: number, keyframe_map: Map<number, Array<string>>) => {
	const res = await get_keyframe(segments[id]);
	const frames: Frame[] = JSON.parse(res)['frames'];
	if (frames.length === 0) {
		log("no frames", id);
		return;
	}

	// find keyframe == 1 in frames at last
	// let last_frame = frames.find((frame: Frame) => frame['key_frame'] === 1);
	let last_frame = undefined;
	for (let i = frames.length - 1; i > 0; i--) {
		if (frames[i]['key_frame'] === 1) {
			last_frame = frames[i];
			break;
		}
	}

	if (!last_frame) {
		last_frame = frames[frames.length - 1];
	}

	keyframe_map.set(id, [
		frames[0]['pkt_pts_time'],
		// frames[frames.length - 1]['pkt_pts_time']
		last_frame['pkt_pts_time']
	]);
};

const get_keyframe_map = async() => {
	const promises = [];
	let keyframe_map = new Map<number, Array<string>>();
	for (let i = 0; i < segments.length; i++) {
		let promise = get_pkt_pts_time_by_id(i, keyframe_map);
		promises.push(promise);
	}
	await Promise.all(promises);
	return keyframe_map = new Map([...keyframe_map.entries()].sort((a, b) => a[0] - b[0]));
};

const new_cut_video = async(video_path: string, start: string, end: string, output_file_path: string) => {
	// await check_file_exist(file_name);
	// const res = await $`${ffmpeg} -i ${video_path} -ss ${start} -to ${end} -c copy ${output_file_path}`;

	const res = await $`${ffmpeg} -i ${video_path} -ss ${start} -t ${end} -acodec copy -vcodec copy -async 1 -y ${output_file_path}`;
	return res['stdout']
}

const new_concat_video = async(output_file_path: string = "nout.webm") => {
	const res = await $`${ffmpeg} -f concat -i ${input_file} -c copy ${output_file_path}`;
	return res['stdout']
}

const cut_with_keyframe = async(map: Map<number, Array<string>>) => {
	const promises = [];
	for (const [id, [start, end]] of map) {
		let s = string_sum(start, `${id * (segment_step + 1)}`);
		let e = string_sum(s, end);
		const new_segment_file_path = segments[id].split("/").map((s, i) => i === 1 ? "n" + s : s).join("/");
		// log(segments[id], new_segment_file_path, "start : ", s, "end : ", e);
		let promise = new_cut_video(segments[id], s, e, new_segment_file_path);
		promises.push(promise);
	}
	await Promise.all(promises);
	
	// { frames: [] } 인 애들이 날라가므로 segments 그대로 쓰면 안된다
	// input에서도 segments -> new_segments
	const new_segments = segments.filter(s => map.has(segments.indexOf(s))).map((s) => s.split("/").map((s, i) => i === 1 ? "n" + s : s).join("/"));
	const input = new_segments.map((s) => `file '${s}'`).join("\n");
	await write_file(input_file, input);
	await new_concat_video(`n${output_file}`);
};

const basic_routine = async() => {
	await not_smooth_cut_and_concat();
	const map = await get_keyframe_map();
	log(map);
	await cut_with_keyframe(map);
};

export {
	basic_routine,
	get_keyframe_map
}
