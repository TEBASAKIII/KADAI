window.addEventListener('DOMContentLoaded', () => {

  const sendButton = document.querySelector('.send-button');
  const inputDate = document.querySelector('.input-date');
  const inputWeight = document.querySelector('.input-weight');
  const userList = document.querySelector('.user-list');


  /*delete*/
  document.querySelectorAll('.delete-button').forEach(button => {

    button.addEventListener('click', async (e) => {

      const li = e.target.parentElement;
      const text = li.querySelector('span').textContent;

      const date = text.split('　')[0].replace('日付：', '');

      const res = await fetch(`/api/weight/${encodeURIComponent(date)}`, {
        method: 'DELETE'
      });

      if(res.ok) li.remove();

    });

  });


  /*add*/
  sendButton.addEventListener('click', async () => {

    const date = inputDate.value;
    const weight = inputWeight.value;

    if (!date || !weight) return;

    try {

      const res = await fetch('/api/weight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date,
          weight: weight
        })
      });

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

    } catch(err) {
      console.error(err);
      return;
    }

    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = `日付：${date}　体重：${weight}kg`;
    li.appendChild(span);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.classList.add('delete-button');

    deleteButton.addEventListener('click', async () => {

      const res = await fetch(`/api/weight/${encodeURIComponent(date)}`, {
        method: 'DELETE'
      });

      if(res.ok) li.remove();

    });

    li.appendChild(deleteButton);

    userList.appendChild(li);

    inputDate.value = '';
    inputWeight.value = '';

  });

});