const button = document.querySelector('.nav-button')
    let collapsed = true;
    function toggleNavbar() { 
    if (!collapsed) {
        button.classList.add('collapsed');
        collapsed = true;
        document.getElementById("overlay").style.display = "none";
    } else {
        button.classList.remove('collapsed');
        collapsed = false;
        document.getElementById("overlay").style.display = "block";
    }
}