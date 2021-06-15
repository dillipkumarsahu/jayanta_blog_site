
$(document).ready(function() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBM_oCBKNGmxDWQ-msrrhy2d0ckO8cpIuA",
        authDomain: "tega-dashboard.firebaseapp.com",
        projectId: "tega-dashboard",
        storageBucket: "tega-dashboard.appspot.com",
        messagingSenderId: "775848884918",
        appId: "1:775848884918:web:08a291e9f8efbc7e6b0417",
        measurementId: "G-N489ERS4YT"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    const db = firebase.firestore();
    db.settings({ timestampsInSnapshots: true });
    //////////////////////////////////
    //////fetch data from firestore
    /////////////////////////////////
    db.collection('blogs').get().then((snapshot) => {
        $("#heading-lists").html("");
        snapshot.docs.forEach(doc => {
            var heading = doc.data().heading;
            var sub_heading = doc.data().sub_heading;
            var image = doc.data().image;
            var content = doc.data().content;
            var time = new Date(doc.data().time.seconds);

            ui = `
                <div class="list-group mt-3">
                    <a href="#" class="list-group-item list-group-item-action active text-center">
                        `+heading+`
                    </a>
                    <a href="#" class="list-group-item list-group-item-action disabled text-center">`+time+`</a>
                    <a href="#" class="list-group-item list-group-item-action disabled text-center">`+sub_heading+`</a>
                    <a href="#" class="list-group-item list-group-item-action disabled text-center"><img src="`+image+`" alt="blog image" class="w-50"></a>
                    <a href="#" class="list-group-item list-group-item-action disabled text-justify">`+content+`</a>
                </div>
            `;

            $("#heading-lists").append(ui);
        });
    });




    var image_data;
    var image = document.getElementById("image");
    $(image).on("change",function(){
        var file = this.files[0];
        var freader = new FileReader();
        freader.readAsDataURL(file);
        freader.onload = function(event){
            image_data = event.currentTarget.result;
        }
    });

    $("#add-blog").on("submit", function(e){
        e.preventDefault();
        var heading = $("#heading").val();
        var sub_heading = $("#sub-heading").val();
        var content = $("#content").val();
        var timestamp = firebase.firestore.FieldValue.serverTimestamp();

        db.collection('blogs').add({
            heading: heading,
            sub_heading: sub_heading,
            image:image_data,
            content:content,
            time:timestamp
        });
        
    });
});




