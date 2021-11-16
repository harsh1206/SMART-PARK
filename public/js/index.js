// function readURL(input) {
//   if (input.files && input.files[0]) {
//     var reader = new FileReader();
//     reader.onload = function (e) {
//       $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
//       $('#imagePreview').hide();
//       $('#imagePreview').fadeIn(650);
//     }
//     reader.readAsDataURL(input.files[0]);
//   }
// }
// document.getElementById("profileImage").change(function () {
//   readURL(this);
// });
/// click of buttons 
console.log('Client-side code running');

const button = document.getElementById('C1R1');
button.addEventListener('click', function (e) {
  console.log('button was clicked');

  fetch('/dashboard', {
      method: 'POST'
    })
    .then(function (response) {
      if (response.ok) {
        console.log('Click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function (error) {
      console.log(error);
    });
});