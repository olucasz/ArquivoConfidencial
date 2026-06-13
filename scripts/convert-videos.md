# Conversão de vídeos para o site

Alguns navegadores, principalmente em mobile, podem exibir arquivos `.MOV` com tela preta dependendo do codec usado pelo celular/câmera.

Formato recomendado:

- Container: `.mp4`
- Vídeo: H.264
- Áudio: AAC
- Nome simples, sem acentos ou espaços

Com `ffmpeg`, converta manualmente assim:

```bash
ffmpeg -i input.MOV -vcodec libx264 -acodec aac -movflags +faststart output.mp4
```

Depois, substitua o arquivo usado no projeto pelo `.mp4` convertido e atualize o import se o nome mudar.
