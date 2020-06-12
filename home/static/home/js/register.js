$(function(){
    /* remove preloader*/
    $('#preloader').fadeOut();

    /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    const particles_url = $('#particles-json-url').val();
    particlesJS.load('particles-js', particles_url, function() {
        console.info('particles.js config loaded');
    });

    /* Initialize tooltips */
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body',
    });

    /* Image Toggle Switch */
    $('#switch-image-option').click(function(event){
        event.stopPropagation();
        let image_labels = $('#fauth-register-form label.upload-images');
        image_labels.fadeToggle();
    });

    let webCamModal = $('#webCamModal');
    let webCamFrame = $('#webcam-camera');
    /* WebCam Buttons */
    let webCamSnap = $('#webcam-button');
    let webCamRetake = $('#webcam-button-retake');
    let webCamNext = $('#webcam-button-next');
    /* preview element */
    let webCamPreview = $('<img />', {
        alt: 'image preview',
        class: 'img-fluid webcam-preview'
    });
    /* Image Value */
    let image = $('#id_image');
    let snapshot = $('#id_snapshot');

    /* Load WebCam Modal */
    $('#webcam-snapshot').click(function(event){
        event.stopPropagation();
        webCamModal.modal({
            backdrop: 'static',
            show: true
        });
        Webcam.set({
            width: 350,
            height: 200,
            image_format: 'png',
            jpeg_quality: 100,
            flip_horiz: true,
            fps: 60
        });
        attachWebCam();
    });
    /* WebCam Button Click */
    webCamSnap.click(function(event){
        event.stopPropagation();
        Webcam.snap(function (dataURI) {
            // load image data URI
            snapshot.val(dataURI);
            webCamPreview.attr('src', dataURI);
        });
        Webcam.reset();
        webCamFrame.append(webCamPreview);
        $(this).fadeOut();
        addExtraWebCamButtons();
    });
    /* Retake Snapshot */
    webCamRetake.click(function(event){
        event.stopPropagation();
        webCamSnap.fadeIn('slow');
        attachWebCam();
        removeExtraWebCamButtons();
    });
    /* Remove WebCam */
    webCamNext.click(function(event){
        event.stopPropagation();
        destryoWebCam();
    });
    $('#webcam-close-btn').click(()=>{
        destryoWebCam()
    });

    function attachWebCam(){
        Webcam.attach('#webcam-camera');
    }
    function destryoWebCam(){
        try{Webcam.reset()}catch (e) {}
        webCamModal.modal('hide');
        webCamSnap.fadeIn();
        removeExtraWebCamButtons();
    }
    function removeExtraWebCamButtons(){
        webCamNext.fadeOut();
        webCamRetake.fadeOut();
    }
    function addExtraWebCamButtons(){
        webCamNext.fadeIn("slow");
        webCamRetake.fadeIn("slow");
    }

    /* Handle Registration */
    image.on('change', function(e){
        let file = e.target.files[0];
        let file_type = file.name.split('.').pop();
        if($.inArray(file_type, ['jpg','png','jpeg']) < 0){
            toastr.warning("The image uploaded is of invalid type", "Hey there!");
        }else{
            let reader = new FileReader();
            reader.onload = ()=>{
                snapshot.val(reader.result)
            };
            reader.readAsDataURL(file)
        }
    });
    $('#fauth-register-form').on('submit',async function register(event){
        event.preventDefault();
        // let images = userImages;
        let name = $('#id_name').val();
        let email = $('#id_email').val();
        let phone = $('#id_phone').val();
        let email_exist_url = $('#js-email-exist-url').val();
        let image_single_face_url = $('#js-image-singleface-url').val();

        try{
            // check if image is uploaded
            if(image.val()){
                // make sure valid passport is uploaded and has a single face
                let image_validate_response = await $.ajax({
                    url: image_single_face_url,
                    type: 'POST',
                    data: {image: snapshot.val()},
                    dataType: 'json',
                });
                if(!image_validate_response.status){
                    toastr.error(
                        image_validate_response.message,
                        "Error"
                    );
                    return
                }
            }else{
                toastr.error("You must provide a passport image", "Error");
                return
            }
            if(!name || !email || !phone){
                toastr.warning("All input fields should not be blank", "Hey there!");
                return
            }else if(!(/^\+?[0-9]+$/.test(phone))){
                toastr.warning("Invalid telephone format", "Hey there!");
                return
            }else if(phone.length <= 4){
                toastr.warning("Invalid telephone length", "Hey there!");
                return
            }

            let email_validate_response = await $.ajax({
                url: email_exist_url,
                type: 'POST',
                data: {email},
                dataType: 'json',
            });
            if(email_validate_response.status){
                toastr.error(email_validate_response.message, "Error");
                // return
            }
            // this.submit()

        }catch (e) {
            toastr.error(e.message, "Error");
        }
    });
});

