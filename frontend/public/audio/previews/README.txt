Pasta de prévias de áudio — Biblioteca de Áudios Sagrados (OB2)

Coloque aqui os arquivos MP3 de prévia gratuita.

Arquivos esperados:
- salve-rainha-preview.mp3  (recomendado: ~30 a 60 segundos, mono, 128 kbps)

Como adicionar mais prévias:
1. Coloque o MP3 nesta pasta.
2. Edite frontend/src/content/biblioteca.js
3. Adicione o campo previewUrl no item correspondente:
     previewUrl: '/audio/previews/NOME-DO-ARQUIVO.mp3'
4. O app detecta automaticamente e libera o player de prévia.

Onde as prévias aparecem:
- Card promocional da Home (quando modulo_audio = false)
- Seção "Orações em Áudio" da Biblioteca Espiritual (quando modulo_audio = false)
