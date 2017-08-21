var DiamondSound = function () {
  this.tone = new Tone();


  //this.pitchCollection = [55, 57, 59, 61, 62, 64, 66, 67, 68, 69, 71, 73, 75, 76, 78, 80, 82, 83];
  this.pitchCollection = [56, 58, 60, 62, 63, 65, 67, 68, 69, 70, 72, 74, 76, 77, 79, 81, 83, 84];

  this.pitch = this.pitchCollection[Math.floor(Math.random() * (this.pitchCollection.length))];

  this.chord = [68, 71, 75];
  this.chordRange = {low: -12, high: 12};
  this.chordLength = '1m';

	this.gainMaster = new Tone.Volume().toMaster();

  this.tremolo = new Tone.Tremolo({
    "frequency":8,
    "type":"sine",
    "depth":0.6,
    "spread":0
    //"wet": 0.8
  }).connect(this.gainMaster).start();

  //this.synth = new Tone.Synth({
  //  "oscillator" : {
  //    "type" : "sine"
  // },
  // "envelope" : {
  //  "attack" : 2.0,
  //  "decay" : 0.5,
  //  "sustain" : 0.8,
  //  "release" : 2.0
  // }
  //}).connect(this.tremolo);
	
  this.chordSynth = new Tone.PolySynth(4, Tone.DuoSynth).connect(this.tremolo);
	this.chordVolume = -30;
  this.chordSynth.set("volume", this.chordVolume);
	this.chordSynth.set('vibratoAmount', 0.5);
	this.chordSynth.set('vibratoRate', 5);
	this.chordSynth.set('harmonicity', 1.5);
// chordSynth.set("detune", -1200);


	// Create a new Tune object
  this.tune = new Tune();
  // Load a 12 tone just intonation scale
  this.tune.loadScale('ji_12');
  // Set the output mode to 'MIDI' 
  this.tune.mode.output = 'MIDI';
  this.tune.key = 69;
  this.samp = new Tone.Sampler("data/c4.mp3");
	this.samp.volume.value = -6;
  this.samp.toMaster();


	this.readingRatio = 0.4;		// limiting the number of times you read the current text.


		// Audio File Players *******
				// PreLoad for immediate triggering
  this.playerUtopalypse = new Tone.Player("data/Utopalypse.mp3").connect(this.gainMaster);
  this.playerDiamonds = new Tone.Player("data/diamonds_in_distopia.mp3").connect(this.gainMaster);
  this.playerKepler = new Tone.Player("data/Kepler_Star.mp3").connect(this.gainMaster);
  	this.playerKepler.retrigger = 1;
  this.playerEnding = new Tone.Player("data/Ending_for_a_minute.mp3").connect(this.gainMaster);
				// Dynamically loaded readings
	this.playerReading = new Tone.Player({url: "data/DiD-reading/0.mp3", "autostart" : true}).connect(this.gainMaster);
		this.playerReading.volume.value = -6;

		// Switch to buffers...
//		var pianoSamples = new Tone.Buffers({
//			"C4" : "path/to/C4.mp3"
//			"C#4" : "path/to/C#4.mp3"
//			"D4" : "path/to/D4.mp3"
//			"D#4" : "path/to/D#4.mp3"
//			...
//		}, function(){
//			//play one of the samples when they all load
//			player.buffer = pianoSamples.get("C4");
//			player.start();
//		});

  //this.gainy = new Tone.Gain().connect(this.gainMaster);
  // this.filt2 = new Tone.Filter(nxMusic.mton(this.pitch+12), "bandpass").connect(this.gainy);
//  this.filt = new Tone.Filter(Tone.Frequency(this.pitch+12,'midi').toNote(), "bandpass").connect(this.gainMaster);
	this.filt = new Tone.Filter(nxMusic.mtof(this.pitch+12), "bandpass").connect(this.gainMaster);
  this.filt.Q.value = 15;
  this.filt.gain.value = 50;
  // this.filt2.Q.value = 2;
  // this.filt2.gain.value = 40;
  // this.ns = new Tone.Noise('pink').connect(this.filt);
  //this.gainy.gain.value = 10.;

  //this.synth.triggerAttackRelease("C4", "8n",{} , 0.25);

  meSpeak.setAudioContext(this.tone.context);
  meSpeak.speakToNode(this.filt);
  // if (meSpeak.isConfigLoaded() && meSpeak.isVoiceLoaded(speakVoice)) {
  // meSpeak.speak('Diamonds');
  // }


		// Anything that needs to be done after the buffers have loaded...
	Tone.Buffer.on('load', function(){
    //document.getElementById('loading').style.display = 'none';
		console.log("All Audio Buffers Loaded ********");
	});
	
	// <div id="loading">
  //   Loading Samples...
  // </div>

}




