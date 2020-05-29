
function register(event, userImages){
    event.preventDefault();
    let images = userImages;
    let name = $('#id_name').val();
    let email = $('#id_email').val();
    let phone = $('#id_phone').val();
    // validate images type
    if(images){
        for(let file of images){
            let file_type = file.name.split('.').pop();
            if($.inArray(file_type, ['jpg','png','jpeg']) < 0){
                toastr.warning("Some or all of the images are of invalid type", "Hey there!");
                return
            }
        }
    }else{
        toastr.error("At least one passport image should be uploaded", "Error");
        return;
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

    toastr.success('Done')



}




$(function(){
    /* remove preloader*/
    $('#preloader').fadeOut();
    /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    const particles_url = $('#particles-json-url').val();
    particlesJS.load('particles-js', particles_url, function() {
        console.info('callback - particles.js config loaded');
    });
    /* Initialize tooltips */
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body',
    });

    /* Handle Registration */
    let images;
    $('#id_images').on('change', function(e){
        images = e.target.files;
    });
    $('#fauth-register-form').on('submit', event=>{
        register(event, images)
    });
});