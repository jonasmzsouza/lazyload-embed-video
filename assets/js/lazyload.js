/**
 * Lazy Load Embed Video v1.0.0
 * Autor: Jonas Souza
 * Data: 2025-08-03
 * Licença: MIT
 * Repositório: https://github.com/jonasmzsouza/lazyload-embed-video
 * Script para carregamento preguiçoso (lazy load) de vídeos do YouTube, Vimeo e Dailymotion.
 */
document.addEventListener('DOMContentLoaded', () => {

  // Seleciona todos os placeholders de vídeo
  const placeholders = document.querySelectorAll('.lev-placeholder');

  // Itera sobre cada placeholder para configurar o carregamento do vídeo
  placeholders.forEach(placeholder => {
    const rawUrl = placeholder.dataset.videoUrl;
    const provider = getVideoProvider(rawUrl);
    const videoId = getVideoIdAuto(rawUrl);

    loadVideoThumbnail(rawUrl, placeholder);

    placeholder.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.width = "560";
      iframe.height = "315";
      iframe.allow = "accelerometer; autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; gyroscope; web-share";
      iframe.loading = "lazy";
      iframe.title = "Vídeo";

      if (provider === 'youtube') {
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?&autoplay=1`;
      } else if (provider === 'vimeo') {
        iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      } else if (provider === 'dailymotion') {
        iframe.src = `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`;
      } else {
        console.warn('Provedor de vídeo não suportado:', provider);
        return;
      }

      placeholder.innerHTML = '';
      placeholder.appendChild(iframe);
      placeholder.classList.add('loaded');
    });
  });

  // IntersectionObserver para carregar vídeos de fundo quando visíveis
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const rawUrl = container.dataset.videoUrl;
        const provider = getVideoProvider(rawUrl);
        const videoId = getVideoIdAuto(rawUrl);

        let iframe = document.createElement('iframe');
        iframe.allow = "accelerometer; autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; gyroscope; web-share";
        iframe.loading = "lazy";
        iframe.title = "Vídeo de fundo";

        if (provider === 'youtube') {
          iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}`;
        } else if (provider === 'vimeo') {
          iframe.src = `https://player.vimeo.com/video/${videoId}?muted=1&autoplay=1&loop=1&background=1`;
        } else if (provider === 'dailymotion') {
          iframe.classList.add('dailymotion-player');
          iframe.src = `https://www.dailymotion.com/embed/video/${videoId}?autostart=on&mute=true&loop=true&enable_playback_control=false&enable_automatic_recommendations=false&enable_autonext=false`;
        } else {
          console.warn('Provedor de vídeo não suportado:', provider);
          return;
        }

        container.innerHTML = '';
        container.appendChild(iframe);

        // Ajusta inicialmente do iframe
        adjustIframeSize(container, iframe);

        // Atualiza dinamicamente o iframe no resize
        const resizeObserver = new ResizeObserver(() => {
          adjustIframeSize(container, iframe);
        });
        resizeObserver.observe(container);
        observer.unobserve(container); // evitar recarregamento
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.lev-background').forEach(container => {
    observer.observe(container);
  });
});

// Proporção do vídeo (16:9)
const aspectRatio = 16 / 9;

/**
 * Ajusta o tamanho do iframe com base no tamanho do container
 * Esta função é chamada quando o vídeo de fundo entra na viewport
 * e também quando o container é redimensionado.
 * 
 * @param {Element} container - Elemento que contém o iframe
 * @param {HTMLIFrameElement} iframe - Elemento iframe a ser ajustado
 * @returns void
 */
function adjustIframeSize(container, iframe) {
  const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();

  // Primeiro tenta ajustar com base na altura
  let iframeWidth = containerHeight * aspectRatio;
  let iframeHeight = containerHeight;

  // Se o iframe não cobrir toda a largura, ajusta com base na largura
  if (iframeWidth < containerWidth) {
    iframeWidth = containerWidth;
    iframeHeight = containerWidth / aspectRatio;
  }

  iframe.style.width = `${iframeWidth}px`;
  iframe.style.height = `${iframeHeight}px`;
}

/**
 * Detecta o provedor de vídeo baseado na URL
 * 
 * @param {String} url - URL do vídeo
 * @returns {String} Provedor ('youtube', 'vimeo', 'dailymotion' ou 'unknown')
 */
function getVideoProvider(url) {
  if (url.includes('youtube') || url.includes('youtu.be')) {
    return 'youtube';
  } else if (url.includes('vimeo')) {
    return 'vimeo';
  } else if (url.includes('dai.ly') || url.includes('dailymotion')) {
    return 'dailymotion';
  } else {
    return 'unknown';  // provedor não seja identificado
  }
}

/**
 * Extrai o ID do vídeo da URL com base no provedor
 * 
 * @param {String} url - URL do vídeo
 * @param {String} provider - 'youtube', 'vimeo', 'dailymotion'
 * @returns {String} ID do vídeo ou string vazia se não encontrar
 */
