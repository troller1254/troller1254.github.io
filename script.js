const viewer = document.getElementById('viewer');
const content = document.getElementById('markdownContent');
const closeViewer = document.getElementById('closeViewer');

document.querySelectorAll('.card[data-report]').forEach(card => {
  card.addEventListener('click', async () => {
    try {
      const response = await fetch(card.dataset.report);
      if (!response.ok) throw new Error('Markdown 파일을 불러오지 못했습니다.');
      const markdown = await response.text();
      content.innerHTML = marked.parse(markdown);
      viewer.classList.add('open');
      viewer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } catch (error) {
      content.innerHTML = `<h2>문서를 불러올 수 없습니다.</h2><p>${error.message}</p>`;
      viewer.classList.add('open');
    }
  });
});

const trpgDrawers = document.querySelectorAll('.trpg-drawer');

trpgDrawers.forEach(drawer => {
  const toggle = drawer.querySelector(':scope > .trpg-toggle');
  const content = drawer.querySelector(':scope > .trpg-content');

  if (!toggle || !content) return;

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');

    if (isOpen) {
      drawer.classList.remove('open');
      content.style.maxHeight = '0px';
    } else {
      drawer.classList.add('open');
      updateHeight(content);
    }

    updateAllParentHeights(drawer);
  });
});


/* 내용의 실제 높이를 계산 */
function updateHeight(content) {
  if (!content) return;

  content.style.maxHeight = content.scrollHeight + 'px';
}


/* 부모 drawer들의 높이도 다시 계산 */
function updateAllParentHeights(drawer) {
  let parent = drawer.parentElement;

  while (parent) {

    if (parent.classList.contains('trpg-content')) {

      const parentDrawer = parent.parentElement;

      if (
        parentDrawer &&
        parentDrawer.classList.contains('trpg-drawer') &&
        parentDrawer.classList.contains('open')
      ) {
        updateHeight(parent);
      }
    }

    parent = parent.parentElement;
  }
}


/* 글자 크기나 화면 크기가 바뀌었을 때 */
window.addEventListener('resize', () => {

  document.querySelectorAll('.trpg-drawer.open').forEach(drawer => {

    const content =
      drawer.querySelector(':scope > .trpg-content');

    updateHeight(content);
  });

});

const resizeObserver = new ResizeObserver(() => {

  document.querySelectorAll('.trpg-drawer.open').forEach(drawer => {

    const content =
      drawer.querySelector(':scope > .trpg-content');

    if (content) {
      content.style.maxHeight =
        content.scrollHeight + 'px';
    }

  });

});

document.querySelectorAll('.trpg-content').forEach(content => {
  resizeObserver.observe(content);
});



function updateParentDrawers(drawer) {

  let parent = drawer.parentElement;


  while (parent) {

    if (
      parent.classList &&
      parent.classList.contains('trpg-content')
    ) {

      const parentDrawer = parent.parentElement;

      if (
        parentDrawer &&
        parentDrawer.classList.contains('trpg-drawer') &&
        parentDrawer.classList.contains('open')
      ) {

        parent.style.maxHeight =
          parent.scrollHeight + 'px';
      }
    }

    parent = parent.parentElement;
  }
}



function closeModal() {
  viewer.classList.remove('open');
  viewer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
closeViewer.addEventListener('click', closeModal);
viewer.addEventListener('click', e => { if (e.target === viewer) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

window.addEventListener('resize', () => {

  document.querySelectorAll('.trpg-drawer.open').forEach(drawer => {

    const content =
      drawer.querySelector(':scope > .trpg-content');

    if (content) {
      content.style.maxHeight =
        content.scrollHeight + 'px';
    }

  });

});
