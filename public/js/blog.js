

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
                    $("#show-hide-comment-add").addClass("d-none");
                    $("#load-comments").removeClass("d-none");
                    $("#view-comments").html("");

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
                    $("#load-comments").attr("blog-id",id);
                    $("#popup").removeClass("d-none");
                    // console.log(sh);
                    $("#close-popup").click(function(){
                        $("#popup").addClass("d-none");
                    });


                });
            });
        });
        
    });

    $("#load-comments").click(function(){
        $("#view-comments").html("");
        $("#show-hide-comment-add").removeClass("d-none");
        $("#load-comments").addClass("d-none");

        var id = $("#load-comments").attr("blog-id");

        db.collection('blogs').doc('comments_'+id).get()
        .then(function (res){
            console.log(res.data());
            var comment;
            var check = res.data();

            if(check == undefined)
            {
                $("#comment-form").on("submit", function(e){
                    e.preventDefault();
                    comment = $("#comment").val();
                    $("#post-btn").attr("disabled",true);
                    $("#post-btn").html("Wait...");
                    comment = [comment];

                    db.collection('blogs').doc('comments_'+id).set({
                        comment:comment
                    }).then(function (){
                        comment = "";
                        $("#comment-form").trigger('reset');
                        $("#post-btn").html("success");
                        setTimeout(function() {
                            $("#post-btn").attr("disabled",false);
                            $("#post-btn").html("Post");
                            // check = "done";
                            console.log(check);
                        },1000);
                    }).catch(function(err) {
                        console.log(err);
                    });
                });

                //show comments
                var ui = `
                    <div class="w-25 border-bottom border-light text-light d-flex align-items-center justify-content-center">
                        <p style="font-weight: 200;">No Comments yet</p>
                    </div>
                `;
                $("#view-comments").append(ui);
                
            }
            else{
                
                comment = res.data().comment;
                console.log(comment);
                $("#comment-form").on("submit", function(e){
                    e.preventDefault();
                    comment.push($("#comment").val());
                    console.log(comment);
                    $("#post-btn").attr("disabled",true);
                    $("#post-btn").html("Wait...");

                    db.collection('blogs').doc('comments_'+id).update({
                        comment:comment
                    }).then(function (){
                        comment = "";
                        $("#comment-form").trigger('reset');
                        $("#post-btn").html("success");
                        setTimeout(function() {
                            $("#post-btn").attr("disabled",false);
                            $("#post-btn").html("Post");
                        },1000);
                    }).catch(function(err) {
                        console.log(err);
                    });
                });

                for (let i = 0; i < comment.length; i++) {
                    var ui = `
                        <div class="w-100 border-bottom border-light py-2 text-light d-flex">
                            <i class="fa fa-user-circle-o mx-2" style="font-size:25px;"></i>
                            <p style="font-weight: 200;" class="m-0 p-0">`+comment[i]+`</p>
                        </div>
                    `;
                    $("#view-comments").append(ui);
                }
            }
        });


        


        // db.collection('blogs').doc('comments').get({
        //     blog_id:id
        // }).then(function (res){
            
        //     comments = res.data().comment;
            
        //     $("#show-hide-comment-add").removeClass("d-none");
        //     $("#load-comments").addClass("d-none");
            
        //     for (let i = 0; i < comments.length; i++) {
        //         const element = comments[i];
        //         console.log(element);
        //         var ui = `
        //             <div class="w-25 border-bottom border-light text-light d-flex align-items-center justify-content-center">
        //                 <i class="fa fa-user-circle-o" style="font-size:25px;"></i>
        //             </div>
        //             <div class="w-75 pt-2 border-bottom border-light text-light d-flex align-items-center">
        //                 <p style="font-weight: 200;">`+element+`</p>
        //             </div>
        //         `;
        //         $("#view-comments").append(ui);
        //     }

        // }).catch(function(err) {
        //     console.log(err);
        // });
    });
    


    
});