const usbBtn = document.querySelector('#usb')
const usbLabel = document.querySelector('#usb_label')
const bleBtn = document.querySelector('#ble')
const bleLabel = document.querySelector('#ble_label')
const connectDeviceBtn = document.querySelector('#connectDeviceBtn')
const connectionBox = document.querySelector('#connectionBox')
const output = document.querySelector('#output')
const sensorArray = document.querySelector('#sensorArray')
const gdxDeviceConnected = document.querySelector('#gdxDeviceConnected')

//import godirect from "./node_modules/@vernier/godirect/dist/godirect.min.umd.js"

let gdxDevice = undefined
let sensors_to_be_watched = new Map

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

//choose device sensors to be used for measurements
function chooseSensors (device) {
    try {
        //to show all sensors
        let i = 0
        device.sensors.forEach(sensor => {
            sensor.id = i
            sensorArray.innerHTML += `<input type="checkbox" id="${sensor.name}" value="${sensor.i}">`
            sensorArray.innerHTML += `<label for="${sensor.name}"> ${sensor.name}</label><br>`
            i++
        })

        sensorArray.hidden = false
  

    } catch (err) {
        console.log(err)
    }
}

//choose device sensors to be used for measurements
function choosenSensors() {
    try {

        gdxDevice.start(2000)
        gdxDevice.sensors.forEach(sensor => {
            if (document.getElementById(sensor.name).checked){
                sensor.enabled = true
                sensor.emit('state-changed', sensor)
                //TODO add checked value from index html
                //todo ask Pavel for && || request 
                sensor.bigger_than_value = 5
                sensor.less_than_value = -20
                sensors_to_be_watched.set(sensor.id, sensor)
            } else {
                sensor.enabled = false
                sensor.emit('state-changed', sensor)
            }
        })

        document.getElementById("choose-sensors").hidden = true
        output.textContent += ('\nclick to submit\n')


    } catch (err) {
        console.log(err)
    }
}