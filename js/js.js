function start() { // Inicio da função start()
              
	$("#inicio").delay().hide(150);

	$("#frontLayer").append("<div id='jogador'><img src='images/spaceship-unit.gif'></div>");
	$("#frontLayer").append("<div id='inimigo1'><img src='images/evil_ship.gif'></div>");
	$("#frontLayer").append("<div id='inimigo2'><img src='images/tank-unit.gif'></div>");
	$("#frontLayer").append("<div id='amigo'><img src='images/space-marine-run.gif'></div>");
	$("main").append("<div id='placar'></div>");

	//Principais variáveis do jogo
		
	var jogo = {}
	var fimdejogo=false;
	var pause = false;
	var pontos=0;
	var salvos=0;
	var perdidos=0;
	var energiaAtual=3;
	var velocidade=5;
	var posicaoY = parseInt(Math.random() * ($(window).height() / 2));
	var podeAtirar=true;
	// var podePausar = true;
	var TECLA = {
		W: 87,
		S: 83,
		// ESC: 27,
		SPACE: 32
		}
	jogo.pressionou = [];

	var somDisparo=document.getElementById("somDisparo");
	var somExplosao=document.getElementById("somExplosao");
	var musica=document.getElementById("musica");
	var somGameover=document.getElementById("somGameover");
	var somPerdido=document.getElementById("somPerdido");
	var somResgate=document.getElementById("somResgate");

	//Música em loop
	musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
	musica.play();

	//Verifica se o usuário pressionou alguma tecla	
	
	$(document).keydown(function(e){
	jogo.pressionou[e.which] = true;
	});

	$(document).keyup(function(e){
	jogo.pressionou[e.which] = false;
	});

	//Game Loop

	jogo.timer = setInterval(function(){
		loop(),
		input()
	},30);

	function input() {
		if (jogo.pressionou[TECLA.W]) {
			var topo = parseInt($("#jogador").css("top"));
			if (topo > 0) {
				$("#jogador").css("top",topo-10);
			}
		}
		
		if (jogo.pressionou[TECLA.S]) {
			var topo = parseInt($("#jogador").css("top"));
			if (topo < ($(window).height() - $("#jogador").height())) {	
				$("#jogador").css("top",topo+10);	
			}
		}
		
		if (jogo.pressionou[TECLA.SPACE]) {
			disparo();
		}
	
		// if (jogo.pressionou[TECLA.ESC]) {
		// 	if (podePausar == true) {
		// 		podePausar = false;
		// 		pause = !pause;
		// 		window.setInterval(delayEnd, 2000);
		// 		//chamar div de pausa!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// 	}

		// 	function delayEnd() {
		// 		podePausar = true;
		// 	}
			
		// 	console.log(pause)
		// }
	} // fim da função movejogador()

	function loop() {

		if (!pause) {
			movefundo();
			moveamigo();
			moveinimigo1();
			moveinimigo2();
			colisao();
			energia();
		}
	} // Fim da função loop()

	//Função que movimenta o fundo do jogo
	function movefundo() {
	
		esquerda = parseInt($("#frontLayer").css("background-position"));
		$("#frontLayer").css("background-position",esquerda-3);

		esquerda = parseInt($("#middleLayer").css("background-position"));
		$("#middleLayer").css("background-position",esquerda-2);

		esquerda = parseInt($("#farLayer").css("background-position"));
		$("#farLayer").css("background-position",esquerda-1);
		
		} // fim da função movefundo()

	function moveinimigo1() {

		posicaoX = parseInt($("#inimigo1").css("left"));
		$("#inimigo1").css("left",posicaoX-velocidade);
		$("#inimigo1").css("top",posicaoY);
			
		if (posicaoX < -658) {
			posicaoY = parseInt(Math.random() * ($(window).height() / 2));
			$("#inimigo1").css("left", $(window).width());
			$("#inimigo1").css("top",posicaoY);
		}
	} //Fim da função moveinimigo1()
	
	function moveinimigo2() {

		posicaoX = parseInt($("#inimigo2").css("left"));
		$("#inimigo2").css("left",posicaoX-4);	

		if (posicaoX < -165) {
			$("#inimigo2").css("left", $(window).width());		
		}
	} // Fim da função moveinimigo2()

	function moveamigo() {

		posicaoX = parseInt($("#amigo").css("left"));
		$("#amigo").css("left",posicaoX+1);	

		if (posicaoX >= $(window).width()) {
			$("#amigo").css("left", 0);		
		}
	} // fim da função moveamigo()

	function disparo() {
	
		if (podeAtirar == true) {
			
			somDisparo.play();
			podeAtirar = false; 
			
			tiroX = parseInt($("#jogador").css("left")) + parseInt($("#jogador").css("width"));
			topoTiro = parseInt($("#jogador").css("top")) + (parseInt($("#jogador").css("width")) / 2.5);
			$("#frontLayer").append("<div id='disparo'></div>");
			$("#disparo").css("top",topoTiro);
			$("#disparo").css("left",tiroX);
			console.log(tiroX, topoTiro, $("#jogador").css("left"), $("#jogador").css("top"))
			
			var tempoDisparo = window.setInterval(executaDisparo, 30);
		
		} //Fecha podeAtirar
	 
		function executaDisparo() {

			posicaoX = parseInt($("#disparo").css("left"));
			$("#disparo").css("left", posicaoX + 50); 

			if (posicaoX >= $(window).width()) {
						
				window.clearInterval(tempoDisparo);
				tempoDisparo = null;
				$("#disparo").remove();
				podeAtirar = true;
			}
		} // Fecha executaDisparo()
	} // Fecha disparo()

	function colisao() {

		var colisao1 = ($("#jogador").collision($("#inimigo1")));
		var colisao2 = ($("#jogador").collision($("#inimigo2")));
		var colisao3 = ($("#disparo").collision($("#inimigo1")));
		var colisao4 = ($("#disparo").collision($("#inimigo2")));
		var colisao5 = ($("#jogador").collision($("#amigo")));
		var colisao6 = ($("#inimigo2").collision($("#amigo")));

		// jogador com o inimigo1
		if (colisao1.length>0) {
			
			energiaAtual--;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			explosao(inimigo1X,inimigo1Y);
		
			posicaoY = parseInt(Math.random() * ($(window).height() / 2));
			$("#inimigo1").css("left", $(window).width());
			$("#inimigo1").css("top", posicaoY);
		}
		
		// jogador com o inimigo2 
		if (colisao2.length>0) {
			
			energiaAtual--;
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			explosao2(inimigo2X,inimigo2Y);
					
			$("#inimigo2").remove();
				
			reposicionaInimigo2();
		}

		// Disparo com o inimigo1
		if (colisao3.length>0) {
				
			velocidade = velocidade + 0.3;
			pontos=pontos+100;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
				
			explosao(inimigo1X,inimigo1Y);
			$("#disparo").css("left", $(window).width());
				
			posicaoY = parseInt(Math.random() * ($(window).height() / 2));
			$("#inimigo1").css("left", $(window).width() + 400);
			$("#inimigo1").css("top",posicaoY);
		}

		// Disparo com o inimigo2	
		if (colisao4.length>0) {
				
			pontos=pontos+50;
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));

			$("#inimigo2").remove();

			explosao2(inimigo2X,inimigo2Y);
			$("#disparo").css("left", $(window).width());
			
			reposicionaInimigo2();
		}

		// jogador com o amigo
		if (colisao5.length>0) {
				
			salvos++;
			somResgate.play();
			$("#amigo").remove();
			reposicionaAmigo();
		}

		//Inimigo2 com o amigo	
		if (colisao6.length > 0) {
				
			perdidos++;
			amigoX = parseInt($("#amigo").css("left")) / 1.8;
			amigoY = parseInt($("#amigo").css("top"));
			$("#amigo").remove();
			explosao3(amigoX,amigoY);
		}
	} //Fim da função colisao()

	//Explosão 1
	function explosao(inimigo1X,inimigo1Y) {

		$("#frontLayer").append("<div id='explosao1'></div>");
		somExplosao.play();
		var div = $("#explosao1");

		div.css("top", inimigo1Y);
		div.css("left", inimigo1X);
		div.css("background-image", "url(images/explosion.gif)");
		
		var tempoExplosao=window.setInterval(removeExplosao, 600);
		
		function removeExplosao() {
			
			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao = null;
		}
	} // Fim da função explosao()

	//Explosão2
	function explosao2(inimigo2X,inimigo2Y) {
	
		$("#frontLayer").append("<div id='explosao2'></div>");
		somExplosao.play();
		var div2=$("#explosao2");
		div2.css("top", inimigo2Y);
		div2.css("left", inimigo2X);
		div2.css("background-image", "url(images/explosion.gif)");
		
		var tempoExplosao2 = window.setInterval(removeExplosao2, 600);
		
		function removeExplosao2() {
			
			div2.remove();
			window.clearInterval(tempoExplosao2);
			tempoExplosao2=null;
		}
	} // Fim da função explosao2()

	//Explosão3
	function explosao3(amigoX,amigoY) {

		$("#frontLayer").append("<div id='amigoDie'><img src='images/space-marine-die.gif'></div>");
		$("#amigoDie").css("top", amigoY);
		$("#amigoDie").css("left", amigoX);
		somPerdido.play();

		var tempoExplosao3=window.setInterval(resetaExplosao3, 500);

		function resetaExplosao3() {
			$("#amigoDie").remove();
			reposicionaAmigo();	
			window.clearInterval(tempoExplosao3);
			tempoExplosao3=null;
					
		}
		
	} // Fim da função explosao3

	//Barra de energia
	function energia() {

		$("#placar").html("<h2> Score: " + pontos + 
								" <img src='images/happyFace.png'/>: " + salvos + 
								" <img src='images/sadFace.png'/>: " + perdidos + 
								" <img src='images/repairLevel.png'/>: " + energiaAtual + "</h2>");

		if (energiaAtual==1) {
			
			$("#jogador img").css("content", "url(images/spaceshipDamage.gif)");
		}

		if (energiaAtual==0) {
			
			//Game Over
			gameOver();
		}

	} // Fim da função energia()

	//Reposiciona Amigo
	function reposicionaAmigo() {
		
		var tempoAmigo = window.setInterval(reposiciona6, 6000);
		
		function reposiciona6() {

			window.clearInterval(tempoAmigo);
			tempoAmigo = null;
			
			if (fimdejogo == false) {
			
				$("#frontLayer").append("<div id='amigo'><img src='images/space-marine-run.gif'></div>");
			}
		}
	} // Fim da função reposicionaAmigo()

	//Reposiciona Inimigo2
	function reposicionaInimigo2() {
	
		var tempoColisao4=window.setInterval(reposiciona4, 5000);
			
		function reposiciona4() {
			window.clearInterval(tempoColisao4);
			tempoColisao4=null;
				
			if (fimdejogo==false) {
			
				$("#frontLayer").append("<div id='inimigo2'><img src='images/tank-unit.gif'></div>");
			}
		}	
	}	

	//Função GAME OVER
	function gameOver() {
		fimdejogo=true;
		musica.pause();
		somGameover.play();
		
		window.clearInterval(jogo.timer);
		jogo.timer=null;
		
		$("#jogador").remove();
		$("#inimigo1").remove();
		$("#inimigo2").remove();
		$("#amigo").remove();
		$("#fim").remove();
		
		$("#frontLayer").append("<div id='fim'></div>");
		
		$("#fim").html("<h1> Game Over </h1><p>Score: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Retry / Repetir</h3></div>");
	} // Fim da função gameOver();
} // Fim da função start

//Reinicia o Jogo
		
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").delay().hide(150);
	start();
	
} //Fim da função reiniciaJogo