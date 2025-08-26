export default function initDisplayArticles(){
  const findMoreBtn = document.getElementById('find-more__button');
  const articlesList = document.querySelector('.articles__list');

  findMoreBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('data/articles.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      listArticles = data.articles;
    } catch (error) {
      console.error("Could not fetch articles:", error);
      return;
    }

    let randomArticles = data.articles
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    articlesList.innerHTML = "";

    randomArticles.forEach(article => {
      articlesList.innerHTML += `
        <article class="article-card" data-article-id="${article.id}">
          <div class="article-card__image">
            <img src="${article.image}" alt="${article.title}">
          </div>
          <div class="article-card__content">
            <div class="article-card__author">
              <img src="${article.authorImage}" alt="${article.author}" class="article-card__author-image">
              <span class="article-card__author-name">${article.author}</span>
            </div>
            <h5 class="article-card__title">
              ${article.title}
            </h5>
            <div class="article-card__meta">
              <svg fill="none" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <use href="assets/icons/icons.svg#icon-clock"></use>
              </svg>
              <span class="article-card__meta-time">${article.readTime}</span>
              |
              <span class="article-card__meta-date">${article.date}</span>
            </div>
          </div>
        </article>
      `;
    });
  });
}