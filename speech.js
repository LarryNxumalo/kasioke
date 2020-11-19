var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrases = [
    'sinazo',
    'a',
    'b',
    'c',
    'd',
//   'Makaveli in this Killuminati',
//   'all through your body',
//   'That blows like a 12-gauge shotty',
//   'feel me!',
//   'And God said he should send his one begotten son',
//   'To lead the wild into the ways of the man',
//   'Follow me!',
//   'Eat my flesh, flesh of my flesh!',
//   'Come with me!',
//   'Hail Mary, nigga, run quick, see',
//   'What do we have here now?',
//   'Do you wanna ride or die?',
//   'La la la la la la la la',
];

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('.logo');

function randomPhrase() {
  var number = Math.floor(Math.random() * phrases.length);
  return number;
}

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Listening';
  testBtn.style.color = "#fff";
  testBtn.style.animation = "glitched2 6s infinite alternate";
  testBtn.style.background = "rgba(255, 0, 0, .2)";

  var phrase = phrases[randomPhrase()];
  // To ensure case consistency while checking with the returned output text
  phrase = phrase.toLowerCase();
  phrasePara.textContent = phrase;
  resultPara.textContent = 'Right or wrong?';
  resultPara.style.background = 'rgba(0,0,0,0.2)';
  diagnosticPara.textContent = '...diagnostic messages';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    var speechResult = event.results[0][0].transcript.toLowerCase();
    console.log(speechResult)
    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
    if(speechResult === phrase) {
      resultPara.textContent = "You're singing it right!";
      resultPara.style.background = 'lime';
      resultPara.style.border = 'none'
    } else {
      resultPara.textContent = "Those are not the lyrics 😂";
      resultPara.style.background = 'red';

    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.style.animation = "none";

    testBtn.textContent = 'Sing Again';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Try Again';
    testBtn.style.color = 'red';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }

  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }

  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }

  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }

  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }

  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }

  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}

testBtn.addEventListener('click', testSpeech);