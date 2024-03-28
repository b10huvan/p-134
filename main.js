img = "";
model_status = "";
objects = [];

function preload() {
    alarm = loadSound("Alarm.mp3");
}

function setup() {
    canvas = createCanvas(380, 380);
    canvas.center();

    //Set up Camera
    video = createCapture(VIDEO);
    video.size(380, 380);
    video.hide();

    //setup cocossd model
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting Objects...";

}

function draw() {
    image(video, 0, 0, 640, 420);

    if (model_status != "") {
        objectDetector.detect(video, gotResult);

        r = random(255);
        g = random(255);
        b = random(255);
        for (i = 0; i < objects.length; i++) {
            console.log(objects[i].label);

            if (objects[i].label == "person") {
                document.getElementById("status").innerHTML = "Status : Object Detected";
                document.getElementById("number_of_objects").innerHTML = "Baby  Found";
                alarm.stop();

                fill(r, g, b);
                percent = floor(objects[i].confidence * 100);
                text(objects[i].label + " " + percent + "%", objects[i].x, objects[i].y);

                noFill();
                stroke(r, g, b);
                rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            } else {
                document.getElementById("status").innerHTML = "Status : Detecting Objects...";
                document.getElementById("number_of_objects").innerHTML = "Baby Not Found";
                alarm.play();
            }
        }
        if (objects.length == 0) {
            document.getElementById("status").innerHTML = "Status : Detecting Objects...";
            document.getElementById("number_of_objects").innerHTML = "Baby Not Found";
            alarm.play();
        }
    }
}

function modelLoaded() {
    console.log("Cocossd model is initialized !");

    model_status = true;
}

function gotResult(error, results) {
    if (error) {
        console.log(error);
    } else {
        console.log(results);
        objects = results;
    }
}