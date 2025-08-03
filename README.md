# Lazyload Embed Video

Este projeto fornece um script JavaScript para carregamento preguiçoso (lazy load) de vídeos do YouTube, Vimeo e Dailymotion, otimizando o desempenho do site ao carregar vídeos apenas quando necessário.

## Funcionalidades

- **Lazy load**: Carrega vídeos sob demanda, reduzindo o consumo de recursos e melhorando o tempo de carregamento da página.
- **Suporte a múltiplos provedores**: YouTube, Vimeo e Dailymotion, com detecção automática do provedor pela URL.
- **Miniaturas responsivas**: Exibe a miniatura do vídeo até o carregamento do player.
- **Privacidade**: Usa iframes configurados para autoplay, loop e privacidade (sem cookies quando possível).
- **Dois modos de uso**: Vídeos clicáveis (placeholder) e vídeos de fundo (background).

## Como usar

### 1. Instale os arquivos

Inclua os arquivos em seu projeto:

- [`assets/js/lazyload.js`](assets/js/lazyload.js)
- [`assets/css/lazyload.css`](assets/css/lazyload.css)

### 2. Estrutura HTML

#### Vídeo clicável (placeholder)

```html
<div class="lev-placeholder" data-video-url="URL_DO_VIDEO"></div>
```

#### Vídeo de fundo (background)

```html
<div class="lev-background" data-video-url="URL_DO_VIDEO"></div>
```

Substitua `URL_DO_VIDEO` pela URL do vídeo do YouTube, Vimeo ou Dailymotion.

### 3. Inclua os arquivos no HTML

```html
<link rel="stylesheet" href="assets/css/lazyload.css">
<script src="assets/js/lazyload.js"></script>
```

> **Dica:** Veja exemplos completos em [`demos/placeholder.html`](demos/placeholder.html) e [`demos/background.html`](demos/background.html).

## Como funciona

- Para elementos `.lev-placeholder`, o vídeo só é carregado após o clique do usuário.
- Para elementos `.lev-background`, o vídeo é carregado automaticamente quando entra na área visível da página (viewport), usando `IntersectionObserver`.
- O script busca e exibe a melhor miniatura disponível antes de carregar o player.

## Exemplo

Veja os exemplos de uso em:

- [demos/placeholder.html](demos/placeholder.html)
- [demos/background.html](demos/background.html)

## Licença

MIT