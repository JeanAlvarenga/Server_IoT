var ip = "http://192.168.2.108"; // IP do ESP8266
var a ,b = 0;

$(".box").each(function() {
	color = $(this).attr("color");
	icon = $(this).attr("icon");
	type = $(this).attr("type");
	
	$(this).find(".box-icon").css("color", color);
	$(this).find(".eff").css("background-color", color);
	$(this).addClass(type);
	$(this).find(".box-icon").addClass("fa").addClass("fa-"+icon);
	$(this).find(".btn-icon").addClass("fa").addClass("fa-"+icon);

	/* if(type == "sensor") {
		$.get(ip+"/sensor", function(data) {
			$(".box[type=sensor]").find(".btn-value").html((parseFloat(data).toFixed(1) + "ºC"));
		});
	} */

	if(type == "sensor") {
		$.get(ip+"/request", function(data) { // Data em formato JSON
			$(".box[type=sensor]").find(".btn-value").html((parseFloat(data.temperature).toFixed(1) + "ºC"));

			a = parseFloat(data.sala);
			b = parseFloat(data.quarto_1);

			if(a == 1) {
				//console.log("valor_b:", data.valor_b);
				$(".box[type=actuator]").find("#sala.btn-icon").css({
					"color": "#eaff3d",
					"text-shadow": "0 1px 1px #111, 0 0 5vw "+"#eaff3d",
				}); 
			}else{
				$(".box[type=actuator]").find("#sala.btn-icon").css({
					"color": "#ddd",
					"text-shadow": "0 1px 1px #111",
				});
			}

			if(b == 1) {
				$(".box[type=actuator]").find("#quarto_1.btn-icon").css({
					"color": "#eaff3d",
					"text-shadow": "0 1px 1px #111, 0 0 5vw "+"#eaff3d",
				});
			}else{
				$(".box[type=actuator]").find("#quarto_1.btn-icon").css({
					"color": "#ddd",
					"text-shadow": "0 1px 1px #111",
				});
			}

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
		} else { // Liga o atuador e atualiza a interface
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
	} else { // Atualiza o valor do sensor
		$.get(ip+"/sensor", function(data) {
			$(".box[type=sensor]").find(".btn-value").html(parseFloat(data).toFixed(1) + "ºC");
		});
	}
});

// Define a função 'closeAll' para fechar todas as caixas.
function closeAll() {
	$(".box").removeClass("active");
	$(".box-load").css("height", 0);
}

// Fecha todas as caixas ao redimensionar a janela.
$(window).resize(function() {
	closeAll();
});