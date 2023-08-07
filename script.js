// Get elements from the DOM
const themeInput = document.getElementById('theme-input');
const generateNudgeBtn = document.getElementById('generate-nudge-btn');
const useNudgeBtn = document.getElementById('use-nudge-btn');
const nudgeContent = document.getElementById('nudge-content');
const notesTable = document.getElementById('notes-table');
// Function to handle "Generate Nudge" button click
generateNudgeBtn.addEventListener('click', () => {
  const theme = themeInput.value;
  generateNudge(theme);
});
// Function to generate a new nudge using OpenAI API
async function generateNudge(theme) {
  const apiKey = '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'; // Replace with your OpenAI API key
  const apiEndpoint = 'https://api.openai.com/v1/chat/completions?content-type=application/json';

  const requestBody = {
  
       model: 'gpt-3.5-turbo',
       messages: [
         {role: 'system', content: 'You are a life coach sending morning nudges to your coachees.'},
         {role: 'system', content: 'You will now receive requests for morning nudges based on themes or emojis.'},
         {role: 'user', content: 'Tag: Energy, Productivity'},
         {role: 'assistant', content: '⚡Time to get your power on'},
         {role: 'user', content: 'Tag: Opportunity, Growth'},
         {role: 'assistant', content: '🆕 A new day brings new opportunities'},
         {role: 'user', content: 'Tag: Challenge, Growth'},
         {role: 'assistant', content: '🐱 🏍Are you ready to take a step out of your comfort zone today?'},
         {role: 'user', content: 'Tag: Positivity, Gratitude'},
         {role: 'assistant', content: '🌻 Ready to start your day off right?'},
         {role: 'user', content: 'Tag: Achievement, Teamwork'},
         {role: 'assistant', content: '🍏 Lets crush your goals together today!'},
         {role: 'user', content: 'Tag: Patience, Perspective'},
         {role: 'assistant', content: '🐢 Take a step back and appreciate the bigger picture'},
         {role: 'user', content: 'Tag: Courage, Hope'},
         {role: 'assistant', content: '🦁Fire up your courage'},
         {role: 'user', content: 'Tag: Focus, Clarity'},
         {role: 'assistant', content: '🔍 Stop and take a few moments to gain focus'},
         {role: 'user', content: 'Tag: Balance, Calm'},
         {role: 'assistant', content: 'Take a moment to find balance and inner peace'},
         {role: 'user', content: 'Tag: Creativity, Expression'},
         {role: 'assistant', content: '🎨 Dont be afraid to let your creativity flow'},
         {role: 'user', content: 'Tag: ▶, power, start'},
         {role: 'assistant', content: '▶ Ready to press play and get things moving?'},
         {role: 'user', content: 'Tag: 👑, Confidence'},
         {role: 'assistant', content: '👑 Invest in yourself today and trust your own capabilities'},
         {role: 'user', content: 'Tag: 🌈, Joy'},
         {role: 'assistant', content: '🌈 Take a moment to breathe in joy and happiness'},
         {role: 'user', content: 'Tag: Small improvements'},
         {role: 'assistant', content: '✨ As you take on this day, set small goals that will lead to big improvements'},
         {role: 'user', content: 'Tag: Health, Wellness'},
         {role: 'assistant', content: '🍎 What is one healthy choice you can make today?'},
         {role: 'user', content: 'Tag: 🍀, Mindfulness, Calm'},
         {role: 'assistant', content: '🍀 Take a few moments to stop and be present in the moment'},
         {role: 'user', content: 'Tag: 🙏, Gratitude, Thankfulness'},
         {role: 'assistant', content: '🙏 Take a moment to thank yourself for how far youve come'},
         {role: 'user', content: 'Tag:Strength '},
         {role: 'assistant', content: '🏋️‍ unleash your inner strength!'},
         { role: 'user', content: `Tag: "${theme}"` },
       ],
     };

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch nudge from OpenAI API');
    }

    const data = await response.json();
    const newNudge = data.choices[0].message.content;
    nudgeContent.textContent = newNudge;
    return newNudge;
  } catch (error) {
    console.error(error);
    nudgeContent.textContent = 'Error: Unable to fetch a new nudge';
  }
}

// Function to handle "Use" button click
useNudgeBtn.addEventListener('click', () => {
  const nudge = nudgeContent.textContent;
  const useDate = new Date().toLocaleDateString();

  // Store the nudge and date in local storage (You can replace this with a more robust storage method)
  const notesData = JSON.parse(localStorage.getItem('notes')) || [];
  notesData.push({ nudge, useDate });
  localStorage.setItem('notes', JSON.stringify(notesData));

  // Copy the nudge to clipboard
  const tempTextarea = document.createElement('textarea');
  tempTextarea.value = nudge;
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextarea);

  // Show an alert
  alert('Nudge copied to clipboard!');

  // Reload notes after adding a new one
  loadNotes();
});

// Function to load notes from local storage and display in the notes table
function loadNotes() {
  notesTable.innerHTML = ''; // Clear existing notes

  const notesData = JSON.parse(localStorage.getItem('notes')) || [];
  notesData.forEach((note) => {
    const { nudge, useDate } = note;
    const noteRow = document.createElement('div');
    noteRow.classList.add('note-row');
    noteRow.innerHTML = `<span>${nudge}</span><span>${useDate}</span><button>Delete</button>`;
    notesTable.appendChild(noteRow);
  });
}

// Load notes on page load
loadNotes();
