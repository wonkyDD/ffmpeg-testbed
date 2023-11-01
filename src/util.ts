import fs from "node:fs";
import { $, execa } from "execa";
import { ffmpeg, ffprobe, input_file, output_file, segments, video } from "./constants";

// ffmpeg pending if filename exists
const check_file_exist = async(file_path: string) => {
	return new Promise((resolve, reject) => {
		fs.access(file_path, fs.constants.F_OK, err => {
			if (!err) {
				reject(new Error(`File ${file_path} exists`));
			}
			else resolve(false);
		})
	});
}

const write_file = async(file_path: string, data: string) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(file_path, data, (err) => {
			if (err) reject(err);
			else resolve(data);
		})
	});
};

const read_file = async(file_path: string) => {
	return new Promise((resolve, reject) => {
		fs.readFile(file_path, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		})
	});
};

const clean = async() => {
	const files = await fs.promises.readdir("video");
	const filtered = files.filter(f => f !== video);
	const new_output_file = `n${output_file}`;
	const extra = [input_file, output_file, new_output_file];
	const promises = [];
	let promise;
	for (const f of filtered) {
		let promise = execa("rm", ["-rf", `video/${f}`]);
		promises.push(promise);
	}

	if (extra.length !== 0) {
		promise = execa("rm", ["-rf", ...extra]);
		promises.push(promise);
	}

	await Promise.all(promises);
};

const log = async(...data: any[]) => {
	console.log(...data);
};

const get_version = async() => {
	const ver = await $`${ffmpeg} -version`;
	return ver['stdout']
};

const get_video_info = async(video_path: string) => {
	const res = await $`${ffprobe} -v quiet -print_format json -show_format -show_streams ${video_path}`;
	return res['stdout']
};

const get_resolution = async(video_path: string) => {
	const res = await $`${ffprobe} -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${video_path}`;
	return res['stdout']
};

const get_duration = async(video_path: string) => {
	const dur = await $`${ffprobe} -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${video_path}`;
	return dur['stdout']
};

const get_keyframe = async(video_path: string) => {
	const res = await $`${ffprobe} -show_frames -select_streams v -print_format json=c=1 ${video_path}`;
	return res['stdout'];
};

const string_sum = (a: string, b: string) => {
	// https://dev.to/darkmavis1980/you-should-stop-using-parseint-nbf
	// return (parseFloat(a) + parseFloat(b)).toFixed(6);
	return (Number(a) + Number(b)).toFixed(6);
};

const init = async() => {
	await execa("rm", ["-rf", "1.webm", "2.webm", "out.webm"]);
};

export {
	check_file_exist,
	write_file,
	read_file,
	clean,
	log,
	get_version,
	get_video_info,
	get_resolution,
	get_duration,
	get_keyframe,
	string_sum,
	init
}
