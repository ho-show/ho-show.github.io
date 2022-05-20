const form = document.getElementById('storyForm');
const ideas = document.querySelectorAll('.ideas-wrapper li');
let loggedResponses = [];

const storiesElement = document.getElementById('stories');
const zeroStories = document.getElementById('emptyStories');
const activeClass = 'active';

// build the prompt to be used with openAI
function buildPrompt() {
  const nameInput = document.querySelector('[name=name]');
  const likesInput = document.querySelector('[name=likes]');
  const dislikesInput = document.querySelector('[name=dislikes]');
  let preferences = '';

  if (likesInput.value && dislikesInput.value) {
    preferences = ` who likes ${likesInput.value} but dislikes ${dislikesInput.value}`;
  } else if (likesInput.value && !dislikesInput.value) {
    preferences = ` who likes ${likesInput.value}`;
  } else if (!likesInput.value && dislikesInput.value) {
    preferences = ` who dislikes ${dislikesInput.value}`;
  }
  return `A short story about ${nameInput.value}${preferences}.`
}

// build the cards for showing the short stories
function buildResultCard(prompt, response) {
  const cardHTML =
    `
      <div class="card">
        <p class="mono">${prompt}</p>
        <p class="result">${response}</p>
      </div>
    `
  return cardHTML;
}

// check for previous stories from session and add them to the page
if(sessionStorage.getItem('loggedResponses')) {
  zeroStories.classList.remove(activeClass);
  loggedResponses = JSON.parse(sessionStorage.loggedResponses);

  for (i = 0; i < loggedResponses.length; i++) {
      storiesElement.insertAdjacentHTML(
      "afterbegin",
      buildResultCard(loggedResponses[i].prompt, loggedResponses[i].response)
    )
  }
}

// fill in ideas
ideas.forEach((idea) => {
  idea.addEventListener('click', function(event) {
    const ideaFor = event.target.closest('.ideas-list').dataset.ideasFor;
    const ideaInput = document.querySelector(`[name=${ideaFor}]`);
    let newIdea = event.target.textContent;

    if (!ideaInput.value || ideaFor === 'name') {
      ideaInput.value = newIdea;
    } else {
      const ideasArray = ideaInput.value.split(', ');

      if (ideasArray.at(-1)) {
        newIdea = ', and ' + newIdea;
      } else {
        newIdea = ', ' + newIdea;
      }
      ideaInput.value = ideaInput.value.replace(', and ', ', ') + newIdea;
    }
  })
})

// listen for the form submission to generate the story and add it sessionStorage
form.addEventListener('submit', async function(event) {
  event.preventDefault();

  const inputs = document.querySelectorAll('#storyForm input');
  const engine = document.querySelector('[name=engine]');
  const storyPrompt = buildPrompt();
  const data = {
    prompt: `
      Setup: A short story about Ellie who likes comic books and dislikes being alone.
      \nStory: Ellie is a teenage girl who likes comic books, playing guitar and dislikes zombies. One day, she happens to come across a mysterious zombie hiding in an alley. Ellie picks up her guitar and begins playing an eerie melody, which scares the zombie away.
      \nSetup: A short story about Abby who likes working out and dislikes heights.
      \nStory: Abby loves working out, but she has never been very keen on heights. Whenever she has to go up a tall building or climb a ladder, she gets really anxious. Her worst experience was when she had to cross a bridge between two buildings and fell off.
      \nSetup: ${storyPrompt}
      \nStory:
    `,
    temperature: 1,
    max_tokens: 200,
    top_p: 1.0,
    frequency_penalty: 0.2
  };

  // the following constants make up the openai api key
  // this is only here because I was unable to figure out how to properly create an env variable using github actions
  // ideally this would not be posted to github and only used in a secure manner
  const key1 = 'sk-VlC4n';
  const key2 = 'MZFNa4pn';
  const key3 = 'bW1ykXTT';
  const key4 = '3BlbkFJN';
  const key5 = 'gdR2Uuri';
  const key6 = 'LM13jSvJK0f';

  // fetch the story from openai
  const response = await fetch(`https://api.openai.com/v1/engines/${engine.value}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key1}${key2}${key3}${key4}${key5}${key6}`
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  const resultObj = {
    prompt: storyPrompt,
    response: responseData.choices[0].text
  }

  // push the story to sessionStorage
  loggedResponses.push(resultObj);
  sessionStorage.setItem('loggedResponses', JSON.stringify(loggedResponses));

  // hide the zero stories element and add the story to the page
  if (zeroStories.classList.contains(activeClass)) {
    zeroStories.classList.remove(activeClass)
  }
  storiesElement.insertAdjacentHTML(
    "afterbegin",
    buildResultCard(resultObj.prompt, resultObj.response)
  )

  // clear form inputs
  inputs.forEach((input) => {
    input.value = '';
  })
});

// clear previous stories
document.getElementById('clear').addEventListener('click', function() {
  zeroStories.classList.add(activeClass);
  sessionStorage.removeItem('loggedResponses');
  storiesElement.innerHTML = '';
})