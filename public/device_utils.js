const usbBtn = document.querySelector('#usb')
const usbLabel = document.querySelector('#usb_label')
const bleBtn = document.querySelector('#ble')
const bleLabel = document.querySelector('#ble_label')
const connectDeviceBtn = document.querySelector('#connectDeviceBtn')
const connectionBox = document.querySelector('#connectionBox')
const gdxDeviceConnected = document.querySelector('#gdxDeviceConnected')

const sensorArrayBox = document.querySelector('#sensorArrayBox')
const sensorArray = document.querySelector('#sensorArray')
const chooseSensorsBtn = document.querySelector('#chooseSensorsBtn')
const sensorLimitBox = document.querySelector('#sensorLimitBox')
const sensorLimitsArray = document.querySelector('#sensorLimitsArray')
const defineSensorLimitsBtn = document.querySelector('#defineSensorLimitsBtn')

const output = document.querySelector('#output')
const sensorAlert = document.querySelector('#sensorAlert')

//import godirect from "./node_modules/@vernier/godirect/dist/godirect.min.umd.js"

let gdxDevice = undefined
let sensors_to_be_watched_map = new Map

//to select a device
async function connectDevice () {
     try {
        if (gdxDevice){
            gdxDevice.close()

        } else {

            connectionBox.hidden = true

            //gdxDevice = await godirect.selectDevice(bluetooth)
            const bleDevice = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'GDX' }],
                optionalServices: ['d91714ef-28b9-4f91-ba16-f0d9a604f112']
            })

            gdxDevice = await godirect.createDevice(bleDevice, {open: false, startMeasurements: false})

            gdxDevice.on('device-closed', () => {
                output.textContent += `Device disconnected.\n`
                gdxDevice = undefined
            })

            gdxDevice.on('device-opened', () => {
                output.textContent += `Device ` + gdxDevice.name + ` opened.\n`
                //to choose sensors for measurements 
                chooseSensors(gdxDevice) 

            })
            gdxDevice.open(false)
 
        }

    } catch (err) {
        console.log(err)
        output.textContent += ('\nReload page and/or reconnect the device.\n')
    }
}

//create check box for device sensors to be choosen
function chooseSensors (device) {
    try {
        //to show all sensors
        let i = 0
        sensorArray.innerHTML += `<p> Choose sensors for continuos limit checking: </p>`
        device.sensors.forEach(sensor => {
            sensor.id = i
            sensorArray.innerHTML += `<input type="checkbox" id="${sensor.name}">`
            sensorArray.innerHTML += `<label for="${sensor.name}"> ${sensor.name}, unit: ${sensor.unit}</label><br>`
            i++
        })

        sensorArrayBox.hidden = false


    } catch (err) {
        console.log(err)
    }
}


//create check box to define sensors limits
function choosenSensors() {
    try {
        sensorArrayBox.hidden = true
        sensorLimitsArray.innerHTML += `<p> Set limits to be checked: </p>`
        sensorLimitBox.hidden = false

        gdxDevice.start(2000)
        gdxDevice.sensors.forEach(sensor => {
            if (document.getElementById(sensor.name).checked){
                sensor.enabled = true
                sensor.emit('state-changed', sensor)
                sensor.bigger_than_value = undefined
                sensor.less_than_value = undefined
                sensor.email_alerts = undefined
 
                sensorLimitsArray.innerHTML += `<p><strong>${sensor.name}</strong>, unit: ${sensor.unit}, min value: ${sensor.specs.measurementInfo.minValue}, max value: ${sensor.specs.measurementInfo.maxValue}</p>`
                sensorLimitsArray.innerHTML += `<label for="id_${sensor.id}_bigger_than_value">Alert for value bigger than </label>`
                sensorLimitsArray.innerHTML += `<input type="number" id="id_${sensor.id}_bigger_than_value" min=${sensor.specs.measurementInfo.minValue} max=${sensor.specs.measurementInfo.maxValue}> ${sensor.unit}`
                sensorLimitsArray.innerHTML += `<select id="id_${sensor.id}_logic"><option value="AND">AND</option><option value="OR">OR</option></select>`
                sensorLimitsArray.innerHTML += `<label for="id_${sensor.id}_less_than_value" > less than </label>`
                sensorLimitsArray.innerHTML += `<input type="number" id="id_${sensor.id}_less_than_value" min=${sensor.specs.measurementInfo.minValue} max=${sensor.specs.measurementInfo.maxValue}> ${sensor.unit}<br>`
                
                sensorLimitsArray.innerHTML += `<input type="checkbox" id="id_${sensor.id}_email_alerts">`
                sensorLimitsArray.innerHTML += `<label for="id_${sensor.id}_email_alerts"> Send email alert </label>`

            } else {
                sensor.enabled = false
                sensor.emit('state-changed', sensor)
            }
        })


        sensorLimitBox.hidden = false

    } catch (err) {
        console.log(err)
    }
}

//choose device sensors to be used for measurements
function defineSensorLimits () {
    try {
        //to show all sensors
        gdxDevice.sensors.forEach(sensor => {
            if (sensor.enabled){
                sensor.bigger_than_value = document.querySelector(`#id_${sensor.id}_bigger_than_value`).value
                sensor.logic = document.querySelector(`#id_${sensor.id}_logic`).value
                sensor.less_than_value = document.querySelector(`#id_${sensor.id}_less_than_value`).value
                sensor.email_alerts = document.querySelector(`#id_${sensor.id}_email_alerts`).checked

                //save sensor to map
                sensors_to_be_watched_map.set(sensor.id, sensor)
            }
        })

        //sensorLimitBox.hidden = false

    } catch (err) {
        console.log(err)
    }
}

