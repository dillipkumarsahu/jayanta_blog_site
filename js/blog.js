

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
        $("#list-of-blogs").html("");
        snapshot.docs.forEach(doc => {
            var heading = doc.data().heading;
            var sub_heading = doc.data().sub_heading;
            var image = doc.data().image;
            var content = doc.data().content;
            // var time = new Date(doc.data().time.seconds);
            var id = doc.id;

            ui = `
                <ul class="list-group mt-1 blg-head-list"
                    heading="`+heading+`"
                    sub-heading="`+sub_heading+`"
                    image="`+image+`"
                    content="`+content+`"
                    id-no="`+id+`"
                >
                    <li class="list-group-item text-center py-1 border">`+heading+`</li>
                    <li class="list-group-item bg-dark text-light text-center py-1 border">`+sub_heading+`</li>
                </ul>
            `;
            if(heading != undefined){
                $("#list-of-blogs").append(ui);
            }

            let h;
            let sh;
            let i;
            let c;
            $(".blg-head-list").each(function(){
                $(this).click(function(){
                    h = $(this).attr("heading");
                    sh = $(this).attr("sub-heading");
                    i = $(this).attr("image");
                    c = $(this).attr("content");
                    id= $(this).attr("id-no");

                    $("#heading").html(h);
                    $("#sub-heading").html(sh);
                    $("#image").attr("src",i);
                    $("#content").html(c);
                    $("#comment-form").attr("blog-id",id);
                    $("#popup").removeClass("d-none");
                    // console.log(sh);
                    $("#close-popup").click(function(){
                        $("#popup").addClass("d-none");
                    });
                });
            });
        });

        $("#comment-form").on("submit", function(e){
            e.preventDefault();
            var id = $(this).attr("blog-id");
            var comment = $("#comment").val();

            
        });
        
    });
});