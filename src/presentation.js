(function($) {
	
	var $this = null;
	var options = {};
	var slideWindowImg = null;
	var slideWindowText = null;
	var full_images = null;
	var prev_images = null;
	var text_slides = null;
	var previewBar = null;
	var currentslide = 0;
	var numslides = 0;
	var barWidth = 0;
	var fullscreen = false;
	
	$.fn.presentation = function (inopt) {
		$this = $(this);
		var defaultOpt = {"ul_images" : ".slide_images",
				"ul_preview" : ".slide_preview",
				"ul_text" : ".slide_text"};
		options = $.extend(defaultOpt, inopt);
		$(options.ul_images).hide();
		$(options.ul_preview).hide();
		$(options.ul_text).hide();
		full_images = $(options.ul_images + '>li>img');
		prev_images = $(options.ul_preview + '>li>img');
		text_slides = $(options.ul_text + '>li');
		numslides = full_images.length;
		$.fn.addShowTextWin();
		$.fn.addShowSlideWin();
		$.fn.addControlButtons();
		$.fn.addPreviewBar();
		$.fn.showSlide(currentslide);
		/* нажатие кнопки назад */
		$this.on('click', '.buttonback', function() {
			if ($(this).hasClass("inactive")) {} 
			else {
				$.fn.prevSlide();
			}
		});
		/* нажатие кнопки вперед */
		$this.on('click', '.nextslides', function() {
			$.fn.nextSlide();
		});
		/* ручной ввод номера слайда */
		$this.find('.numslides>input').on('change', function() {
			numSlide = $(this).val() - 1;
			if (numSlide >= 0 && numSlide < numslides) {
				currentslide = numSlide;
			} else {
				if (numSlide < 0) {
					currentslide = 0;
				}
				if (numSlide > numslides - 1) {
					currentslide = numslides - 1;
				}
			}
			$.fn.showSlide(currentslide);
		});
		/* переключение слайда по клику на картинку */
		$this.on('click', '.imagepreview', function() {
			currentslide = parseInt($(this).attr('num-slide'));
			$.fn.showSlide(currentslide);
		});
		/* корректировка высоты текстового блока */
		$(window).resize(function() {
			$.fn.correctTextBox();
		});
		/* нажатие на кнопку открыть во весь экран */
		$this.on('click', '.modeautoslides', function() {
			$.fn.showFullscreen();
			return false;
		});
		/* выход из полноэкранного режима */
		$('body').on('click', '.fullscreenexit', function() {
			$.fn.exitFullscreen();
			return false;
		});
		/* переключение слайда по кнопке вправо */
		$("body").keydown(function(e) {
			var code = e.keyCode || e.which;
			switch (code)
			{
			   case 37: // prev
				   $.fn.prevSlide();
				   break;
			   case 39: // next
				   $.fn.nextSlide();
				   break;
			   case 32: // next
				   $.fn.nextSlide();
				   break;
			   case 27: // exitfsc
				   $.fn.exitFullscreen();
				   break;
			   case 70: // showfsc
				   $.fn.showFullscreen();
				   break;
			}
		});
		
		$(document).bind('fscreenchange', function(e, state, elem) {
			// if we currently in fullscreen mode
			if ($.fullscreen.isFullScreen()) {
				$this.addClass('fullscreenmode');
				fullscreen = true;
			} else {
				$this.removeClass('fullscreenmode');
                            $.fn.exitFullscreen();
				$this.find('.showslidetext').css('bottom', 'auto');
				fullscreen = false;
			}
			$('#state').text($.fullscreen.isFullScreen() ? '' : 'not');
		});
		$('.showslide img').load(function() {
			$.fn.correctTextBox();
			$('.textblock .mCSB_container').css('top', '0px');
		});
		$this.append('<div class="fspheader"><a class="logo"></a><div class="fullscreenexit">Выйти из режима презентации</div><span class="rightelem"></span></div>');
		/* показать/скрыть аннотацию в полноэкранном режиме */
		$this.on('click', '.showhideanon', function() {
			var textBlock = $(this).parent(); 
			if ($(this).hasClass('close')) {
				$(this).removeClass('close').addClass('open');
				$(this).text('СКРЫТЬ АННОТАЦИЮ');
				textBlock.animate({'bottom': '0px'});
			} else {
				$(this).removeClass('open').addClass('close');
				$(this).text('ПОКАЗАТЬ АННОТАЦИЮ');
				textBlock.animate({'bottom': (- $this.find('.showslidetext .mCSB_container').height() - 15) + 'px'});
			}
		});
		$this.on('click', '.prevslidefsm', function() {
			$.fn.prevSlide();
		});
		$this.on('click', '.nextslidefsm', function() {
			$.fn.nextSlide();
		});
	};
	
	$.fn.correctTextBox = function() {
		var elemheight;
		if (fullscreen) {
			elemheight = $this.find('.mCSB_container').height() + 30;
			$this.find('.showslidetext').has('.showhideanon.close').css('bottom', (- elemheight + 15) + 'px');
			$this.find('.showslidetext').has('.showhideanon.open').css('bottom', '0px');
		} else {
			$this.find('.showslidetext').css({'bottom' : 'auto'});
			elemheight = $('.showslide').height() - 60;
		}
		$this.find('.showslidetext').css('height', elemheight + 'px');
	};

	$.fn.prevSlide = function() {
		if (currentslide > 0) {
			currentslide -= 1;
			$this.height($this.height());
			$.fn.showSlide(currentslide);
		}
	};
	
	$.fn.nextSlide = function() {
		if (currentslide < numslides - 1) {
			currentslide += 1;
			$this.height($this.height());
			$.fn.showSlide(currentslide);
		}
		
	};
	
	$.fn.addShowSlideWin = function() {
		$this.append('<div class="showslide"><div class="prevslidefsm"></div><div class="nextslidefsm"></div><div class="imageblock"></div><span class="fsnumslide"></span></div>');
		slideWindowImg = $this.find(".showslide>.imageblock");
	};
	
	$.fn.addShowTextWin = function() {
		$this.append('<div class="showslidetext"><div class="textblock"></div></div>');
		slideWindowText = $this.find(".showslidetext>.textblock");
	};
	
	$.fn.addControlButtons = function() {
		$this.find(".showslidetext").append('<div class="controlbuttons">' + 
				'<div class="modeautoslides">Режим презентации</div>' + 
				'<div class="controlbutton buttonback">Назад</div>' + 
				'<div class="numslides"><input type="text" /></div>' + 
				'<div class="controlbutton nextslides">Далее</div></div>' + 
				'<span class="showhideanon close">ПОКАЗАТЬ АННОТАЦИЮ</div>');
	};
	
	$.fn.addPreviewBar = function() {
		$this.append('<div class="previewbar"><div class="previewbarimage"></div></div>');
		previewBar = $this.find('.previewbar .previewbarimage');
		prev_images.each(function() {
			previewBar.append(this);
		});
		previewBar.find('img').each(function(i) {
			$(this).wrap('<div class="imagepreview" num-slide="' + i + '"></div>');
			
		});
		previewBar.find('.imagepreview:last-child>img').on('load', 
			function() {
				var imgwidth = parseInt(this.width);
				previewBar.css('width',  ((imgwidth + 12) * numslides) + 5);
				$this.find('.previewbar').mCustomScrollbar({
					horizontalScroll:true,
					callbacks:{
						whileScrolling:function(){ WhileScrolling(); }
					}
				});
				$this.find('.previewbar .previewbarimage .imagepreview').each(function(i) {
					$(this).append('<span class="slidenumber" style="left:' + ((imgwidth + 12) * (i + 1) - 25) + 'px">' + ( i + 1) + '</span>');
				});
				$this.find('.previewbar .mCustomScrollBox ').append('<div class="leftback"></div><div class="rightback"></div>');
			}
		);
	};
	
	function WhileScrolling(){
		var fullWidth = $this.find('.previewbarimage').width();
		var leftShadow = $this.find('.previewbar .mCustomScrollBox .leftback');
		var rightShadow = $this.find('.previewbar .mCustomScrollBox .rightback');
		var mscleft = mcs.left;
		if (mscleft < -110) {
			mscleft = -110;
		};
		leftShadow.css('left', -110 - mscleft + 'px');
		
		var diff = - mcs.left + $this.width() - fullWidth;
		if (diff < -110) {
			rightShadow.css('right', '0px');
		} else {
			rightShadow.css('right', -110 - diff + 'px');
		}
		return true;
	};
	
	$.fn.showSlide = function(shownumslide) {
		slideWindowImg.fadeOut("fast");
		slideWindowImg.empty();
		$(full_images[shownumslide]).appendTo(slideWindowImg);
		slideWindowImg.fadeIn("fast");
		slideWindowText.fadeOut("fast");
		slideWindowText.html($(text_slides[shownumslide]).html());
		slideWindowText.fadeIn("fast");
		$('.controlbuttons .numslides>input').val(shownumslide + 1);
		if (shownumslide == 0) {
			$('.controlbuttons .buttonback').addClass('inactive');
		} else {
			$('.controlbuttons .buttonback').removeClass('inactive');
		}
		if (shownumslide == numslides - 1) {
			$('.controlbuttons .nextslides').addClass('inactive');
		} else {
			$('.controlbuttons .nextslides').removeClass('inactive');
		}
		$this.height('auto');
		previewImages = $this.find('.previewbar .imagepreview>img');
		previewImages.removeClass('active');
		previewImages.eq(shownumslide).addClass('active');
		$this.find('.textblock').mCustomScrollbar({});
		$.fn.correctTextBox();
		if (fullscreen) {
			$this.find('.textblock').mCustomScrollbar("scrollTo","bottom");
			$this.find ('.showslide .fsnumslide').html(shownumslide + 1);
		}
		return false;
	};
	
	$.fn.exitFullscreen = function() {
		fullscreen = false;
		$('body .header').show();
		$('.content .menu').show();
		$.fullscreen.exit();
		$.fn.correctTextBox();
		return false;
	};
	
	$.fn.showFullscreen = function() {
		fullscreen = true;
		$this.fullscreen();
		$this.addClass('fullscreenmode');
		$('body .header').hide();
		$('.content .menu').hide();
		$.fn.correctTextBox();
		$this.find ('.showslide .fsnumslide').html(currentslide + 1);
		return false;
	};

})(jQuery);