DiamondSound.prototype.audienceEnable = function(enabled) {
		console.log('enabled? ', enabled);
	if(enabled) {
		// this.gainMaster.volume.mute = false;
		this.gainMaster.volume.value = 0.;
		this.chordSynth.set("volume", this.chordVolume);
	} else {
		// this.gainMaster.volume.mute = true;
		this.gainMaster.volume.value = -96;
		this.chordSynth.set("volume", -96);
	}
}



DiamondSound.prototype.phrygian = function(midi) {
	return teoria.note.fromMIDI(midi);
}




// ********* Sampler playing ********

		// dSound.sampPlay(60) || dSound.sampPlay(0,440.)
DiamondSound.prototype.sampPlay = function(midi) {
	// console.log("freq: ", freq);
	// if (freq==null) {
	// 	freq = nxMusic.mtof(note);
	// }
	// console.log("post check freq: ", freq);
	// var midi = this.tune.key + 12*Math.log(freq/440)/Math.log(2)
	
	
	console.log("midi: ", midi);
	this.samp.triggerAttack();

	// Detune each piano sample 
	this.samp.pitch = this.tune.note(midi-this.tune.scale.length)-this.tune.key; 
	console.log("pitch: ", this.samp.pitch);
}



		// ********* Synthesis playing ********

DiamondSound.prototype.playPitch = function () {
  //this.synth.triggerAttackRelease(nxMusic.mton(this.pitch+12), 5);
};

DiamondSound.prototype.triggerPitch = function () {
  //this.synth.triggerAttackRelease(nxMusic.mton(this.pitch+12), 5);
  // socket.emit('triggerPitch', dSound.pitch);
};

DiamondSound.prototype.playChord = function (chordNotes, chordLength) {
  if(chordNotes) {
    this.chord = chordNotes;
  };
  if (chordLength) {
    this.chordLength = chordLength;
  }

  this.chordSynth.triggerAttackRelease(this.chord.map(nxMusic.mton), this.chordLength);
};

DiamondSound.prototype.sustainChord = function (chordNotes, chordLength) {
  if(chordNotes) {
    this.chord = chordNotes;
  };
  if (chordLength) {
    this.chordLength = chordLength;
  } else {
		chordLength = '8m';
	}
  this.chordSynth.triggerAttackRelease(this.chord, this.chordLength);
};

DiamondSound.prototype.setChordRange = function () {

};

DiamondSound.prototype.setChord = function () {

};

DiamondSound.prototype.playChordSplit = function () {

};

DiamondSound.prototype.playChordDiads = function () {

};







DiamondSound.prototype.playUtopalypse = function() {
  this.playerKepler.start();
  this.playerUtopalypse.start("+2");
  this.playerKepler.start("+4");
};

DiamondSound.prototype.playDiamonds = function() {
  this.playerDiamonds.start();
};

DiamondSound.prototype.playKepler = function() {
  this.playerKepler.start();
};

DiamondSound.prototype.playEnding = function() {
  this.playerEnding.start();
};


DiamondSound.prototype.triggerDiamonds = function() {
  // this.synth.triggerAttackRelease(nxMusic.mton(this.pitch+12), 5);
	this.chordSynth.triggerAttackRelease(nxMusic.mton(this.pitch+12), '4m');
  this.playerDiamonds.start();
};


// ************** Reading from Files  *****************

DiamondSound.prototype.readText = function (num) {
	if(readingTexts.hasOwnProperty(num)){
		this.playerReading.load("data/DiD-reading/" + num + ".mp3");
		return readingTexts[num];
	}
}



// ************** Speaking with meSpeak  *****************

DiamondSound.prototype.speak = function(text) {
  this.pitch = this.pitchCollection[Math.floor(Math.random() * (this.pitchCollection.length))];
  var freq = nxMusic.mton(this.pitch+12);
  this.filt.frequency.value = (freq);
  //this.filt2.frequency.value = (freq);
  var rate = Math.floor(Math.random() * (12.)+ 4.);
  this.tremolo.frequency.value = rate;

      // check for safety - iOS will fail if you try to say something and can't
  if (meSpeak.isConfigLoaded() && meSpeak.isVoiceLoaded(speakVoice)) {
    meSpeak.speak(text);
  }
  //this.synth.triggerAttackRelease(freq, "4n",'+0' , 0.15);
	this.chordSynth.triggerAttackRelease(freq, '2n');
};
