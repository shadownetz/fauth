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

    /* Image Value */
    let image = $('#id_image');
    let snapshot = $('#id_snapshot');

    // Initialize our WebCam
    let newWebCam = new FauthWebCam({
        launchBTN: '#webcam-snapshot',
        outputID: '#id_snapshot',
        bodyID: '#fauth-auth',
    });
    newWebCam.initialize();

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
        let loader = loading('.register-box');
        let name = $('#id_name').val();
        let email = $('#id_email').val();
        let phone = $('#id_phone').val();
        let email_exist_url = $('#js-email-exist-url').val();
        let image_single_face_url = $('#js-image-singleface-url').val();

        try{
            // check if image is uploaded
            if(snapshot.val()){
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
                    loader.hide();
                    return
                }
            }else{
                loader.hide();
                toastr.error("You must provide a passport image", "Error");
                return
            }
            if(!name || !email || !phone){
                loader.hide();
                toastr.warning("All input fields should not be blank", "Hey there!");
                return
            }else if(!(/^\+?[0-9]+$/.test(phone))){
                loader.hide();
                toastr.warning("Invalid telephone format", "Hey there!");
                return
            }else if(phone.length <= 4){
                loader.hide();
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
                loader.hide();
                toastr.error(email_validate_response.message, "Error");
                return
            }
            this.submit()

        }catch (e) {
            toastr.error(e.message, "Error");
        }
    });

    /* Login */
    try{
        let app = new Vue({
            el: '#fauth-auth',
            delimiters: ['[[', ']]'],
            data(){
                return {
                    passcodes: ['', '', '', ''],
                    email: '',
                    face_auth_login_mode: true
                }
            },
            watch:{
                face_auth_login_mode(newval){
                    if(!newval){
                        setTimeout(()=>{
                            toastr.warning('This method only works if enabled in settings', 'Notice!')
                        }, 500)
                    }
                    $('.js-opt').toggleClass('hide')

                }
            },
            methods: {
                authInputs(event='', index=0){
                    let val = event.target.value;
                    for(let i in this.passcodes){
                        if(Number.parseInt(i) === index){
                            // in case of html hack
                            if(val.length > 1){
                                this.passcodes[index] = val.substr((0-val.length)+1, 1);
                                break
                            }else{
                                this.passcodes[index] = val;
                                break
                            }
                        }
                    }
                    // move to next focus
                    if(((index+1) < 4 || (index+1) === 4) && val){
                        this.$refs['focus-'+(index+1)].focus();
                    }
                },
                validateEmail(mail){
                    return !!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)
                },
                login(){
                    if(this.face_auth_login_mode){
                        let b64Image = $('#id_snapshot').val();
                        if(!b64Image){
                            toastr.error("Take a passport snapshot to login", "Error!")
                        }else{

                        }
                    }else{
                        if(!this.validateEmail(this.email)){
                            toastr.error("Invalid email address", "Error!")
                        }

                    }

                }
            },
            created(){
                console.log("Vue.JS initalized!")
            }
        });
    }catch (e) {
    }
});


