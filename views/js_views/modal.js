var btn_modal = document.getElementById("btn_modal");

var mymodal = document.getElementById("mymodal");

console.log(`불러오긴 했냐?`);


btn_modal.onclick("click", (e) => {
    alert("mybtn listener!");
    console.log(`click?`);
});