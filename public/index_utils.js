function checkValue(sensor) {
    try {

        if (sensor.bigger_than_value < sensor.value){
            //|| 
            //TODO < > && ||
            //TODO max min value to html soose sensor table
            //TODO send info to browser
            //sensor.less_than_value <  sensor.value){
                sendDeviceToAPI(sensor) //to be emailed
        }

    } catch (err) {
        console.log(err)
    }
}

//sendDeviceToAPI()
function sendDeviceToAPI(sensor) {
    try {
        //TODO URL to be send from app.js or other config
        fetch('http://localhost:8000' + "/get_sensors", {
            method: 'post',
            headers: {
              "Content-type": 'application/json'
            },
            body: JSON.stringify({device_name: gdxDevice.name, sensor})
          })

    } catch (err) {
        console.log(err)
    }
}