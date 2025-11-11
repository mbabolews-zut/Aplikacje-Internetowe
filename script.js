const pogodaBtn = document.getElementById("submit-btn");
const addressInput = document.getElementById("address-input");
const errorSection = document.getElementById("error-section");
const curWeatherDiv = document.getElementById("current-weather");

const API_KEY = "7ded80d91f2b280ec979100cc8bbba94";

class WeatherContainerGen {
    construct() {
        this.weatherDiv = document.createElement('div');
        this.weatherImg = document.createElement('img');
        this.weatherDesc = document.createElement('span');
        this.tempDiv = document.createElement('div');
        this.tempText = document.createElement('span');

        this.weatherDiv.appendChild(this.weatherImg);
        this.weatherDiv.appendChild(this.weatherDesc);
        this.tempDiv.appendChild(this.tempText);
    }

    setWeatherDesc(textContent, icon) {
        this.weatherImg.src = `https://openweathermap.org/img/wn/${icon}`;
        this.weatherDesc.textContent = textContent;
    }

    generate() {
        let elem = document.createElement('div');
        elem.className = "weather-box";
        elem.appendChild(this.weatherDiv);
        elem.appendChild(this.tempDiv);
        return elem;
    }
}

function handleCurWeatherJson(json) {
    /*
      "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03n"
        }
      ],
      "base": "stations",
      "main": {
        "temp": 282.11,
        "feels_like": 281.57,
        "temp_min": 282.11,
        "temp_max": 282.11,
      },
      "wind": {
        "speed": 1.54,
        "deg": 180
      },
      "clouds": {
        "all": 40
      },
     */
    let divGen = new WeatherContainerGen();
    divGen.setWeatherDesc(
        `pogoda: ${json["weather"][0]["description"]}`,
        json["weather"][0]["icon"]
    )
    curWeatherDiv.textContent = `
    pogoda: ${json["weather"][0]["description"]}\n
    temperatura: ${(json["main"]["temp"] - 273.15).toFixed(1)}°C
    `;
    let img = document.createElement('img');
    img.src = `https://openweathermap.org/img/wn/${json["weather"][0]["icon"]}.png`;
    curWeatherDiv.appendChild(img);
}

function handleForecastJson(json) {

}

pogodaBtn.addEventListener("click", () => {
    //ajax load current weather
    let addr = encodeURI(addressInput.value);
    let xhreq = new XMLHttpRequest();
    xhreq.onreadystatechange = (e) => {
        let state = e.target.readyState;
        let status = e.target.status;
        let respText = e.target.responseText;
        console.debug(JSON.parse(respText));
        if (state == 4 && status === 200)
            handleCurWeatherJson(JSON.parse(respText));
        else if (state == 4) {
            errorSection.textContent = `Error: Http status code ${status}`;
            console.error(`current weather response (status:${status}):${respText}`);
        }
    }
    xhreq.open('get', `https://api.openweathermap.org/data/2.5/weather?q=${addr}&lang=pl&appid=${API_KEY}`, true);
    xhreq.send();

    //fetch forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${addr}&lang=pl&appid=${API_KEY}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return res.json();
        })
        .then(handleForecastJson)
        .catch(err => {
            console.debug(err);
            errorSection.textContent = "Error: " + err.message;
        });
})