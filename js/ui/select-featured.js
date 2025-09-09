function updateCardDOM(cardElement, articleData, cardType = 'article') {
  if (cardType === 'featured') {
    cardElement.querySelector('.featured-article__image img').src = articleData.image;
    cardElement.querySelector('.featured-article__image img').alt = articleData.title;
    cardElement.querySelector('.featured-article__author-image').src = articleData.authorImage;
    cardElement.querySelector('.featured-article__author-image').alt = articleData.author;
    cardElement.querySelector('.featured-article__author-name').textContent = articleData.author;
    cardElement.querySelector('.featured-article__title').textContent = articleData.title;
    cardElement.querySelector('.featured-article__description').textContent = articleData.description;
    cardElement.querySelector('.featured-article__meta .featured-article__meta-time').textContent = articleData.readTime;
    cardElement.querySelector('.featured-article__meta .featured-article__meta-date').textContent = articleData.date;
  } else {
    cardElement.querySelector('.article-card__image img').src = articleData.image;
    cardElement.querySelector('.article-card__image img').alt = articleData.title;
    cardElement.querySelector('.article-card__author-image').src = articleData.authorImage;
    cardElement.querySelector('.article-card__author-image').alt = articleData.author;
    cardElement.querySelector('.article-card__author-name').textContent = articleData.author;
    cardElement.querySelector('.article-card__title').textContent = articleData.title;
    cardElement.querySelector('.article-card__meta .article-card__meta-time').textContent = articleData.readTime;
    cardElement.querySelector('.article-card__meta .article-card__meta-date').textContent = articleData.date;
  }
}

export default async function initDisplayArticles() {
  const articlesList = document.querySelector('.articles__list');
  const featuredCard = document.querySelector('.featured-article');

  if (!articlesList || !featuredCard) {
    console.error('Required article elements not found on the page.');
    return;
  }

  let listArticles = [];

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

  articlesList.addEventListener('click', (e) => {
    const clickedCard = e.target.closest('.article-card');
    
    if (!clickedCard) return;

    const clickedId = Number(clickedCard.dataset.articleId);
    const featuredId = Number(featuredCard.dataset.articleId);
    
    if (clickedId === featuredId) return;

    const clickedArticleData = listArticles.find(a => a.id === clickedId);
    const featuredArticleData = listArticles.find(a => a.id === featuredId);

    if (!clickedArticleData || !featuredArticleData) {
      console.error('Could not find article data for the swap.');
      return;
    }
    
    updateCardDOM(featuredCard, clickedArticleData, 'featured');

    updateCardDOM(clickedCard, featuredArticleData, 'article');

    featuredCard.dataset.articleId = clickedId;
    clickedCard.dataset.articleId = featuredId;
  });
}