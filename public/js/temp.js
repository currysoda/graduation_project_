window.onload = () => {
    temp = document.getElementsByName("temp");
    
    console.log(`typeof_querySelectorAll : ${typeof(temp)}`);
    console.log(`querySelectorAll : ${temp}`);

    console.log(temp.length);

    for(let i = 0; i < temp.length; i++) {
        console.log(i);
        console.log(temp[i]);
    }
}