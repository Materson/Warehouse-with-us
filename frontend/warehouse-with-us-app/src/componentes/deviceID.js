export function deviceID()
{
    var navigator_info = window.navigator;
    var screen_info = window.screen;
    var devID = navigator_info.mimeTypes.length;
    devID += navigator_info.userAgent.replace(/\D+/g, '');
    devID += navigator_info.plugins.length;
    devID += screen_info.height || '';
    devID += screen_info.width || '';
    devID += screen_info.pixelDepth || '';
    
    return devID;
}

export async function registerDeviceID(devID)
{
    const params = {
        devID: devID
    };
    const HOST = window.location.hostname;
    const init = {
        method: "POST",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept':'*/*',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        body: JSON.stringify(params)
    };
    fetch("https://"+HOST+":8002/deviceid", init)
    .then(res => res.json())
    .then(
        (result) => {
            this.setState({data: result});
            this.setState({isLoaded:true});
        },
        (error) => {
            console.log("blad");
            console.log(error);
        }
    )
}

export async function updateDeviceID(oldID, newID)
{
    const params = {
        oldID: oldID,
        newID: newID
    };
    const HOST = window.location.hostname;
    const init = {
        method: "PUT",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept':'*/*',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        body: JSON.stringify(params)
    };
    fetch("https://"+HOST+":8002/deviceid", init)
    .then(res => res.json())
    .then(
        (result) => {
            this.setState({data: result});
            this.setState({isLoaded:true});
        },
        (error) => {
            console.log("blad");
            console.log(error);
        }
    )
}

export async function checkDeviceID()
{
    const devID = deviceID().toString();
    if(!localStorage.getItem("deviceID"))
    {
        localStorage.setItem("deviceID", devID);
    }
    else
    {
        const storageID = !localStorage.getItem("deviceID");
        if(devID !== storageID)
        {
            const result = await updateDeviceID(storageID, devID);
            if(result)
            {
                localStorage.setItem("deviceID", devID);
            }
        }
    }
}