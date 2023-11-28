import os, { homedir } from 'os';
import { join } from 'path';
import { promises } from 'fs';

const filePath = 
os.platform() === 'win32' ?
join(process.env.USERPROFILE, 'weather-data.json') :
join(homedir(), 'weather-data.json');

const TOCEN_DICTIONARY = {
	token: 'token',
	city: 'city'
}

const saveKeyValue = async (key, value) => {
	let data = {};
	if (await isExist(filePath)) {
		const file = await promises.readFile(filePath);
		data = JSON.parse(file);
	}
	data[key] = value;
	await promises.writeFile(filePath, JSON.stringify(data));
};

const getKeyValue = async (key) => {
	if (await isExist(filePath)) {
		const file = await promises.readFile(filePath);
		const data = JSON.parse(file);
		return data[key];
	}
	return undefined;
};

const isExist = async (path) => {
	try {
		await promises.stat(path);
		return true;
	} catch (e) {
		return false;
	}
};

export { saveKeyValue, getKeyValue, TOCEN_DICTIONARY };