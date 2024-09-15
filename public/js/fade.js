window.onload = function() {
    document.body.classList.add('fade-in');
};

window.onbeforeunload = function() {
    document.body.classList.add('fade-out');
};
window.addEventListener('popstate', function(event) {
    fadeInPage();
});
window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};



