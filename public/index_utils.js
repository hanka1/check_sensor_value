function checkValue(sensor) {
    try {
        sensor.alert = false
        if (sensor.logic == 'AND'){
            if (sensor.bigger_than_value < sensor.value
                &&
                sensor.less_than_value > sensor.value){
                    sensor.alert = gdxDevice.name + ' sensor ' + sensor.name + ', value: ' + sensor.value 
                    sensor.alert += ' is bigger than defined ' + sensor.bigger_than_value + ' ' + sensor.unit
                    sensor.alert += ' and value: ' + sensor.value 
                    sensor.alert += ' is less than defined ' + sensor.less_than_value + ' ' + sensor.unit +'. '
            }
        }
        if (sensor.logic == 'OR'){
            if (sensor.bigger_than_value < sensor.value){
                sensor.alert = gdxDevice.name + ' sensor ' + sensor.name + ', value: ' + sensor.value 
                sensor.alert += ' is bigger than defined ' + sensor.bigger_than_value + ' ' + sensor.unit + '. '
            }
            if (sensor.less_than_value > sensor.value){
                    sensor.alert += gdxDevice.name + ' sensor ' + sensor.name + ', value: ' + sensor.value 
                    sensor.alert += ' is less than defined ' + sensor.less_than_value + ' ' + sensor.unit + '. '
            }
        }

        if(sensor.alert){
            sensor.alert += `\nTimestamp: ` + new Date()
            sensorAlert.textContent += sensor.alert + `\n\n`


            if(sensor.email_alerts)
                sendDeviceToAPI(sensor.alert) //to be emailed
        }

    } catch (err) {
        console.log(err)
    }
}

//sendDeviceToAPI()
function sendDeviceToAPI(sensor_alert) {
    try {
        //TODO URL to be send from app.js or other config
        fetch('http://localhost:8000' + "/get_sensors", {
            method: 'post',
            headers: {
              "Content-type": 'application/json'
            },
            body: JSON.stringify({sensor_alert})
          })

    } catch (err) {
        console.log(err)
    }
}

//sendDeviceToAPI()
function sendBrowserAlert(sensor_alert) {
    try {
        //TODO 

    } catch (err) {
        console.log(err)
    }
}