(function() {
    // references
    const body = document.body;
    const tempInput = document.getElementById('temp');
    const unitSelect = document.getElementById('unit');
    const resultDiv = document.getElementById('result');
    const sky = document.querySelector('.sky'); // we will append snow to sky

    // remove all snowflakes helper
    function clearSnow() {
        document.querySelectorAll('.snowflake').forEach(el => el.remove());
    }

    // create fresh snow (60 flakes)
    function createSnow() {
        clearSnow(); // avoid duplicates
        for (let i = 0; i < 50; i++) {
            const snow = document.createElement('div');
            snow.classList.add('snowflake');
            // mix of ❄ and ❆
            snow.innerHTML = (i % 3 === 0) ? '❆' : '❄';
            snow.style.left = Math.random() * 100 + '%';
            // random duration between 3s and 8s
            snow.style.animationDuration = (Math.random() * 5 + 3).toFixed(2) + 's';
            // random delay so they don't all start together
            snow.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
            // size variation
            const size = 12 + Math.floor(Math.random() * 22);
            snow.style.fontSize = size + 'px';
            snow.style.opacity = 0.6 + Math.random() * 0.4;
            sky.appendChild(snow);
        }
    }

    // remove extra thematic elements (sun/moon pseudo-elements are handled by class, but we need to clean snow and maybe extra overlays)
    function removeSnow() {
        clearSnow();
    }

    // core conversion & weather staging
    window.convertTemperature = function() {
        const rawValue = tempInput.value.trim();
        const unit = unitSelect.value;
        let temp = parseFloat(rawValue);

        // validation
        if (isNaN(temp)) {
            resultDiv.innerHTML = '❄️  enter a valid number  ☀️';
            return;
        }

        // convert everything to celsius first
        let celsius;
        if (unit === 'c') {
            celsius = temp;
        } else if (unit === 'f') {
            celsius = (temp - 32) * 5 / 9;
        } else { // kelvin
            celsius = temp - 273.15;
        }

        // calculate fahrenheit & kelvin for display
        const fahr = (celsius * 9/5) + 32;
        const kelv = celsius + 273.15;

        // format output
        resultDiv.innerHTML = `${celsius.toFixed(2)} °C <br> ${fahr.toFixed(2)} °F <br> ${kelv.toFixed(2)} K`;

        // ---- DYNAMIC WEATHER LOGIC (animation & classes) ----
        // remove previous weather classes & snow
        body.className = '';        // removes all previous e.g., 'hot day' etc
        removeSnow();

        // decide climate based on celsius
        if (celsius > 30) {          // HOT threshold (>30°C)
            body.classList.add('hot', 'day');
            // ensure no snow (already removed)
            // (hot sun pseudo is managed by css)
        } 
        else if (celsius < 10) {     // COLD (<10°C)
            body.classList.add('cold', 'night');
            // create falling snow
            createSnow();
        } 
        else {                        // MILD / NORMAL (10°C - 30°C)
            body.classList.add('normal', 'day');
            // no snow, just clouds & soft sun
        }

        // minor extra: if temp exactly 0 or below, make sure it's cold (already <10)
        // if user inputs extreme hot >45 still hot class
    };

    // optional: initialize default weather based on default input value (22°C)
    window.addEventListener('load', function() {
        // set default convert to set weather based on initial 22 (celsius)
        // but unit is celsius by default, so we can call convert
        convertTemperature();
    });
})();