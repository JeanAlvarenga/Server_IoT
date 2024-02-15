var ip = "http://192.168.0.106";

$(".box").each(function() {
	color = $(this).attr("color");
	icon = $(this).attr("icon");
	type = $(this).attr("type");
	
	$(this).find(".box-icon").css("color", color);
	$(this).find(".eff").css("background-color", color);
	$(this).addClass(type);
	$(this).find(".box-icon").addClass("fa").addClass("fa-"+icon);
	$(this).find(".btn-icon").addClass("fa").addClass("fa-"+icon);

	if(type == "sensor") {
		$.get(ip+"/sensor", function(data) {
			$(".box[type=sensor]").find(".btn-value").html((parseFloat(data).toFixed(1) + "ºC"));
		});
	}
});
$(".box").on("mouseover", function() {
	$(this).addClass("hover");
});
$(".box").on("mouseout", function() {
	$(this).removeClass("hover");
});

$(".box-label").on("click", function() {
	height = $(this).parent().find(".box-content").css("height");
	if($(this).parents(".box").hasClass("active")) {
		closeAll();
	} else {
		$(".box").removeClass("active");
		$(this).parents(".box").addClass("active");
		$(".box-load").css("height", "0");
		$(this).parents(".box").find(".box-load").css("height", height);
	}
});
$(".btn").on("click", function() {
	type = $(this).parents(".box").attr("type");
	color = $(this).parents(".box").attr("color");
	pin = $(this).attr("pin");
	pin2 = $(this).attr("pin2");
	if(type == "actuator") {
		if($(this).hasClass("on")) {
			$(this).removeClass("on");
			$(this).find(".btn-icon").css({
				"color": "#ddd",
				"text-shadow": "0 1px 1px #111",
			});
			$.get(ip+"/?pin="+pin+"&val=0");
			if(pin2) {
				setTimeout(function() {
					$.get(ip+"/?pin="+pin2+"&val=0");
				}, 1000);
			}
		} else {
			$(this).addClass("on");
			$(this).find(".btn-icon").css({
				"color": color,
				"text-shadow": "0 1px 1px #111, 0 0 5vw "+color,
			});
			$.get(ip+"/?pin="+pin+"&val=1");
			if(pin2) {
				setTimeout(function() {
					$.get(ip+"/?pin="+pin2+"&val=1");
				}, 1000);
			}
		}
	} else {
		$.get(ip+"/sensor", function(data) {
			$(".box[type=sensor]").find(".btn-value").html(parseFloat(data).toFixed(1) + "ºC");
		});
	}
});

function closeAll() {
	$(".box").removeClass("active");
	$(".box-load").css("height", 0);
}
$(window).resize(function() {
	closeAll();
});


