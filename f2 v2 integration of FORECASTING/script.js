let api_key = 'ccd4a65d6daa2c1406d4997f1db9712f';
let limit = 1;






/* Promise Implementation for getLonLat*/
/*
function getLonLat() {
    let searchBarEl = document.getElementById('searchBar');
    let cityName = searchBarEl.value;
    console.log("Your Query City is : " , cityName);
    
    let Geocode_api = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${api_key}`;


    fetch(Geocode_api)
        .then(response => response.json())
        .then(data => console.log(data[0]))
        .catch(error => console.error(error))
}
*/

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

function formatUnixTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    
    const day = date.getDate();
    const ordinalSuffix = getOrdinalSuffix(day); /* like 23rd 13th rd th nd etc.. */
    const month = date.toLocaleString('default', { month: 'long' });
    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // specially identifies hour '0' and make it 12
    
    return `${day}${ordinalSuffix} ${month}, ${dayOfWeek} ${hours}:${minutes} ${ampm}`;
}




function renderPageW(name,temp,feels_like,temp_max,temp_min,sea_level,pressure,humidity,grnd_level){

    document.getElementById('instruction').innerHTML = `Weather information for ${name}...!`;
    document.getElementById('temp').innerHTML = `Temperature: ${Math.round((temp - 273.15) * 10) / 10} °C`;
    document.getElementById('feels_like').innerHTML = `Feels like: ${Math.round((feels_like - 273.15) * 10) / 10} °C`;
    document.getElementById('temp_max').innerHTML = `Max Temperature: ${Math.round((temp_max - 273.15) * 10) / 10} °C`;
    document.getElementById('temp_min').innerHTML = `Min Temperature: ${Math.round((temp_min - 273.15) * 10) / 10} °C`;
    document.getElementById('sea_level').innerHTML = `Sea Level Pressure: ${Math.round(sea_level)} hPa`;
    document.getElementById('pressure').innerHTML = `Pressure: ${Math.round(pressure)} hPa`;
    document.getElementById('humidity').innerHTML = `Humidity: ${Math.round(humidity)} %`;
    document.getElementById('grnd_level').innerHTML = `Ground Level: ${Math.round(grnd_level)} hPa`;

}

function renderPageF(hourF, timePeriod) {
    const dt = hourF.dt;
    const description = hourF.weather[0].description;
    const temp = hourF.main.temp;
    
    document.getElementById(`date-time${timePeriod}`).innerHTML = `Date&Time: ${formatUnixTimestamp(dt)}`;
    document.getElementById(`temp${timePeriod}`).innerHTML = `Temperature: ${temp-273.15} °C`;
    document.getElementById(`description${timePeriod}`).innerHTML = `Description: ${description}`;
}


async function loadStats(country,lat,lon,name,state){
    weather_api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    forecast_api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    
    try{
        const responseW = await fetch(weather_api);
        const responseF = await fetch(forecast_api);

        console.log('Response from Weather API: ' , responseW['ok']);
        console.log('Response from Forecast API: ' , responseF['ok']);
        
        let dataW = await responseW.json();
        let dataF = await responseF.json();

        if(!responseW.ok || !responseF.ok ){
            document.getElementById('instruction').innerHTML = `Something went wrong...!   :(`;
            throw new Error("Response not ok");
        }
        else if(dataW.length==0 || dataF.length==0){
            document.getElementById('instruction').innerHTML = `Could not find the place you are looking for..!   :( `;
            console.log("Weather API couldn't find your place");
            
        }
        else{
            /*console.log(data.main.temp-273.15);*/
            /*console.log(data); */
            
            let {temp,feels_like,temp_max,temp_min,sea_level,pressure,humidity,grnd_level} = dataW.main;
            console.log("Temp, pressure , feelslie", temp ," ", pressure, " ", feels_like);

            console.log(dataF.list[0]);

            const threeF = dataF.list[0];
            const sixF = dataF.list[1];
            const nineF = dataF.list[2];    

            renderPageF(threeF,'ThreeF');
            renderPageF(sixF,'SixF');
            renderPageF(nineF,'NineF');
            renderPageW(name,temp,feels_like,temp_max,temp_min,sea_level,pressure,humidity,grnd_level);
        }
        
    }
    catch(error){
        console.error(error);
    }

}

async function getLonLat(){
    let searchBarEl = document.getElementById('searchBar');
    let cityName = searchBarEl.value;
    console.log("Your Query City is : " , cityName);
    
    let Geocode_api = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${api_key}`;    

    try{
        const response = await fetch(Geocode_api);
        console.log('Response from Geo API: ' , response['ok']);
        let data = await response.json();

        if(!response.ok){
            document.getElementById('instruction').innerHTML = `Something went wrong...!   :(`;
            throw new Error("Response False")
        }
        else if(data.length==0){
            document.getElementById('instruction').innerHTML = `Could not find the place you are looking for..!   :( `;
            console.log("Could not find your Query.");
        }
        else{
            console.log(data[0]);
            let {country,lat,lon,name,state} = data[0];
            loadStats(country,lat,lon,name,state);
        }
    }
    catch(error){
        console.error(error);
    }
}

document.getElementById('searchButton').addEventListener('click' , getLonLat);
