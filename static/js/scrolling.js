$(document).ready(function() {
    // Initializing page. Scroll to the top and hide other containers except for the first page
    $(document).scrollTop(0);
    $('.container_1').css("display", "none");
    $('.container_2').css("display", "none");
    $('.container_3').css("display", "none");

    // Set the amount of fade in, show, fade out.
    const fdIn = 400;
    const show = 200;
    const fdOut = 400;
    const nContainers = 3;
    var strCss = [".habit_str", "", ".look_str"];

    // If the browser gets scrolled
    $(window).scroll(function() {
        // Get the number of page and current location
        var nPage = parseInt($(window).scrollTop() / (fdIn + show + fdOut));
        var currentLoc = $(window).scrollTop() % (fdIn + show + fdOut);
        
        switch (nPage){
            case 0:
                // In the first page, show the main image and text
                $('.main_img').css("display", "flex");
                $('.main_str_container').css("display", "flex");

                // Hide other pages
                for(i = 1;i <= nContainers;i++)
                    $(`.container_${i}`).css("display", "none");
                
                // Fade in, show, and fade out depending on the current location
                if(currentLoc <= fdIn){
                    $('.main_str_container').css("opacity", $(window).scrollTop() / (fdIn*2));
                    $('.main_str').css("font-size", `${($(window).scrollTop() / 130)}vw`);
                }else if(currentLoc <= (fdIn+show)){
                    $('.main_str_container').css("opacity", 0.5);
                }else{
                    $('.main_img').css("opacity", 1 - ((currentLoc-fdIn-show) / fdOut));
                    $('.main_str_container').css("opacity", 0.5 - ((currentLoc-fdIn-show) / (fdIn * 2)));
                }
                break;
            
            case 1:
                // In the second page, hide the first page
                $('.main_str_container').css("display", "none");
                $('.main_img').css("display", "none");

                for(i = 1;i <= nContainers;i++)
                    if(i === nPage || i === nPage+1)
                        $(`.container_${i}`).css("display", "flex");
                    else
                        $(`.container_${i}`).css("display", "none");

                if(currentLoc <= fdIn){
                    $(`.container_${nPage+1}`).css("opacity", (currentLoc / fdIn)/2);
                    $(`.container_${nPage}`).css("opacity", currentLoc / fdIn);
                    $(strCss[nPage-1]).css("font-size", `${(currentLoc / 50)}vw`);
                }else if(currentLoc <= (fdIn+show)){
                    $(`.container_${nPage+1}`).css("opacity", 0.5);
                    $(`.container_${nPage}`).css("opacity", 1);
                }else{
                    $(`.container_${nPage+1}`).css("opacity", 0.5 - ((currentLoc-fdIn-show)/fdOut)/2);
                    $(`.container_${nPage}`).css("opacity", 1 - ((currentLoc-fdIn-show)/fdOut));
                }

                break;
                

            default:
                $('.main_str_container').css("display", "none");
                $('.main_img').css("display", "none");

                for(i = 1;i <= nContainers;i++)
                    if(i === nPage+1)
                        $(`.container_${i}`).css("display", "flex");
                    else
                        $(`.container_${i}`).css("display", "none");

                if(currentLoc <= fdIn){
                    $(`.container_${nPage+1}`).css("opacity", currentLoc / fdIn);
                    $(strCss[nPage]).css("font-size", `${(currentLoc / 50)}vw`);
                }else if(currentLoc <= (fdIn+show))
                    $(`.container_${nPage+1}`).css("opacity", 1);
                else
                    $(`.container_${nPage+1}`).css("opacity", 1 - ((currentLoc-fdIn-show)/fdOut));
        }    
    });
});
