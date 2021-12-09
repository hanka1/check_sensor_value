connectDeviceBtn.addEventListener('click', connectDevice )

let time_interval_start_checking = setInterval(() => {
    if (gdxDevice && gdxDevice.opened) {
        checkDeviceValues()
        clearInterval(time_interval_start_checking)
    }
}, 1000)
    

function checkDeviceValues () { 
    try {
            gdxDevice.sensors.forEach( sensor => {
                sensor.on('value-changed', (sensor) => {
                    //to check if sensor is set to be watched
                    
                    if (sensors_to_be_watched.has(sensor.id))
                        checkValue(sensor)
                })
            })


    } catch (err) {
        console.error(err)
    }
}





    
