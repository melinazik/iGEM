/* Code in here goes to iGEM TopBar in wiki between the tags <script> </script> */

$(document).ready(function() {
        
    //remove the HQ_page id
    $("#HQ_page").attr('id','');	

    //check for page scrolling
    function adjust_for_scrolling(){

        $(window).bind('scroll', function() {
                if ($(window).scrollTop() > 500) {
                $(".general_menu").removeClass('active_button');
                $(".menu_container").hide();
                $(".top_bar").hide();

                }
                else {
                $(".top_bar").show();
            }	
        });

    }

    //adjust for screen resizing
    function window_resized(){
        
        //first get screen size
        
        //small
            if ($(window).width() <= 800) {

            //activate scrolling menu
            adjust_for_scrolling();
            
                // if the menu is visible
                if($(".menu_container").is(":visible")){
        //$(".igem_content_wrapper").removeClass("full_screen");
            }
            //if it isnt
                else {
                        $('.active_button').removeClass('active_button');
                
                }
        }

        //big
            if ($(window).width() >= 801) {

            //stop scrolling
            $(window).unbind('scroll');
            
            $(".top_bar").show();
            
                // if the menu is visible
                if($(".menu_container").is(":visible")){
                        $(".general_menu").addClass('active_button');
            }
            //if it isnt
                else {
                //$(".igem_content_wrapper").addClass("full_screen");
                }	
        }
    }

        
        
    function highlight_current_page_menu() {
        
        var page_url="https://2021.igem.org/";
        page_url = page_url + wgPageName;
        $("a[href$='"+ page_url +"']").parent().addClass("current_page");
        $("a[href$='"+ page_url +"']").parent().addClass("current_hub");
        
        
        //if the page is in a submenu, open the submenu and make the appropiate changes
        if( $( ".current_page" ).hasClass( "submenu_item_wrapper" )){
            
            $(".current_page").parent().toggle();
            $(".current_page").parent().prev().addClass("current_hub");
            $(".current_hub > .menu_control").toggleClass("open");
            
        }
    }

        
    //navigation functionality
    function navigation_functionality(){
        
        $('.accordion').click(function(){	
            $(this).next().toggle();
            $(this).children('.menu_control').toggleClass('open');
        });
        
        //highlight current page
        highlight_current_page_menu();
        
    }

    //navigation adjustments for teams
    function team_navigation_adjustment(){	

        var team_name = wgPageName;
        
        //if this is the topbar template, for now, leave team example 2
        if(team_name == 'Template:IGEM_TopBar'){
            team_name = 'Team:Example2';
        }
        
        //if this is a subpage, cut until first '/'
        if(team_name.indexOf('/') > -1){
            team_name = team_name.substr(0, team_name.indexOf('/')); 
        }
        
        //if not, replace all Team:Example 2 with this team's name
        $('#navigation').find('a').each(function() {
                $(this).attr("href", function(index, old) {
            return old.replace('Team:Example2',team_name);
                });
        });		
    }
        
        
    //start of code

    //load navigation menu
    $("#navigation_tab_content").load("https://2021.igem.org/HQ:Team_Navigation #navigation" , function() {	
        team_navigation_adjustment();		
        navigation_functionality();	
    });	


        
    // check page width when device loads page
    if ($(window).width() <= 800) {
        $('.active_button').removeClass('active_button');
        adjust_for_scrolling();
    }


    //if the user is resizing the window
    $( window ).resize(function() {

        window_resized();			

    });


    // if the button is clicked, hide or show divs 
    $(".general_menu").click(function(){
        
        //if it is visible, hide everything
        if($(".menu_container").is(":visible")){
        
            $(".general_menu").removeClass('active_button');
            $(".menu_container").fadeOut();		
        }
        else{
            $(".general_menu").addClass('active_button');
            $(".menu_container").fadeIn();
        }
        
    });


    //if a menu tab is clicked
    $(".menu_tab").click(function(){
        
        var clicked_id= $(this).attr('id');
        
        //remove and hide
        $('.active_tab').removeClass('active_tab');
        $(".menu_tabs_content").hide();
        
        //add and show
        $(this).addClass("active_tab");
        $("#"+clicked_id+"_content").show();

    });


});