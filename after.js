'use strict';

function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play();
    key.classList.add('playing');
    // key.classList.remove('playing');
    // key.classList.toggle('playing');
    console.log(key);
}

function removeTransition(e) {
    if (e.propertyName !== 'transform') return;
    // console.log(e.propertyName);
    this.classList.remove('playing');
}

const keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend', removeTransition));

window.addEventListener('keydown', playSound);
//recorderjs

window.onload = function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    var recorder;

    // var d = document.getElementById('d');
    // for (var i = 0; i < 256; i++) {
    //     d.innerHTML += '<div></div>';
    // }
    // var dd = document.querySelectorAll('#d div');

    var play = document.getElementById('play');
    var pause = document.getElementById('pause');
    var timer;
    var context = new AudioContext();

    navigator.getUserMedia({
        audio: true
    }, function(stream) {
        var microphone = context.createMediaStreamSource(stream);
        var analyser = context.createAnalyser();
        microphone.connect(analyser);

        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(analyser.fftSize);
        analyser.getByteFrequencyData(dataArray);

        play.onclick = function() {
            recorder = new Recorder(microphone);
            recorder.record();
            play.disabled = true;
            pause.disabled = false;
            update();
        };

        pause.onclick = function() {
            clearTimeout(timer);
            play.disabled = false;
            pause.disabled = true;
            recorder.stop();
            createDownloadLink();
            recorder.clear();
        };

        function update() {
            console.log(dataArray);
            analyser.getByteFrequencyData(dataArray);
            // for (var j = 0; j < 256; j++) {
            //     dd[j].style.hieght = dataArray[j] + 'px';
            //     dd[j].style.background = 'rgba(' + (255 - j) + ',' + j * 2 + ',0,1)';
            // }
            timer = setTimeout(update, 20);
        }

        function createDownloadLink() {
            recorder.exportWAV(function(blob) {
                var url = URL.createObjectURL(blob);
                var li = document.createElement('li');
                var audio = document.createElement('audio');
                var href = document.createElement('a');

                audio.controls = true;
                audio.src = url;
                href.href = url;
                href.download = new Date().toISOString() + '.wav';
                href.innerHTML = href.download;
                li.appendChild(audio);
                li.appendChild(href);
                recordingslist.appendChild(li);
            });
        }
    }, function() {
        console.log('error');
    });
};