$(document).ready(function() {
    $(document).scrollTop(0);
    $('.chart_container_2').css("display", "none");
    $('.chart_container_3').css("display", "none");

    const fdIn = 400;
    const show = 200;
    const fdOut = 400;
    var nContainers = 3;
            
    $(window).scroll(function() {
        var nPage = parseInt($(window).scrollTop() / (fdIn + show + fdOut));
        var currentLoc = $(window).scrollTop() % (fdIn + show + fdOut);
        
        switch (nPage){
            case 0:
                for(i = 1;i <= nContainers;i++)
                    if(i === (nPage+1)){
                        $(`.chart_container_${i}`).css("display", "flex");
                        $(`.exp_container_${i}`).css("display", "flex");
                        $(`.str_container_${i}`).css("display", "flex");
                    }else{
                        $(`.chart_container_${i}`).css("display", "none");
                        $(`.exp_container_${i}`).css("display", "none");
                        $(`.str_container_${i}`).css("display", "none");
                    }

                for(i = 2;i <= nContainers;i++)
                    $(`.container_${i}`).css("display", "none");
                
                if(currentLoc <= fdIn)
                    $('.exp_container_1').css("opacity", $(window).scrollTop() / fdIn);
                else if(currentLoc <= (fdIn+show)){
                    $('.chart_container_1').css("opacity", 1);
                    $('.str_container_1').css("opacity", 1);
                    $('.exp_container_1').css("opacity", 1);
                }else{
                    $('.chart_container_1').css("opacity", 1 - ((currentLoc-fdIn-show) / fdOut));
                    $('.str_container_1').css("opacity", 1 - ((currentLoc-fdIn-show) / fdOut));
                    $('.exp_container_1').css("opacity", 1 - ((currentLoc-fdIn-show) / fdOut));
                }
                break;
            
            default:
                for(i = 1;i <= nContainers;i++)
                    if(i === (nPage+1)){
                        $(`.chart_container_${i}`).css("display", "flex");
                        $(`.exp_container_${i}`).css("display", "flex");
                    }else{
                        $(`.chart_container_${i}`).css("display", "none");
                        $(`.exp_container_${i}`).css("display", "none");
                        $(`.str_container_${i}`).css("display", "none");
                    }

                if(currentLoc <= fdIn){
                    $(`.chart_container_${nPage+1}`).css("opacity", currentLoc / fdIn);
                }else if(currentLoc <= (fdIn+show)){
                    $(`.chart_container_${nPage+1}`).css("opacity", 1);
                    $(`.exp_container_${nPage+1}`).css("opacity", (currentLoc-fdIn) / show);
                }else{
                    $(`.chart_container_${nPage+1}`).css("opacity", 1 - ((currentLoc-fdIn-show)/fdOut));
                    $(`.exp_container_${nPage+1}`).css("opacity", 1 - ((currentLoc-fdIn-show)/fdOut));
                }
        }    
    });
});
