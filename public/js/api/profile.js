function callApiProf(id) {
    var postApi = `http://localhost:3000/prof/api/${id}`;
    var postUApi = `http://localhost:3000/prof/api/u/${id}`;

    function start() {
        getInfo(renderInfo);
        handleUpdateForm();
        renderImage();
    }
    
    start();

    //FUNCTION 

    function getInfo(callback) {
        fetch(postApi)
        .then(function(response) {
            return response.json();
        })
        .then(callback)
        .catch(function(err){
            alert(err);
        });
      }

    function updateInfo(data, callback) {
        var options = {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }


        fetch(postUApi, options)
            .then(function(response) {
                response.json();
            })
            .then(callback);
    }


    function renderInfo (posts){
        document.getElementById('fullname').value =  document.getElementById('title-fullname').innerText = posts.fullname;
        document.getElementById('email').value = posts.email;
        document.getElementById('numberphone').value = posts.numberphone;
    }

    function renderImage(){
        image = `http://localhost:3000/prof/image/${id}`;
        $('#confirm-img').attr('src', image);
    }

    
  function handleUpdateForm (){
        var updateBtn = document.querySelector('#save-btn');
        updateBtn.onclick = function() {
            var fullname = document.querySelector('input[name="fullname"]').value;
            var email = document.querySelector('input[name="email"]').value;
            var numberphone = document.querySelector('input[name="numberphone"]').value;
            document.getElementById('form-frofile').action = postUApi;

            var formData = {
                fullname: fullname,
                email: email,
                numberphone: numberphone
            }

            updateInfo(formData, function() {
                getInfo(renderInfo);
            });

            var elements = document.getElementsByClassName("form-group");
            var btn_element = document.getElementsByClassName('form-submit');

            for ( var i = 0 ;i < elements.length; i++ ) {
                if(!elements[i].classList.contains('disable'))
                {
                    elements[i].classList.add('disable')
                }
            }

            for(var i = 0; i < btn_element.length; i++){
                if(btn_element[i].classList.contains('disable'))
                {
                    btn_element[i].classList.remove('disable')
                }
                else
                {
                    btn_element[i].classList.add('disable')
                }
            }
        }
  }
}