var menu_open = false;
var menu = document.querySelector('.main-nav');
var icon_menu_open = document.querySelector('.menu-open');
var icon_menu_close = document.querySelector('.menu-close');

document.querySelector('.mobile-nav-icon').addEventListener('click', function(){
    if (!menu_open) {
        menu_open = true;
        menu.style.display = 'block';
        icon_menu_open.style.display = 'none';
        icon_menu_close.style.display = 'block';
    } else {
        menu_open = false;
        menu.style.display = 'none';
        icon_menu_open.style.display = 'block';
        icon_menu_close.style.display = 'none';
    }
});

$(document).ready(function() {
    
    $('.js--section-features').waypoint(function(direction){
        if (direction == "down") {
            $('nav').addClass('sticky');
        } else {
            $('nav').removeClass('sticky');
        }
    }, {
      offset: '80px'
    });
    
    /* Scroll on buttons */
    $('.js--scroll-to-plans').click(function(){
        $('html, body').animate({scrollTop: $('.js--section-plans').offset().top}, 1000);
    });
    
    $('.js--scroll-to-start').click(function(){
        $('html, body').animate({scrollTop: $('.js--section-features').offset().top}, 1000);
    });
    /*Navigation scroll*/
    
   /* // Add smooth scrolling to all links
    $("a").click(function(event) {
        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();
            // Store hash
            var hash = this.hash;
            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
            scrollTop: $(hash).offset().top
            }, 1000, function(){
                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });*/
    
    /* Animation on scroll */
   /* $('.js--wp-1').waypoint(function(direction){
        $('.js--wp-1').addClass('animated');
        alert('works');
    }, {
        offset: 50%;
    });*/
    
    var count = 1;
     $('.js--wp-1').waypoint(function(direction){
         if (count > 0){
             $('.js--wp-1').addClass('damn');
             count -= 1;
         }
    }, {
      offset: '80%'
    });
    
    
    
});