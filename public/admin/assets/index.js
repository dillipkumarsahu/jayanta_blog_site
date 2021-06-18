
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
            // var time = new Date(doc.data().time.seconds);
            var id = doc.id;

            ui = `
                <ul class="list-group mt-3">
                    <li class="list-group-item list-group-item-action active text-center">
                        `+heading+`
                    </li>
                    <li class="list-group-item list-group-item-action text-center">`+sub_heading+`</li>
                    <li class="list-group-item list-group-item-action text-center"><img src="`+image+`" alt="blog image" class="w-50"></li>
                    <li class="list-group-item list-group-item-action text-justify">`+content+`</li>
                    <li class="list-group-item list-group-item-action bg-danger delete" blog-id="`+id+`">
                         <i class="fa fa-trash-o text-light" style="font-size:25px;"></i>
                    </li>
                    
                </ul>
            `;
            if(heading != undefined){
                $("#heading-lists").append(ui);
            }


            /////delete coding
        var pre_val = "";
        $(".delete").each(function(){
            $(this).click(function(){
                pre_val = $(this).attr("blog-id");
                var ui = `
                    <button class="btn btn-info" id="close">No</button>
                    <button class="btn btn-danger" id="dlt-yes" blg-id="`+pre_val+`">Yes</button>
                `;
                $("#popup").removeClass("d-none");
                $("#confirm-btn").html(ui);
                $("#close").click(function(){
                    $("#popup").addClass("d-none");
                });
                $("#dlt-yes").click(function(){
                    $("#confirm-btn").html('<img src="./../assets/loader.gif" alt="loader" class="w-50">');
                    var result = db.collection('blogs').doc(pre_val).delete();
                    if(result)
                    {
                            var ui = `
                                <h6 class="text-success">Blog Deleted !</h6>
                            `;
                            $("#confirm-btn").html(ui);
                            
                            $(".delete").each(function(){
                                if($(this).attr("blog-id") == pre_val){
                                    $(this).parent().remove();
                                }
                            });
                            setTimeout(function(){
                                $("#popup").addClass("d-none");
                            },1000);
                    }
                });

                
            });
        });
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

        var result = db.collection('blogs').add({
            heading: heading,
            sub_heading: sub_heading,
            image:image_data,
            content:content,
            time:timestamp
        }).then(function (){
            $("#add-blog").trigger('reset');
        }).catch(function(err) {
            console.log(err);
        });
    });
});

