let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    render_elements();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
    } else {
        alert("Coordinates not selected!")
        window.history.back();
    }
}

function render_elements() {
    $.ajax({
        url:"https://api.mapbox.com/directions/v5/mapbox/driving/$%7Bcoordinates.source_lon%7D%2C$%7Bcoordinates.source_lat%7D%3B$%7Bcoordinates.destination_lon%7D%2C$%7Bcoordinates.destination_lat%7D?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA",
        type:"get",
        success:function(response){
            console.log(response)
            let images = {
                "turn_right":"./assets/ar_right.png",
                "turn_left":"./assets/ar_left.png",
                "slight_right":"./assets/ar_slight_right.png",
                "slight_left":"./assets/ar_slight_left",
                "straight":"./assets/ar_straight.png"
            }
            let steps=response.route[0].legs[0].steps
            for (let i=0; i<steps.length;i++){
                let images;
                let distance=steps[i].distance
                let instructions=steps[i].maneuver.instruction
                if(instructions.includes("turn right")){
                    images="turn_right"
                }
                else if(instructions.includes("turn left")){
                    images="turn_left"
                }
                if(i>0){
                    $("#scene_container").append(
                        <a-entity gps-entity-place="latitude:${steps[i].maneuver.location[1]}; longitude:${steps[i].maneuver.location[1]}">
                            
                            <a-image src="./assets/${images[image]}"
                            name="${instructions}"
                            look-at="#step_${i-1}"
                            scale="5 5 5"
                            id="step_${i}"
                            position="0 0 0 "></a-image>
                            <a-entity ><a-text height="50" value="${instructions}(${distance}m)" ></a-text></a-entity>
                        </a-entity>    
                    )
                }
                else{
                    $("#scene_container").append(
                        <a-entity gps-entity-place="latitude:${steps[i].maneuver.location[1]}; longitude:${steps[i].maneuver.location[1]}">
                            
                            <a-image src="./assets/ar_start.png"
                            name="${instructions}"
                            look-at="#step_${i+1}"
                            scale="5 5 5"
                            id="step_${i}"
                            position="0 0 0 "></a-image>
                            <a-entity ><a-text height="50" value="${instructions}(${distance}m)" ></a-text></a-entity>
                        </a-entity>    
                    )
                }
                    

                


                
            }
        },
        

    })
   
}