function getVideoId(url, provider) {
  const patterns = {
    youtube: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|video)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    vimeo: /vimeo\.com\/(?:.*\/)?(?:videos?\/)?(?:video\/)?(\d{6,})/,
    dailymotion: /(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9_-]+)/,
  };

  const regex = patterns[provider];
  if (!regex) return '';

  const match = url.match(regex);
  return match ? match[1] : '';
}

/**
 * Extrai o ID do vídeo automaticamente com base na URL (autodetecção do provedor)
 * 
 * @param {String} url
 * @returns {String} ID do vídeo ou string vazia se não encontrar
 */
function getVideoIdAuto(url) {
  if (url.includes('youtu')) return getVideoId(url, 'youtube');
  if (url.includes('vimeo')) return getVideoId(url, 'vimeo');
  if (url.includes('dai.ly') || url.includes('dailymotion')) return getVideoId(url, 'dailymotion');
  return '';
}


/**
 * Recupera uma matriz de URLs de miniaturas de vídeo para diferentes plataformas de vídeo (YouTube, Vimeo, Dailymotion) com base na URL de vídeo fornecida.
 *
 * @async
 * @function
 * @param {string} url - A URL do vídeo do YouTube, Vimeo ou Dailymotion.
 * @returns {Promise<Array<{width: number, url: string}>>|Promise<string>} 
 *           Uma promessa que resolve para uma matriz de objetos miniatura com propriedades de largura e URL,
 *           ou uma string vazia se a plataforma não for compatível ou ocorrer um erro.
 */
async function getThumbsVideo(url) {
  if (url.includes('youtube') || url.includes('youtu.be')) {
    const videoId = getVideoId(url, 'youtube');
    return data = [
      { "width": 320, "url": `https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp` || '' },
      { "width": 480, "url": `https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp` || '' },
      { "width": 640, "url": `https://i.ytimg.com/vi_webp/${videoId}/sddefault.webp` || '' },
      { "width": 1280, "url": `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp` || '' }
    ]
  } else if (url.includes('vimeo')) {
    const videoId = getVideoId(url, 'vimeo');
    const sizes = [200, 295, 640, 960, 1280];
    const requests = sizes.map(size => {
      return fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}&width=${size}&height=${size * 0.5}`)
        .then(response => response.json())
        .then(data => ({
          width: size,
          url: data.thumbnail_url
        }))
        .catch(error => {
          console.error(`Error fetching thumbnail size ${size}:`, error);
          return null;
        });
    });

    // Aguarda todas as requisições serem resolvidas
    return Promise.all(requests)
      .then(thumbnails => {
        // Filtra os resultados válidos
        return thumbnails.filter(thumbnail => thumbnail !== null);
      });
  } else if (url.includes('dai.ly') || url.includes('dailymotion')) {
    const videoId = getVideoId(url, 'dailymotion');
    return fetch(`https://api.dailymotion.com/video/${videoId}?fields=thumbnail_180_url,thumbnail_360_url,thumbnail_480_url,thumbnail_720_url`)
      .then(response => response.json())
      .then(data => {
        return [
          { "width": 320, "url": data.thumbnail_180_url || '' },
          { "width": 480, "url": data.thumbnail_360_url || '' },
          { "width": 640, "url": data.thumbnail_480_url || '' },
          { "width": 1280, "url": data.thumbnail_720_url || '' }
        ]
      })
      .catch(error => {
        console.error('Error fetching Dailymotion thumbnail:', error);
        return '';
      });
  } else {
    return '';
  }
}

/**
 * Carrega a miniatura do vídeo no container especificado
 * Esta função é assíncrona para lidar com a obtenção de miniaturas de vídeos
 * e garante que a miniatura seja exibida antes do carregamento do player.
 * 
 * @async
 * @param {String} url - URL do vídeo
 * @param {HTMLElement} container - Elemento onde a miniatura será carregada
 * @returns {Promise<void>}
 */
async function loadVideoThumbnail(url, container) {
  const thumbnails = await getThumbsVideo(url);

  if (!thumbnails) return;

  const srcset = thumbnails.map(thumbnail => `${thumbnail.url} ${thumbnail.width}w`).join(', ');

  const imgElement = document.createElement('img');
  imgElement.src = thumbnails[2].url;
  imgElement.setAttribute('srcset', srcset);
  imgElement.setAttribute('sizes', '(max-width: 600px) 100vw, 640px');
  imgElement.loading = "lazy";
  imgElement.decoding = "async";
  imgElement.alt = "Clique para assistir ao vídeo";
  imgElement.title = "Clique para assistir ao vídeo";

  const button = document.createElement('div');
  button.className = 'lev-play';

  container.appendChild(imgElement);
  container.appendChild(button);
}
