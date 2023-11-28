#!/usr/bin/env node
import { getArgs } from "./helpers/args.js";
import { getWeather, getIcon } from "./services/api.service.js";
import { printError, printHelp, printSuccess, printWeather } from "./services/log.service.js";
import { getKeyValue, saveKeyValue, TOCEN_DICTIONARY } from "./services/storage.service.js";


const saveToken = async (token) => {
    if(!token.length) {
        printError("The token has not been transferred")
        return;
    }
    try {
        await saveKeyValue(TOCEN_DICTIONARY.token, token);
        printSuccess('Token saved')
    } catch(e) {
        printError(e.message)
    }
}

const saveCity = async (city) => {
    if(!city.length) {
        printError("The city has not been transferred")
        return;
    }
    try {
        await saveKeyValue(TOCEN_DICTIONARY.city, city);
        printSuccess('City saved')
    } catch(e) {
        printError(e.message)
    }
}

const getForcast = async () => {
    try{
        const city = process.env.CITY ?? await getKeyValue(TOCEN_DICTIONARY.city)
        const weather = await getWeather(city);
        printWeather(weather, getIcon(weather.weather[0].icon));
    } catch(e) {
        if(e?.response?.status == 404) {
            printError('Wrong city');
        } else if(e?.response?.status == 401) {
            printError('Wrong token');
        } else {
            printError(e.message);
        }
    }
}

const initCLI = () => {
    const args = getArgs(process.argv);
    
    if(args.h) {
        return printHelp();
    }
    if(args.s) {
        return saveCity(args.s);
    }
    if(args.t) {
        return saveToken(args.t);
    }
    return getForcast()
}

initCLI();