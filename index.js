/*
    Degree and Radian Converter
    Copyright (C) 2020 Hershraj N.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/


const fs = require(`fs`) // Get the FS module from NodeJS


// Get the data files
let toConvertToDeg = JSON.parse(fs.readFileSync(`./data/radtodeg.mathdata`))
let toConvertToRad = JSON.parse(fs.readFileSync(`./data/degtorad.mathdata`))

// Get the .txt files to write the answers too
let toWrite1 = fs.createWriteStream(`./results/Answers (Radian To Degree).txt`)
let toWrite = fs.createWriteStream(`./results/Answers (Degree To Radian).txt`)


// Reducing a fraction function
function reduce(numerator, denominator) {
	
    var gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
    };
    gcd = gcd(numerator, denominator);
	
    return [numerator / gcd, denominator / gcd];
}

// Convert Deg => Rad
async function degrees_to_radians(degrees) {
	
    var pi = Math.PI;
    let finalConvert = parseInt(degrees) * (pi / 180);
    let reducedF = await reduce(degrees, 180)
	
    return {
        "finalConvert": finalConvert,
        "reduced": `${reducedF[0]}pi/${reducedF[1]}`,
        "eq": `${degrees}pi/180`
    } // Return Object with different variations of the answer
}

async function preformOperationDegToRad(toCalc, int) {
    let finalObj = await degrees_to_radians(parseInt(toCalc))
	
    toWrite.write(`Timestamp: ${Date.now()} || Question ${int}: ${finalObj.reduced} (UN-REDUCED: ${finalObj.eq}) (EXACT ANSWER ${finalObj.finalConvert}) \n`)
    console.log(`[DEGREE => RAD] Question ${int}: ${finalObj.reduced} (UN-REDUCED: ${finalObj.eq}) (EXACT ANSWER ${finalObj.finalConvert})`)
}

async function preformOperationRadToDeg(toCalc, int) {
    toCalc = toCalc.toString().toLowerCase()
    if (toCalc.startsWith(`pi/`)) {
        toCalc = `1${toCalc}`
    }
	
    if (toCalc.startsWith(`-pi/`)) {
        toCalc = `-1${toCalc}`
    }
	
    let arrayInt = toCalc.split(`pi/`)
    let converted = ((parseInt(arrayInt[0]) * Math.PI) / parseInt(arrayInt[1])) * (180 / Math.PI)
	
    console.log(`[RAD => DEGREE] Question ${int}: ${converted}`)
    toWrite1.write(`Timestamp: ${Date.now()} || Question ${int}: ${converted} \n`)
}

// Loop through the file (Deg => Rad)
if (toConvertToRad.array.length > 0) {
    for (var b = 0; b < toConvertToRad.array.length; b++) {
        preformOperationDegToRad(toConvertToRad.array[b], b + 1)
    }
}

// Loop through the file (Rad => Deg)
if (toConvertToDeg.array.length > 0) {
    for (var i = 0; i < toConvertToDeg.array.length; i++) {
        preformOperationRadToDeg(toConvertToDeg.array[i], i + 1)
    }
}