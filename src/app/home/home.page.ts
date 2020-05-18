import { Component } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  percent: number = 0;
  radius: number = 100;

  fullTime: any = "00:01:30";
  timer: any = false;
  progress: any = 0;
  minutes: number = 1;
  seconds: any = 30;

  elapsed: any = {
    h: "00",
    m: "00",
    s: "00"
  };
  overallTimer: any = false;

  countDownTimer: any = false;
  timeLeft: any = {
    m: '00',
    s: '00'
  };
  remainingTime = `${this.timeLeft.m}:${this.timeLeft.s}`;

   

  startTime() {

    // Reiniciar cronómetro al dar click sobre el número
    if(this.timer) {
      clearInterval(this.timer);
      clearInterval(this.countDownTimer);
    }

    // Muestra el tiempo hasta que alcance el objetivo establecido
    if(!this.overallTimer) {
      this.progressTimer();
      this.insomnia.keepAwake(); // Evitar bloqueo de pantalla en dispositivos móviles
    }

    this.timer = false;
    this.percent = 0;
    this.progress = 0;

    // Obtiene el tiempo del ion-Datetime
    let timeSplit = this.fullTime.split(':');
    this.minutes = timeSplit[1];
    this.seconds = timeSplit[2];

    // Cálculo de segundos
    let totalSeconds = Math.floor(this.minutes * 60) + parseInt(this.seconds);
    let secondsLeft = totalSeconds;

    // Contador ascendente
    let forwardsTimer = () => {
      if (this.percent == this.radius) clearInterval(this.timer)
      this.percent = Math.floor((this.progress / totalSeconds) * 100)
      ++this.progress
    }

    // Contador descendente
    let backwardsTimer = () => {
      if (secondsLeft >= 0) {
        this.timeLeft.m = Math.floor(secondsLeft / 60)
        this.timeLeft.s = secondsLeft - (60 * this.timeLeft.m)
        this.remainingTime = `${this.pad(this.timeLeft.m, 2)}:${this.pad(this.timeLeft.s, 2)}`
        secondsLeft--;
      }
    }

    // Al hacer click sobre el círculoc o play se inician ambos contadores
    forwardsTimer();
    backwardsTimer();

    // Se actualizan cada segundo (1000ms)
    this.countDownTimer = setInterval(backwardsTimer, 1000);
    this.timer = setInterval(forwardsTimer, 1000);
  }

  progressTimer() {
    let countDownDate = new Date();

    this.overallTimer = setInterval(() => {
      let now = new Date().getTime();

      // Distancia entre now y la cuenta regresiva de la fecha
      let distance = now - countDownDate.getTime();

      // Cálculos sobre las horas, minutos y segundos
      this.elapsed.h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.elapsed.m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.elapsed.s = Math.floor((distance % (1000 * 60)) / 1000);
      
      this.elapsed.h = this.pad(this.elapsed.h, 2);
      this.elapsed.m = this.pad(this.elapsed.m, 2);
      this.elapsed.s = this.pad(this.elapsed.s, 2);
    }, 1000);
  }

  // función de apoyo para establecer las horas, minutos y segundos
  pad(num, size) {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  stopTime() {
    // Detiene y cancela contadores, regresando los valores a los predefinidos
    clearInterval(this.countDownTimer);
    clearInterval(this.timer);
    clearInterval(this.overallTimer);
    this.countDownTimer = false;
    this.overallTimer = false;
    this.timer = false;    
    this.percent = 0;
    this.progress = 0;

    // reinicia contadores
    this.elapsed = {
      h: '00',
      m: '00',
      s: '00'
    }
    this.timeLeft = {
      m: '00',
      s: '00'
    }

    this.remainingTime = `${this.pad(this.timeLeft.m, 2)}:${this.pad(this.timeLeft.s, 2)}`;
    this.insomnia.allowSleepAgain() // permite al dispositivo bloquearse cuando no hay cuenta en el cronómetro
  }

  constructor(private insomnia: Insomnia) {

  }

}
