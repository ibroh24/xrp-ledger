let xrpCopy = document.querySelector('.copy');
let xrpAddress = document.querySelector('.cd');
let txtAddress = document.querySelector('.address');
xrpAddress = xrpAddress.innerText;
// let textCopier = '';
console.log(xrpAddress);
xrpCopy.addEventListener('click', ()=>{
    var textCopier = xrpAddress.replace(' ', '');
    txtAddress.value = textCopier;
    alert('address copied');

});
