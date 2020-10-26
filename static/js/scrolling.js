$(document).ready(function() {
    $(document).scrollTop(0);
    $('.container_1').css("display", "none");
    $('.container_2').css("display", "none");
    $('.container_3').css("display", "none");

    var fdIn = 400;
    var show = 200;
    var fdOut = 400;
    var nContainers = 3;
    var strCss = [".habit_str", "", ".look_str"];
            
    $(window).scroll(function() {
        var nPage = parseInt($(window).scrollTop() / (fdIn + show + fdOut));
        var currentLoc = $(window).scrollTop() % (fdIn + show + fdOut);
        
        switch (nPage){
            case 0:
                $('.main_img').css("display", "flex");
                $('.main_str_container').css("display", "flex");

                for(i = 1;i <= nContainers;i++)
                    $(`.container_${i}`).css("display", "none");
                
                if(currentLoc <= fdIn){
                    $('.main_str_container').css("opacity", $(window).scrollTop() / (fdIn*2));
                    $('.main_str').css("font-size", `${($(window).scrollTop() / 100)}vw`);
                }else if(currentLoc <= (fdIn+show)){
                    $('.main_str_container').css("opacity", 0.5);
                }else{
                    $('.main_img').css("opacity", 1 - ((currentLoc-fdIn-show) / fdOut));
                    $('.main_str_container').css("opacity", 0.5 - ((currentLoc-fdIn-show) / (fdIn * 2)));
                }
                break;
            
            default:
                $('.main_str_container').css("display", "none");
                $('.main_img').css("display", "none");

                for(i = 1;i <= nContainers;i++)
                    if(i === nPage)
                        $(`.container_${i}`).css("display", "flex");
                    else
                        $(`.container_${i}`).css("display", "none");

                if(currentLoc <= fdIn){
                    $(`.container_${nPage}`).css("opacity", currentLoc / fdIn);
                    $(strCss[nPage-1]).css("font-size", `${(currentLoc / 50)}vw`);
                }else if(currentLoc <= (fdIn+show))
                    $(`.container_${nPage}`).css("opacity", 1);
                else
                    $(`.container_${nPage}`).css("opacity", 1 - ((currentLoc-fdIn-show)/fdOut));
        }    
    });
});
