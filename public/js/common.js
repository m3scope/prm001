$(document).ready(function() {

  	$('.otchety .table, .komissii .table').mCustomScrollbar({
    	theme:"my-theme",
    	axis:"x",
    	autoDraggerLength:false,
    	scrollbarPosition:"outside",
	});





	$(".orders_on_buy_full .table tbody, .orders_on_buy_and_sell .inner .table tbody").prepend('<tr><td>Top</td></tr>')
	function widthHeadTable(){
  		var tdBody = $('.orders_on_buy_full .table tbody tr:eq(1) td, .orders_on_sell .table tbody tr:eq(1) td, .orders_on_buy .table tbody tr:eq(1) td');
  		var tdHead = $('.orders_on_buy_full .table thead tr td, .orders_on_sell .table thead tr td, .orders_on_buy .table thead tr td');
  		tdBody.each(function(i,elem) {
  			if (tdHead.eq(i).width()>$('.min-width',elem).width()){
  				$('.min-width',elem).width(tdHead.eq(i).width());
  				tdHead.eq(i).width(tdHead.eq(i).width());
  			}else{
  				tdHead.eq(i).width($(elem).width());
  			}
		});
  	}
  	$(window).resize(function(){
  		widthHeadTable();
	});
  	widthHeadTable();

	$('.orders_on_buy_full .table, .orders_on_buy_and_sell .inner .table').mCustomScrollbar({
    	theme:"my-theme",
    	axis:"xy",
    	autoDraggerLength:false,
    	scrollbarPosition:"outside",
    	callbacks: {    // callback for thead,tbody scroll
			whileScrolling: function() {
						$("thead", this).css('top', -this.mcs.top);
					},
			},
    	
	});


	$('.prizmex .inner').mCustomScrollbar({
    	theme:"my-theme",
    	autoDraggerLength:false
	});

	$('.deposite .input-btn').click(function(e){
		e.preventDefault();
		$('.input-form').show();
		$('.output-form').hide();
		$('.output-btn, .input-btn').removeClass('active');
		$(this).addClass('active');
	});
	$('.deposite .output-btn').click(function(e){
		e.preventDefault();
		$('.input-form').hide();
		$('.output-form').show();
		$('.output-btn, .input-btn').removeClass('active');
		$(this).addClass('active');
	});

	$('.parovoz .checkbox input').click(function(){
		var parovoz = $('.parovoz .checkbox #check').prop('checked');
		if (typeof parovoz !== typeof undefined && parovoz !== false) {
			$('.parovoz').removeClass('disabled');
		}else{
			$('.parovoz').addClass('disabled');
		}
	});





  	$('#signup, #repassbtn').click(function(e){
  		e.preventDefault();
  		$('.signup, .repass').hide();
  		$('.in_acc').show();
  	});

  	$('#repass').click(function(e) {
        e.preventDefault();
        $('.in_acc').hide();
        $('.signup').hide();
        $('.repass').show();
    });
    $('#signupform, #logout').click(function(e) {
        e.preventDefault();
        $('.in_acc').hide();
        $('.repass').hide();
        $('.signup').show();
    });
});