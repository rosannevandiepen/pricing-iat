
<html>
  <head>
    <title>My experiment</title>

    <script src="plugins/jspsych.js"></script>
    <script src="plugins/jspsych-instructions.js"></script>
    <script src="plugins/jspsych-html-keyboard-response.js"></script>
    <script src="plugins/jspsych-image-keyboard-response.js"></script>
    <script src="plugins/jspsych-survey-likert.js"></script>
    <link href="css/jspsych.css" rel="stylesheet" type="text/css"></link>
  </head>
  <body></body>
  <script>

    /* create timeline */
    var timeline = [];

    /* create random participantID */
    var subject_id = jsPsych.randomization.randomID(5);
      jsPsych.data.addProperties({
      subject: subject_id,
      });

    /* define welcome message trial */
/*    var welcome = {
      type: "html-keyboard-response",
      stimulus: "Welcome to the experiment. Press any key to begin."
    };
    timeline.push(welcome);

    var welcome2 = {
      type: "html-keyboard-response",
      stimulus: "<p> Before we start the experiment, " +
      "please fill out the questionnaire on the following few pages </p> "
    };
    timeline.push(welcome2);
*/
    var welcome = {
      type: 'instructions',
      pages: ['Welcome to the experiment. Click next to begin.',
        'You are going to participate in a study on brands and their logo\'s',
        'Before we start the experiment, we will ask you several questions about how you feel about the brands in this study'],
      show_clickable_nav: true,
      show_page_number: false
    }
    timeline.push(welcome);
    /* pre-questionnaire */

    // defining response scales that can be used.
    var scale_1 = ["Strongly Disagree","","Disagree","","Neutral","","Agree","","Strongly Agree"];

    var likert_scale_rabo = {
      type: 'survey-likert',
      questions: [{prompt: "If Rabobank were not available, it would make little difference to me if I had to choose another brand", labels: scale_1},
      {prompt: " I consider myself to be highly loyal to Rabobank", labels: scale_1},
      {prompt: " When another brand is on cheaper, I will generally use it rather than Rabobank", labels: scale_1}],
      };
      // Insert more brands here

    var likert_procedure = {
      timeline: [likert_scale_rabo],
      randomize_order: false,
      // repetitions: 3
    }

    // timeline.push(likert_scale);
    timeline.push(likert_procedure);

    /* define instructions trial */
    var instructions = {
      type: "html-keyboard-response",
      stimulus: "<p>In this experiment, you will first see a fixation cross " +
          "of the screen.</p><p>Then, shortly, a <strong>logo</strong> " +
          "is shown followed by a <strong> word </strong>.</p>" +
          "<p>Answer whether you feel the word matches the logo " +
          "as fast as you can.</p>" +
          "<p> Press the <strong> F-key for yes </strong> and the <strong> J-key for no </strong> </p>" +
          "<div style='width: 700px;'>"+
          /*"<div style='float: left;'><img src='img/blue.png'></img>" +
          "<p class='small'><strong>Press the F key</strong></p></div>" +
          "<div class='float: right;'><img src='img/orange.png'></img>" +
          "<p class='small'><strong>Press the J key</strong></p></div>" +
          "</div>"+*/
          "<p>Press any key to begin.</p>",
      post_trial_gap: 1000
    };
    timeline.push(instructions);

// input cut part here

/*var factors = {
  logos: [
    {stimulus: "img/rabo1.png", data: {test_part: 'test'}},
    {stimulus: "img/rabo2.png", data: {test_part: 'test'}},
    {stimulus: "img/rabo3.png", data: {test_part: 'test'}},
  ]
  words: [
    {stimulus: "img/happy.png", data: {test_part: 'word'}},
    {stimulus: "img/angry.png", data: {test_part: 'word'}},
    {stimulus: "img/sad.png", data: {test_part: 'word'}},
  ]
}*/

    var factors = {
      logos: ['img/rabo1.png', 'img/rabo2.png','img/rabo3.png'],
      //      logos: [{'img/rabo1.png', data: {test_part: 'test'}}, {'img/rabo2.png'data: {test_part: 'test'}},{'img/rabo3.png'data: {test_part: 'test'}}],
      // words: ['<div style="font-size:60px;">sad</div>', '<div style="font-size:60px;">happy</div>','<div style="font-size:60px;">angry</div>']
      words: ['img/happy.png','img/sad.png','img/angry.png']
    }

    var full_design = jsPsych.randomization.factorial(factors, 1);

// show fixation cross
    var fixation = {
      type: 'html-keyboard-response',
      stimulus: '<div style="font-size:60px;">+</div>',
      choices: jsPsych.NO_KEYS,
      trial_duration: 900,
      data: {test_part: 'fixation'}
    }
// show company logo
    var test = {
      type: "image-keyboard-response",
      data: { screen_type: 'logo'},
      stimulus: jsPsych.timelineVariable('logos'),
      // stimulus: logos,
      choices: jsPsych.NO_KEYS,
      //data: jsPsych.timelineVariable('data'),
      trial_duration: 750
      /* on_finish: function(data){ */
      /* data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
    } */
    }
// show target word
    var word = {
      type: 'image-keyboard-response',
      data: { screen_type: 'targetWord'},
      stimulus: jsPsych.timelineVariable('words'),
      choices: ['f','j'],
      data: jsPsych.timelineVariable('data'),
      trial_duration: 1500
    }

    var test_procedure = {
      timeline: [fixation, test, word],
      timeline_variables: full_design,
      randomize_order: true,
      // repetitions: 3
    }

    timeline.push(test_procedure);

    /* define debrief */

    var debrief_block = {
      type: "html-keyboard-response",
      stimulus: function() {

    var trials = jsPsych.data.get().filter({test_part: 'test'});
    // var correct_trials = trials.filter({correct: true});
    // var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    // var rt = Math.round(correct_trials.select('rt').mean());
    var rt = Math.round(trials.select('rt').mean());
    var trialNums = trials.count();

    return "<p>Number of Trials "+trialNums+"% of the trials.</p>"+
          "<p>Average response time on Happy x Rabo = "+rt+"ms.</p>"+
          "<p>Average response time on Sad x Rabo = "+rt+"ms.</p>"+
          "<p>Average response time on Angry x Rabo = "+rt+"ms.</p>"+
          "<p>Press any key to complete the experiment. Thank you!</p>";
          }
        };

    timeline.push(debrief_block);



    /* start the experiment */
    jsPsych.init({
      timeline: timeline,
      on_finish: function() {
      jsPsych.data.displayData(); // displaying in browser in trial by trial form
      //jsPsych.data.displayData('csv'); // displaying in browser in csv form

      // select all trials
      var all_data = jsPsych.data.get();
      // get csv representation of data and log to console
      console.log(all_data.csv());
      // jsPsych.data.get().localSave('csv','mydata.csv'); // Save localy as csv
      // When collecting online, visit: https://www.jspsych.org/overview/data/ for instructions on saving
    }
    });

  </script>
  </html>
